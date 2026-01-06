// src/lib/pdf-extractor.ts
// Robust PDF text extraction: pdf2json (primary), pdf-parse (fallback)
import "./node-dom-polyfills";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Try pdf2json first
  try {
    const PDFParser = (await import("pdf2json")).default;
    const pdfParser = new PDFParser();
    return await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err: any) => reject(err.parserError));
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        // Extract text from all pages
        const texts: string[] = [];
        for (const page of pdfData.formImage.Pages) {
          for (const textObj of page.Texts) {
            for (const r of textObj.R) {
              texts.push(decodeURIComponent(r.T));
            }
          }
        }
        resolve(texts.join(" "));
      });
      pdfParser.parseBuffer(buffer);
    });
  } catch (err) {
    // Fallback to pdf-parse
    try {
      const pdfParse = (await import("pdf-parse")) as any;
      const pdfData = await pdfParse(buffer);
      return pdfData.text || "";
    } catch (err2) {
      return "";
    }
  }
}
