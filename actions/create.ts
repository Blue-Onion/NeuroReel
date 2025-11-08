"use server";

import FormData from "form-data";
import fetch from "node-fetch";

// Define OCR.Space response type
interface OCRParsedResult {
  ParsedText: string;
}

interface OCRSpaceResponse {
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
  ParsedResults?: OCRParsedResult[];
}

export async function extractText(file: File): Promise<string> {
  if (!file) throw new Error("No file received!");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const form = new FormData();
  form.append("file", buffer, file.name);
  form.append("language", "eng");
  form.append("isOverlayRequired", "false");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: process.env.OCR_API_KEY || "helloworld",
    },
    body: form as any,
  });

  const data = (await res.json()) as OCRSpaceResponse;

  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage || "OCR processing failed.");
  }

  const fullText =
    data.ParsedResults?.map((r) => r.ParsedText.trim()).join(" ") ||
    "No text found.";

  const preview = fullText;
  console.log("📄 Extracted preview:", preview);

  return preview;
}
