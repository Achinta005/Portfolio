"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import skillsData from "../../data/skills.json";

const SkillCard3D = dynamic(() => import("./SkillCard3D"), { ssr: false });

const isModel = (path) => path.toLowerCase().endsWith(".glb");

function SkillTile({ skill }) {
  const [hovered, setHovered] = useState(false);
  const label = skill.id.charAt(0).toUpperCase() + skill.id.slice(1);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative aspect-square rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-slate-700 transition-colors"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl"
        style={{ backgroundColor: skill.color }}
      />

      <div className="relative w-full h-full flex items-center justify-center p-4">
        {isModel(skill.glb) ? (
          <SkillCard3D glb={skill.glb} scale={skill.scale} color={skill.color} />
        ) : (
          <img
            src={skill.glb}
            alt={label}
            className="w-full h-full object-contain p-3 transition-transform group-hover:scale-110"
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-2.5 text-center bg-slate-950/80 backdrop-blur-sm border-t border-slate-800">
        <span
          className="text-xs font-medium tracking-wide"
          style={{ color: hovered ? skill.color : "#cbd5e1" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function SkillsDesktop() {
  return (
    <section id="skills" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center md:text-left">
          <span className="text-sm font-mono tracking-widest text-indigo-400">
            02 · SKILLS
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            Tools I build with.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {skillsData.map((skill) => (
            <SkillTile key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
