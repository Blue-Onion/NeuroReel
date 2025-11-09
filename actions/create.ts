"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import FormData from "form-data";
import fetch from "node-fetch";

// 🧾 OCR.Space response types
interface OCRParsedResult {
  ParsedText: string;
}

interface OCRSpaceResponse {
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
  ParsedResults?: OCRParsedResult[];
}

// 🧠 OCR Text Extraction
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


  return fullText;
}

// 🎬 Gemini Scene Generation - Returns multiple scenes
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateScene(text: string): Promise<string[]> {
  if (!text) throw new Error("No text provided!");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      You are a creative screenwriter. Based on the following extracted text,
      create 3 distinct cinematic scenes that capture different aspects or interpretations of the text.

      RULES:
      - Create exactly 2 different scenes
      - Each scene should have a unique perspective, style, or focus
      - Return them as Scene 1 and Scene 2, clearly separated
      - Each scene should be 2-4 paragraphs long
      - Make them genuinely different in tone, perspective, or interpretation

      Text:
      ${text}

      Format your response exactly like this:
      
      SCENE 1:
      [First cinematic scene here]

      SCENE 2:
      [Second cinematic scene here]

      SCENE #:
      [Third cinematic scene here]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullResponse = response.text();



    // Parse the response to extract both scenes
    const scenes = parseScenesFromResponse(fullResponse);
    

    return scenes;
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw new Error("Failed to generate scenes");
  }
}

// Helper function to parse scenes from the response
function parseScenesFromResponse(response: string): string[] {
  const scenes: string[] = [];
  
  // Try to split by "SCENE 1:" and "SCENE 2:" markers
  const scene1Match = response.match(/SCENE 1:\s*(.*?)(?=SCENE 2:|$)/is);
  const scene2Match = response.match(/SCENE 2:\s*(.*?)$/is);
  
  if (scene1Match && scene1Match[1]) {
    scenes.push(scene1Match[1].trim());
  }
  
  if (scene2Match && scene2Match[1]) {
    scenes.push(scene2Match[1].trim());
  }
  
  // Fallback: if parsing by markers fails, try to split the response into two parts
  if (scenes.length < 2) {
    const lines = response.split('\n').filter(line => line.trim());
    const midPoint = Math.ceil(lines.length / 2);
    scenes.push(lines.slice(0, midPoint).join('\n').trim());
    scenes.push(lines.slice(midPoint).join('\n').trim());
  }
  
  // Ensure we always return exactly 2 scenes
  while (scenes.length < 2) {
    scenes.push("Could not generate this scene. Please try again.");
  }
  
  return scenes.slice(0, 2);
}

// Enhanced version with customization options
export async function generateCustomScenes(
  text: string, 
  options?: {
    style?: string;
    mood?: string;
    numberOfScenes?: number;
  }
): Promise<string[]> {
  if (!text) throw new Error("No text provided!");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const numScenes = options?.numberOfScenes || 5;

    let prompt = `
      You are a creative screenwriter. Based on the following extracted text,
      create ${numScenes} distinct cinematic scenes that capture different aspects or interpretations.
    `;

    if (options?.style) {
      prompt += `\nSTYLE: ${options.style}`;
    }
    
    if (options?.mood) {
      prompt += `\nMOOD: ${options.mood}`;
    }

    prompt += `
      RULES:
      - Create exactly ${numScenes} different scenes
      - Each scene should have a unique perspective, style, or focus
      - Return them as Scene 1, Scene 2,Scene 3 clearly separated
      - Each scene should be 2-4 paragraphs long
      - Make them genuinely different in tone, perspective, or interpretation

      Text:
      ${text}

      Format your response exactly like this:
    `;

    // Add scene markers based on number of scenes
    for (let i = 1; i <= numScenes; i++) {
      prompt += `\n\nSCENE ${i}:\n[Scene ${i} content here]`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullResponse = response.text();



    // Parse the response to extract all scenes
    const scenes = parseMultipleScenesFromResponse(fullResponse, numScenes);
    

    return scenes;
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw new Error("Failed to generate scenes");
  }
}

// Enhanced parser for multiple scenes
function parseMultipleScenesFromResponse(response: string, numberOfScenes: number): string[] {
  const scenes: string[] = [];
  
  for (let i = 1; i <= numberOfScenes; i++) {
    const sceneRegex = new RegExp(`SCENE ${i}:\\s*(.*?)(?=SCENE ${i + 1}:|$)`, 'is');
    const sceneMatch = response.match(sceneRegex);
    
    if (sceneMatch && sceneMatch[1]) {
      scenes.push(sceneMatch[1].trim());
    } else {
      // If no marker found, try to split equally
      const lines = response.split('\n').filter(line => line.trim());
      const scenesCount = Math.min(numberOfScenes, lines.length);
      const sceneLength = Math.ceil(lines.length / scenesCount);
      const startIndex = (i - 1) * sceneLength;
      const endIndex = i === scenesCount ? lines.length : startIndex + sceneLength;
      scenes.push(lines.slice(startIndex, endIndex).join('\n').trim());
    }
  }
  
  // Ensure we return exactly the requested number of scenes
  while (scenes.length < numberOfScenes) {
    scenes.push(`Scene ${scenes.length + 1}: Could not generate this scene. Please try again.`);
  }
  
  return scenes.slice(0, numberOfScenes);
}