"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    setProgress(20);

    const timer1 = setTimeout(() => setProgress(40), 100);
    const timer2 = setTimeout(() => setProgress(70), 300);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none"
      style={{
        opacity: loading ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 transition-all duration-300 ease-out shadow-lg shadow-blue-500/50"
        style={{
          width: `${progress}%`,
          transition: "width 0.3s ease-out",
        }}
      />
    </div>
  );
}
