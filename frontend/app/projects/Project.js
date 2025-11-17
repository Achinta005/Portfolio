"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Lazy load components
const Header = dynamic(() => import("../../components/Navbar"), {
  loading: () => <div className="h-16 bg-black/20 animate-pulse" />,
});

const ProjectsHero = dynamic(() => import("./ProjectsHero"), {
  loading: () => (
    <div className="h-32 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const ProjectsGrid = dynamic(() => import("./ProjectsGrid"), {
  loading: () => (
    <div className="flex justify-center items-center py-20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400">Loading projects grid...</p>
      </div>
    </div>
  ),
});

const generateLineStyles = () =>
  Array.from({ length: 20 }, () => ({
    style: {
      width: `${Math.random() * 200 + 100}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 180}deg`,
    },
    transition: {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 2,
    },
  }));

const generateParticleStyles = () =>
  Array.from({ length: 15 }, () => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    },
    transition: {
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 3,
    },
  }));

export default function Projects({ projectsData }) {
  const [lineStyles, setLineStyles] = useState([]);
  const [particleStyles, setParticleStyles] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Delay animations slightly for better initial render
    const timer = setTimeout(() => {
      setLineStyles(generateLineStyles());
      setParticleStyles(generateParticleStyles());
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{ position: "relative", zIndex: 1 }}
      className="overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900"
    >
      {/* Only render animations after mount */}
      {mounted && (
        <>
          <div className="hidden lg:block absolute inset-0 overflow-hidden">
            {lineStyles.map((item, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute bg-gradient-to-r from-transparent via-purple-400/20 to-transparent h-px"
                style={item.style}
                animate={{
                  opacity: [0, 1, 0],
                  scaleX: [0, 1, 0],
                }}
                transition={item.transition}
              />
            ))}
          </div>
          <div className="hidden lg:block absolute inset-0">
            {particleStyles.map((item, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                style={item.style}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                }}
                transition={item.transition}
              />
            ))}
          </div>
        </>
      )}
      
      <Header />
      <ProjectsHero />
      <ProjectsGrid projectsData={projectsData} />
    </div>
  );
}
