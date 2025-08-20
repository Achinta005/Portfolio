"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background_gradient";
import useIsMobile from "@/components/useIsMobile";
import InteractiveDisplayMobile from "./InteractiveDisplayMobile";

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
      <BackgroundGradient>
        <div
          className="lg:w-24 lg:h-28 w-20 h-24 rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-visible transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-gradient-to-br from-blue-300 to-red-200"
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
          <div className="flex-1 flex items-center justify-center  rounded-b-lg w-full relative top-[-5vh]">
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
          className={`absolute bg-white rounded-xl shadow-2xl border-2 p-6 min-w-80 max-w-96 z-50 transition-all duration-300 transform ${
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
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 hover:text-red-800 transition-colors shadow-sm"
              aria-label="Close details"
            >
              <X size={14} />
            </button>

            <h3
              className="font-bold text-xl mb-3 pr-6"
              style={{ color: skill.color }}
            >
              {skill.skill}
            </h3>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed text-left">
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
  const [openDetailId, setOpenDetailId] = useState(null);

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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345765/icons8-html-600_g9tthk.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/icons8-css-600_g0pql0.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345765/icons8-javascript-600_ntxhgq.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345770/icons8-react-600_wzbkes.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345768/icons8-node-js-600_cziqse.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/icons8-express-js-600_tpyesx.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345769/icons8-python-600_efkdzt.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345767/icons8-mysql-600_cj4vmc.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345766/icons8-mongodb-600_k2lpxo.png",
        },
      ],
    },
    framework: {
      title: "Framework",
      description: "Modern frameworks and libraries for efficient development.",
      experienceLevel: 70,
      skills: [
        {
          id: "framework-1",
          stage: "2nd",
          skill: "Next.js",
          description:
            "Full Stack Framework - Production-ready React framework with SSR, routing, and deployment optimization.",
          color: "#000000",
          proficiency: 70,
          category: "Framework",
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345768/icons8-nextjs-600_oxnqhk.png",
        },
        {
          id: "framework-2",
          stage: "3rd",
          skill: "Tailwind CSS",
          description: "Utility-first CSS framework for rapid UI development.",
          color: "#06b6d4",
          proficiency: 70,
          category: "Framework",
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345770/icons8-tailwind-css-600_x4eyux.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345765/icons8-json-web-token-600_njxszh.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345771/oauth-svgrepo-com_jwdq2t.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/icons8-c-600_erdce2.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345765/icons8-java-600_xg83ki.png",
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
          image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/icons8-git-600_w3fdrr.png",
        },
      ],
    },
  };

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

  const isMobile = useIsMobile(1024);

  return isMobile?(
    <div>
      <InteractiveDisplayMobile/>
    </div>
  ): (
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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center lg:gap-6 gap-1.5 flex-wrap">
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
  );
};

export default SimplifiedSkillsGrid;
