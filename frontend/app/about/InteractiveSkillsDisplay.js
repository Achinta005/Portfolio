"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Globe,
  BrainCircuit,
  Network,
  Sparkles,
  Database,
  Cloud,
} from "lucide-react";

/* ======================================================
   Category visual meta (accent colour, label, symbol)
   Keyed by category title from the server
====================================================== */
const CATEGORY_META = {
  "Programming Language": { accent: "#4ade80", label: "PL", Icon: Code2 },
  "Web Technology": { accent: "#38bdf8", label: "WEB", Icon: Globe },
  "Machine Learning": { accent: "#f472b6", label: "ML", Icon: BrainCircuit },
  "Deep Learning": { accent: "#fb923c", label: "DL", Icon: Network },
  "Generative AI": { accent: "#c084fc", label: "AI", Icon: Sparkles },
  Database: { accent: "#2dd4bf", label: "DB", Icon: Database },
  "Cloud & DevOps": { accent: "#facc15", label: "OPS", Icon: Cloud },
};

const CATEGORY_ORDER = [
  "Programming Language",
  "Web Technology",
  "Database",
  "Machine Learning",
  "Deep Learning",
  "Generative AI",
  "Cloud & DevOps",
];

/* stage → badge colour */
const stageColor = (stage) =>
  ({ "1st": "#4ade80", "2nd": "#f87171", "3rd": "#38bdf8", "4th": "#facc15" })[
    stage
  ] ?? "#c084fc";

/* ======================================================
   Skill Detail Modal
====================================================== */
const SkillModal = ({ skill, accent, onClose }) => {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const sc = stageColor(skill.stage);
  // use the skill's own brand colour for the proficiency bar
  const barColor =
    skill.color && skill.color !== "#000000" ? skill.color : accent;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(14px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0f0f1e 0%, #08080f 100%)",
          border: `1px solid ${accent}38`,
          boxShadow: `0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04), 0 0 70px ${accent}18`,
          animation: "modalIn 0.26s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {/* Top glow bar */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}cc, transparent)`,
          }}
        />

        {/* Radial header bg */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}10 0%, transparent 70%)`,
          }}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${barColor}15`,
                border: `1px solid ${barColor}35`,
                boxShadow: `0 0 28px ${barColor}22`,
              }}
            >
              <img
                src={skill.image}
                alt={skill.skill_name}
                className="w-9 h-9 object-contain"
              />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h2 className="text-[18px] font-bold text-white leading-tight mb-2 font-display">
                {skill.skill_name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: `${sc}18`,
                    color: sc,
                    border: `1px solid ${sc}40`,
                  }}
                >
                  {skill.stage} Stage
                </span>
                <span
                  className="text-[9px] font-mono"
                  style={{ color: "rgba(255,255,255,0.26)" }}
                >
                  {skill.category}
                </span>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 hover:scale-110 mt-0.5"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mx-6 h-px"
          style={{ background: "rgba(255,255,255,0.055)" }}
        />

        {/* Body */}
        <div className="px-6 py-5">
          <p
            className="text-[13px] leading-[1.7] mb-5 font-display"
            style={{ color: "rgba(255,255,255,0.48)" }}
          >
            {skill.description}
          </p>

          {/* Proficiency */}
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-[9px] font-bold tracking-[0.22em] uppercase font-mono"
              style={{ color: "rgba(255,255,255,0.26)" }}
            >
              Proficiency
            </span>
            <span
              className="text-[13px] font-bold font-mono"
              style={{ color: barColor }}
            >
              {skill.proficiency}%
            </span>
          </div>

          <div
            className="h-[3px] w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              style={{
                height: "100%",
                width: `${skill.proficiency}%`,
                background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}70 100%)`,
                boxShadow: `0 0 12px ${barColor}aa`,
                borderRadius: 9999,
                transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>

          <div className="flex justify-between mt-1.5">
            {[0, 25, 50, 75, 100].map((n) => (
              <span
                key={n}
                className="text-[8px] font-mono"
                style={{ color: "rgba(255,255,255,0.16)" }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
          }}
        />
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform: scale(0.86) translateY(20px); }
          to   { opacity:1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
};

/* ======================================================
   Skill Chip — uses skill.color as the hover/glow tint
====================================================== */
const SkillChip = ({ skill, accent, onSelect, delay, visible }) => {
  const chipColor =
    skill.color && skill.color !== "#000000" ? skill.color : accent;

  return (
    <button
      onClick={() => onSelect(skill)}
      className="group flex flex-col items-center gap-1 rounded-xl p-2"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: `opacity 0.38s ease ${delay}ms, transform 0.38s cubic-bezier(0.16,1,0.3,1) ${delay}ms, background 0.18s, border-color 0.18s, box-shadow 0.18s`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${chipColor}14`;
        e.currentTarget.style.borderColor = `${chipColor}45`;
        e.currentTarget.style.boxShadow = `0 4px 18px ${chipColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Skill icon */}
      <div className="relative">
        <img
          src={skill.image}
          alt={skill.skill_name}
          className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-110"
        />
        {/* tiny colour dot using the skill's own brand color */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0a0a14]"
          style={{
            backgroundColor: chipColor,
            boxShadow: `0 0 5px ${chipColor}`,
          }}
        />
      </div>
      <span
        className="text-[9px] font-medium text-center leading-tight w-full truncate font-mono"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {skill.skill_name}
      </span>
    </button>
  );
};

/* ======================================================
   Category Card  (grid tile)
====================================================== */
const CategoryCard = ({ category }) => {
  const [expanded, setExpanded] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const meta = CATEGORY_META[category.title] ?? {
    accent: "#c084fc",
    label: "—",
    symbol: "·",
  };
  const { accent, Icon } = meta;
  const skills = category.skills ?? [];
  const PREVIEW = 4;
  const preview = skills.slice(0, PREVIEW);
  const extra = skills.slice(PREVIEW);

  useEffect(() => {
    if (expanded) {
      const t = setTimeout(() => setGridVisible(true), 25);
      return () => clearTimeout(t);
    } else {
      setGridVisible(false);
    }
  }, [expanded]);

  // proficiency bar for the category (use category.experienceLevel)
  const expLevel = category.experienceLevel ?? 0;

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: expanded
            ? `linear-gradient(148deg, ${accent}0d 0%, #09091a 100%)`
            : "linear-gradient(148deg, rgba(255,255,255,0.038) 0%, rgba(255,255,255,0.012) 100%)",
          border: `1px solid ${expanded ? accent + "2e" : "rgba(255,255,255,0.068)"}`,
          boxShadow: expanded ? `0 0 55px ${accent}0d` : "none",
          transition: "background 0.35s, border-color 0.35s, box-shadow 0.35s",
        }}
      >
        {/* Accent stripe */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}${expanded ? "99" : "35"}, transparent)`,
            transition: "all 0.35s",
          }}
        />

        {/* ── Card Header ── */}
        <div className="p-4 pb-3">
          {/* Top row: symbol + name + count */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              {/* Symbol badge */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${accent}14`,
                  border: `1px solid ${accent}30`,
                }}
              >
                <Icon size={18} color={accent} strokeWidth={1.8} />
              </div>

              <div>
                <h3 className="text-[13px] font-bold text-white leading-tight font-display">
                  {category.title}
                </h3>
              </div>
            </div>

            {/* Skill count */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex-shrink-0 mt-0.5"
              style={{
                background: `${accent}14`,
                color: accent,
                border: `1px solid ${accent}30`,
              }}
            >
              {skills.length}
            </span>
          </div>

          {/* Category experience bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-[8px] font-mono tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                Experience
              </span>
              <span
                className="text-[9px] font-bold font-mono"
                style={{ color: accent }}
              >
                {expLevel}%
              </span>
            </div>
            <div
              className="h-[2px] w-full rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${expLevel}%`,
                  background: `linear-gradient(90deg, ${accent} 0%, ${accent}60 100%)`,
                  boxShadow: `0 0 8px ${accent}80`,
                  borderRadius: 9999,
                }}
              />
            </div>
          </div>

          {/* Preview skill chips — always visible */}
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${Math.min(PREVIEW, preview.length)}, 1fr)`,
            }}
          >
            {preview.map((skill, i) => (
              <SkillChip
                key={skill._id ?? i}
                skill={skill}
                accent={accent}
                onSelect={setSelectedSkill}
                delay={0}
                visible={true}
              />
            ))}
          </div>
        </div>

        {/* ── Expanded extra skills ── */}
        {extra.length > 0 && (
          <div
            style={{
              overflow: "hidden",
              maxHeight: expanded
                ? `${Math.ceil(extra.length / 4) * 94 + 24}px`
                : "0px",
              transition: "max-height 0.48s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="px-4 pb-2">
              <div
                className="h-px mb-3"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}1e, transparent)`,
                }}
              />
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                {extra.map((skill, i) => (
                  <SkillChip
                    key={skill._id ?? i}
                    skill={skill}
                    accent={accent}
                    onSelect={setSelectedSkill}
                    delay={i * 28}
                    visible={gridVisible}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Expand / Collapse button ── */}
        {extra.length > 0 && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center justify-center gap-1.5 py-2.5 mt-auto w-full font-mono font-bold"
            style={{
              borderTop: `1px solid ${expanded ? accent + "1e" : "rgba(255,255,255,0.05)"}`,
              color: expanded ? accent : "rgba(255,255,255,0.28)",
              fontSize: "9px",
              letterSpacing: "0.12em",
              background: expanded ? `${accent}07` : "transparent",
              transition: "all 0.2s",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {expanded ? "COLLAPSE" : `+${extra.length} MORE`}
          </button>
        )}
      </div>

      {/* Skill modal */}
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          accent={accent}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </>
  );
};

/* ======================================================
   Main export
   Props:
     skillsData — the raw array from the server
                  [ { _id, title, description, experienceLevel, skills: [...] }, … ]
====================================================== */
const SimplifiedSkillsGrid = ({ skillsData = [] }) => {
  // Sort categories by the preferred order, unknown ones appended at the end
  const sorted = [
    ...CATEGORY_ORDER.map((title) =>
      skillsData.find((c) => c.title === title),
    ).filter(Boolean),
    ...skillsData.filter((c) => !CATEGORY_ORDER.includes(c.title)),
  ];

  const totalSkills = skillsData.reduce(
    (s, c) => s + (c.skills?.length ?? 0),
    0,
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .skills-page, .skills-page * { box-sizing: border-box; }
        .skills-page  { font-family: 'Outfit', sans-serif; }
        .font-display { font-family: 'Outfit', sans-serif !important; }
        .font-mono    { font-family: 'JetBrains Mono', monospace !important; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .card-in {
          opacity: 0;
          animation: fadeUp 0.52s cubic-bezier(0.16,1,0.3,1) forwards;
        }
      `}</style>

      <div
        className="skills-page min-h-screen w-full overflow-x-hidden"
        style={{
          background: "#060610",
          backgroundImage: `
            radial-gradient(ellipse 120% 50% at 50% -8%, #190c38 0%, transparent 58%),
            radial-gradient(ellipse 50% 40% at 88% 108%, #0a1526 0%, transparent 50%)
          `,
        }}
      >
        {/* Grain */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
            opacity: 0.02,
          }}
        />

        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
          {/* ── Header (small + centered) ── */}
          <div className="mb-8 sm:mb-10 text-center">
            <h1 className="font-display text-[22px] sm:text-[27px] leading-[1.15] tracking-[-0.01em] text-white mt-1.5 mb-3">
              Technical{" "}
              <span
                style={{
                  background:
                    "linear-gradient(125deg, #c084fc 0%, #38bdf8 50%, #4ade80 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Expertise
              </span>
            </h1>

            <div className="flex items-center justify-center gap-5">
              {[
                { dot: "#4ade80", val: sorted.length, label: "categories" },
                { dot: "#38bdf8", val: totalSkills, label: "skills" },
              ].map(({ dot, val, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: dot,
                      boxShadow: `0 0 6px ${dot}`,
                    }}
                  />
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "rgba(255,255,255,0.32)" }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.62)",
                        fontWeight: 700,
                      }}
                    >
                      {val}
                    </span>{" "}
                    {label}
                  </span>
                </div>
              ))}
              <span
                className="font-mono text-[10px] hidden sm:inline"
                style={{ color: "rgba(255,255,255,0.14)" }}
              >
                · tap any skill for details
              </span>
            </div>
          </div>

          {/* ── Category Grid ── */}
          <div
            className="grid gap-3 sm:gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {sorted.map((category, i) => (
              <div
                key={category._id ?? category.title}
                className="card-in"
                style={{ animationDelay: `${i * 65}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SimplifiedSkillsGrid;
