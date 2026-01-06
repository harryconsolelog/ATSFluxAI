'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Progress } from '@/components/ui/Progress';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { ATSAnalysisResponse } from '@/lib/types';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface ResultCardProps {
  data: NonNullable<ATSAnalysisResponse['data']>;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, className }) => {
  const { atsScore, breakdown, suggestions } = data;

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">ATS Analysis Results</h3>
            </div>
            <div className="flex items-center space-x-2">
              {getScoreIcon(atsScore)}
              <span className="text-2xl font-bold" style={{ color: getScoreColor(atsScore) }}>
                {atsScore}/100
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Your resume scored <span className="font-semibold">{getScoreLabel(atsScore)}</span> against the job description
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Breakdown */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h4>
            <div className="space-y-4">
              {/* Semantic Similarity */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-700">Semantic Match</span>
                    <span className="text-xs text-gray-500">({Math.round(breakdown.semanticSimilarity.weight * 100)}% weight)</span>
                  </div>
                  <p className="text-sm text-gray-600">{breakdown.semanticSimilarity.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-24">
                    <Progress
                      value={breakdown.semanticSimilarity.score}
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {Math.round(breakdown.semanticSimilarity.score)}%
                  </span>
                </div>
              </div>

              {/* Keyword Match */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-700">Keyword Match</span>
                    <span className="text-xs text-gray-500">(25% weight)</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Found {breakdown.keywordMatch.matched.length} of {breakdown.keywordMatch.total} important keywords
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-24">
                    <Progress
                      value={breakdown.keywordMatch.score}
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {Math.round(breakdown.keywordMatch.score)}%
                  </span>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-700">Skills Coverage</span>
                    <span className="text-xs text-gray-500">(20% weight)</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {breakdown.skillsAnalysis.found.length} relevant skills found in your resume
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-24">
                    <Progress
                      value={breakdown.skillsAnalysis.score}
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {Math.round(breakdown.skillsAnalysis.score)}%
                  </span>
                </div>
              </div>

              {/* Formatting */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-700">Formatting Quality</span>
                    <span className="text-xs text-gray-500">(10% weight)</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {breakdown.formatting.issues.length === 0
                      ? 'Excellent formatting for ATS parsing'
                      : `${breakdown.formatting.issues.length} formatting issues found`
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-24">
                    <Progress
                      value={breakdown.formatting.score}
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {Math.round(breakdown.formatting.score)}%
                  </span>
                </div>
              </div>

              {/* Completeness */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-700">Content Completeness</span>
                    <span className="text-xs text-gray-500">(5% weight)</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(breakdown.completeness.sections).map(([section, present]) => (
                      <span
                        key={section}
                        className={`px-2 py-1 text-xs rounded-full ${
                          present
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-24">
                    <Progress
                      value={breakdown.completeness.score}
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {Math.round(breakdown.completeness.score)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Analysis Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {breakdown.keywordMatch.matched.length}
                </div>
                <div className="text-sm text-gray-600">Keywords Matched</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {breakdown.skillsAnalysis.found.length}
                </div>
                <div className="text-sm text-gray-600">Skills Found</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(data.analysisMetadata.processingTime)}ms
                </div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {suggestions.length}
                </div>
                <div className="text-sm text-gray-600">Suggestions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};