'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UploadCard } from '@/components/UploadCard';
import { JobDescription } from '@/components/JobDescription';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ResultCard } from '@/components/ResultCard';
import { KeywordList } from '@/components/KeywordList';
import { SuggestionsList } from '@/components/SuggestionsList';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Sparkles } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useATSAnalysis } from '@/hooks/useATSAnalysis';
import { useReportGeneration } from '@/hooks/useReportGeneration';

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  const fileUpload = useFileUpload({
    onSuccess: (data) => {
      setResumeText(data?.extractedText || '');
    },
  });

  const analysis = useATSAnalysis({
    onSuccess: (data) => {
      // Scroll to results after successful analysis
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    },
  });

  const reportGeneration = useReportGeneration({
    onError: (error) => {
      console.error('Report generation failed:', error);
    },
  });

  const handleFileSelect = (file: File) => {
    setResumeFile(file);
    fileUpload.uploadFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeText('');
    fileUpload.resetUpload();
    analysis.resetAnalysis();
  };

  const handleAnalyze = () => {
    if (!resumeText || !jobDescription) {
      return;
    }

    analysis.analyzeResume({
      resumeText,
      jobDescription,
      options: {
        includeSuggestions: true,
        detailedAnalysis: true,
      }
    });
  };

  const handleDownloadReport = () => {
    if (analysis.analysisData) {
      reportGeneration.downloadReport(analysis.analysisData);
    }
  };

  const canAnalyze = resumeText.length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ATS Resume Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Optimize your resume with AI-powered analysis. Get instant feedback and increase your chances of landing your dream job.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Upload & Input */}
          <div className="space-y-6">
            <UploadCard
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              isUploading={fileUpload.isUploading}
              error={fileUpload.error}
              uploadedFile={resumeFile || undefined}
            />

            <JobDescription
              value={jobDescription}
              onChange={setJobDescription}
              maxLength={5000}
              showSuggestions={true}
            />

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || fileUpload.isUploading || analysis.isAnalyzing}
              loading={analysis.isAnalyzing}
              className="w-full text-lg py-3"
              size="lg"
            >
              {analysis.isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Results Preview or Instructions */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!analysis.analysisData ? (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Upload Your Resume</h4>
                        <p className="text-gray-600">Supports PDF, DOC, and DOCX formats</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Paste Job Description</h4>
                        <p className="text-gray-600">Add the job description for comparison</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Get AI Analysis</h4>
                        <p className="text-gray-600">Receive detailed ATS score and improvement suggestions</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="score-preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Your ATS Score</h3>
                  <ScoreGauge
                    score={analysis.analysisData.atsScore}
                    size={200}
                    animated={true}
                  />
                  <div className="mt-6">
                    <Button
                      onClick={handleDownloadReport}
                      loading={reportGeneration.isGenerating}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Full Report
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Detailed Results */}
        <AnimatePresence>
          {analysis.analysisData && (
            <motion.div
              id="results"
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Report Download Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center"
              >
                <h3 className="text-lg font-semibold mb-2">Ready to Share Your Results?</h3>
                <p className="mb-4 text-blue-100">
                  Download a comprehensive PDF report with all your ATS analysis results
                </p>
                <Button
                  onClick={handleDownloadReport}
                  loading={reportGeneration.isGenerating}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF Report
                </Button>
              </motion.div>

              {/* Results Components */}
              <div className="space-y-8">
                <ResultCard data={analysis.analysisData} />
                <KeywordList keywords={analysis.analysisData.breakdown.keywordMatch} />
                <SuggestionsList suggestions={analysis.analysisData.suggestions} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {analysis.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800 font-medium">Analysis Error</p>
              <p className="text-red-600">{analysis.error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}