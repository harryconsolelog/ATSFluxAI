"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";

interface JobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showSuggestions?: boolean;
}

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: "Senior Frontend Developer",
    description: `We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for developing user-facing features, ensuring optimal performance, and collaborating with cross-functional teams.

Requirements:
• 5+ years of experience with React/Next.js
• Strong proficiency in JavaScript, TypeScript, and HTML5/CSS3
• Experience with state management (Redux, Zustand)
• Knowledge of modern build tools and CI/CD pipelines
• Excellent problem-solving skills and attention to detail
• Bachelor's degree in Computer Science or related field`,
  },
  {
    title: "Full Stack Engineer",
    description: `Join our growing team as a Full Stack Engineer! You'll work on cutting-edge web applications, collaborate with product managers, and help shape our technical architecture.

What we're looking for:
• 3+ years of full-stack development experience
• Proficiency in JavaScript/TypeScript, Node.js, and React
• Experience with databases (PostgreSQL, MongoDB)
• Knowledge of cloud platforms (AWS, Azure, or GCP)
• Strong understanding of RESTful APIs and GraphQL
• Excellent communication and teamwork skills
• Degree in Engineering or related field preferred`,
  },
  {
    title: "DevOps Engineer",
    description: `We're seeking a skilled DevOps Engineer to enhance our infrastructure and deployment processes. You'll work with modern cloud technologies and help us scale our systems.

Key responsibilities and requirements:
• 4+ years of DevOps or Site Reliability experience
• Strong experience with containerization (Docker, Kubernetes)
• Proficiency in infrastructure as code (Terraform, CloudFormation)
• Experience with CI/CD tools (Jenkins, GitHub Actions, GitLab CI)
• Knowledge of monitoring and logging solutions
• Scripting skills in Python, Bash, or PowerShell
• AWS or Azure certifications are a plus
• Strong analytical and problem-solving abilities`,
  },
];

export const JobDescription: React.FC<JobDescriptionProps> = ({
  value,
  onChange,
  placeholder = "Paste the job description here...",
  maxLength = 5000,
  showSuggestions = true,
}) => {
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      // Simple keyword detection (can be enhanced)
      if (newValue.length > 100) {
        const keywords = extractKeywords(newValue);
        setDetectedKeywords(keywords.slice(0, 5));
      } else {
        setDetectedKeywords([]);
      }
    },
    [onChange]
  );

  const handleSampleSelect = useCallback(
    (description: string) => {
      onChange(description);
      setShowSuggestionsList(false);
    },
    [onChange]
  );

  const extractKeywords = (text: string): string[] => {
    const commonKeywords = [
      "react",
      "javascript",
      "typescript",
      "node.js",
      "python",
      "aws",
      "docker",
      "kubernetes",
      "mongodb",
      "postgresql",
      "api",
      "rest",
      "graphql",
      "ci/cd",
      "agile",
      "scrum",
      "devops",
      "frontend",
      "backend",
      "full stack",
      "microservices",
      "cloud",
      "database",
      "analytics",
    ];

    const textLower = text.toLowerCase();
    return commonKeywords.filter((keyword) =>
      textLower.includes(keyword.toLowerCase())
    );
  };

  const currentWordCount = value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const minRecommendedWords = 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Job Description
              </h3>
            </div>
            {showSuggestions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestionsList(!showSuggestionsList)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Examples
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Textarea
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder}
            maxLength={maxLength}
            showCharacterCount={true}
            rows={8}
            className="min-h-[200px] text-black text-sm leading-relaxed"
          />

          {value && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              {/* Word count indicator */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Word count: {currentWordCount}
                </span>
                {currentWordCount < minRecommendedWords && (
                  <span className="text-orange-600">
                    • Consider adding more details for better analysis
                  </span>
                )}
              </div>

              {/* Detected keywords */}
              {detectedKeywords.length > 0 && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Detected keywords:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {detectedKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Sample job descriptions */}
      {showSuggestions && showSuggestionsList && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-medium text-gray-700">
            Sample Job Descriptions:
          </h4>
          <div className="grid gap-3">
            {SAMPLE_JOB_DESCRIPTIONS.map((sample, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSampleSelect(sample.description)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">
                      {sample.title}
                    </h5>
                    <Button variant="ghost" size="sm">
                      Use This
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {sample.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
