"use client";
import { motion } from "framer-motion";
import skillsData from "../../data/skills.json";

const isModel = (path) => path.toLowerCase().endsWith(".glb");

function SkillBadge({ skill, index }) {
  const label = skill.id.charAt(0).toUpperCase() + skill.id.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2.5 p-3 rounded-2xl border border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-slate-900/20 active:scale-95 transition-transform"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${skill.color}12`, border: `1px solid ${skill.color}30` }}
      >
        {isModel(skill.glb) ? (
          <span className="text-base font-bold" style={{ color: skill.color }}>
            {label.charAt(0)}
          </span>
        ) : (
          <img src={skill.glb} alt={label} className="w-7 h-7 object-contain" />
        )}
      </div>
      <span className="text-[10px] font-semibold text-slate-400 text-center leading-tight tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
}

export default function SkillsMobile() {
  return (
    <section id="skills" className="relative py-20 px-5 bg-transparent text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 -right-20 w-48 h-48 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-[10px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[0.25em] uppercase text-cyan-400"
      >
        02 · SKILLS
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-3 text-[26px] font-extrabold tracking-tight"
      >
        Tools I build with.
      </motion.h2>

      <div className="mt-8 grid grid-cols-4 gap-2.5">
        {skillsData.map((skill, i) => (
          <SkillBadge key={skill.id} skill={skill} index={i} />
        ))}
      </div>
    </section>
  );
}
