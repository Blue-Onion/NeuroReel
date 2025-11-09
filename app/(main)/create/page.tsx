"use client";

import { extractText, generateScene } from "@/actions/create";
import React, { useState } from "react";
// Import Lucide Icons
import { 
  Upload, 
  FileText, 
  Film, 
  Play, 
  RotateCw, 
  ArrowLeft, 
  Loader, 
  CheckCircle,
  X // Used for the error dismiss button
} from 'lucide-react'; 

// Extended Step Type
type AppStep = "upload" | "extracted" | "generated" | "converting";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [generatedScenes, setGeneratedScenes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<AppStep>("upload");
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  // NEW STATE: Tracks if the final videos have been generated
  const [videoGenerated, setVideoGenerated] = useState(false); 

  const clearError = () => setError(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;
    
    if (!file) {
      setError("Please upload a file first!");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    
    try {
      const text = await extractText(file);
      setExtractedText(text);
      setCurrentStep("extracted");
    } catch (err) {
      console.error(err);
      setError("Failed to extract text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScenes = async () => {
    if (!extractedText) {
      setError("No text available to generate scenes!");
      return;
    }
    clearError();
    setLoading(true);
    // Reset video state when generating new scenes
    setVideoGenerated(false); 
    
    try {
      const scenes = await generateScene(extractedText);
      setGeneratedScenes(scenes);
      setCurrentStep("generated");
    } catch (err) {
      console.error(err);
      setError("Failed to generate scenes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearError();
    setExtractedText("");
    setGeneratedScenes([]);
    setVideoGenerated(false); // Reset video state
    setCurrentStep("upload");
    setFileName("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleConvertToVideo = () => {
    clearError();
    setLoading(true);
    setCurrentStep("converting");

    // --- DUMMY VIDEO GENERATION SIMULATION ---
    console.log("Starting final video generation...");
    setTimeout(() => {
      setLoading(false);
      setVideoGenerated(true); // MARK VIDEOS AS GENERATED
      alert("✅ Video Generation Finished! (Dummy Simulation)");
      setCurrentStep("generated"); // Return to the 'generated' step to show the new video buttons
    }, 3000); // Shorter timeout for dummy simulation
    // --------------------------------------------------------------------
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Multi-Scene Video Generator
          </h1>
          <p className="text-lg text-gray-600">
            Effortlessly transform documents into cinematic storyboards and videos.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" 
              onClick={clearError}
            >
              <X className="h-6 w-6 text-red-500" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 ring-1 ring-gray-100">
          {/* Step Indicators */}
          <div className="mb-8 flex justify-center items-center gap-2 sm:gap-4">
            <StepIndicator label="Upload Document" icon={<Upload />} active={currentStep === "upload"} completed={currentStep !== "upload" && currentStep !== "converting"} />
            <div className="h-0.5 w-6 sm:w-8 bg-gray-200"></div>
            <StepIndicator label="Extract Text" icon={<FileText />} active={currentStep === "extracted"} completed={currentStep === "generated" || currentStep === "converting"} />
            <div className="h-0.5 w-6 sm:w-8 bg-gray-200"></div>
            <StepIndicator label="Generate Scenes" icon={<Film />} active={currentStep === "generated"} completed={videoGenerated || currentStep === "converting"} />
            <div className="h-0.5 w-6 sm:w-8 bg-gray-200"></div>
            <StepIndicator label="Generate Video" icon={<Play />} active={currentStep === "converting" || videoGenerated} completed={videoGenerated} />
          </div>

          {/* UPLOAD Step (1/4) */}
          {currentStep === "upload" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document (PDF, PNG, JPG)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file" type="file" accept=".png,.jpg,.jpeg,.pdf" required className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="-ml-1 mr-3 h-5 w-5" />
                    Extract Text
                  </>
                )}
              </button>
            </form>
          )}

          {/* EXTRACTED Step (2/4) */}
          {currentStep === "extracted" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" /> Extracted Text
                </h3>
                {fileName && (
                  <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    {fileName}
                  </span>
                )}
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 max-h-72 overflow-y-auto shadow-inner text-sm leading-relaxed text-gray-700">
                <p className="whitespace-pre-wrap">{extractedText || "No text extracted."}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerateScenes}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Film className="-ml-1 mr-3 h-5 w-5" />
                      Generate 2 Scenes
                    </>
                  )}
                </button>
                <button
                  onClick={() => setCurrentStep("upload")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" /> Back to Upload
                </button>
              </div>
            </div>
          )}

          {/* GENERATED Step (3/4 & COMPLETE) */}
          {currentStep === "generated" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Film className="h-6 w-6 text-purple-600" /> Generated Scenes
                </h3>
                <span className="text-sm text-gray-600">2 cinematic interpretations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedScenes.map((scene, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-lg">
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

              {/* Video Generation Section */}
              <div className="pt-8 border-t border-gray-200 mt-8">
                {!videoGenerated ? (
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Ready to create videos?</h4>
                    <button
                      onClick={handleConvertToVideo}
                      className="inline-flex items-center bg-green-600 text-white py-3.5 px-8 rounded-md font-medium hover:bg-green-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Play className="-ml-1 mr-3 h-6 w-6" /> Generate Final Videos
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                      <p className="font-semibold text-green-700 flex items-center justify-center gap-2 mb-4">
                        <CheckCircle className="h-6 w-6" /> Videos successfully generated!
                      </p>
                      
                      {/* Dummy Video Placeholders */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {generatedScenes.map((_, index) => (
                          <div key={index} className="bg-black rounded-lg overflow-hidden shadow-lg">
                            <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                              <div className="text-center text-white">
                                <Play className="h-12 w-12 mx-auto mb-2 opacity-70" />
                                <p className="text-sm font-medium">Scene {index + 1} Video</p>
                                <p className="text-xs text-gray-400 mt-1">Dummy Video Simulation</p>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                00:30
                              </div>
                            </div>
                            <div className="p-3 bg-gray-900">
                              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors">
                                Download Video
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <RotateCw className="-ml-1 mr-3 h-5 w-5" /> Start Over
                </button>
                <button
                  onClick={() => setCurrentStep("extracted")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" /> Back to Text
                </button>
              </div>
            </div>
          )}
          
          {/* CONVERTING Step (4/4 - Loading) */}
          {currentStep === "converting" && (
            <div className="flex flex-col items-center justify-center h-80 text-center space-y-6">
              <div className="relative">
                <Film className="h-20 w-20 text-indigo-200" />
                <Loader className="absolute inset-0 m-auto h-20 w-20 text-indigo-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Generating Final Videos...
              </h3>
              <p className="text-gray-600 max-w-sm">
                This is a dummy simulation. In a real application, this would render actual videos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for step indicators
interface StepIndicatorProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  completed?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ label, icon, active, completed = false }) => (
  <div className="flex flex-col items-center relative group">
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center text-lg
      ${completed ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 border border-gray-200'}
      transition-all duration-300 ease-in-out
    `}>
      {/* Ensure Lucide icons are sized correctly inside the div */}
      {completed ? <CheckCircle className="h-5 w-5" /> : React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
    </div>
    <span className={`
      mt-2 text-sm font-medium whitespace-nowrap
      ${active ? 'text-indigo-600' : 'text-gray-500'}
      transition-colors duration-300 ease-in-out
      hidden sm:block
    `}>
      {label}
    </span>
  </div>
);