"use client";
import { easeOut, motion } from "framer-motion";

export default function CertificationSection() {
  const certifications = [
    {
      name: "Full Stack Web Devolopment",
      issuer: "Teachnook",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346694/1630662755102_c5fstb.jpg",
      path: "/Teachnook COURSE Completion Certificate _ Achinta Hazra.pdf",
    },
    {
      name: "Internship Training Program on ADVANCE JAVA",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/Advance Java.pdf",
    },
    {
      name: "Internship Training Program on CORE JAVA",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/Full Stack Data Science using Python.pdf",
    },
    {
      name: "FULL STACK DATA SCIENCE USING PYTHON",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/ML using Python.pdf",
    },
    {
      name: "MACHINE LEARNING USING PYTHON",
      issuer: "AUTODESK CADEASY",
      year: "2024",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/cadeasy_naooon.png",
      path: "/Advance Java.pdf",
    },
    {
      name: "IEEE Student Chapter",
      issuer: "The Institution Of Engineer",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346757/Institution_of_Engineers__India__Logo_lv3eix.svg",
      path: "/IEEE.pdf",
    },
    {
      name: "IEEE Seminar",
      issuer: "DIATM",
      year: "2023",
      icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346757/Institution_of_Engineers__India__Logo_lv3eix.svg",
      path: "/IEI Seminar.pdf",
    },
  ];
  //Function to open file
  const openFile = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
            <h2 className="text-4xl font-bold text-yellow-100 mb-4">
              Certifications
            </h2>
            <span></span>
          </motion.div>
          <motion.div
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -150 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="text-xl text-gray-300 max-w-3xl mx-auto dark:text-gray-300">
              Professional certifications that validate my expertise and
              commitment to continuous learning.
            </p>
            <span></span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <div className="bg-white/10 p-6 rounded-xl hover:bg-white/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-8 flex items-center justify-center bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                    <img
                      src={cert.icon}
                      alt={cert.name}
                      className="w-fit h-fit rounded-lg object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => openFile(cert.path)}
                      className="font-bold text-left text-blue-600 text-sm leading-tight hover:text-blue-600  cursor-pointer"
                      type="button"
                    >
                      {cert.name}
                    </button>
                  </div>
                </div>
                <p className="text-gray-100 font-medium text-sm mb-1 dark:text-gray-400">
                  {cert.issuer}
                </p>
                <p className="text-gray-300 text-xs dark:text-gray-600">
                  {cert.year}
                </p>
                <span></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
