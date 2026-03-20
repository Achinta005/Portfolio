"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Contact,
  View,
  Github,
  Linkedin,
  Mail,
  Twitter,
  ExternalLink,
} from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load PdfModal
const PdfModal = dynamic(() => import("./PdfModal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  ),
  ssr: false,
});

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load Vanta.js lazily after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      loadVanta();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const loadVanta = async () => {
    try {
      if (!window.THREE) {
        await new Promise((resolve, reject) => {
          const threeScript = document.createElement("script");
          threeScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
          threeScript.onload = resolve;
          threeScript.onerror = reject;
          document.body.appendChild(threeScript);
        });
      }

      if (!window.VANTA) {
        await new Promise((resolve, reject) => {
          const vantaScript = document.createElement("script");
          vantaScript.src =
            "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          vantaScript.onload = resolve;
          vantaScript.onerror = reject;
          document.body.appendChild(vantaScript);
        });
      }

      if (!vantaEffect.current && window.VANTA && vantaRef.current) {
        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 0.8,
          backgroundColor: 0x000000,
          color: 0x0077ff,
          points: 15.0,
          maxDistance: 8.0,
          spacing: 18.0,
        });
        setVantaLoaded(true);
      }
    } catch (error) {
      console.error("Failed to load Vanta:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleView = async () => {
    setPdfUrl(
      "https://drive.google.com/file/d/1WNeyAoiHDn_zRkJX-pKGPHA10hbJLAxN/view?usp=sharing"
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/Achinta005",
      label: "GitHub",
      color: "hover:text-gray-300",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/achinta-hazra/",
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/achinta005",
      label: "Twitter",
      color: "hover:text-sky-400",
    },
    {
      icon: Mail,
      href: "mailto:achintahazra8515@gmail.com",
      label: "Email",
      color: "hover:text-emerald-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      ref={vantaRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:-top-8 overflow-hidden"
    >
      {/* Fallback gradient background while Vanta loads */}
      {!vantaLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
      )}

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 bg-black/40 z-0" />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          <motion.div
            className="lg:col-span-7 space-y-6 lg:space-y-8 order-2 lg:order-1"
            variants={itemVariants}
          >
            <div className="relative p-4 sm:p-6 lg:p-8 rounded-lg lg:rounded-3xl border border-white/10 lg:border-none shadow-lg backdrop-blur-md lg:backdrop-blur-none lg:bg-transparent">
              {/* Decorative element */}
              <motion.div
                className="hidden lg:block absolute -left-4 top-0 w-1 h-24 bg-gradient-to-b from-emerald-400 to-blue-500 rounded-full"
                initial={{ height: 0 }}
                animate={{ height: 96 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />

              <motion.h1
                className="text-3xl sm:text-4xl lg:text-6xl font-bold lg:font-black mb-4 lg:mb-6 leading-tight text-white"
                variants={mobileItemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="block text-base sm:text-lg lg:text-3xl lg:mb-2 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Hi, I&apos;m
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: "100% 50%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Achinta Hazra
                </motion.span>
              </motion.h1>

              <motion.div
                className="mb-6 lg:mb-8"
                variants={mobileItemVariants}
              >
                <motion.div
                  className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm text-emerald-400 font-mono flex items-center gap-2">
                    <motion.span
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Available for work
                  </span>
                </motion.div>

                <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed">
                  <span className="text-base sm:text-lg font-mono">
                    I am a{" "}
                    <strong className="font-semibold text-gray-100">
                      developer
                    </strong>{" "}
                    with a passion for creating{" "}
                    <strong className="font-semibold text-emerald-400">
                      innovative solutions
                    </strong>{" "}
                    by{" "}
                    <strong className="font-semibold text-blue-400">
                      optimizing
                    </strong>{" "}
                    existing technology or building{" "}
                    <strong className="font-semibold text-purple-400">
                      new innovations
                    </strong>
                    .
                  </span>
                </h2>
              </motion.div>

              {/* Social Links - Desktop */}
              <motion.div
                className="hidden lg:flex items-center gap-4 mb-8"
                variants={itemVariants}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 ${social.color} transition-all duration-300 backdrop-blur-sm`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </motion.div>

              <motion.div
                className="hidden lg:flex flex-col xl:flex-row gap-3"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleView}
                  className="group relative px-4 xl:px-5 py-2 xl:py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 
               text-white font-medium rounded-lg shadow-md hover:shadow-emerald-500/40 
               transition-all duration-300 text-xs xl:text-sm overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <View className="w-4 h-4" />
                    View My Resume
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                <Link
                  href="/contact"
                  className="group px-4 xl:px-5 py-2 xl:py-2.5 border border-emerald-500/50 text-emerald-400 
               font-medium rounded-lg hover:bg-emerald-500/10 hover:border-emerald-400 
               transition-all duration-300 text-xs xl:text-sm text-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <Contact className="w-4 h-4" />
                    Get In Touch
                  </span>

                  <motion.div
                    className="absolute inset-0 bg-emerald-500/5"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
            variants={itemVariants}
          >
            {/* Desktop Profile */}
            <motion.div
              className="hidden lg:block relative"
              style={{
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="w-80 h-80 relative">
                {/* Animated rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-2 border-blue-500/30"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />

                <motion.div
                  className="relative w-full h-full bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-md rounded-full border border-slate-700/50 shadow-2xl p-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                      {!imageLoaded && (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <Image
                        src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755695343/profile_kxt3ue.png"
                        alt="Achinta Hazra"
                        className="w-full h-full object-cover"
                        width={320}
                        height={320}
                        priority
                        sizes="320px"
                        onLoad={() => setImageLoaded(true)}
                        style={{ display: imageLoaded ? "block" : "none" }}
                      />
                      {/* Overlay glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold"
                  variants={floatingVariants}
                  animate="animate"
                >
                  💻 Developer
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold"
                  variants={floatingVariants}
                  animate="animate"
                  transition={{ delay: 1.5 }}
                >
                  ✨ Innovator
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile Profile */}
            <div className="lg:hidden w-48 sm:w-52 h-48 sm:h-52 relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755695343/profile_kxt3ue.png"
                  alt="Achinta Hazra"
                  className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-emerald-500/50"
                  width={320}
                  height={320}
                  priority
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 bg-gradient-to-br from-emerald-500 to-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 360 }}
              >
                <i className="ri-code-s-slash-line" />
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile Buttons and Social */}
          <motion.div
            className="lg:hidden flex flex-col gap-4 w-full order-3 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Social Links - Mobile */}
            <div className="flex items-center justify-center gap-3 mb-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 ${social.color} transition-all duration-300 backdrop-blur-sm`}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
          </motion.div>
        </div>
      </motion.div>
      {isModalOpen && <PdfModal pdfUrl={pdfUrl} onClose={closeModal} />}
    </section>
  );
}
