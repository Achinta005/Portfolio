"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PortfolioApiService } from "@/services/PortfolioApiService";
import { Contact, View } from "lucide-react";

// Import the new Modal component
import PdfModal from "./PdfModal";

export default function Herosection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleView = async () => {
    try {
      const url = await PortfolioApiService.viewResume();
      setPdfUrl(url);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error viewing resume:", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

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
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:-top-8">
      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Content Section */}
          <motion.div
            className="lg:col-span-7 space-y-6 lg:space-y-8 order-2 lg:order-1"
            variants={itemVariants}
          >
            <div className="relative p-4 sm:p-6 lg:p-8 rounded-lg lg:rounded-3xl border shadow-lg lg:shadow-2xl lg:ml-16">
              {/* Greeting */}
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
                <span className="block text-base sm:text-lg lg:text-3xl lg:mb-2">Hi, I&apos;m</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Achinta Hazra
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                className="text-lg sm:text-xl lg:text-2xl text-gray-100 lg:text-slate-300 mb-6 lg:mb-8 font-bold lg:font-semibold"
                variants={mobileItemVariants}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="lg:bg-gradient-to-r lg:from-blue-400 lg:to-emerald-400 lg:bg-clip-text lg:text-transparent">
                  Developer & Learner
                </span>
              </motion.h2>

              {/* Desktop Action Buttons */}
              <motion.div
                className="hidden lg:flex flex-col xl:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleView}
                  className="px-6 xl:px-8 py-3 xl:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-sm xl:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <View />
                    View My Resume
                  </span>
                </motion.button>

                <Link
                  href="/contact"
                  className="px-6 xl:px-8 py-3 xl:py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200 text-center text-sm xl:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Contact />
                    Get In Touch
                  </span>
                </Link>
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

          {/* Mobile Action Buttons - Moved outside content section */}
          <motion.div 
            className="lg:hidden flex flex-col sm:flex-row gap-3 w-full order-3 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleView}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <View className="w-4 h-4" />
                View Resume
              </span>
            </motion.button>

            <Link
              href="/contact"
              className="flex-1 px-4 py-3 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200 text-center text-sm flex items-center justify-center"
            >
              <span className="flex items-center justify-center gap-2">
                <Contact className="w-4 h-4" />
                Get In Touch
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* The new modal component is rendered here */}
      {isModalOpen && <PdfModal pdfUrl={pdfUrl} onClose={closeModal} />}
    </section>
  );
}