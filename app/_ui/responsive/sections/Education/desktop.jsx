"use client";
import { useEffect, useState, useMemo } from "react";
import { GraduationCap } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function StatusBadge({ status }) {
  const isOngoing = status === "ongoing";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
        isOngoing
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-slate-700 bg-slate-800/50 text-slate-400"
      }`}
    >
      {isOngoing && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      )}
      {isOngoing ? "In Progress" : "Completed"}
    </span>
  );
}

export default function EducationDesktop() {
  const [education, setEducation] = useState(null);

  useEffect(() => {
    portfolioApi.getEducation().then(setEducation).catch(console.error);
  }, []);

  const sorted = useMemo(() => {
    if (!education) return [];
    return [...education].sort((a, b) => {
      const yearA = parseInt(a.year.split(" - ")[0]);
      const yearB = parseInt(b.year.split(" - ")[0]);
      return yearA - yearB;
    });
  }, [education]);

  if (!education) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="education" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <span className="text-sm font-mono tracking-widest text-indigo-400">04 · EDUCATION</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Academic journey.</h2>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-2 bottom-2 w-px bg-gradient-to-b from-slate-700 via-slate-800 to-transparent" />

          <div className="space-y-10">
            {sorted.map((edu) => (
              <div key={edu._id} className="relative pl-20">
                <div
                  className="absolute left-0 top-0 w-16 h-16 rounded-2xl overflow-hidden border-2 flex items-center justify-center bg-slate-900"
                  style={{ borderColor: edu.accent }}
                >
                  {edu.icon ? (
                    <img src={edu.icon} alt={edu.college} className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={24} style={{ color: edu.accent }} />
                  )}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="text-sm font-mono font-semibold" style={{ color: edu.accent }}>
                      {edu.year}
                    </span>
                    <StatusBadge status={edu.status} />
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{edu.degree}</h3>
                  <p className="text-sm text-slate-400 mb-1">{edu.college}</p>
                  <p className="text-xs text-slate-500 mb-4">{edu.university}</p>

                  <p className="text-sm text-slate-400 leading-relaxed">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
