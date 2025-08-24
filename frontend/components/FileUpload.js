"use client";
import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Upload
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-100 w-full max-w-md text-center">
          <p>
            <strong>File:</strong> {result.filename}
          </p>
          <p>
            <strong>Fake:</strong> {result.isFake ? "Yes" : "No"}
          </p>
          <p>
            <strong>Confidence:</strong> {Math.round(result.confidence * 100)}%
          </p>
          <p className="text-red-600">
            <strong>Message:</strong> {result.message}
          </p>
        </div>
      )}
    </div>
  );
}
