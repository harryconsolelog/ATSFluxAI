// Core types for ATS Resume Checker

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface FileUploadResponse {
  success: boolean;
  data?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    extractedText: string;
    textLength: number;
    processingTime: number;
  };
  error?: {
    code: 'INVALID_FILE_TYPE' | 'FILE_TOO_LARGE' | 'PROCESSING_ERROR';
    message: string;
    details?: any;
  };
}

export interface KeywordMatch {
  matched: string[];
  missing: string[];
  score: number;
  total: number;
}

export interface SkillsAnalysis {
  found: string[];
  missing: string[];
  score: number;
  categories: {
    technical: string[];
    soft: string[];
    certifications: string[];
  };
}

export interface FormattingAnalysis {
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface CompletenessAnalysis {
  score: number;
  sections: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    summary: boolean;
    projects?: boolean;
  };
}

export interface Suggestion {
  type: 'keyword' | 'skill' | 'formatting' | 'content';
  priority: 'high' | 'medium' | 'low';
  description: string;
  example?: string;
}

export interface AnalysisBreakdown {
  semanticSimilarity: {
    score: number;
    weight: number;
    description: string;
  };
  keywordMatch: KeywordMatch;
  skillsAnalysis: SkillsAnalysis;
  formatting: FormattingAnalysis;
  completeness: CompletenessAnalysis;
}

export interface AnalysisMetadata {
  processingTime: number;
  resumeWordCount: number;
  jobDescriptionWordCount: number;
  analyzedAt: string;
}

export interface ATSAnalysisRequest {
  resumeText: string;
  jobDescription: string;
  options?: {
    includeSuggestions: boolean;
    detailedAnalysis: boolean;
    industry?: string;
  };
}

export interface ATSAnalysisResponse {
  success: boolean;
  data?: {
    atsScore: number;
    breakdown: AnalysisBreakdown;
    suggestions: Suggestion[];
    analysisMetadata: AnalysisMetadata;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ReportRequest {
  analysisData: ATSAnalysisResponse['data'];
  fileName?: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export type AnalysisStatus = 'idle' | 'analyzing' | 'success' | 'error';