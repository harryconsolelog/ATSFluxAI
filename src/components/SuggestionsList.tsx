'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import {
  Lightbulb,
  AlertTriangle,
  Info,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Suggestion } from '@/lib/types';

interface SuggestionsListProps {
  suggestions: Suggestion[];
  className?: string;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, className }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const filteredSuggestions = suggestions.filter(suggestion =>
    filter === 'all' || suggestion.priority === filter
  );

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <Lightbulb className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword':
        return '🔍';
      case 'skill':
        return '💼';
      case 'formatting':
        return '📝';
      case 'content':
        return '📄';
      default:
        return '💡';
    }
  };

  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, Suggestion[]>);

  const filterOptions = [
    { id: 'all', label: 'All', count: suggestions.length },
    { id: 'high', label: 'High Priority', count: suggestions.filter(s => s.priority === 'high').length },
    { id: 'medium', label: 'Medium Priority', count: suggestions.filter(s => s.priority === 'medium').length },
    { id: 'low', label: 'Low Priority', count: suggestions.filter(s => s.priority === 'low').length },
  ];

  const toggleExpanded = (id: string) => {
    setExpandedSuggestion(expandedSuggestion === id ? null : id);
  };

  if (suggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={className}
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Great job!</h3>
            <p className="text-gray-600">
              Your resume is well-optimized for this position. No major improvements needed.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Improvement Suggestions</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filterOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
            <div key={type}>
              <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
                <span>{getTypeIcon(type)}</span>
                <span className="capitalize">{type} Suggestions</span>
                <span className="text-sm text-gray-500">({typeSuggestions.length})</span>
              </h4>
              <div className="space-y-3">
                {typeSuggestions.map((suggestion, index) => {
                  const suggestionId = `${type}-${index}`;
                  const isExpanded = expandedSuggestion === suggestionId;

                  return (
                    <motion.div
                      key={suggestionId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getPriorityColor(
                          suggestion.priority
                        )}`}
                        onClick={() => toggleExpanded(suggestionId)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="mt-0.5">
                              {getPriorityIcon(suggestion.priority)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-medium">
                                {suggestion.description}
                              </p>

                              <div className="flex items-center space-x-2 mt-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(
                                  suggestion.priority
                                )}`}>
                                  {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority
                                </span>
                                <span className="text-xs text-gray-500 capitalize">
                                  {suggestion.type}
                                </span>
                              </div>

                              <AnimatePresence>
                                {isExpanded && suggestion.example && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-3 p-3 bg-white bg-opacity-70 rounded border border-gray-200"
                                  >
                                    <p className="text-sm font-medium text-gray-700 mb-1">Example:</p>
                                    <p className="text-sm text-gray-600 italic">
                                      "{suggestion.example}"
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {suggestion.example && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(suggestionId);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};