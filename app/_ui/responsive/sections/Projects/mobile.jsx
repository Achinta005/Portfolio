"use client";
import { useEffect, useState, useMemo } from "react";
import { Github, ExternalLink } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function parseTech(technologies) {
  return technologies
    .flatMap((t) => t.split(","))
    .map((t) => t.trim())
    .filter(Boolean);
}

function ProjectCardMobile({ project }) {
  const tech = parseTech(project.technologies);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden active:scale-[0.98] transition-transform">
      <div className="relative aspect-video bg-slate-800">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2.5 left-2.5 text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm border border-slate-700 text-indigo-300">
          {project.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold mb-1.5">{project.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-2">
          {project.description}
        </p>

        {(project.modelAccuracy || project.modelFeatures) && (
          <div className="flex gap-2 mb-3">
            {project.modelAccuracy && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                {project.modelAccuracy}% acc.
              </span>
            )}
            {project.modelFeatures && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium">
                {project.modelFeatures} features
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tech.slice(0, 4).map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/70 text-slate-300 border border-slate-700/50"
            >
              {t}
            </span>
          ))}
          {tech.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/70 text-slate-500">
              +{tech.length - 4}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t border-slate-800">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-400"
            >
              <Github size={15} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-indigo-400 ml-auto"
            >
              Live <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsMobile() {
  const [projects, setProjects] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    portfolioApi.getProjects().then(setProjects).catch(console.error);
  }, []);

  const categories = useMemo(() => {
    if (!projects) return [];
    return ["All", ...new Set(projects.map((p) => p.category))];
  }, [projects]);

  const filtered = useMemo(() => {
    if (!projects) return [];
    const sorted = [...projects].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
    return filter === "All" ? sorted : sorted.filter((p) => p.category === filter);
  }, [projects, filter]);

  if (!projects) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="projects" className="relative py-16 px-5 bg-slate-950 text-white">
      <span className="text-xs font-mono tracking-widest text-indigo-400">03 · PROJECTS</span>
      <h2 className="mt-2 text-2xl font-bold mb-5">Things I've built.</h2>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 mb-6 snap-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 snap-start px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === cat
                ? "bg-indigo-500 border-indigo-500 text-white"
                : "border-slate-700 text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((project) => (
          <ProjectCardMobile key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
