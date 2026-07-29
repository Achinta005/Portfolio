"use client";
import { useEffect, useState, useMemo } from "react";
import { Github, ExternalLink, Layers } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function parseTech(technologies) {
  return technologies
    .flatMap((t) => t.split(","))
    .map((t) => t.trim())
    .filter(Boolean);
}

function ProjectCard({ project }) {
  const tech = parseTech(project.technologies);

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-slate-700 hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

        <span className="absolute top-3 left-3 text-xs font-medium px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm border border-slate-700 text-indigo-300">
          {project.category}
        </span>

        {project.media?.length > 1 && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm border border-slate-700 text-slate-300">
            <Layers size={12} />
            {project.media.length}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {(project.modelAccuracy || project.modelFeatures) && (
          <div className="flex gap-3 mb-4">
            {project.modelAccuracy && (
              <div className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                <p className="text-lg font-bold text-emerald-400">{project.modelAccuracy}%</p>
                <p className="text-[11px] text-slate-500">Accuracy</p>
              </div>
            )}
            {project.modelFeatures && (
              <div className="flex-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-2">
                <p className="text-lg font-bold text-cyan-400">{project.modelFeatures}</p>
                <p className="text-[11px] text-slate-500">Features</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-5">
          {tech.slice(0, 5).map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/70 text-slate-300 border border-slate-700/50"
            >
              {t}
            </span>
          ))}
          {tech.length > 5 && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/70 text-slate-500">
              +{tech.length - 5}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-3 pt-4 border-t border-slate-800">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Github size={16} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
            >
              Live Demo <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsDesktop() {
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
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="projects" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-mono tracking-widest text-indigo-400">03 · PROJECTS</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Things I've built.</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  filter === cat
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
