import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { FileUploadResponse } from "@/lib/types";
import { APP_CONFIG } from "@/lib/constants";
import { Document, Packer, Paragraph } from "docx";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Validate file exists
    if (!file) {
      const error: FileUploadResponse = {
        success: false,
        error: {
          code: "INVALID_FILE_TYPE",
          message: "No file provided",
        },
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Validate file type
    if (!APP_CONFIG.SUPPORTED_FILE_TYPES.includes(file.type as any)) {
      const error: FileUploadResponse = {
        success: false,
        error: {
          code: "INVALID_FILE_TYPE",
          message: "Only PDF, DOC, and DOCX files are allowed",
        },
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Validate file size
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
      const error: FileUploadResponse = {
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: `File size exceeds ${
            APP_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
          }MB limit`,
        },
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    try {
      // Extract text based on file type

      if (file.type === "application/pdf") {
        // Use pdf2json directly for PDF extraction
        const PDFParser = (await import("pdf2json")).default;
        const pdfParser = new PDFParser();
        extractedText = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (err) => {
            if (err && typeof err === "object" && "parserError" in err) {
              reject((err as any).parserError);
            } else {
              reject(err);
            }
          });
          pdfParser.on("pdfParser_dataReady", (pdfData) => {
            const texts = [];
            // Defensive: check Pages exist (pdf2json Output type)
            if (pdfData && Array.isArray(pdfData.Pages)) {
              for (const page of pdfData.Pages) {
                for (const textObj of page.Texts) {
                  for (const r of textObj.R) {
                    let decoded = r.T;
                    try {
                      decoded = decodeURIComponent(r.T);
                    } catch (e) {
                      // If decoding fails, use the raw value
                    }
                    texts.push(decoded);
                  }
                }
              }
            }
            resolve(texts.join(" "));
          });
          pdfParser.parseBuffer(buffer);
        });
        // Convert extracted text to DOCX and re-extract with mammoth for normalization
        const paragraphs = extractedText
          .split(/\n|\r/)
          .map((line) => new Paragraph(line));
        const doc = new Document({ sections: [{ children: paragraphs }] });
        const docxBuffer = await Packer.toBuffer(doc);
        const mammothResult = await mammoth.extractRawText({
          buffer: docxBuffer,
        });
        extractedText = mammothResult.value;
      } else if (file.type.includes("word")) {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else {
        throw new Error("Unsupported file type");
      }

      // Clean and normalize text
      extractedText = cleanExtractedText(extractedText);

      // Validate extracted text
      if (!extractedText || extractedText.trim().length < 50) {
        const error: FileUploadResponse = {
          success: false,
          error: {
            code: "PROCESSING_ERROR",
            message:
              "Unable to extract sufficient text from the file. Please ensure it contains readable content.",
          },
        };
        return NextResponse.json(error, { status: 400 });
      }

      const processingTime = Date.now() - startTime;

      const response: FileUploadResponse = {
        success: true,
        data: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          extractedText,
          textLength: extractedText.length,
          processingTime,
        },
      };

      return NextResponse.json(response);
    } catch (extractionError) {
      console.error("Text extraction error:", extractionError);
      const error: FileUploadResponse = {
        success: false,
        error: {
          code: "PROCESSING_ERROR",
          message:
            "Failed to extract text from the file. Please try a different file.",
          details:
            extractionError instanceof Error
              ? extractionError.message
              : "Unknown error",
        },
      };
      return NextResponse.json(error, { status: 500 });
    }
  } catch (error) {
    console.error("Upload API error:", error);
    const errorResponse: FileUploadResponse = {
      success: false,
      error: {
        code: "PROCESSING_ERROR",
        message: "File upload processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

function cleanExtractedText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove extra line breaks
      .replace(/\n+/g, " ")
      // Remove special characters that might interfere with analysis
      .replace(/[^\w\s\-.,;:!?()[\]{}@#$%^&*+=/\\|<>"'`~\n]/g, "")
      // Remove multiple punctuation
      .replace(/([.,;:!?])\1+/g, "$1")
      // Trim whitespace
      .trim()
  );
}

// Add CORS headers
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
