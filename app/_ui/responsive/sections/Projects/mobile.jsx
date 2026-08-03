"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function parseTech(technologies) {
  return technologies
    .flatMap((t) => t.split(","))
    .map((t) => t.trim())
    .filter(Boolean);
}

function ProjectCardMobile({ project, index }) {
  const tech = parseTech(project.technologies);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-900/20 overflow-hidden active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-video bg-slate-800">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-700/50 text-cyan-300">
          {project.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-[15px] font-bold tracking-tight mb-1.5">{project.title}</h3>
        <p className="text-[12px] text-slate-400 leading-[1.6] mb-3 line-clamp-2 font-light">
          {project.description}
        </p>

        {(project.modelAccuracy || project.modelFeatures) && (
          <div className="flex gap-2 mb-3">
            {project.modelAccuracy && (
              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 font-bold tracking-wide">
                {project.modelAccuracy}% acc.
              </span>
            )}
            {project.modelFeatures && (
              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/8 border border-cyan-500/15 text-cyan-400 font-bold tracking-wide">
                {project.modelFeatures} features
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tech.slice(0, 4).map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06] font-[family-name:var(--font-jetbrains)]"
            >
              {t}
            </span>
          ))}
          {tech.length > 4 && (
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-500">
              +{tech.length - 4}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t border-slate-800/50">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              <Github size={14} strokeWidth={2.2} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] font-medium text-cyan-400 ml-auto"
            >
              Live <ExternalLink size={12} strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
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
    <section id="projects" className="relative py-20 px-5 bg-transparent text-white">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-[10px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[0.25em] uppercase text-cyan-400"
      >
        03 · PROJECTS
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-3 text-[26px] font-extrabold tracking-tight mb-6"
      >
        Things I&apos;ve built.
      </motion.h2>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 mb-7 snap-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 snap-start px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-wide border transition-all ${
              filter === cat
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 border-transparent text-white shadow-md shadow-blue-500/15"
                : "border-slate-700/60 text-slate-400 bg-white/[0.02]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCardMobile key={project._id} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
