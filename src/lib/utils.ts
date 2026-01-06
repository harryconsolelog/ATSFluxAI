import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { COMMON_SKILLS, STOP_WORDS } from './constants';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// File validation utilities
export function isValidFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return allowedTypes.includes(file.type);
}

export function isValidFileSize(file: File, maxSize: number = 10 * 1024 * 1024): boolean {
  return file.size <= maxSize;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Text processing utilities
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n+/g, ' ') // Replace multiple newlines with single space
    .replace(/[^\w\s\-.,;:!?()[\]{}]/g, '') // Remove special characters except common punctuation
    .trim();
}

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter(word =>
      word.length > 2 &&
      !STOP_WORDS.includes(word as any) &&
      !/^\d+$/.test(word) // Remove numbers
    );

  // Count word frequency
  const wordFreq = words.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {} as Record<string, number>);

  // Sort by frequency and return top keywords
  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50)
    .map(([word]) => word);
}

export function extractSkills(text: string): string[] {
  const textLower = text.toLowerCase();
  const foundSkills: string[] = [];

  // Check technical skills
  COMMON_SKILLS.TECHNICAL.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  // Check soft skills
  COMMON_SKILLS.SOFT.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  // Check certifications
  COMMON_SKILLS.CERTIFICATIONS.forEach(cert => {
    if (textLower.includes(cert.toLowerCase())) {
      foundSkills.push(cert);
    }
  });

  return [...new Set(foundSkills)]; // Remove duplicates
}

export function detectSections(text: string): {
  experience: boolean;
  education: boolean;
  skills: boolean;
  summary: boolean;
  projects?: boolean;
} {
  const textLower = text.toLowerCase();

  return {
    experience: /experience|work history|employment|professional background/.test(textLower),
    education: /education|academic|degree|university|college/.test(textLower),
    skills: /skills|competencies|expertise|technical/.test(textLower),
    summary: /summary|objective|profile|about/.test(textLower),
    projects: /projects|portfolio|work|case study/.test(textLower),
  };
}

export function analyzeFormatting(text: string): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for consistent formatting
  const lines = text.split('\n').filter(line => line.trim());

  // Check bullet points
  const bulletPointLines = lines.filter(line => /^\s*[-*•]\s/.test(line));
  if (bulletPointLines.length === 0 && lines.length > 10) {
    issues.push('No bullet points found');
    recommendations.push('Use bullet points to improve readability');
    score -= 15;
  }

  // Check for proper section headers
  const hasHeaders = lines.some(line =>
    /^[A-Z][A-Z\s]{2,}$/.test(line.trim()) ||
    line.trim().endsWith(':')
  );
  if (!hasHeaders) {
    issues.push('Clear section headers not found');
    recommendations.push('Add clear section headers (Experience, Education, Skills)');
    score -= 10;
  }

  // Check line length
  const longLines = lines.filter(line => line.length > 100);
  if (longLines.length > lines.length * 0.3) {
    issues.push('Many lines are too long');
    recommendations.push('Keep lines under 100 characters for better readability');
    score -= 5;
  }

  // Check for empty lines between sections
  const hasProperSpacing = text.includes('\n\n');
  if (!hasProperSpacing) {
    issues.push('No spacing between sections');
    recommendations.push('Use empty lines to separate sections');
    score -= 5;
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

// Score calculation utilities
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#059669'; // Green
  if (score >= 65) return '#d97706'; // Orange
  return '#dc2626'; // Red
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Average';
  if (score >= 35) return 'Below Average';
  return 'Poor';
}

export function generateSuggestions(analysis: any): any[] {
  const suggestions = [];

  // Keyword suggestions
  if (analysis.keywordMatch.score < 70) {
    suggestions.push({
      type: 'keyword' as const,
      priority: 'high' as const,
      description: `Add missing keywords from job description. Currently only matching ${analysis.keywordMatch.score.toFixed(0)}% of keywords.`,
      example: analysis.keywordMatch.missing.slice(0, 3).join(', ')
    });
  }

  // Skills suggestions
  if (analysis.skillsAnalysis.score < 60) {
    suggestions.push({
      type: 'skill' as const,
      priority: 'high' as const,
      description: 'Highlight more relevant skills that match the job requirements.',
      example: analysis.skillsAnalysis.missing.slice(0, 3).join(', ')
    });
  }

  // Formatting suggestions
  if (analysis.formatting.score < 80) {
    suggestions.push({
      type: 'formatting' as const,
      priority: 'medium' as const,
      description: 'Improve resume formatting for better ATS parsing.',
      example: analysis.formatting.recommendations.slice(0, 2).join('. ')
    });
  }

  return suggestions;
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}