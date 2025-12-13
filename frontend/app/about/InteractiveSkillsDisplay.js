"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

/* ======================================================
   Skill Card (Hover + Click Popover)
====================================================== */
const SkillNode = ({ skill }) => {
  const [open, setOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const stageColors = {
    "1st": "#10b981",
    "2nd": "#ef4444",
    "3rd": "#3b82f6",
    "4th": "#f59e0b",
  };

  useEffect(() => {
    console.log(skill);
  }, [skill]);

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const handleMouseEnter = () => {
    if (isTouch) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    clearTimeout(hoverTimeoutRef.current);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ---------- CARD ---------- */}
      <PopoverTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setOpen((prev) => !prev)}
          className="
            lg:w-24 lg:h-28 w-20 h-24
            rounded-2xl shadow-lg
            flex flex-col items-center justify-center
            cursor-pointer select-none
            transition-all duration-300
            hover:scale-105 hover:-translate-y-1
            backdrop-blur-md bg-white/10
            border border-white/20 hover:bg-white/20
          "
        >
          <div className="flex flex-col items-center justify-center h-full p-2">
            <span className="h-16 w-16 sm:h-20 sm:w-20">
              <img
                src={skill.image}
                alt={skill.skill_name}
                className="object-contain"
              />
            </span>
          </div>
        </div>
      </PopoverTrigger>

      {/* ---------- POPOVER DETAIL ---------- */}
      <PopoverContent
        side="bottom"
        align="center"
        onMouseEnter={() => !isTouch && setOpen(true)}
        onMouseLeave={() => !isTouch && setOpen(false)}
        className="
          w-80 max-w-[calc(100vw-2rem)]
          bg-gradient-to-br from-purple-800/40 via-gray-900/60 to-black/70
          backdrop-blur-xl
          border border-purple-500/30
          rounded-xl shadow-2xl
          p-4 sm:p-6
        "
      >
        <div className="text-center">
          <h3 className="font-bold text-lg sm:text-xl mb-3 text-white">
            {skill.skill_name}
          </h3>

          <p className="text-gray-200 text-xs sm:text-sm mb-4 leading-relaxed text-left">
            {skill.description}
          </p>

          {/* Proficiency */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-200">
                Proficiency Level
              </span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {skill.proficiency}%
              </span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="h-2 sm:h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${skill.proficiency}%`,
                  background: `linear-gradient(
                    90deg,
                    ${skill.color} 0%,
                    ${skill.color}80 100%
                  )`,
                }}
              />
            </div>
          </div>

          {/* Stage */}
          <div
            className="
              inline-flex items-center
              px-3 py-1.5 rounded-full
              text-xs font-bold text-white
              backdrop-blur-md border border-white/20
            "
            style={{ backgroundColor: `${stageColors[skill.stage]}40` }}
          >
            {skill.stage} Stage in {skill.category}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/* ======================================================
   Main Grid
====================================================== */
const SimplifiedSkillsGrid = ({ skillsData }) => {
  const allSkills = Object.values(skillsData).flatMap(
    (category) => category.skills
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      <div className="min-h-screen backdrop-blur-md bg-black/20 border border-white/10">
        {/* ---------- HEADER ---------- */}
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-4xl mx-auto shadow-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 sm:mb-6">
              My Skills Journey
            </h1>
            <p className="text-gray-200 text-base sm:text-xl">
              Hover or click on a skill card to view details
            </p>
          </div>
        </div>

        {/* ---------- CATEGORY TITLES ---------- */}
        <div className="relative w-full mb-8 sm:mb-12 px-4">
          <div className="flex gap-4 sm:gap-6 justify-center flex-wrap max-w-6xl mx-auto">
            {Object.entries(skillsData).map(([category, data]) => (
              <div key={category} className="flex flex-col items-center">
                <h2
                  className="
                    text-base sm:text-lg lg:text-2xl font-bold text-white
                    text-center px-4 py-3
                    backdrop-blur-lg bg-white/10
                    border border-white/20 rounded-2xl
                    shadow-lg min-w-[160px]
                  "
                >
                  {data.title}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- SKILLS GRID ---------- */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4 pb-12">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
            <div className="flex justify-center gap-3 sm:gap-4 lg:gap-8 flex-wrap">
              {allSkills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SkillNode skill={skill} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedSkillsGrid;
