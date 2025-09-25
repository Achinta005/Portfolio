"use client";
import React, { useState, useEffect } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

// LinkPreview component
const LinkPreview = ({ url, className, children }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
};

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [breakpoint]);

  return isMobile;
};

export const AnimatedTestimonials = ({ testimonials, autoplay = false }) => {
  const [active, setActive] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
    setShowFullDescription(false); // Reset description when changing projects
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setShowFullDescription(false); // Reset description when changing projects
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  // Reset description view when active project changes
  useEffect(() => {
    setShowFullDescription(false);
  }, [active]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full max-w-6xl">
        
        {/* Image Container - Fixed height for better viewport usage */}
        <div className="flex items-center justify-center order-1 lg:order-1">
          <div className="relative h-48 w-full max-w-sm sm:h-56 sm:max-w-md lg:h-64 lg:max-w-lg">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    draggable={false}
                    className="h-full w-full rounded-xl object-cover object-center shadow-xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Container - Compact layout */}
        <div className="flex flex-col justify-center order-2 lg:order-2 space-y-4 lg:space-y-5">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="space-y-3 lg:space-y-4"
          >
            {/* Project Title */}
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                {testimonials[active].name}
              </h3>
              <p className="text-xs sm:text-sm text-green-400 mt-1 font-medium">
                {testimonials[active].designation}
              </p>
            </div>

            {/* Project Description - With See More functionality */}
            <motion.div className="text-sm sm:text-base text-gray-300 leading-relaxed">
              <div className={`transition-all duration-300 ${showFullDescription ? 'max-h-none' : 'max-h-24 overflow-hidden'}`}>
                {testimonials[active].quote.split(" ").map((word, index) => {
                  const shouldShow = showFullDescription || index < 30;
                  return shouldShow ? (
                    <motion.span
                      key={index}
                      initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut", delay: showFullDescription ? 0 : 0.01 * index }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ) : null;
                })}
              </div>
              {testimonials[active].quote.split(" ").length > 30 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline decoration-dotted underline-offset-2 cursor-pointer"
                >
                  {showFullDescription ? 'See less' : 'See more'}
                </button>
              )}
            </motion.div>

            {/* Project Links */}
            <div className="flex flex-row gap-4 pt-2">
              {testimonials[active].liveUrl && (
                <LinkPreview
                  url={testimonials[active].liveUrl}
                  className="font-bold"
                >
                  <div className="flex items-center font-semibold text-green-500 hover:text-blue-400 transition-colors cursor-pointer group">
                    <div className="w-4 h-4 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                      <span className="text-sm">🔗</span>
                    </div>
                    <span className="text-sm">Live Demo</span>
                  </div>
                </LinkPreview>
              )}
              
              {testimonials[active].githubUrl && (
                <a
                  href={testimonials[active].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-500 hover:text-blue-400 transition-colors cursor-pointer group"
                >
                  <div className="w-4 h-4 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                    <span className="text-sm">📁</span>
                  </div>
                  <span className="text-sm font-medium">View Code</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Navigation Controls - Compact */}
          <div className="flex items-center gap-4 pt-2 justify-between">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="group/button flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <IconArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300 group-hover/button:-translate-x-0.5" />
              </button>
              
              <button
                onClick={handleNext}
                className="group/button flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <IconArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive(index)
                      ? "bg-green-400 scale-125"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const testimonials = filteredProjects.map((project) => {
    let techList = "No technologies listed";

    // Parse technologies string to array
    try {
      const parsedTech = JSON.parse(project.technologies);
      if (Array.isArray(parsedTech)) {
        techList = parsedTech.join(", ");
      }
    } catch (err) {
      // fallback in case JSON.parse fails
      techList = project.technologies || "No technologies listed";
    }

    return {
      quote: project.description || "No description available",
      name: project.title || "Untitled Project",
      src: project.image || "/placeholder-image.jpg",
      githubUrl: project.github_url,
      liveUrl: project.live_url,
      designation: techList,
    };
  });

  return (
    <section className="min-h-screen flex flex-col py-4 sm:py-6">
      <div className="flex-1 flex flex-col max-w-full mx-auto px-4 sm:px-6">
        {/* Header Section - Compact */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            My Projects
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            A showcase of my recent work spanning web applications. Each project represents a unique challenge and solution.
          </p>
        </div>

        {/* Main Content Container - Uses remaining viewport height */}
        <div className="flex-1 flex flex-col bg-white/5 rounded-lg backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden">
          {/* Decorative Corner Elements - Only on desktop */}
          <div className="hidden lg:block absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
          <div className="hidden lg:block absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-purple-400/50 rounded-tr-lg"></div>

          {/* Container Content */}
          <div className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6">
            {/* Window Controls */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 border-purple-400/50 border-2 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap text-xs sm:text-sm ${
                    selectedCategory === category
                      ? "bg-amber-700/50 text-white border-amber-500/70 transform scale-105"
                      : "bg-white/10 text-green-300 hover:bg-purple-600/70 hover:text-green-500 hover:border-purple-400/70"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Projects Content - Takes remaining space */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              {/* Loading state */}
              {projects.length === 0 ? (
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-3"></div>
                    <div className="text-gray-400 text-base">Loading projects...</div>
                  </div>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-base mb-2">No projects found</div>
                    <div className="text-gray-500 text-sm">Try selecting a different category</div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
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