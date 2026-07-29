"use client";
import { useEffect, useState } from "react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

export default function AboutDesktop() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    portfolioApi.getAbout().then(setAbout).catch(console.error);
  }, []);

  if (!about) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="about" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <span className="text-sm font-mono tracking-widest text-indigo-400">
            {about.header.tag}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
            {about.header.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          <div>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              {about.bio}
            </p>

            <div className="space-y-3">
              {about.traits.map((trait) => (
                <div
                  key={trait.label}
                  className="group flex items-center justify-between px-5 py-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: trait.color }}
                    />
                    <span className="font-medium">{trait.label}</span>
                  </div>
                  <span className="text-sm text-slate-500 font-mono">
                    {trait.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-slate-500 font-mono">profile.json</span>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed">
                <p className="text-slate-500">{"{"}</p>
                {Object.entries(about.code).map(([key, value]) => (
                  <p key={key} className="pl-4">
                    <span className="text-cyan-400">"{key}"</span>
                    <span className="text-slate-500">: </span>
                    <span className="text-emerald-400">"{value}"</span>
                    <span className="text-slate-500">,</span>
                  </p>
                ))}
                <p className="text-slate-500">{"}"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {about.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-start gap-3 p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:-translate-y-1 transition-transform"
                >
                  <img src={stat.icon} alt={stat.label} className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>
                      {stat.value}+
                    </p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
