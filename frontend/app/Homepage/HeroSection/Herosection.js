"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export default function Herosection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleDownload = async () => {
    try {
      PortfolioApiService.downloadResume();
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

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 max-w-screen sm:px-6 lg:-top-8">
      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
         
          {/* Content Section */}
          <motion.div
            className="lg:col-span-7 space-y-6 lg:space-y-8 order-2 lg:order-1"
            variants={itemVariants}
          >
            {/* Desktop Glassmorphism Container / Mobile Simple Container */}
            <div className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/20 lg:backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-lg lg:rounded-3xl border border-slate-700/50 lg:border-slate-700/50 shadow-lg lg:shadow-2xl lg:glow-container bg-white/5 lg:bg-gradient-to-br">


              {/* Greeting - Desktop only */}
              <motion.div
                className="hidden lg:block text-emerald-400 mb-4 font-medium tracking-wide text-sm uppercase"
                variants={itemVariants}
              >
                <span className="mr-2">👋</span> Welcome to my Page
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-6xl font-bold lg:font-black mb-4 lg:mb-6 leading-tight text-green-600 lg:text-white"
                variants={mobileItemVariants}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <span className="block lg:mb-2">Hi, I&apos;m</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent lg:bg-gradient-to-r lg:from-emerald-400 lg:via-blue-500 lg:to-purple-500 lg:bg-clip-text lg:text-transparent text-green-600 lg:text-transparent">
                  Achinta Hazra
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                className="text-xl sm:text-xl lg:text-2xl text-gray-100 lg:text-slate-300 mb-6 lg:mb-8 font-bold lg:font-semibold"
                variants={mobileItemVariants}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="lg:bg-gradient-to-r lg:from-blue-400 lg:to-emerald-400 lg:bg-clip-text lg:text-transparent">
                  Developer & Learner
                </span>
              </motion.h2>

              {/* Mobile Description */}
              <motion.p
                className="text-gray-200 mb-6 lg:mb-0 max-w-xl lg:hidden text-sm sm:text-base"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                I&apos;m Developer with a passion for building dynamic,
                user-friendly, and scalable web applications. I specialize in
                creating end-to-end solutions using modern technologies across
                both frontend and backend. From crafting responsive interfaces
                to developing robust APIs, I love turning ideas into real-world
                digital products. I&apos;m always exploring new tools and
                frameworks to improve my craft and deliver clean, efficient
                code.
              </motion.p>

              {/* Skills Tags - Desktop only */}
              <motion.div
                className="hidden lg:flex flex-wrap gap-3 mb-8"
                variants={itemVariants}
              >
                {[
                  "React",
                  "Next.js",
                  "Node.js",
                  "Auth",
                  "Tailwind",
                  "Numpy",
                ].map((skill, i) => (
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
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:gap-4"
                variants={itemVariants}
              >
                {/* Desktop Buttons */}
                <div className="hidden lg:contents">
                  <motion.button
                    onClick={handleDownload}
                    className="px-6 xl:px-8 py-3 xl:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-sm xl:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      📄 Download Resume
                    </span>
                  </motion.button>

                  <Link
                    href="/contact"
                    className="px-6 xl:px-8 py-3 xl:py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200 text-center text-sm xl:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      ✉️ Get In Touch
                    </span>
                  </Link>
                </div>

                {/* Mobile Buttons */}
                <div className="lg:hidden grid grid-cols-1 relative sm:grid-cols-2 gap-4 w-full mt-6 sm:left-10 left-[30vw]">
                  <motion.div
                    className="connect-button"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <button
                      onClick={handleDownload}
                      className="button-connect w-full"
                    >
                      <p className="text-xs sm:text-sm">Download Resume</p>
                      <span></span>
                    </button>
                  </motion.div>

                  <motion.div
                    className="connect-button"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <Link href="/contact" className="connect-button w-full">
                      <button className="w-full">
                        <p className="text-xs sm:text-sm">Get In Touch</p>
                      </button>
                      <span></span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
            variants={itemVariants}
          >
            {/* Desktop Image */}
            <div className="hidden lg:block w-80 h-80 relative bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-md rounded-full border border-slate-700/50 shadow-2xl profile-glow-container p-1">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 p-1"
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
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

            {/* Mobile Image */}
            <div className="lg:hidden w-48 sm:w-52 h-48 sm:h-52 relative">
              <div className="w-full h-full">
                <Image
                  src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755695343/profile_kxt3ue.png"
                  alt="Achinta Hazra"
                  className="w-full h-full rounded-full object-cover object-center shadow-2xl"
                  width={320}
                  height={320}
                  priority
                  sizes="(max-width: 640px) 192px, 208px"
                />
                <div className="absolute -bottom-0 -right-0 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl">
                  <i className="ri-code-s-slash-line" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
