"use client";
import { motion } from "framer-motion";

const SectionIndicators = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
  ];

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4">
      {sections.map((section, index) => (
        <div key={section.id} className="relative group">
          {/* Tooltip */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {section.label}
          </div>
          
          {/* Indicator Dot */}
          <button
            onClick={() => onSectionChange(section.id)}
            className="relative w-3 h-3 rounded-full border-2 border-white/40 hover:border-white/80 transition-colors duration-300"
          >
            {/* Active dot fill */}
            <motion.div
              initial={false}
              animate={{
                scale: activeSection === section.id ? 1 : 0,
                opacity: activeSection === section.id ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"
            />
            
            {/* Glow effect for active state */}
            {activeSection === section.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-sm scale-150"
              />
            )}
          </button>
        </div>
      ))}
      
      {/* Keyboard hint */}
      <div className="mt-8 text-white/40 text-xs text-center">
        <div>← → keys</div>
        <div>to navigate</div>
      </div>
    </div>
  );
};

export default SectionIndicators;