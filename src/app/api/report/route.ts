import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { ATSAnalysisResponse } from "@/lib/types";
import { getScoreLabel } from "@/lib/utils";

interface ReportRequest {
  analysisData: NonNullable<ATSAnalysisResponse["data"]>;
  fileName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();

    if (!body.analysisData) {
      return NextResponse.json(
        { error: "Analysis data is required" },
        { status: 400 }
      );
    }

    const { analysisData, fileName = "ATS-Analysis-Report.pdf" } = body;
    const pdf = generatePDF(analysisData);

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generatePDF(data: NonNullable<ATSAnalysisResponse["data"]>): Buffer {
  const { atsScore, breakdown, suggestions, analysisMetadata } = data;
  const scoreLabel = getScoreLabel(atsScore);

  const doc = new jsPDF({
    format: "a4",
    unit: "mm",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("Helvetica", "bold");
  doc.text("ATS Analysis Report", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text("Resume Optimization Analysis powered by AI", pageWidth / 2, 23, {
    align: "center",
  });

  yPosition = 40;

  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 244, 248);
  doc.rect(70, yPosition, 70, 25, "F");
  doc.setFontSize(16);
  doc.setFont("Helvetica", "bold");
  doc.text(`${atsScore}`, pageWidth / 2, yPosition + 12, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text(`${scoreLabel} ATS Score`, pageWidth / 2, yPosition + 20, {
    align: "center",
  });

  yPosition += 40;

  doc.setFillColor(248, 250, 252);
  doc.rect(15, yPosition - 5, pageWidth - 30, 5, "F");
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(" Score Breakdown", 20, yPosition + 2);

  yPosition += 12;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");

  const scoreItems = [
    { name: "Semantic Match", score: breakdown.semanticSimilarity.score },
    { name: "Keywords Match", score: breakdown.keywordMatch.score },
    { name: "Skills Match", score: breakdown.skillsAnalysis.score },
    { name: "Formatting Quality", score: breakdown.formatting.score },
    { name: "Completeness", score: breakdown.completeness.score },
  ];

  scoreItems.forEach((item) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setTextColor(0, 0, 0);
    doc.text(item.name, 20, yPosition);
    doc.setFont("Helvetica", "bold");
    doc.text(`${item.score}%`, pageWidth - 20, yPosition, { align: "right" });
    doc.setFont("Helvetica", "normal");
    yPosition += 6;
  });

  yPosition += 5;

  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.rect(15, yPosition - 5, pageWidth - 30, 5, "F");
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("🔍 Keyword Analysis", 20, yPosition + 2);

  yPosition += 12;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(16, 185, 129);
  doc.text(
    `✓ Matched Keywords (${breakdown.keywordMatch.matched.length})`,
    20,
    yPosition
  );
  yPosition += 5;

  doc.setTextColor(0, 0, 0);
  breakdown.keywordMatch.matched.forEach((keyword) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    const cleanKeyword = cleanText(keyword);
    doc.text(`• ${cleanKeyword}`, 25, yPosition);
    yPosition += 4;
  });

  /**
   * Cleans a keyword string by trimming whitespace and removing unwanted characters.
   */
  function cleanText(text: string): string {
    return text.trim();
  }

  yPosition += 3;

  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setTextColor(239, 68, 68);
  doc.setFont("Helvetica", "bold");
  doc.text(
    `✗ Missing Keywords (${breakdown.keywordMatch.missing.length})`,
    20,
    yPosition
  );
  yPosition += 5;

  doc.setTextColor(0, 0, 0);
  doc.setFont("Helvetica", "normal");
  breakdown.keywordMatch.missing.forEach((keyword) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
    const cleanKeyword = cleanText(keyword);
    doc.text(`• ${cleanKeyword}`, 25, yPosition);
    yPosition += 4;
  });

  yPosition += 5;

  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.rect(15, yPosition - 5, pageWidth - 30, 5, "F");
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("💡 Top Suggestions", 20, yPosition + 2);

  yPosition += 12;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");

  suggestions.slice(0, 3).forEach((suggestion, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    const priorityColor: { [key: string]: [number, number, number] } = {
      high: [239, 68, 68],
      medium: [245, 158, 11],
      low: [16, 185, 129],
    };

    const color = priorityColor[suggestion.priority.toLowerCase()] || [
      102, 126, 234,
    ];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("Helvetica", "bold");
    doc.text(
      `${index + 1}. [${suggestion.priority.toUpperCase()}] ${
        suggestion.description
      }`,
      20,
      yPosition
    );

    yPosition += 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont("Helvetica", "normal");
    const wrappedText = doc.splitTextToSize(
      suggestion.example || "",
      pageWidth - 40
    );
    wrappedText.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 25, yPosition);
      yPosition += 4;
    });

    yPosition += 3;
  });

  yPosition += 5;

  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFillColor(249, 250, 251);
  doc.rect(15, yPosition - 2, pageWidth - 30, 35, "F");
  doc.setFontSize(10);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Analysis Metadata", 20, yPosition + 3);

  yPosition += 10;
  doc.setFontSize(8);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(75, 85, 99);

  doc.text(
    `Analysis Date: ${new Date(analysisMetadata.analyzedAt).toLocaleString()}`,
    20,
    yPosition
  );
  yPosition += 5;
  doc.text(
    `Processing Time: ${analysisMetadata.processingTime}ms`,
    20,
    yPosition
  );
  yPosition += 5;
  doc.text(
    `Resume Words: ${analysisMetadata.resumeWordCount} | Job Desc Words: ${analysisMetadata.jobDescriptionWordCount}`,
    20,
    yPosition
  );

  doc.setFontSize(8);
  doc.setTextColor(155, 160, 163);
  const footerText = `Generated by ATSFlux AI Resume Checker | ${new Date().toLocaleString()}`;
  doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: "center" });

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  return pdfBuffer;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
