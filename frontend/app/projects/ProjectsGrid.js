"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, easeOut } from "framer-motion";
import useIsMobile from "@/components/useIsMobile";
import ProjectGridMobile from "./ProjectGridMobile";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProjectsGrid() {
  const isMobile = useIsMobile(1024);
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
  //Explain -----------------------------------------------------------------------------------------------------------------------------------------
  const categories = ["All", "Web Development", "Data Science"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return isMobile ? (
    <ProjectGridMobile />
  ) : (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-blue-600 dark:bg-gray-900 text-white"
                  : "bg-white/20 text-gray-800 hover:bg-gray-200 "
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          style={{ height: "70vh" }}
        >
          {filteredProjects.map((project, index) => (
            <SwiperSlide key={index}>
              <motion.div
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: easeOut }}
              >
                <div className="bg-white/10 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex gap-10 h-[70vh]">
                  <Image
                    src={project.image}
                    width={500}
                    height={500}
                    alt={project.title}
                    className="w-[40vw] h-full p-6 rounded-[10vh]"
                  />

                  <div className="flex flex-col p-8">
                    <div className="relative right-[-27vw] mb-5 mt-4">
                      <span className="text-sm text-blue-600 font-semibold bg-white/50 p-2 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-yellow-100 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-800 font-semibold mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(project.technologies || []).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded dark:bg-gray-400 dark:text-black"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-4">
                        <a
                          href={project.liveUrl}
                          className="flex items-center font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                        >
                          <div className="w-4 h-4 flex items-center justify-center mr-1">
                            <i className="ri-external-link-line"></i>
                          </div>
                          Live Demo
                        </a>
                        <a
                          href={project.githubUrl}
                          className="flex items-center text-gray-700 hover:text-gray-950 transition-colors cursor-pointer"
                        >
                          <div className="w-4 h-4 flex items-center justify-center mr-1">
                            <i className="ri-github-line"></i>
                          </div>
                          <p className="text-blue-700 font-semibold hover:text-blue-900">
                            Code
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
