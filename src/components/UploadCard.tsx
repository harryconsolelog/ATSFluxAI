'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { UploadedFile } from '@/lib/types';
import { isValidFileType, isValidFileSize, formatFileSize } from '@/lib/utils';

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  onRemoveFile?: () => void;
  isUploading?: boolean;
  error?: string;
  uploadedFile?: File;
  maxSize?: number;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onFileSelect,
  onRemoveFile,
  isUploading = false,
  error,
  uploadedFile,
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string>('');

  const validateFile = useCallback((file: File): string | null => {
    if (!isValidFileType(file)) {
      return 'Only PDF, DOC, and DOCX files are allowed';
    }

    if (!isValidFileSize(file, maxSize)) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }

    return null;
  }, [maxSize]);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFileError('');
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleRemoveFile = useCallback(() => {
    setFileError('');
    onRemoveFile?.();
  }, [onRemoveFile]);

  const getFileIcon = () => {
    if (uploadedFile?.type.includes('pdf')) return '📄';
    if (uploadedFile?.type.includes('word')) return '📝';
    return '📄';
  };

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-200',
      isDragOver && 'border-blue-500 bg-blue-50/50',
      error && 'border-red-500 bg-red-50/50',
      uploadedFile && 'border-green-500 bg-green-50/50'
    )}>
      <CardContent className="p-8">
        {!uploadedFile ? (
          <div
            className={`text-center cursor-pointer ${
              isUploading ? 'pointer-events-none' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              disabled={isUploading}
            />

            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 mx-auto">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div>
                  </div>
                  <p className="text-lg font-medium text-gray-700">Processing file...</p>
                  <p className="text-sm text-gray-500">This will only take a moment</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-4"
                >
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Upload className={`w-8 h-8 ${
                      isDragOver ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>

                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {isDragOver ? 'Drop your file here' : 'Upload your resume'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag and drop your file here, or click to browse
                    </p>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Supported formats: PDF, DOC, DOCX</p>
                    <p>Maximum file size: {formatFileSize(maxSize)}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-700 flex items-center gap-2">
                    <span>{getFileIcon()}</span>
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>

              {!isUploading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span>Processing file...</span>
              </div>
            )}
          </div>
        )}

        {(fileError || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800">Upload Error</p>
              <p className="text-red-700">{fileError || error}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}