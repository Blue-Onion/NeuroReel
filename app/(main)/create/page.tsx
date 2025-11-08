"use client";


import { extractText } from "@/actions/create";
import React, { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;
    if (!file) return alert("Please upload a file first!");

    setLoading(true);
    try {
      const text = await extractText(file);
      console.log("Extracted text:", text);
      setPreview(text);
    } catch (err) {
      console.error(err);
      alert("Failed to read the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        OCR Text Extractor
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80 flex flex-col gap-3"
      >
        <input
          type="file"
          name="file"
          accept=".pdf,.png,.jpg,.jpeg"
          required
          className="border p-2 rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Reading..." : "Extract Text"}
        </button>
      </form>

      {preview && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow w-96 text-gray-800">
          <h2 className="font-semibold mb-2 text-lg text-blue-500">
            Extracted Preview:
          </h2>
          <p>{preview}</p>
        </div>
      )}
    </div>
  );
}
