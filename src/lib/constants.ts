// Application constants

export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_FILE_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  DEFAULT_JOB_DESCRIPTION_LIMIT: 5000,
} as const;

export const ATS_SCORING = {
  SEMANTIC_WEIGHT: 0.4,
  KEYWORD_WEIGHT: 0.25,
  SKILLS_WEIGHT: 0.2,
  FORMATTING_WEIGHT: 0.1,
  COMPLETENESS_WEIGHT: 0.05,
} as const;

export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 65,
  AVERAGE: 50,
  POOR: 35,
} as const;

export const COLOR_PALETTE = {
  PRIMARY: '#2563eb',
  SUCCESS: '#059669',
  WARNING: '#d97706',
  ERROR: '#dc2626',
  BACKGROUND: '#ffffff',
  SURFACE: '#f8fafc',
  TEXT: '#1e293b',
  TEXT_SECONDARY: '#64748b',
} as const;

export const SCORE_COLORS = {
  HIGH: COLOR_PALETTE.SUCCESS,
  MEDIUM: COLOR_PALETTE.WARNING,
  LOW: COLOR_PALETTE.ERROR,
} as const;

export const API_ENDPOINTS = {
  UPLOAD: '/api/upload',
  ANALYZE: '/api/analyze',
  REPORT: '/api/report',
  HEALTH: '/api/health',
} as const;

export const COMMON_SKILLS = {
  TECHNICAL: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
    'Machine Learning', 'Data Science', 'DevOps', 'Agile', 'Scrum'
  ],
  SOFT: [
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Project Management',
    'Critical Thinking', 'Time Management', 'Creativity', 'Adaptability', 'Attention to Detail'
  ],
  CERTIFICATIONS: [
    'AWS Certified', 'Google Cloud Certified', 'Microsoft Certified',
    'PMP', 'Scrum Master', 'CISSP', 'CompTIA', 'Oracle Certified'
  ]
} as const;

export const STOP_WORDS = [
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
  'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
  'its', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
] as const;