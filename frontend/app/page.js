"use client";
import { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Navbar";
import LoadingBar from "../components/LoadingBar";

const Homepage = dynamic(() => import("./Homepage/page"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Radial gradient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent" />

      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Multiple rotating rings */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 border-r-blue-500 rounded-full animate-spin" />
          {/* Middle ring */}
          <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 border-r-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          {/* Inner ring */}
          <div className="absolute inset-4 border-4 border-transparent border-t-blue-400 border-r-emerald-400 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
          </div>
        </div>

        {/* Text with gradient and animation */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
            Ready..Set..Go!!
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 animate-pulse rounded-full" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-full" />
    </div>
  ),
  ssr: false,
});

export default function Page() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  return (
    <>
      <LoadingBar />
      
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
        }

        #__next {
          overflow-x: hidden;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "calc(var(--vh, 1vh) * 100)",
          overflow: "hidden",
          backgroundColor: "black",
        }}
      >
        <Header />
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Homepage />
        </Suspense>
      </div>
    </>
  );
}
