import React from "react";
import Projects from "./Project";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export const dynamic = "force-dynamic"; // SSR on every request

// ✅ SSR Fetch Function (Server-side)
async function getProjectsData() {

  // ⏩ Skip fetch during Docker build
  if (process.env.SKIP_BUILD_STATIC_GENERATION === "true") {
    console.log("⏩ Skipping Projects fetch during Docker build");
    return [];
  }

  try {
    return await PortfolioApiService.fetchProjects();
  } catch (error) {
    console.error("❌ Error fetching projects data:", error);
    return [];
  }
}

// ✅ Server Component
export default async function Page() {
  const projectsData = await getProjectsData();

  // 🧩 Fallback if build skipped or data failed
  if (!projectsData.length) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-400">
        <p>🚧 Projects data unavailable during build. It will load dynamically once the app runs.</p>
      </main>
    );
  }

  // ✅ Normal Render
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Projects projectsData={projectsData} />
    </main>
  );
}
