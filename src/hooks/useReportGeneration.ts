'use client';

import { useState, useCallback } from 'react';
import { ATSAnalysisResponse } from '@/lib/types';
import { API_ENDPOINTS } from '@/lib/constants';

interface UseReportGenerationOptions {
  onSuccess?: (blob: Blob) => void;
  onError?: (error: string) => void;
}

interface ReportRequest {
  analysisData: NonNullable<ATSAnalysisResponse['data']>;
  fileName?: string;
}

export const useReportGeneration = (options: UseReportGenerationOptions = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const generateReport = useCallback(async ({ analysisData, fileName }: ReportRequest) => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.REPORT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisData,
          fileName: fileName || 'ATS-Analysis-Report.pdf'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Report generation failed');
      }

      const blob = await response.blob();

      // Create download URL and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'ATS-Analysis-Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      options.onSuccess?.(blob);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  const downloadReport = useCallback((analysisData: NonNullable<ATSAnalysisResponse['data']>) => {
    return generateReport({
      analysisData,
      fileName: `ATS-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`
    });
  }, [generateReport]);

  return {
    generateReport,
    downloadReport,
    isGenerating,
    error,
    resetError: () => setError(''),
  };
};