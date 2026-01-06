'use client';

import { useState, useCallback } from 'react';
import { FileUploadResponse, UploadedFile, UploadStatus } from '@/lib/types';
import { API_ENDPOINTS } from '@/lib/constants';

interface UseFileUploadOptions {
  onSuccess?: (data: FileUploadResponse['data']) => void;
  onError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploadData, setUploadData] = useState<FileUploadResponse['data'] | null>(null);
  const [error, setError] = useState<string>('');

  const uploadFile = useCallback(async (file: File) => {
    setStatus('uploading');
    setError('');
    setUploadData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData,
      });

      const result: FileUploadResponse = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage = result.error?.message || 'Upload failed';
        throw new Error(errorMessage);
      }

      setStatus('success');
      setUploadData(result.data || null);
      options.onSuccess?.(result.data!);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setStatus('error');
      setError(errorMessage);
      options.onError?.(errorMessage);
    }
  }, [options]);

  const resetUpload = useCallback(() => {
    setStatus('idle');
    setError('');
    setUploadData(null);
  }, []);

  return {
    status,
    uploadData,
    error,
    uploadFile,
    resetUpload,
    isUploading: status === 'uploading',
    isIdle: status === 'idle',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
};