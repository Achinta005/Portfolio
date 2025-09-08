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
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white/20 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div>
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
