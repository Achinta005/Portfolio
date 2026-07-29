"use client";
import { useEffect, useState, useMemo } from "react";
import { GraduationCap } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function StatusBadge({ status }) {
  const isOngoing = status === "ongoing";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
        isOngoing
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-slate-700 bg-slate-800/50 text-slate-400"
      }`}
    >
      {isOngoing && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {isOngoing ? "In Progress" : "Completed"}
    </span>
  );
}

export default function EducationMobile() {
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
      <section className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="education" className="relative py-16 px-5 bg-slate-950 text-white">
      <span className="text-xs font-mono tracking-widest text-indigo-400">04 · EDUCATION</span>
      <h2 className="mt-2 text-2xl font-bold mb-8">Academic journey.</h2>

      <div className="relative">
        <div className="absolute left-6 top-1 bottom-1 w-px bg-gradient-to-b from-slate-700 via-slate-800 to-transparent" />

        <div className="space-y-6">
          {sorted.map((edu) => (
            <div key={edu._id} className="relative pl-14">
              <div
                className="absolute left-0 top-0 w-12 h-12 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-slate-900"
                style={{ borderColor: edu.accent }}
              >
                {edu.icon ? (
                  <img src={edu.icon} alt={edu.college} className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap size={18} style={{ color: edu.accent }} />
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold" style={{ color: edu.accent }}>
                    {edu.year}
                  </span>
                  <StatusBadge status={edu.status} />
                </div>

                <h3 className="text-sm font-semibold mb-1">{edu.degree}</h3>
                <p className="text-xs text-slate-400 mb-0.5">{edu.college}</p>
                <p className="text-[11px] text-slate-500 mb-2.5">{edu.university}</p>

                <p className="text-xs text-slate-400 leading-relaxed">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
