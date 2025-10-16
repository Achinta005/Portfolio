"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Navbar";
import AboutHero from "./AboutHero";
import EducationSection from "./EducationSection";
import CertificationSection from "./CertificationSection";
import InteractiveSkillsDisplay from "./InteractiveSkillsDisplay";
import DecorativeNavbar from "@/components/DecorativeNavbar";
import SectionIndicators from "../../components/SectionIndicator";

export default function About() {
  const [activeSection, setActiveSection] = useState("about");

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
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeSection]);

  return (
    <>
      <DecorativeNavbar
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
      />

      {/* Side Section Indicators */}
      <SectionIndicators
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
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