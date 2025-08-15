"use client";
import Image from "next/image";
import { easeOut, motion } from "framer-motion";

export default function EducationSection() {
  const education = [
    {
      degree: "Bachelor of Technology in Computer Science",
      university: "West Bengal University of Technology",
      college: "Durgapur Institute of Advance Technology & Management",
      year: "2022 - 2026",
      // description:
      //   "Graduated Magna Cum Laude with a focus on software engineering and web development.",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025127/img_xel2z6.jpg",
    },
  ];

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              Education
            </h2>
            <span></span>
          </motion.div>
          <motion.div
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -150 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="text-xl text-gray-300 max-w-3xl mx-auto ">
              My academic foundation in computer science and continuous learning
              journey.
            </p>
            <span></span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <div className="flex justify-center p-0 bg-white/30 rounded-lg shadow-lg w-fit transform duration-500 hover:translate-x-5 hover:-translate-y-5 pointer-events-none">

                <div className="shadow-2xl object-cover object-top rounded-lg transform duration-500 hover:-translate-x-10 hover:translate-y-10 pointer-events-auto bg-white/60 p-8">

                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                      <Image
                        src={edu.icon}
                        width={500}
                        height={500}
                        alt="Education Icon"
                        className="w-10 h-10 object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-1">
                        {edu.university}
                      </p>
                      <p className="text-gray-700 dark:text-gray-400 font-semibold mb-1">
                        {edu.college}
                      </p>
                      <p className="text-gray-800 text-sm ">
                        {edu.year}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">{edu.description}</p>
                </div>
                <span></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
