"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/components/useoutsideclick";
import { AnimatedTestimonialsMobile } from "@/components/ui/animatedprojectmobile";

export function ExpandableCardDemo() {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  //Project fetch
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
        const data = await res.json();
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

  const testimonials = filteredProjects.map((project) => ({
    src: project.image,
    title: project.title,
    description: project.description,
    ctaText: project.liveUrl,
    ctaLink: project.githubUrl,
    content: Array.isArray(project.technologies)
      ? project.technologies.join(", ")
      : project.technologies,
  }));

  return (
    <>
      {/* Background Blur when Modal Open */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[400px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-gray-600 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={150}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-52 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div className="overflow-y-scroll custom-scrollbar">
                <div className=" justify-between items-start p-2">
                  <div>
                    <motion.p
                      layoutId={`title-${active.title}-${id}`}
                      className=" text-white text-2xl font-bold"
                    >
                      {active.title}
                    </motion.p>

                    <motion.p
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.content}
                    </motion.p>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                  <div className="flex mt-3">
                    <motion.div
                      layoutId={`button-${active.title}-${id}`}
                      href={active.ctaLink}
                      className="px-4 text-sm rounded-full font-bold  text-green-600"
                    >
                      GitHub URL
                    </motion.div>

                    <motion.div
                      layoutId={`button-${active.title}-${id}`}
                      href={active.ctaText}
                      className="px-4 text-sm rounded-full font-bold text-green-600 "
                    >
                      Live URL
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Initial Display - Animated Testimonials */}
      <div className="">
        <AnimatedTestimonialsMobile
          testimonials={testimonials}
          setActive={setActive}
        />
      </div>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);
