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
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl h-full lg:h-full min-h-0 relative border border-purple-500/20 lg:border-purple-500/20 shadow-2xl shadow-purple-500/10 -top-28">
        <div className="hidden lg:block absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
        <div className="hidden lg:block absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/50 rounded-tr-lg"></div>
        <div className="hidden lg:block absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/50 rounded-bl-lg"></div>
        <div className="hidden lg:block absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-400/50 rounded-br-lg"></div>
        <div className="flex items-center space-x-2 relative top-7">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        </div>
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 border-purple-400/50 border-2 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-amber-700/50 text-white "
                  : "bg-white/10 text-green-300 hover:bg-purple-600/70 hover:text-green-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="relative">
          {/* Loading state or Animated Testimonials */}
          {projects.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500 dark:text-neutral-400">
                Loading projects...
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500 dark:text-neutral-400">
                No projects found in this category.
              </div>
            </div>
          ) : (
            <AnimatedTestimonials testimonials={testimonials} />
          )}
        </div>
      </div>
    </section>
  );
}
