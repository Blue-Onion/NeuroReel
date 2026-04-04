"use client";

import { useState } from "react";
import { Upload, Film, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { startProductionAction } from "@/actions/create";

export default function CreatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [style, setStyle] = useState("netflix-cinematic");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const styles = [
    { id: "netflix-cinematic", name: "Netflix Cinematic", desc: "Dramatic lighting and high-stakes narrative." },
    { id: "corporate-sleek", name: "Corporate Sleek", desc: "Clean, professional, and high-energy." },
    { id: "documentary", name: "Deep Documentary", desc: "Informative, grounded, and trust-building." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 font-archivo">
            Create Your <span className="text-blue-600">Production</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your training material and let the Director Agent transform it into a multi-scene cinematic experience.
          </p>
        </div>

        <form action={startProductionAction} className="space-y-10">
          {/* Upload Area */}
          <div className="group relative">
            <input
              type="file"
              name="file"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
              required
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
                file 
                  ? "border-green-400 bg-green-50/50 shadow-inner" 
                  : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 shadow-lg"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-4">
                {file ? (
                  <>
                    <div className="p-4 bg-green-100 rounded-full text-green-600 animate-bounce">
                      <CheckCircle2 size={48} />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">Ready for production</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                      <Upload size={48} />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-slate-700">Drop your training PDF here</p>
                      <p className="text-sm text-slate-500">or click to browse your files</p>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Style Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Film className="text-blue-600" /> Choose Production Style
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {styles.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    style === s.id
                      ? "border-blue-600 bg-blue-50 ring-4 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <input type="radio" name="style" value={s.id} checked={style === s.id} className="hidden" readOnly />
                  <h3 className={`font-bold mb-2 ${style === s.id ? "text-blue-700" : "text-slate-800"}`}>{s.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              size="lg"
              className="h-16 px-12 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-blue-600 hover:bg-blue-700"
              disabled={!file || isUploading}
              onClick={() => setIsUploading(true)}
            >
              {isUploading ? "Starting Engine..." : "Kickstart Production"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
