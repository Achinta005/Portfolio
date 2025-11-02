import React from "react";
import Projects from "./Project";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

// SSR Rendering
async function getProjectsData() {
  try {
    const res = await fetch(`${baseUrl}/api/projects_data`, {
      cache: "no-store", // Always get fresh data (SSR)
    });

    if (!res.ok) {
      throw new Error("Failed to fetch projects data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return [];
  }
}

// The main page component (Server Component)
export default async function Page() {
  const projectsData = await getProjectsData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Projects projectsData={projectsData} />
    </main>
  );
}