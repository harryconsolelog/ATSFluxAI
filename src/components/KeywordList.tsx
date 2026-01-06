'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircle, XCircle, Copy, Search, Filter } from 'lucide-react';
import { KeywordMatch } from '@/lib/types';

interface KeywordListProps {
  keywords: KeywordMatch;
  className?: string;
}

export const KeywordList: React.FC<KeywordListProps> = ({ keywords, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'missing'>('all');

  const { matched, missing, score } = keywords;

  const filteredMatched = matched.filter(keyword =>
    keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMissing = missing.filter(keyword =>
    keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyKeywords = async (keywordList: string[]) => {
    const text = keywordList.join(', ');
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy keywords:', err);
    }
  };

  const KeywordBadge = ({ keyword, matched }: { keyword: string; matched: boolean }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
        matched
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      )}
    >
      {matched ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {keyword}
    </motion.div>
  );

  const tabs = [
    { id: 'all' as const, label: 'All Keywords', count: matched.length + missing.length },
    { id: 'matched' as const, label: 'Matched', count: filteredMatched.length },
    { id: 'missing' as const, label: 'Missing', count: filteredMissing.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Keyword Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">
                {matched.length} of {matched.length + missing.length} keywords found ({score.toFixed(1)}% match rate)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{score.toFixed(0)}%</div>
                <div className="text-xs text-gray-500">Match Rate</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tabs */}
          <div className="flex items-center space-x-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                )}
              >
                {tab.label}
                <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Keywords Display */}
          <AnimatePresence mode="wait">
            {activeTab === 'all' && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Matched Keywords */}
                {filteredMatched.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Matched Keywords ({filteredMatched.length})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyKeywords(filteredMatched)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredMatched.map((keyword) => (
                        <KeywordBadge key={keyword} keyword={keyword} matched={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {filteredMissing.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-red-700 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Missing Keywords ({filteredMissing.length})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyKeywords(filteredMissing)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredMissing.map((keyword) => (
                        <KeywordBadge key={keyword} keyword={keyword} matched={false} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'matched' && (
              <motion.div
                key="matched"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-green-700">Matched Keywords</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyKeywords(filteredMatched)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredMatched.map((keyword) => (
                    <KeywordBadge key={keyword} keyword={keyword} matched={true} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'missing' && (
              <motion.div
                key="missing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-red-700">Missing Keywords</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyKeywords(filteredMissing)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredMissing.map((keyword) => (
                    <KeywordBadge key={keyword} keyword={keyword} matched={false} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Statistics Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">{matched.length}</div>
                <div className="text-xs text-gray-500">Matched</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-600">{missing.length}</div>
                <div className="text-xs text-gray-500">Missing</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">{score.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Match Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}