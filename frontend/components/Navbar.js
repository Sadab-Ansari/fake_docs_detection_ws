"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Info } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="font-bold text-lg text-blue-700">
          FakeDocs<span className="text-gray-800">Detector</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <Home size={18} /> Home
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <Info size={18} /> About
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            <Home size={18} /> Home
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            <Info size={18} /> About
          </Link>
        </div>
      )}
    </nav>
  );
}
