"use client";
import Image from "next/image";

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
          <h2 className="text-4xl font-bold text-yellow-100 mb-4">Education</h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto dark:text-gray-300">
            My academic foundation in computer science and continuous learning
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-white/40 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
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
                  <p className="text-gray-500 text-sm dark:text-gray-400">{edu.year}</p>
                </div>
              </div>
              <p className="text-gray-600">{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
