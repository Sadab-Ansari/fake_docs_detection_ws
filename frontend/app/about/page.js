"use client";
import { ShieldCheck, Brain, FileCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        About FakeDocsDetector
      </h1>
      <p className="text-gray-700 mb-6 leading-relaxed">
        <strong>FakeDocsDetector</strong> is an AI-powered web application
        designed to detect fake or forged documents. It leverages{" "}
        <span className="font-semibold">Machine Learning</span>
        models combined with secure backend APIs to provide reliable results
        with confidence scores.
      </p>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="p-4 shadow-md rounded-xl bg-white flex flex-col items-center text-center">
          <ShieldCheck size={40} className="text-blue-600 mb-3" />
          <h2 className="font-semibold">Secure</h2>
          <p className="text-sm text-gray-600">
            Helps prevent fraud by validating document authenticity.
          </p>
        </div>

        <div className="p-4 shadow-md rounded-xl bg-white flex flex-col items-center text-center">
          <Brain size={40} className="text-blue-600 mb-3" />
          <h2 className="font-semibold">AI Powered</h2>
          <p className="text-sm text-gray-600">
            Uses machine learning models trained to detect fake documents.
          </p>
        </div>

        <div className="p-4 shadow-md rounded-xl bg-white flex flex-col items-center text-center">
          <FileCheck size={40} className="text-blue-600 mb-3" />
          <h2 className="font-semibold">Accurate Results</h2>
          <p className="text-sm text-gray-600">
            Provides confidence scores to ensure trustworthy analysis.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        This project was created to demonstrate the potential of combining{" "}
        <span className="font-semibold">Artificial Intelligence</span> with{" "}
        <span className="font-semibold">web technology</span> for real-world
        problem-solving.
      </p>
    </div>
  );
}
