"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useIsMobile from "@/components/useIsMobile";
import HerosectionMobile from "./HeroSectionMobile";

export default function Herosection() {
  const isMobile = useIsMobile(1024);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/download/resume`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Achinta_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading:", err);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return isMobile ? (
    <HerosectionMobile />
  ) : (
    <>
      <section className="relative min-h-screen flex items-center justify-center px-6 -top-8">
        <motion.div
          className="relative z-10 max-w-6xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content - Takes 7 columns */}
            <motion.div
              className="lg:col-span-7 space-y-8"
              variants={itemVariants}
            >
              {/* Glassmorphism Container with Infinite Glow */}
              <div className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-2xl glow-container">
                {/* Greeting */}
                <motion.div
                  className="text-emerald-400 mb-4 font-medium tracking-wide text-sm uppercase"
                  variants={itemVariants}
                >
                  <span className="mr-2">👋</span> Welcome to my Page
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  className="text-4xl lg:text-6xl font-black mb-6 leading-tight"
                  variants={itemVariants}
                >
                  <span className="block text-white mb-2">Hi, I'm</span>
                  <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Achinta Hazra
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.h2
                  className="text-xl lg:text-2xl text-slate-300 mb-8 font-semibold"
                  variants={itemVariants}
                >
                  <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Developer & Learner
                  </span>
                </motion.h2>

                {/* Skills Tags */}
                <motion.div
                  className="flex flex-wrap gap-3 mb-8"
                  variants={itemVariants}
                >
                  {["React", "Next.js", "Node.js", "Auth", "Tailwind","Numpy"].map(
                    (skill, i) => (
                      <motion.span
                        key={skill}
                        className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-sm text-emerald-300 font-medium backdrop-blur-sm"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        {skill}
                      </motion.span>
                    )
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  variants={itemVariants}
                >
                  <motion.button
                    onClick={handleDownload}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      📄 Download Resume
                    </span>
                  </motion.button>

                  <Link
                    href="/contact"
                    className="px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200 text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      ✉️ Get In Touch
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Content - Takes 5 columns */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-end"
              variants={itemVariants}
            >
              <div className="w-80 h-80 relative bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-md rounded-full border border-slate-700/50 shadow-2xl profile-glow-container p-1">
                {/* Rotating Ring */}
                <motion.div
                  className="w-full h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 p-1"
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Profile Image */}
                  <motion.div
                    className="w-full h-full rounded-full overflow-hidden bg-black"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755695343/profile_kxt3ue.png"
                      alt="Achinta Hazra"
                      className="w-full h-full object-cover"
                      width={320}
                      height={320}
                      priority
                      sizes="320px"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
