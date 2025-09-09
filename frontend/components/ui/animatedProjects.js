"use client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { LinkPreview } from "./linkpreview";
import { useEffect, useState } from "react";

export const AnimatedTestimonials = ({ testimonials, autoplay = false }) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 lg:py-10 font-sans antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Image Container */}
        <div className="flex items-center justify-center order-1 lg:order-1">
          <div className="relative h-64 w-full max-w-[300px] sm:h-80 sm:max-w-[350px] lg:h-96 lg:max-w-[400px]">
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
                    y: isActive(index) ? [0, -80, 0] : 0,
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
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-2xl sm:rounded-3xl object-cover object-center shadow-2xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col justify-between order-2 lg:order-2 space-y-6">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Project Title */}
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                {testimonials[active].name}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-green-400 mt-2 font-medium">
                {testimonials[active].designation}
              </p>
            </div>

            {/* Project Description */}
            <motion.div className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.div>

            {/* Project Links */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
              {testimonials[active].liveUrl && (
                <LinkPreview
                  url={testimonials[active].liveUrl}
                  className="font-bold"
                >
                  <div className="flex items-center font-semibold text-green-500 hover:text-blue-400 transition-colors cursor-pointer group">
                    <div className="w-4 h-4 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                      <i className="ri-external-link-line text-sm"></i>
                    </div>
                    <span className="text-sm sm:text-base">Live Demo</span>
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
                    <i className="ri-github-line text-sm"></i>
                  </div>
                  <span className="text-sm sm:text-base font-medium">View Code</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8 justify-center lg:justify-start">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              <IconArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              <IconArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center lg:justify-start gap-2 pt-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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
  );
};