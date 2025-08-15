"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import useIsMobile from "./useIsMobile";
import HeroSectionMobile from "./HeroSectionMobile";

export default function HeroSection() {
  const isMobile = useIsMobile(1024);
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

  return isMobile ? (
    <div>
      <HeroSectionMobile />
    </div>
  ) : (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left bg-white/5 backdrop-blur-md p-8 shadow-lg lg:w-[55vw] w-[75vw] rounded-lg lg:rounded-r-full">
            <h1 className="lg:text-[3.4rem] text-3xl mt-4 lg:mt-0 font-bold text-green-600 mb-6 w-2xl overflow-hidden whitespace-nowrap border-r-4 border-white pr-5 animate-typing dark:text-gray-100">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }} // triggers animation every time in view
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ display: "inline-block" }}
              >
                Hi, I&apos;m Achinta Hazra
              </motion.span>
            </h1>

            <h2 className="text-xl lg:text-3xl text-gray-100 mb-6  font-bold">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ display: "inline-block" }}
              >
                Developer & Learner
              </motion.span>
            </h2>
            <p className=" text-gray-200 mb-8 max-w-xl lg:text-gray-200 lg:text-lg">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ display: "inline-block" }}
              >
                I&apos;m Developer with a passion for building
                dynamic, user-friendly, and scalable web applications. I
                specialize in creating end-to-end solutions using modern
                technologies across both frontend and backend. From crafting
                responsive interfaces to developing robust APIs, I love turning
                ideas into real-world digital products. I&apos;m always
                exploring new tools and frameworks to improve my craft and
                deliver clean, efficient code.
              </motion.span>
            </p>
            <div className="flex flex-wrap gap-6">
              <motion.div
                rel="noopener noreferrer"
                className="connect-button"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <button
                  onClick={handleDownload}
                  rel="noopener noreferrer"
                  className="button-connect"
                >
                  Download My Resume
                  <span></span>
                </button>
                <span></span>
              </motion.div>
              <motion.div
                rel="noopener noreferrer"
                className="connect-button"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Link
                  href="#contact"
                  rel="noopener noreferrer"
                  className="connect-button"
                >
                  <button>Get In Touch</button>
                  <span></span>
                </Link>
                <span></span>
              </motion.div>
            </div>
          </div>

          <div className=" w-80 h-80 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 lg:left-[15vw] relative ">
            <div className=" w-full h-full">
              <Image
                src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025128/profile_lz4yry.jpg"
                alt="A professional headshot"
                className="w-full h-full rounded-full object-cover object-center shadow-2xl"
                width={320}
                height={320}
                priority
              />
              <div className=" absolute -bottom-0 -right-0 bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center text-2xl">
                <i className="ri-code-s-slash-line" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
