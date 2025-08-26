"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md">
      <h1 className="font-bold text-lg">Fake Documents Detection Web App</h1>
      <div className="space-x-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link href="/about" className="hover:text-blue-600">
          About
        </Link>
      </div>
    </nav>
  );
}
