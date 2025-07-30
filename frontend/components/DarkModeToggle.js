'use client';  // for Next.js App Router, enables hooks
import "@theme-toggles/react/css/Classic.css";
import { Classic } from "@theme-toggles/react";
import { useEffect, useState } from 'react';
import "@theme-toggles/react/css/Lightbulb.css"
import { Lightbulb } from "@theme-toggles/react"

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check localStorage or prefers-color-scheme
    const saved = localStorage.getItem('dark-mode');
    if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
      setIsDark(true);
    }
  };

  return (
   <div>
  {/* Mobile toggle: visible on < md */}
  <Classic
    toggled={isDark}
    onToggle={toggleDarkMode}
    duration={750}
    className="md:hidden w-8 h-8"
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  />

  {/* Desktop toggle: visible on ≥ md */}
  <button
    onClick={toggleDarkMode}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    className="hidden md:flex w-12 h-6 rounded-full p-1 bg-gray-300 dark:bg-gray-700 items-center cursor-pointer transition-colors hover:bg-cyan-500"
  >
    <span
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
        isDark ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
</div>

  );
}
