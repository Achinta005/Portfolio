"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

// Lazy load AnimatedTestimonials
const AnimatedTestimonials = dynamic(
  () => import("@/components/ui/animatedProjects").then(mod => ({ default: mod.AnimatedTestimonials })),
  {
    loading: () => (
      <div className="flex justify-center items-center h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading testimonials...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function ProjectsGrid({ projectsData }) {
  const [shuffledProjects, setShuffledProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const categories = useMemo(() => ["All", "Web Development", "Machine Learning"], []);

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      setShuffledProjects(shuffleArray(projectsData));
      setIsLoading(false);
    }
  }, [projectsData]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setShuffledProjects(shuffleArray(projectsData));
    }
  };

  const currentProjects = useMemo(() => {
    return selectedCategory === "All"
      ? shuffledProjects
      : projectsData.filter((project) => project.category === selectedCategory);
  }, [selectedCategory, shuffledProjects, projectsData]);

  const testimonials = useMemo(() => {
    return currentProjects.map((project) => {
      let techList = "No technologies listed";
      try {
        if (Array.isArray(project.technologies)) {
          techList = project.technologies.join(", ");
        } else {
          const parsedTech = JSON.parse(project.technologies);
          if (Array.isArray(parsedTech)) {
            techList = parsedTech.join(", ");
          }
        }
      } catch (err) {
        techList = project.technologies || "No technologies listed";
      }

      const isMachineLearning = project.category === "Machine Learning";

      return {
        quote: project.description || "No description available",
        name: project.title || "Untitled Project",
        src: project.image || "/placeholder-image.jpg",
        githubUrl: project.github_url||project.githubUrl,
        liveUrl: project.live_url||project.liveUrl,
        designation: techList,
        category: project.category,
        accuracy: isMachineLearning ? project.model_accuracy : undefined,
        features: isMachineLearning ? project.model_features : undefined,
        showAllButtons: isMachineLearning,
      };
    });
  }, [currentProjects]);

  return (
    <section className="relative py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden -top-28 relative">
          <div className="relative p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-6 lg:mb-8">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 lg:mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 sm:px-6 sm:py-2 border-purple-400/50 border-2 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                    selectedCategory === category
                      ? "bg-amber-700/50 text-white border-amber-500/70 transform scale-105"
                      : "bg-white/10 text-green-300 hover:bg-purple-600/70 hover:text-green-500 hover:border-purple-400/70"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative min-h-[400px] sm:min-h-[500px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin" />
                      <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                    </div>
                    <div className="text-gray-400 text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Loading projects...
                    </div>
                  </div>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="text-gray-400 text-lg mb-2">
                      No projects found
                    </div>
                    <div className="text-gray-500 text-sm">
                      Currently Working In it ...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full overflow-hidden">
                  <AnimatedTestimonials testimonials={testimonials} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}