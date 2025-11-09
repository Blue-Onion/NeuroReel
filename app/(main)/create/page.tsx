"use client";

import { extractText, generateScene, generateCustomScenes } from "@/actions/create";
import React, { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [generatedScenes, setGeneratedScenes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"upload" | "extracted" | "generated">("upload");
  const [fileName, setFileName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;
    
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    
    try {
      const text = await extractText(file);
      console.log("Extracted text:", text);
      setExtractedText(text);
      setCurrentStep("extracted");
    } catch (err) {
      console.error(err);
      alert("Failed to read the file.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScenes = async () => {
    if (!extractedText) {
      alert("No text available to generate scenes!");
      return;
    }

    setLoading(true);
    
    try {
      const scenes = await generateScene(extractedText);
      console.log("Generated scenes:", scenes);
      setGeneratedScenes(scenes);
      setCurrentStep("generated");
    } catch (err) {
      console.error(err);
      alert("Failed to generate scenes.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setExtractedText("");
    setGeneratedScenes([]);
    setCurrentStep("upload");
    setFileName("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🎬 Multi-Scene Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload an image and get multiple cinematic interpretations
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {currentStep === "upload" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📁 Upload Image
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "⏳ Processing..." : "🧾 Extract Text"}
              </button>
            </form>
          )}

          {currentStep === "extracted" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">📄 Extracted Text</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {fileName}
                </span>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap text-sm">{extractedText}</p>
              </div>
              
              <button
                onClick={handleGenerateScenes}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "⏳ Generating..." : "🎬 Generate 2 Scenes"}
              </button>
            </div>
          )}

          {currentStep === "generated" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">🎬 Generated Scenes</h3>
                <span className="text-sm text-gray-500">2 interpretations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedScenes.map((scene, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-800">Scene {index + 1}</h4>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                      {scene}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  🚀 Start Over
                </button>
                <button
                  onClick={() => setCurrentStep("extracted")}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back to Text
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}