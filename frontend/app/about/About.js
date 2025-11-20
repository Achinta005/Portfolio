"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy load all components
const Header = dynamic(() => import("@/components/Navbar"), {
  loading: () => <div className="h-16 bg-black/20 animate-pulse" />,
});

const AboutHero = dynamic(() => import("./AboutHero"), {
  loading: () => <SectionLoadingState section="About Me" />,
  ssr: false,
});

const EducationSection = dynamic(() => import("./EducationSection"), {
  loading: () => <SectionLoadingState section="Education" />,
  ssr: false,
});

const CertificationSection = dynamic(() => import("./CertificationSection"), {
  loading: () => <SectionLoadingState section="Certifications" />,
  ssr: false,
});

const InteractiveSkillsDisplay = dynamic(() => import("./InteractiveSkillsDisplay"), {
  loading: () => <SectionLoadingState section="Skills" />,
  ssr: false,
});

const DecorativeNavbar = dynamic(() => import("@/components/DecorativeNavbar"), {
  loading: () => null,
});

const SectionIndicators = dynamic(() => import("../../components/SectionIndicator"), {
  loading: () => null,
});

// Section loading state component
function SectionLoadingState({ section }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated icon */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Loading {section}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About({ skillsData, educationData, certificateData }) {
  const [activeSection, setActiveSection] = useState("about");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("SKILL:",skillsData)
  }, [skillsData]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  useEffect(() => {
    if (!mounted) return;

    const handleKeyPress = (event) => {
      const sections = ["about", "skills", "education", "certifications"];
      const currentIndex = sections.indexOf(activeSection);

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          setActiveSection(sections[(currentIndex + 1) % sections.length]);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          setActiveSection(
            sections[(currentIndex - 1 + sections.length) % sections.length]
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeSection, mounted]);

  if (!mounted) {
    return <SectionLoadingState section="Page" />;
  }

  return (
    <>
      <Header />
      <DecorativeNavbar
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
      />
      <SectionIndicators
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

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
              <InteractiveSkillsDisplay skillsData={skillsData} />
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
              <EducationSection educationData={educationData} />
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
              <CertificationSection certificateData={certificateData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}