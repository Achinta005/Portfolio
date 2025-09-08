"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background_gradient";
import { PortfolioApiService } from "@/services/PortfolioApiService";

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
    toggleDetail(skill.id);
  };

  return (
    <div className="relative" data-skill-id={skill.id}>
      {/* Main Node */}
      <BackgroundGradient>
        <div
          className="w-20 h-24 rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-visible transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-gradient-to-br from-blue-300 to-red-200"
          onMouseEnter={() => onHover(skill.id)}
          onMouseLeave={() => onHover(null)}
          onClick={handleButtonClick}
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
          <div className="flex-1 flex items-center justify-center  rounded-b-lg w-full relative top-[-4vh]">
            <button
              className={`cursor-pointer  rounded-full transition-all duration-200 ${
                isDetailOpen ? "text-black rotate-180" : ""
              }`}
              onClick={handleButtonClick}
              aria-label={`${isDetailOpen ? "Close" : "Open"} details for ${
                skill.skill
              }`}
            >
              <ChevronDown size={28} className="text-gray-950 font-bold" />
            </button>
          </div>
        </div>
      </BackgroundGradient>

      {/* Animated Detail Card */}
      {isDetailOpen && (
        <div
          ref={detailRef}
          className={`absolute bg-white rounded-xl shadow-2xl border-2 p-2 min-w-40 max-w-52 z-50 transition-all duration-300 transform ${
            isDetailOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2"
          }`}
          style={{
            borderColor: skill.color,
            top: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(8px)",
            marginTop: "8px",
          }}
        >
          {/* Arrow pointer */}
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l-2 border-t-2"
            style={{
              borderColor: skill.color,
            }}
          />

          <div className="text-center relative">
            {/* Close button */}
            <button
              onClick={() => toggleDetail(skill.id)}
              className="absolute  right-1 w-5 h-5 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 hover:text-red-800 transition-colors shadow-sm"
              aria-label="Close details"
            >
              <X size={8} />
            </button>

            <h3
              className="font-bold text-sm mb-1 pr-6"
              style={{ color: skill.color }}
            >
              {skill.skill}
            </h3>

            <p className="text-gray-700 text-sm mb-4 font-normal text-left">
              {skill.description}
            </p>

            {/* Animated Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-normal text-nowrap text-gray-700">
                  Proficiency Level
                </span>
                <span
                  className="text-sm font-normal"
                  style={{ color: skill.color }}
                >
                  {skill.proficiency}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    background: `linear-gradient(90deg, ${skill.color} 0%, ${skill.color}80 100%)`,
                    width: `${skill.proficiency}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveDisplayMobile = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [openDetailId, setOpenDetailId] = useState(null);
  const [skillsData, setskillsData] = useState([]);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const data = await PortfolioApiService.FetchSkillsData();
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
    <div>
      <div className="min-h-screen w-full">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-green-600 mb-4">
            My Skills Journey
          </h1>
          <p className="text-white text-lg">
            Click the buttons to explore skills! ✨
          </p>
        </div>

        {/* Rotating Categories Row */}
        <div className="relative overflow-hidden w-full mb-12">
          <div className="flex gap-4 pb-4 animate-scroll-categories">
            {/* First set of categories */}
            {Object.entries(skillsData).map(([category, data]) => (
              <div
                key={category}
                className="flex flex-col items-center min-w-fit flex-shrink-0"
              >
                <h2 className="lg:text-2xl text-sm font-bold text-white text-center mb-4 lg:px-4 px-1 py-5 backdrop-blur-lg rounded-lg shadow-sm bg-white/20 lg:min-w-[200px] min-w-[100px] flex justify-center items-center gap-2">
                  {data.title}
                </h2>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {Object.entries(skillsData).map(([category, data]) => (
              <div
                key={`${category}-duplicate`}
                className="flex flex-col items-center min-w-fit flex-shrink-0"
              >
                <h2 className="lg:text-2xl text-sm font-bold text-white text-center mb-4 lg:px-4 px-1 py-5 backdrop-blur-lg rounded-lg shadow-sm bg-white/20 min-w-[200px] flex justify-center items-center gap-2">
                  {data.title}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid - All Skills from All Categories */}
        <div className="max-w-[100vw] mx-auto px-4">
          <div className="flex justify-center gap-1.5 flex-wrap">
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
  );
};

export default InteractiveDisplayMobile;
