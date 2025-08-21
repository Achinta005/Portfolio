"use client";
import Image from "next/image";
import { easeOut, motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowEffect";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
} from "@material-tailwind/react";

export default function EducationSectionMobile() {
  const education = [
    {
      degree: "Secondary Education",
      university: "West Bengal Board of Secondary Education",
      college: "Local Secondary School",
      year: "2018 - 2020",
      description:
        "Foundation education with excellent grades in Mathematics and Science subjects.",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346172/baradongal-ramanath-institution-baradangal-hooghly-schools-67ow2odqsn_wbbog0.jpg",
    },
    {
      degree: "Higher Secondary Education",
      university: "West Bengal Council of Higher Secondary Education",
      college: "Local Higher Secondary School",
      year: "2020 - 2022",
      description:
        "Completed with Science stream focusing on Mathematics, Physics, and Computer Science.",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346172/baradongal-ramanath-institution-baradangal-hooghly-schools-67ow2odqsn_wbbog0.jpg",
    },
    {
      degree: "Bachelor of Technology in Computer Science",
      university: "West Bengal University of Technology",
      college: "Durgapur Institute of Advance Technology & Management",
      year: "2022 - 2026",
      description:
        "Currently pursuing B.Tech(CSE) degree with focus on software engineering and web development.",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025127/img_xel2z6.jpg",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-1 sm:px-2 lg:px-4">
        <div className="text-center mb-16">
          <motion.div
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">Education</h2>
            <span></span>
          </motion.div>
          <motion.div
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -150 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              My academic foundation in computer science and continuous learning
              journey.
            </p>
            <span></span>
          </motion.div>
        </div>

        <div className="w-full relative">
          <Timeline className="relative">
            {education.map((edu, index) => (
              <TimelineItem key={index} className="relative z-10">
                {/* Custom connector line - only show between items */}
                {index < education.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-80 bg-gradient-to-b from-blue-500 to-purple-500 z-0"></div>
                )}

                <TimelineConnector className="hidden" />
                <TimelineHeader>
                  <TimelineIcon className="p-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full overflow-hidden">
                      <Image
                        src={
                          index === 2
                            ? "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/icons8-circle-48_jip8cm.png"
                            : "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345763/icons8-checkmark-48_wgk7ka.png"
                        }
                        width={30}
                        height={30}
                        alt="Education Icon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TimelineIcon>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="text-gray-100"
                  >
                    {edu.year}
                  </Typography>
                </TimelineHeader>
                <TimelineBody className="pb-8">
                  <motion.div
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: easeOut }}
                  >
                    <div className="flex justify-center p-0 rounded-lg shadow-lg w-full pointer-events-none">
                      <div className="relative shadow-2xl w-full max-w-xl object-cover object-top rounded-2xl pointer-events-auto bg-white/10 p-2">
                        {/* Glowing Effect */}
                        <GlowingEffect
                          spread={80}
                          glow={true}
                          disabled={false}
                          proximity={60}
                          inactiveZone={0.01}
                          borderWidth={3}
                        />

                        {/* Content Container with Glowing Border */}
                        <div className="border-0.75 relative flex h-full w-fit flex-col justify-between lg:gap-6 overflow-hidden rounded-xl lg:p-8">
                          <div className="lg:flex lg:flex-row lg:items-start sm:flex sm:flex-col gap-6">
                            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-lg flex-shrink-0 overflow-hidden border-4 border-amber-50 max-lg:mx-auto mb-4">
                              <Image
                                src={edu.icon}
                                width={96}
                                height={96}
                                alt="Education Icon"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-100 mb-2">
                                {edu.degree}
                              </h3>
                              <p className="text-green-600 font-semibold mb-1">
                                {edu.university}
                              </p>
                              <p className="text-gray-300 dark:text-gray-400 font-semibold mb-1">
                                {edu.college}
                              </p>
                              <p className="text-gray-300 text-sm mb-2">
                                {edu.year}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {edu.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TimelineBody>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </section>
  );
}
