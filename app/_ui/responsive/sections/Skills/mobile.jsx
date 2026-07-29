"use client";
import { useState } from "react";
import skillsData from "../../data/skills.json";

const isModel = (path) => path.toLowerCase().endsWith(".glb");

function SkillBadge({ skill }) {
  const label = skill.id.charAt(0).toUpperCase() + skill.id.slice(1);

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-900/40 active:scale-95 transition-transform">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${skill.color}20`, border: `1px solid ${skill.color}50` }}
      >
        {isModel(skill.glb) ? (
          <span className="text-lg font-bold" style={{ color: skill.color }}>
            {label.charAt(0)}
          </span>
        ) : (
          <img src={skill.glb} alt={label} className="w-7 h-7 object-contain" />
        )}
      </div>
      <span className="text-[11px] text-slate-400 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function SkillsMobile() {
  return (
    <section id="skills" className="relative py-16 px-5 bg-slate-950 text-white">
      <span className="text-xs font-mono tracking-widest text-indigo-400">
        02 · SKILLS
      </span>
      <h2 className="mt-2 text-2xl font-bold">Tools I build with.</h2>

      <div className="mt-8 grid grid-cols-4 gap-3">
        {skillsData.map((skill) => (
          <SkillBadge key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}
