"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function StatusBadge({ status }) {
  const isOngoing = status === "ongoing";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-lg border ${
        isOngoing
          ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
          : "border-slate-700/50 bg-white/[0.03] text-slate-400"
      }`}
    >
      {isOngoing && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {isOngoing ? "In Progress" : "Completed"}
    </span>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

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
    <section id="education" className="relative py-20 px-5 bg-transparent text-white">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-[10px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[0.25em] uppercase text-cyan-400"
      >
        04 · EDUCATION
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-3 text-[26px] font-extrabold tracking-tight mb-8"
      >
        Academic journey.
      </motion.h2>

      <div className="relative">
        <div className="absolute left-6 top-1 bottom-1 w-px bg-gradient-to-b from-cyan-500/30 via-blue-500/20 to-transparent" />

        <div className="space-y-5">
          {sorted.map((edu, i) => (
            <motion.div key={edu._id} {...fadeUp(i * 0.08)} className="relative pl-14">
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

              <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-900/20 p-4">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold font-[family-name:var(--font-jetbrains)]" style={{ color: edu.accent }}>
                    <Calendar size={11} strokeWidth={2.5} />
                    {edu.year}
                  </span>
                  <StatusBadge status={edu.status} />
                </div>

                <h3 className="text-[14px] font-bold tracking-tight mb-1">{edu.degree}</h3>
                <p className="text-[12px] text-slate-400 font-medium mb-0.5">{edu.college}</p>
                <p className="text-[11px] text-slate-500 mb-3 font-light">{edu.university}</p>

                <p className="text-[12px] text-slate-400 leading-[1.6] font-light">{edu.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
