"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden px-6">

      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main content */}
      <div
        className={`relative z-10 text-center max-w-lg transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
      >
        {/* 404 glitch text */}
        <div className="relative mb-6 select-none">
          <span className="font-mono text-[clamp(6rem,20vw,10rem)] font-bold leading-none text-white tracking-tight animate-[glitch_4s_infinite]">
            404
          </span>
        </div>

        {/* Divider */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 rounded-full" />

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Page Not Found
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Looks like this page wandered off into the void.
          <br />
          Let&apos;s get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            ← Back to Home
          </Link>

          <Link
            href="/#projects"
            className="inline-flex items-center px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            View Projects
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            Contact Me
          </Link>
        </div>
      </div>

      {/* Glitch keyframes */}
      <style>{`
        @keyframes glitch {
          0%, 85%, 100% { text-shadow: -3px 0 0 #a855f7, 3px 0 0 #6366f1; }
          87%            { text-shadow: -6px 0 0 #a855f7, 6px 0 0 #6366f1; }
          89%            { text-shadow:  4px 0 0 #a855f7, -4px 0 0 #6366f1; }
          91%            { text-shadow: -3px 0 0 #a855f7, 3px 0 0 #6366f1; }
          93%            { text-shadow:  5px 1px 0 #a855f7, -5px -1px 0 #6366f1; }
          95%            { text-shadow: -3px 0 0 #a855f7, 3px 0 0 #6366f1; }
        }
      `}</style>
    </main>
  );
}