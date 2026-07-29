"use client";
import { useEffect, useState } from "react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

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
    <section id="about" className="relative py-16 px-5 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <span className="text-xs font-mono tracking-widest text-indigo-400">
        {about.header.tag}
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-snug">
        {about.header.title}
      </h2>

      <p className="mt-5 text-slate-400 text-sm leading-relaxed">
        {about.bio}
      </p>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x">
        {about.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex-shrink-0 snap-start w-28 flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/40"
          >
            <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
            <p className="text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}+
            </p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2.5">
        {about.traits.map((trait) => (
          <div
            key={trait.label}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-800 bg-slate-900/40"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: trait.color }}
              />
              <span className="text-sm font-medium">{trait.label}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {trait.desc}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900 border-b border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[10px] text-slate-500 font-mono">profile.json</span>
        </div>
        <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto">
          <p className="text-slate-500">{"{"}</p>
          {Object.entries(about.code).map(([key, value]) => (
            <p key={key} className="pl-3 whitespace-nowrap">
              <span className="text-cyan-400">"{key}"</span>
              <span className="text-slate-500">: </span>
              <span className="text-emerald-400">"{value}"</span>
              <span className="text-slate-500">,</span>
            </p>
          ))}
          <p className="text-slate-500">{"}"}</p>
        </div>
      </div>
    </section>
  );
}
