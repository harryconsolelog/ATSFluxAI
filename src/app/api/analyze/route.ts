import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ATSAnalysisRequest, ATSAnalysisResponse } from '@/lib/types';
import { ATS_SCORING } from '@/lib/constants';
import {
  cleanText,
  extractKeywords,
  extractSkills,
  detectSections,
  analyzeFormatting,
  calculateCosineSimilarity,
  generateSuggestions
} from '@/lib/utils';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ATSAnalysisRequest = await request.json();

    // Validate input
    if (!body.resumeText || !body.jobDescription) {
      const error: ATSAnalysisResponse = {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Both resumeText and jobDescription are required'
        }
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Clean and preprocess texts
    const cleanResume = cleanText(body.resumeText);
    const cleanJobDesc = cleanText(body.jobDescription);

    if (cleanResume.length < 100 || cleanJobDesc.length < 100) {
      const error: ATSAnalysisResponse = {
        success: false,
        error: {
          code: 'INSUFFICIENT_CONTENT',
          message: 'Both resume and job description must contain sufficient text for analysis (minimum 100 characters)'
        }
      };
      return NextResponse.json(error, { status: 400 });
    }

    try {
      // Generate embeddings for semantic similarity
      let semanticScore = 0;

      try {
        const [resumeEmbedding, jobEmbedding] = await Promise.all([
          generateEmbeddings(cleanResume),
          generateEmbeddings(cleanJobDesc)
        ]);

        semanticScore = calculateCosineSimilarity(resumeEmbedding, jobEmbedding) * 100;
      } catch (embeddingError) {
        console.error('Embedding generation error:', embeddingError);
        // Fallback to text similarity if embeddings fail
        semanticScore = calculateTextSimilarity(cleanResume, cleanJobDesc) * 100;
      }

      // Extract keywords and calculate match
      const resumeKeywords = extractKeywords(cleanResume);
      const jobKeywords = extractKeywords(cleanJobDesc);

      const matchedKeywords = jobKeywords.filter(keyword =>
        resumeKeywords.some(resumeKeyword =>
          resumeKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(resumeKeyword.toLowerCase())
        )
      );

      const missingKeywords = jobKeywords.filter(keyword =>
        !matchedKeywords.includes(keyword)
      );

      const keywordMatchScore = jobKeywords.length > 0
        ? (matchedKeywords.length / jobKeywords.length) * 100
        : 0;

      // Skills analysis
      const resumeSkills = extractSkills(cleanResume);
      const jobSkills = extractSkills(cleanJobDesc);

      const foundSkills = jobSkills.filter(skill =>
        resumeSkills.some(resumeSkill =>
          resumeSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(resumeSkill.toLowerCase())
        )
      );

      const missingSkills = jobSkills.filter(skill =>
        !foundSkills.includes(skill)
      );

      const skillsScore = jobSkills.length > 0
        ? (foundSkills.length / jobSkills.length) * 100
        : 0;

      // Categorize skills
      const skillsCategories = categorizeSkills(foundSkills);

      // Formatting analysis
      const formattingAnalysis = analyzeFormatting(body.resumeText);

      // Section completeness analysis
      const detectedSections = detectSections(body.resumeText);
      const sectionCount = Object.values(detectedSections).filter(Boolean).length;
      const totalSections = Object.keys(detectedSections).length;
      const completenessScore = (sectionCount / totalSections) * 100;

      // Calculate final ATS score
      const atsScore = Math.round(
        semanticScore * ATS_SCORING.SEMANTIC_WEIGHT +
        keywordMatchScore * ATS_SCORING.KEYWORD_WEIGHT +
        skillsScore * ATS_SCORING.SKILLS_WEIGHT +
        formattingAnalysis.score * ATS_SCORING.FORMATTING_WEIGHT +
        completenessScore * ATS_SCORING.COMPLETENESS_WEIGHT
      );

      const processingTime = Date.now() - startTime;

      // Generate suggestions
      const breakdown = {
        semanticSimilarity: {
          score: Math.round(semanticScore),
          weight: ATS_SCORING.SEMANTIC_WEIGHT,
          description: "Semantic matching between resume and job description"
        },
        keywordMatch: {
          matched: matchedKeywords,
          missing: missingKeywords,
          score: Math.round(keywordMatchScore),
          total: jobKeywords.length
        },
        skillsAnalysis: {
          found: foundSkills,
          missing: missingSkills,
          score: Math.round(skillsScore),
          categories: skillsCategories
        },
        formatting: formattingAnalysis,
        completeness: {
          score: Math.round(completenessScore),
          sections: detectedSections
        }
      };

      const suggestions = generateSuggestions(breakdown);

      const response: ATSAnalysisResponse = {
        success: true,
        data: {
          atsScore,
          breakdown,
          suggestions,
          analysisMetadata: {
            processingTime,
            resumeWordCount: cleanResume.split(/\s+/).length,
            jobDescriptionWordCount: cleanJobDesc.split(/\s+/).length,
            analyzedAt: new Date().toISOString()
          }
        }
      };

      return NextResponse.json(response);

    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      const error: ATSAnalysisResponse = {
        success: false,
        error: {
          code: 'ANALYSIS_ERROR',
          message: 'Failed to analyze resume against job description',
          details: analysisError instanceof Error ? analysisError.message : 'Unknown error'
        }
      };
      return NextResponse.json(error, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    const errorResponse: ATSAnalysisResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.substring(0, 8000), // Limit text length for API
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI embedding error:', error);
    throw error;
  }
}

function calculateTextSimilarity(text1: string, text2: string): number {
  // Simple word-based similarity as fallback
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

function categorizeSkills(skills: string[]): {
  technical: string[];
  soft: string[];
  certifications: string[];
} {
  const technical = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes'];
  const soft = ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Project Management'];
  const certifications = ['AWS Certified', 'Google Cloud Certified', 'Microsoft Certified', 'PMP'];

  return {
    technical: skills.filter(skill => technical.some(tech => skill.toLowerCase().includes(tech.toLowerCase()))),
    soft: skills.filter(skill => soft.some(softSkill => skill.toLowerCase().includes(softSkill.toLowerCase()))),
    certifications: skills.filter(skill => certifications.some(cert => skill.toLowerCase().includes(cert.toLowerCase()))),
  };
}

// Add CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}