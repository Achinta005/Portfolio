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
    <div className="mx-auto max-w-sm px-4 py-10 font-sans antialiased md:max-w-screen">
      <div className="relative grid grid-cols-1 md:grid-cols-2 -left-20">
        {/* Left-side image container */}
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-full max-w-[400px]">
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
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        {/* Right-side text container */}
        <div className="flex flex-col justify-between py-4 w-[52vw] p-2">
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
          >
            <h3 className="text-2xl font-bold text-white">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-green-500">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
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
            </motion.p>
            <div className="flex mt-5 gap-6">
              <LinkPreview
                url={testimonials[active].liveUrl}
                className="font-bold"
              >
                <div
                  href={testimonials[active].liveUrl}
                  className="flex items-center font-semibold text-green-600 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-external-link-line"></i>
                  </div>
                  Live Demo
                </div>
              </LinkPreview>
              <a
                href={testimonials[active].githubUrl}
                className="flex items-center text-green-600 hover:text-blue-500 transition-colors cursor-pointer"
              >
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                  <i className="ri-github-line"></i>
                </div>
                Code
              </a>
            </div>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-5">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 cursor-pointer"
            >
              <IconArrowLeft className="h-5 w-5 lg:h-7 lg:w-7 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-200" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 cursor-pointer"
            >
              <IconArrowRight className="h-5 w-5 lg:h-7 lg:w-7 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
