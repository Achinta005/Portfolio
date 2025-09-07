"use client";
import React from "react";
import { useState, useEffect } from "react";
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

// Motion-like animation hooks (simple version)
const useInView = () => {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    // Simple timeout to simulate intersection observer
    const timer = setTimeout(() => setIsInView(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  return isInView;
};

const MotionDiv = ({ children, initial, whileInView, transition, className }) => {
  const isInView = useInView();
  
  return (
    <div 
      className={`transition-all duration-700 ${
        isInView 
          ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
          : 'opacity-0 translate-x-[-150px] translate-y-4 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function EducationSection() {
  const [education, setEducation] = useState([])
 
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/education/geteducationdata`
        );
        const data = await res.json();
        setEducation(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    };
    fetchEducationData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Main Container with Glass Effect */}
      <div className="min-h-screen backdrop-blur-md bg-black/20 border-t border-white/10">
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Section */}
            <div className="text-center mb-16">
              <MotionDiv
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl mb-8">
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                    Education
                  </h2>
                </div>
              </MotionDiv>
              
              <MotionDiv
                initial={{ opacity: 0, x: -150 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 max-w-3xl mx-auto shadow-xl">
                  <p className="text-xl text-gray-200">
                    My academic foundation in computer science and continuous learning journey.
                  </p>
                </div>
              </MotionDiv>
            </div>

            {/* Timeline Container */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="w-full relative lg:left-16 left-[-15vw]">
                <Timeline className="relative">
                  {education.map((edu, index) => (
                    <TimelineItem key={index} className="relative z-10">
                      
                      {/* Custom connector line - only show between items */}
                      {index < education.length - 1 && (
                        <div className="absolute left-6 top-14 w-0.5 h-56 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 z-0"></div>
                      )}

                      <TimelineConnector className="hidden" />
                      <TimelineHeader>
                        <TimelineIcon className="p-2">
                          <div className="w-8 h-8 flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 rounded-full overflow-hidden">
                            <img
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
                          className="text-blue-200 font-semibold"
                        >
                          {edu.year}
                        </Typography>
                      </TimelineHeader>
                      
                      <TimelineBody className="pb-8">
                        <MotionDiv
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="flex justify-center p-0 rounded-lg shadow-lg w-full pointer-events-none">
                            <div className="relative shadow-2xl w-full max-w-3xl object-cover object-top rounded-2xl pointer-events-auto backdrop-blur-lg bg-white/10 border border-white/20 p-2 md:rounded-3xl md:p-3">
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
                              <div className="border-0.75 relative flex h-full lg:w-[60vw] max-sm:w-[75vw] flex-col justify-between lg:gap-6 overflow-hidden rounded-xl lg:p-8">
                                <div className="lg:flex lg:flex-row lg:items-start sm:flex sm:flex-col gap-6">
                                  <div className="w-24 h-24 flex items-center justify-center backdrop-blur-md bg-white/20 border border-white/30 rounded-lg flex-shrink-0 overflow-hidden border-4 border-amber-50 max-lg:mx-auto mb-4">
                                    <img
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
                                    <p className="text-green-400 font-semibold mb-1">
                                      {edu.university}
                                    </p>
                                    <p className="text-gray-200 font-semibold mb-1">
                                      {edu.college}
                                    </p>
                                    <p className="text-gray-300 text-sm mb-2">
                                      {edu.year}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                      {edu.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </MotionDiv>
                      </TimelineBody>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}