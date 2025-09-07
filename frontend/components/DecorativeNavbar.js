"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DecorativeNavbar = ({ onSectionChange, activeSection = "about" }) => {
  const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
  ];

  const handleNavClick = (sectionId) => {
    console.log('Navbar clicked:', sectionId);
    
    if (onSectionChange) {
      onSectionChange(sectionId);
    } else {
      console.warn('onSectionChange prop is missing');
    }
  };

  return (
    <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50">
      {/* Glassmorphism Container */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-3 shadow-2xl">
        <div className="flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative group px-4 py-2 text-white/80 hover:text-white transition-colors duration-300 font-medium text-sm"
            >
              {/* Text */}
              <span className="relative z-10">{item.label}</span>
              
              {/* Hover Background */}
              <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Active/Hover Gradient Glow Line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: activeSection === item.id ? 1 : 0,
                  opacity: activeSection === item.id ? 1 : 0
                }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full origin-left"
              />
              
              {/* Extra glow effect for active state */}
              {activeSection === item.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-sm"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DecorativeNavbar;