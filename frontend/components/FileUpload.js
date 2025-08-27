"use client";

import { useCallback, useRef, useState } from "react";

const MAX_MB = 12; // Max file size allowed
const ACCEPTED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Reset state
  const resetAll = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Validation
  const validate = (f) => {
    if (!ACCEPTED.includes(f.type) && !f.name.endsWith(".pdf")) {
      return "Unsupported file type. Please upload PDF, JPG/PNG, or DOC/DOCX.";
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      return `File is too large. Max ${MAX_MB} MB.`;
    }
    return null;
  };

  // When a file is selected
  const handleChoose = (f) => {
    setError(null);
    setResult(null);
    if (!f) return;
    const v = validate(f);
    if (v) {
      setError(v);
      setFile(null);
      return;
    }
    setFile(f);
  };

  // Handle drag and drop
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    handleChoose(f);
  }, []);

  // Upload handler
  const handleUpload = async () => {
    if (!file || isLoading) return;
    setError(null);
    setResult(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while uploading.");
    } finally {
      setIsLoading(false);
    }
  };

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-10 rounded-2xl">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Fake Documents Detector
          </h1>
          <p className="text-slate-600 mt-2">
            Upload a document (PDF/JPG/PNG/DOC) to check its authenticity.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer
              flex flex-col items-center justify-center p-8 md:p-10 text-center
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
              onChange={(e) => handleChoose(e.target.files?.[0] ?? null)}
            />

            <div className="text-slate-700">
              <div className="text-lg font-medium">
                {file ? "Ready to upload" : "Drag & drop your file here"}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                or <span className="text-blue-600 underline">browse</span> to
                choose a file
              </div>

              {/* Selected file chip */}
              {file && (
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-slate-100">
                  <span className="truncate max-w-[220px]">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAll();
                    }}
                    className="text-slate-600 hover:text-slate-800 transition"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-white font-medium shadow-sm
                ${
                  !file || isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-5 w-5 border-2 border-white/40 border-l-white rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                "Upload & Analyze"
              )}
            </button>

            <button
              type="button"
              onClick={resetAll}
              disabled={isLoading || (!file && !result && !error)}
              className="rounded-xl px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          {/* Loading Bar */}
          {isLoading && (
            <div className="mt-5">
              <div className="progress-bar" aria-hidden />
              <p className="text-sm text-slate-500 mt-2">
                This may take a few seconds…
              </p>
            </div>
          )}

          {/* Result */}
          {result && !isLoading && (
            <div
              className={`mt-6 rounded-2xl p-5 border ${
                result.isFake
                  ? "bg-red-50 border-red-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-slate-600">
                    File:{" "}
                    <span className="font-medium text-slate-800">
                      {result.filename}
                    </span>
                  </p>
                  <p className="mt-1">
                    <span className="text-slate-700 font-semibold">
                      Prediction:
                    </span>{" "}
                    <span
                      className={
                        result.isFake
                          ? "text-red-700 font-bold"
                          : "text-emerald-700 font-bold"
                      }
                    >
                      {result.isFake ? "Fake" : "Not Fake"}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 font-medium">
                    Confidence
                  </p>
                  <div className="w-48 h-2 rounded-full bg-white/70 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-slate-900/80 transition-all"
                      style={{ width: `${confidencePct}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-700 mt-1">
                    {confidencePct}%
                  </p>
                </div>
              </div>

              {result.message && (
                <p className="mt-4 text-sm text-slate-600">
                  <span className="font-semibold">Message:</span>{" "}
                  {result.message}
                </p>
              )}
            </div>
          )}

          {/* Small footer/help */}
          <p className="mt-6 text-xs text-slate-500">
            We don’t store your document. The model runs on the server and
            returns only the prediction & confidence.
          </p>
        </div>
      </div>

      {/* scoped CSS for the indeterminate progress bar */}
      <style jsx>{`
        .progress-bar {
          height: 8px;
          width: 100%;
          border-radius: 9999px;
          background: #e5e7eb;
          position: relative;
          overflow: hidden;
        }
        .progress-bar::after {
          content: "";
          position: absolute;
          left: -40%;
          top: 0;
          height: 100%;
          width: 40%;
          border-radius: 9999px;
          background: #3b82f6;
          animation: indeterminate 1.1s ease-in-out infinite;
        }
        @keyframes indeterminate {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
