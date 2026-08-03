"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, BookOpen, Cpu, Users } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

const STAT_ICONS = {
  0: Rocket,
  1: BookOpen,
  2: Cpu,
  3: Users,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function AboutMobile() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    portfolioApi.getAbout().then(setAbout).catch(console.error);
  }, []);

  if (!about) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="about" className="relative py-20 px-5 bg-transparent text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <motion.span {...fadeUp(0)} className="text-[10px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[0.25em] uppercase text-cyan-400">
        {about.header.tag}
      </motion.span>
      <motion.h2 {...fadeUp(0.05)} className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-tight">
        {about.header.title}
      </motion.h2>

      <motion.p {...fadeUp(0.1)} className="mt-5 text-slate-400 text-[13px] leading-[1.7] font-light">
        {about.bio}
      </motion.p>

      <motion.div {...fadeUp(0.15)} className="mt-8 flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x">
        {about.stats.map((stat, i) => {
          const Icon = STAT_ICONS[i] || Rocket;
          return (
            <div
              key={stat.label}
              className="flex-shrink-0 snap-start w-[5.5rem] flex flex-col items-start gap-2.5 p-4 rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-900/30"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/[0.06]">
                {stat.icon ? (
                  <img src={stat.icon} alt={stat.label} className="w-5 h-5" />
                ) : (
                  <Icon size={16} className="text-slate-400" />
                )}
              </div>
              <p className="text-xl font-extrabold tracking-tight" style={{ color: stat.color }}>
                {stat.value}+
              </p>
              <p className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="mt-7 space-y-2">
        {about.traits.map((trait, i) => (
          <motion.div
            key={trait.label}
            {...fadeUp(0.2 + i * 0.03)}
            className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-800/50 bg-slate-900/30"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-slate-950"
                style={{ backgroundColor: trait.color, ringColor: trait.color }}
              />
              <span className="text-[13px] font-semibold tracking-tight">{trait.label}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-[family-name:var(--font-jetbrains)]">
              {trait.desc}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp(0.35)} className="mt-7 rounded-2xl border border-slate-800/50 bg-slate-900/40 overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-900/80 border-b border-slate-800/50">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-3 text-[10px] text-slate-500 font-[family-name:var(--font-jetbrains)] tracking-wide">profile.json</span>
        </div>
        <div className="p-4 font-[family-name:var(--font-jetbrains)] text-[11px] leading-[1.8] overflow-x-auto">
          <p className="text-slate-600">{"{"}</p>
          {Object.entries(about.code).map(([key, value]) => (
            <p key={key} className="pl-4 whitespace-nowrap">
              <span className="text-cyan-400/90">&quot;{key}&quot;</span>
              <span className="text-slate-600">: </span>
              <span className="text-emerald-400/90">&quot;{value}&quot;</span>
              <span className="text-slate-600">,</span>
            </p>
          ))}
          <p className="text-slate-600">{"}"}</p>
        </div>
      </motion.div>
    </section>
  );
}
