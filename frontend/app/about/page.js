"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Navbar";
import useIsMobile from "@/components/useIsMobile";
import AboutHero from "./AboutHeroSection/AboutHero";
import EducationSection from "./EducationSection/EducationSection";
import CertificationSection from "./CertificateSection/CertificationSection";
import InteractiveSkillsDisplay from "./SkillSection/InteractiveSkillsDisplay";
import AboutHeroMobile from "./AboutHeroSection/AboutHeroMobile";
import InteractiveDisplayMobile from "./SkillSection/InteractiveDisplayMobile";
import EducationSectionMobile from "./EducationSection/EducationSectionMobile";
import CertificationSectionMobile from "./CertificateSection/CertificationSectionMobile";
import DecorativeNavbar from "@/components/DecorativeNavbar";
import SectionIndicators from "../../components/SectionIndicator";

export default function About() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    async function loadVanta() {
      if (!window.VANTA) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      if (!vantaEffect && window.VANTA && vantaRef.current) {
        setVantaEffect(
          window.VANTA.NET({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x0,
            points: 20.0,
            maxDistance: 10.0,
            spacing: 20.0,
          })
        );
      }
    }

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Handle section navigation
  const handleSectionChange = (sectionId) => {
    console.log('Navigating to section:', sectionId);
    setActiveSection(sectionId);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      const sections = ["about", "skills", "education", "certifications"];
      const currentIndex = sections.indexOf(activeSection);
      
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % sections.length;
          setActiveSection(sections[nextIndex]);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
          setActiveSection(sections[prevIndex]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeSection]);

  const isMobile = useIsMobile(1024);

  return isMobile ? (
    <>
      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AboutHeroMobile />
        <InteractiveDisplayMobile />
        <EducationSectionMobile />
        <CertificationSectionMobile />
        <Header />
      </div>
    </>
  ) : (
    <>
      {/* Decorative Navbar */}
      <DecorativeNavbar 
        onSectionChange={handleSectionChange} 
        activeSection={activeSection}
      />
      
      {/* Side Section Indicators */}
      <SectionIndicators 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Background Effect */}
      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      
      {/* ONLY ONE SECTION SHOWS AT A TIME */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <AnimatePresence mode="wait">
          {activeSection === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <AboutHero />
            </motion.div>
          )}
          
          {activeSection === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <InteractiveSkillsDisplay />
            </motion.div>
          )}
          
          {activeSection === "education" && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <EducationSection />
            </motion.div>
          )}
          
          {activeSection === "certifications" && (
            <motion.div
              key="certifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <CertificationSection />
            </motion.div>
          )}
        </AnimatePresence>
        
        <Header />
      </div>
    </>
  );
}