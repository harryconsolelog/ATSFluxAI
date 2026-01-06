'use client';

import { useState, useCallback } from 'react';
import { ATSAnalysisRequest, ATSAnalysisResponse, AnalysisStatus } from '@/lib/types';
import { API_ENDPOINTS } from '@/lib/constants';

interface UseATSAnalysisOptions {
  onSuccess?: (data: ATSAnalysisResponse['data']) => void;
  onError?: (error: string) => void;
}

export const useATSAnalysis = (options: UseATSAnalysisOptions = {}) => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisData, setAnalysisData] = useState<ATSAnalysisResponse['data'] | null>(null);
  const [error, setError] = useState<string>('');

  const analyzeResume = useCallback(async (request: ATSAnalysisRequest) => {
    setStatus('analyzing');
    setError('');
    setAnalysisData(null);

    try {
      const response = await fetch(API_ENDPOINTS.ANALYZE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result: ATSAnalysisResponse = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage = result.error?.message || 'Analysis failed';
        throw new Error(errorMessage);
      }

      setStatus('success');
      setAnalysisData(result.data || null);
      options.onSuccess?.(result.data!);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setStatus('error');
      setError(errorMessage);
      options.onError?.(errorMessage);
    }
  }, [options]);

  const resetAnalysis = useCallback(() => {
    setStatus('idle');
    setError('');
    setAnalysisData(null);
  }, []);

  return {
    status,
    analysisData,
    error,
    analyzeResume,
    resetAnalysis,
    isAnalyzing: status === 'analyzing',
    isIdle: status === 'idle',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
};