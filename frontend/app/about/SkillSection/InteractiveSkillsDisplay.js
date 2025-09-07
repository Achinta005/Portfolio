"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

// Custom Skill Node Component
const SkillNode = ({
  skill,
  onHover,
  isHovered,
  isDetailOpen,
  toggleDetail,
}) => {
  const detailRef = useRef(null);

  const stageColors = {
    "1st": "#10b981",
    "2nd": "#ef4444",
    "3rd": "#3b82f6",
    "4th": "#f59e0b",
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        // Check if click was on the button or skill node
        const skillNode = event.target.closest(
          '[data-skill-id="' + skill.id + '"]'
        );
        if (!skillNode && isDetailOpen) {
          toggleDetail(skill.id);
        }
      }
    };

    if (isDetailOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDetailOpen, skill.id, toggleDetail]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Button clicked for:", skill.skill);
    toggleDetail(skill.id);
  };

  return (
    <div className="relative" data-skill-id={skill.id}>
      {/* Main Node */}
      <div
        className="lg:w-24 lg:h-28 w-20 h-24 rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-visible transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20"
        onMouseEnter={() => onHover(skill.id)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Content Container */}
        <div className="text-center p-3 w-full h-36 lg:flex lg:flex-col lg:items-center lg:justify-center rounded-2xl">
          {/* Skill Icon Container */}
          <div className="w-full h-full rounded-lg flex items-center justify-center lg:mt-20 mt-12">
            <span className="h-32 w-32">
              <img src={skill.image} alt={skill.skill} />
            </span>
          </div>
        </div>

        {/* Button Container */}
        <div className="flex-1 flex items-center justify-center rounded-b-lg w-full relative top-[-5vh]">
          <button
            className={`cursor-pointer rounded-full transition-all duration-200 ${
              isDetailOpen ? "text-white rotate-180" : ""
            }`}
            onClick={handleButtonClick}
            aria-label={`${isDetailOpen ? "Close" : "Open"} details for ${
              skill.skill
            }`}
          >
            <ChevronDown size={28} className="text-white font-bold" />
          </button>
        </div>
      </div>

      {/* Animated Detail Card */}
      {isDetailOpen && (
        <div
          ref={detailRef}
          className={`absolute backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl p-6 min-w-80 max-w-96 z-50 transition-all duration-300 transform ${
            isDetailOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2"
          }`}
          style={{
            top: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(8px)",
            marginTop: "8px",
          }}
        >
          {/* Arrow pointer */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 backdrop-blur-md bg-white/10 border border-white/20 rotate-45 border-l border-t" />

          <div className="text-center relative">
            {/* Close button */}
            <button
              onClick={() => toggleDetail(skill.id)}
              className="absolute -top-2 -right-2 w-7 h-7 backdrop-blur-md bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-full flex items-center justify-center text-red-300 hover:text-red-100 transition-colors shadow-sm"
              aria-label="Close details"
            >
              <X size={14} />
            </button>

            <h3 className="font-bold text-xl mb-3 pr-6 text-white">
              {skill.skill}
            </h3>

            <p className="text-gray-200 text-sm mb-4 leading-relaxed text-left">
              {skill.description}
            </p>

            {/* Animated Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-200">
                  Proficiency Level
                </span>
                <span className="text-sm font-bold text-white">
                  {skill.proficiency}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    background: `linear-gradient(90deg, ${skill.color} 0%, ${skill.color}80 100%)`,
                    width: `${skill.proficiency}%`,
                  }}
                />
              </div>
            </div>

            {/* Stage Badge */}
            <div
              className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg backdrop-blur-md border border-white/20"
              style={{ backgroundColor: `${stageColors[skill.stage]}40` }}
            >
              <span className="mr-2">🎯</span>
              {skill.stage} Stage in {skill.category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SimplifiedSkillsGrid = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [openDetailId, setOpenDetailId] = useState(null);
  const [skillsData, setskillsData] = useState([])

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/skills/getskillsdata`
        );
        const data = await res.json();
        setskillsData(data);
      } catch (error) {
        console.error("Error fetching Skills data:", error);
      }
    };
    fetchSkillsData();
  }, []);

  // Flatten all skills from all categories
  const allSkills = Object.values(skillsData).flatMap(
    (category) => category.skills
  );

  // Function to toggle detail view - only one can be open at a time
  const toggleDetail = (skillId) => {
    console.log("toggleDetail called with:", skillId);
    if (openDetailId === skillId) {
      setOpenDetailId(null); // Close if already open
    } else {
      setOpenDetailId(skillId); // Open this skill's detail and close others
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Main Container with Glass Effect */}
      <div className="min-h-screen backdrop-blur-md bg-black/20 border border-white/10">
        {/* Header */}
        <div className="text-center py-12 px-4">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              My Skills Journey
            </h1>
            <p className="text-gray-200 text-xl">
              Click the buttons to explore skills! ✨
            </p>
          </div>
        </div>

        {/* Rotating Categories Row */}
        <div className="relative overflow-hidden w-full mb-12">
          <div className="flex gap-6 pb-4 animate-scroll-categories">
            {/* First set of categories */}
            {Object.entries(skillsData).map(([category, data]) => (
              <div
                key={category}
                className="flex flex-col items-center min-w-fit flex-shrink-0"
              >
                <h2 className="lg:text-2xl text-lg font-bold text-white text-center mb-4 lg:px-6 px-4 py-6 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg lg:min-w-[220px] min-w-[160px] flex justify-center items-center hover:bg-white/20 transition-all duration-300">
                  {data.title}
                </h2>
              </div>
            ))}
            {Object.entries(skillsData).map(([category, data]) => (
              <div
                key={category}
                className="flex flex-col items-center min-w-fit flex-shrink-0"
              >
                <h2 className="lg:text-2xl text-lg font-bold text-white text-center mb-4 lg:px-6 px-4 py-6 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg lg:min-w-[220px] min-w-[160px] flex justify-center items-center hover:bg-white/20 transition-all duration-300">
                  {data.title}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid - All Skills from All Categories */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-center lg:gap-8 gap-4 flex-wrap">
              {allSkills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <SkillNode
                    skill={skill}
                    onHover={setHoveredNode}
                    isHovered={hoveredNode === skill.id}
                    isDetailOpen={openDetailId === skill.id}
                    toggleDetail={toggleDetail}
                  />
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
