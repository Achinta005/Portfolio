"use client";
import React, { useState, useEffect } from "react";
import { PanelTopOpen, PanelBottomOpen } from "lucide-react";

// Custom Skill Node Component with GLB 3D models
const SkillNode = ({ skill, onHover, isHovered }) => {
  const stageColors = {
    "1st": "#10b981",
    "2nd": "#ef4444",
    "3rd": "#3b82f6",
    "4th": "#f59e0b",
  };

  // Map skills to their GLB file paths
  const getSkillModelPath = (skillName) => {
    const modelPaths = {
      "HTML":"/html_logo_3d_model.glb",
      "CSS":"/css_logo_3d_model.glb",
      "JavaScript":"/backup_looking_glass_display_concept_1.glb",
      "React":"/react_logo.glb",
      "Tailwind CSS":"/3.glb",
      "Node.js":"/0.glb",
      "Express.js":"/the_rust_lang_on_mini_cpu.glb",
      "Python":"/python.glb",
      "MySQL":"/backup_looking_glass_display_concept_1.glb",
      "MongoDB": "/backup_looking_glass_display_concept_1.glb",
      "Next.js":"/the_rust_lang_on_mini_cpu.glb",
      "JWT":"/the_rust_lang_on_mini_cpu.glb",
      "OAuth":"/backup_looking_glass_display_concept_1.glb",
      "C":"/c.glb",
      'Java':"/java.glb",
      "Git":"/3d_github_logo.glb",
    };
    return modelPaths[skillName];
  };

  return (
    <div className="relative">
      {/* Main Node */}
      <div
        className="w-full h-full rounded-xl shadow-lg cursor-pointer flex items-center justify-center relative overflow-visible transition-all duration-300 hover:scale-105 hover:-translate-y-1 top-10 bg-gradient-to-br from-slate-100 to-slate-200"
        onMouseEnter={() => onHover(skill.id)}
        onMouseLeave={() => onHover(null)}
      >
        <div className="text-center p-3 w-80 h-48 flex flex-col items-center justify-center">
          {/* 3D Model Placeholder */}
          <div
            className="w-32 h-32 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${skill.color}20`, color: skill.color }}
          >
            <model-viewer
            src={getSkillModelPath(skill.skill)}
            camera-controls="true"
            auto-rotate="true"
            auto-rotate-delay="1000"
            rotation-per-second="30deg"
            interaction-prompt="none"
            style={{ 
              width: '200px', 
              height: '200px', 
              background: 'transparent',
              '--poster-color': 'transparent'
            }}
            exposure="1"
            shadow-intensity="1"
            environment-image="neutral"
            loading="eager"
          />
          </div>

          {/* Skill Name */}
          <div
            className="mt-2 text-sm font-bold text-center"
            style={{ color: skill.color }}
          >
            {skill.skill}
          </div>
        </div>

        {/* Glow effect when hovered */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-xl animate-pulse"
            style={{
              background: `radial-gradient(circle, ${skill.color}20 0%, transparent 70%)`,
              filter: "blur(8px)",
            }}
          />
        )}
      </div>

      {/* Animated Detail Card */}
      {isHovered && (
        <div
          className="absolute bg-white rounded-xl shadow-2xl border-2 p-6 min-w-80 max-w-96 z-50 transition-all duration-300"
          style={{
            borderColor: skill.color,
            top: "200px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {/* Arrow pointer */}
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l-2 border-t-2"
            style={{
              borderColor: skill.color,
            }}
          />
          <div className="text-center">
            <h3
              className="font-bold text-xl mb-3"
              style={{ color: skill.color }}
            >
              {skill.skill}
            </h3>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {skill.description}
            </p>

            {/* Animated Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Proficiency Level
                </span>
                <span
                  className="text-sm font-bold"
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

            {/* Stage Badge */}
            <div
              className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg"
              style={{ backgroundColor: stageColors[skill.stage] }}
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
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleBackgroundClick = (e) => {
    // Close if clicking on background or any element that's not a category title
    if (!e.target.closest(".category-title")) {
      setExpandedCategory(null);
    }
  };

  const skillsData = {
    frontend: {
      title: "Frontend",
      description:
        "User interface technologies and frameworks for creating engaging web experiences.",
      experienceLevel: 90,
      skills: [
        {
          id: "frontend-0",
          stage: "1st",
          skill: "HTML",
          description:
            "Structure & Markup - The foundation of web development, creating semantic and accessible content structures.",
          color: "#e34c26",
          proficiency: 100,
          category: "Frontend",
        },
        {
          id: "frontend-1",
          stage: "2nd",
          skill: "CSS",
          description:
            "Styling & Design - Advanced styling techniques, animations, and responsive design principles.",
          color: "#1572b6",
          proficiency: 100,
          category: "Frontend",
        },
        {
          id: "frontend-2",
          stage: "3rd",
          skill: "JavaScript",
          description:
            "Interactivity - Modern ES6+ features, DOM manipulation, and asynchronous programming.",
          color: "#f7df1e",
          proficiency: 95,
          category: "Frontend",
        },
        {
          id: "frontend-3",
          stage: "4th",
          skill: "React",
          description:
            "Component Framework - Building dynamic user interfaces with hooks, state management, and component architecture.",
          color: "#61dafb",
          proficiency: 90,
          category: "Frontend",
        },
      ],
    },
    backend: {
      title: "Backend",
      description:
        "Server-side technologies for building robust and scalable applications.",
      experienceLevel: 82,
      skills: [
        {
          id: "backend-0",
          stage: "1st",
          skill: "Node.js",
          description:
            "Runtime Environment - Server-side JavaScript runtime for building scalable network applications.",
          color: "#339933",
          proficiency: 85,
          category: "Backend",
        },
        {
          id: "backend-1",
          stage: "2nd",
          skill: "Express.js",
          description:
            "Web Framework - Minimal and flexible Node.js web application framework with robust features.",
          color: "#000000",
          proficiency: 85,
          category: "Backend",
        },
        {
          id: "backend-2",
          stage: "3rd",
          skill: "Python",
          description:
            "Server Language - Versatile programming language for web development, automation, and data processing.",
          color: "#3776ab",
          proficiency: 80,
          category: "Backend",
        },
      ],
    },
    database: {
      title: "Database",
      description:
        "Data storage and management solutions for modern applications.",
      experienceLevel: 95,
      skills: [
        {
          id: "database-0",
          stage: "1st",
          skill: "MySQL",
          description:
            "Relational Database - Structured query language for managing relational database systems.",
          color: "#00618a",
          proficiency: 100,
          category: "Database",
        },
        {
          id: "database-1",
          stage: "2nd",
          skill: "MongoDB",
          description:
            "NoSQL Database - Document-oriented database for flexible, scalable data storage solutions.",
          color: "#47a248",
          proficiency: 100,
          category: "Database",
        },
      ],
    },
    framework: {
      title: "Framework",
      description: "Modern frameworks and libraries for efficient development.",
      experienceLevel: 70,
      skills: [
        {
          id: "framework-0",
          stage: "1st",
          skill: "React",
          description:
            "Component Based UI Library - Building reusable components and managing application state effectively.",
          color: "#61dafb",
          proficiency: 70,
          category: "Framework",
        },
        {
          id: "framework-1",
          stage: "2nd",
          skill: "Next.js",
          description:
            "Full Stack Framework - Production-ready React framework with SSR, routing, and deployment optimization.",
          color: "#000000",
          proficiency: 70,
          category: "Framework",
        },
        {
          id: "framework-2",
          stage: "3rd",
          skill: "Tailwind CSS",
          description: "Utility-first CSS framework for rapid UI development.",
          color: "#06b6d4",
          proficiency: 70,
          category: "Framework",
        },
      ],
    },
    authentication: {
      title: "Authentication",
      description: "Security protocols and authentication mechanisms.",
      experienceLevel: 70,
      skills: [
        {
          id: "auth-0",
          stage: "1st",
          skill: "JWT",
          description:
            "Token Authentication - Secure method for transmitting information between parties as JSON objects.",
          color: "#000000",
          proficiency: 70,
          category: "Authentication",
        },
        {
          id: "auth-1",
          stage: "2nd",
          skill: "OAuth",
          description:
            "Authorization Protocol - Industry-standard protocol for authorization and secure API access.",
          color: "#4285f4",
          proficiency: 70,
          category: "Authentication",
        },
      ],
    },
    programming: {
      title: "Programming",
      description:
        "Core programming languages and computer science fundamentals.",
      experienceLevel: 85,
      skills: [
        {
          id: "prog-0",
          stage: "1st",
          skill: "C",
          description:
            "System Programming - Low-level programming language for system software and embedded applications.",
          color: "#a8b9cc",
          proficiency: 100,
          category: "Programming",
        },
        {
          id: "prog-1",
          stage: "2nd",
          skill: "Java",
          description:
            "Enterprise Programming - Object-oriented language for large-scale enterprise applications.",
          color: "#ed8b00",
          proficiency: 70,
          category: "Programming",
        },
        {
          id: "prog-2",
          stage: "3rd",
          skill: "Python",
          description:
            "High-Level Programming - Versatile language for web development, data science, and automation.",
          color: "#3776ab",
          proficiency: 80,
          category: "Programming",
        },
      ],
    },
    versioncontrol: {
      title: "Version Control",
      description: "Code versioning and collaboration tools.",
      experienceLevel: 90,
      skills: [
        {
          id: "vc-0",
          stage: "1st",
          skill: "Git",
          description:
            "Distributed Version Control - Essential tool for tracking changes and collaborating on software projects.",
          color: "#f05032",
          proficiency: 90,
          category: "Version Control",
        },
      ],
    },
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-4xl">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
          My Skills Journey
        </h1>
        <p className="text-white text-lg">
          Click on categories and hover over skills to explore! ✨
        </p>
      </div>

      {/* Skills Grid */}
      <div className="max-w-7xl mx-auto">
        <div onClick={handleBackgroundClick} className="space-y-8">
          {Object.entries(skillsData).map(([category, data]) => (
            <div key={category} className="flex flex-col items-center w-full">
              {/* Category Title */}
              <h2
                className="category-title text-2xl font-bold text-white text-center mb-4 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-lg shadow-sm cursor-pointer transition-all duration-300 hover:bg-white/30 w-[20vw] flex justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCategory(
                    expandedCategory === category ? null : category
                  );
                }}
              >
                {data.title}
                <span
                  className={`transition-transform duration-300 relative text-sm top-[6px] right-[-10px]`}
                >
                  {expandedCategory === category ? (
                    <PanelBottomOpen />
                  ) : (
                    <PanelTopOpen />
                  )}
                </span>
              </h2>

              {/* Skills and Info Card Container */}
              <div
                className={`flex flex-col lg:flex-row items-start gap-6 transition-all duration-500 ease-in-out  w-full ${
                  expandedCategory === category
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {/* Skills Container */}
                <div className="grid grid-cols-4 gap-8 justify-center z-10">
                  {data.skills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className={`transition-all duration-300 ${
                        expandedCategory === category
                          ? "translate-y-0 opacity-100 scale-100"
                          : "translate-y-4 opacity-0 scale-95"
                      }`}
                      style={{
                        transitionDelay:
                          expandedCategory === category
                            ? `${index * 100}ms`
                            : "0ms",
                      }}
                    >
                      <SkillNode
                        skill={skill}
                        onHover={setHoveredNode}
                        isHovered={hoveredNode === skill.id}
                      />
                    </div>
                  ))}
                </div>

                {/* Info Card - Right Side */}
                <div
                  className={`flex-shrink-0 w-full lg:w-80 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl transition-all duration-500 ${
                    expandedCategory === category
                      ? "translate-x-0 opacity-100 scale-100"
                      : "translate-x-8 opacity-0 scale-95"
                  }`}
                  style={{
                    transitionDelay:
                      expandedCategory === category ? "300ms" : "0ms",
                  }}
                >
                  <h3 className="text-lg font-bold text-white mb-4">
                    {data.title} Overview
                  </h3>

                  <div className="space-y-3">
                    <p className="text-white/80 text-sm">{data.description}</p>

                    <div className="border-t border-white/20 pt-3">
                      <h4 className="text-white font-semibold mb-2">
                        Skills Count
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 font-bold text-sm">
                            {data.skills.length}
                          </span>
                        </div>
                        <span className="text-white/70 text-sm">
                          {data.skills.length === 1
                            ? "Technology"
                            : "Technologies"}
                        </span>
                      </div>
                    </div>

                    {/* Currently Hovered Skill Details */}
                    {hoveredNode &&
                      data.skills.find((skill) => skill.id === hoveredNode) && (
                        <div className="border-t border-white/20 pt-3">
                          <h4 className="text-white font-semibold mb-2">
                            Currently Viewing
                          </h4>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-blue-300 font-medium">
                              {
                                data.skills.find(
                                  (skill) => skill.id === hoveredNode
                                )?.skill
                              }
                            </p>
                            <p className="text-white/60 text-xs mt-1">
                              {
                                data.skills.find(
                                  (skill) => skill.id === hoveredNode
                                )?.description
                              }
                            </p>
                          </div>
                        </div>
                      )}

                    {/* Experience Level */}
                    <div className="border-t border-white/20 pt-3">
                      <h4 className="text-white font-semibold mb-2">
                        Experience Level
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${data.experienceLevel}%` }}
                          />
                        </div>
                        <span className="text-white/70 text-xs">
                          {data.experienceLevel}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SimplifiedSkillsGrid;
