import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingBar from "@/components/LoadingBar";

// Lazy load About component
const About = dynamic(() => import("./About"), {
  loading: () => <AboutLoadingSkeleton />,
  ssr: true,
});

export const revalidate = 3600; // regenerate every 1 hour

// Stunning loading skeleton for About page
function AboutLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Suspense fallback={null}>
        <LoadingBar />
      </Suspense>

      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Animated logo/icon area */}
        <div className="relative w-40 h-40 mb-12">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin" />
          {/* Middle ring */}
          <div
            className="absolute inset-4 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "2s" }}
          />
          {/* Inner ring */}
          <div
            className="absolute inset-8 border-4 border-transparent border-t-pink-400 border-r-blue-400 rounded-full animate-spin"
            style={{ animationDuration: "3s" }}
          />
          {/* Center pulsing orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full animate-pulse shadow-2xl shadow-purple-500/50" />
          </div>
        </div>

        {/* Main content */}
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
            Loading About
          </h1>
          <p className="text-gray-300 text-xl">
            Crafting your journey story...
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" />
            <div
              className="w-4 h-4 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>

        {/* Section preview cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
          {["About Me", "Skills", "Education", "Certifications"].map(
            (section, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-purple-500/20 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-purple-500/30 rounded w-3/4 mx-auto mb-3" />
                <div className="h-3 bg-purple-500/20 rounded w-full mb-2" />
                <div className="h-3 bg-purple-500/20 rounded w-5/6 mx-auto" />
              </div>
            )
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-12 w-96 max-w-full">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse rounded-full" />
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">
            Loading sections dynamically...
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-tl-full" />
    </div>
  );
}

export default async function AboutPage() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    console.log("⏩ Skipping About data fetch during Docker build");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400 text-lg max-w-md">
            About data skipped during build. It will load dynamically once the
            app runs.
          </p>
        </div>
      </div>
    );
  }

  try {
    const [skillsRes, eduRes, certRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/Skilldata`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/Educationdata`, {
        next: { revalidate: 3600 },
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/Certificatesdata`,
        {
          next: { revalidate: 3600 },
        }
      ),
    ]);

    const [skillsData, educationData, certificateData] = await Promise.all([
      skillsRes.json(),
      eduRes.json(),
      certRes.json(),
    ]);

    return (
      <Suspense fallback={<AboutLoadingSkeleton />}>
        <About
          skillsData={skillsData}
          educationData={educationData}
          certificateData={certificateData}
        />
      </Suspense>
    );
  } catch (err) {
    console.error("❌ Error fetching About page data:", err);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4 max-w-md p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400">Failed to Load</h2>
          <p className="text-gray-400">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}
