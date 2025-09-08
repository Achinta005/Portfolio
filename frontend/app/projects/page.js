"use client";

import Header from "../../components/Navbar";
import ProjectsHero from "./ProjectsHero";
import ProjectsGrid from "./ProjectsGrid";
import { use, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useIsMobile from "@/components/useIsMobile";
import { ExpandableCardDemo } from "./projectMobile";
import { motion } from "framer-motion";

const generateLineStyles = () =>
  Array.from({ length: 20 }, () => ({
    style: {
      width: `${Math.random() * 200 + 100}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 180}deg`,
    },
    transition: {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 2,
    },
  }));
const generateParticleStyles = () =>
  Array.from({ length: 15 }, () => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    },
    transition: {
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 3,
    },
  }));

export default function Projects() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [lineStyles, setLineStyles] = useState([]);
  const [particleStyles, setParticleStyles] = useState([]);

  // Generate styles client-side only
  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);
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
        <ProjectsHero />
        <ExpandableCardDemo />
        <Header />
      </div>
    </>
  ) : (
    <div
      style={{ position: "relative", zIndex: 1 }}
      className="overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900"
    >
      <div className="hidden lg:block absolute inset-0 overflow-hidden">
        {lineStyles.map((item, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-transparent via-purple-400/20 to-transparent h-px"
            style={item.style}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0],
            }}
            transition={item.transition}
          />
        ))}
      </div>
      <div className="hidden lg:block absolute inset-0">
        {particleStyles.map((item, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={item.style}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={item.transition}
          />
        ))}
      </div>
      <Header />
      <ProjectsHero />
      <ProjectsGrid />
    </div>
  );
}
