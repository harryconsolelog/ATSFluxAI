'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number; // circle stroke width
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 200,
  strokeWidth = 12,
  showLabel = true,
  animated = true,
  className,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const timer = setTimeout(() => {
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const increment = score / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(current);
        }
      }, duration / steps);
    }, 100);

    return () => clearTimeout(timer);
  }, [score, animated]);

  // Background segments for visual appeal
  const segments = 20;
  const segmentAngle = 360 / segments;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle with segments */}
        {Array.from({ length: segments }).map((_, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = size / 2 + radius * Math.cos(startRad);
          const y1 = size / 2 + radius * Math.sin(startRad);
          const x2 = size / 2 + radius * Math.cos(endRad);
          const y2 = size / 2 + radius * Math.sin(endRad);

          return (
            <path
              key={index}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth - 1}
              fill="none"
              strokeLinecap="butt"
            />
          );
        })}

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.1))'
          }}
        />

        {/* Inner glow effect */}
        {score > 70 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: animated ? 0.3 : 0 }}
          className="text-center"
        >
          <div className="text-4xl font-bold" style={{ color: scoreColor }}>
            {Math.round(displayScore)}
          </div>
          {showLabel && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: animated ? 0.5 : 0 }}
              className="text-sm font-medium text-gray-600 mt-1"
            >
              {scoreLabel}
            </motion.div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            ATS Score
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      {score >= 80 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: animated ? 0.8 : 0 }}
          className="absolute -top-2 -right-2"
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
};