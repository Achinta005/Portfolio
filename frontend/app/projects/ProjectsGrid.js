"use client";

import React, { useState, useEffect } from "react";
import { AnimatedTestimonials } from "@/components/ui/animatedProjects";
import useIsMobile from "@/components/useIsMobile";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export default function ProjectsGrid() {
  const isMobile = useIsMobile(1024);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await PortfolioApiService.FetchProject();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    getProjects();
  }, []);

  const categories = ["All", "Web Development", "Data Science"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  // Map projects to testimonials format
  const testimonials = filteredProjects.map((project) => ({
    quote: project.description || "No description available",
    name: project.title || "Untitled Project",
    src: project.image || "/placeholder-image.jpg",
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    designation: Array.isArray(project.technologies)
      ? project.technologies.join(", ")
      : project.technologies || "No technologies listed",
  }));

  return (
    <section className="relative py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden">
          
          {/* Decorative Corner Elements - Desktop Only */}
          <div className="hidden lg:block absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
          <div className="hidden lg:block absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/50 rounded-tr-lg"></div>
          <div className="hidden lg:block absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/50 rounded-bl-lg"></div>
          <div className="hidden lg:block absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-400/50 rounded-br-lg"></div>
          
          {/* Container Content */}
          <div className="relative p-4 sm:p-6 lg:p-8">
            
            {/* Window Controls */}
            <div className="flex items-center space-x-2 mb-6 lg:mb-8">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 lg:mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
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

            {/* Projects Content */}
            <div className="relative min-h-[400px] sm:min-h-[500px]">
              {/* Loading state */}
              {projects.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <div className="text-gray-400 text-lg">Loading projects...</div>
                  </div>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="text-gray-400 text-lg mb-2">No projects found</div>
                    <div className="text-gray-500 text-sm">Try selecting a different category</div>
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