import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  showCharacterCount = false,
  maxLength,
  className,
  id,
  value,
  onChange,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm',
          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200',
          'resize-vertical min-h-[100px]',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {(error || helperText || showCharacterCount) && (
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
          {showCharacterCount && maxLength && (
            <span className={cn(
              'text-sm',
              currentLength > maxLength * 0.9 ? 'text-orange-600' : 'text-gray-500'
            )}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
};