import React, { Suspense } from "react";
import nextDynamic from "next/dynamic";
import LoadingBar from "@/components/LoadingBar";

// Lazy load Projects component
const Projects = nextDynamic(() => import("./Project"), {
  loading: () => <ProjectsLoadingSkeleton />,
  ssr: true,
});

export const revalidate = 3600;

// Beautiful loading skeleton component
function ProjectsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Suspense fallback={null}>
        <LoadingBar />
      </Suspense>

      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-40" />
        <div
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-40"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-40"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Animated rings */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin" />
          <div
            className="absolute inset-3 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
          <div
            className="absolute inset-6 border-4 border-transparent border-t-pink-400 border-r-blue-400 rounded-full animate-spin"
            style={{ animationDuration: "2s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
            Loading Projects
          </h2>
          <p className="text-gray-400 text-lg">
            Preparing something amazing for you...
          </p>

          {/* Bouncing dots */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
            <div
              className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>

        {/* Skeleton cards preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 animate-pulse"
            >
              <div className="w-full h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4" />
              <div className="h-4 bg-purple-500/30 rounded w-3/4 mb-3" />
              <div className="h-3 bg-purple-500/20 rounded w-full mb-2" />
              <div className="h-3 bg-purple-500/20 rounded w-5/6" />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-80 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Corner glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
    </div>
  );
}

async function getProjectsData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_SERVER_API_URL}/project/projects_data`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return [];
  }
}

export default async function Page() {
  const response = await getProjectsData();

  const projects = response?.data || [];

  if (!projects.length) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-lg max-w-md">
            No project data found!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Suspense fallback={<ProjectsLoadingSkeleton />}>
        <Projects projectsData={projects} />
      </Suspense>
    </main>
  );
}
