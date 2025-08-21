"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Navbar";
import useIsMobile from "@/components/useIsMobile";
import AboutHero from "./AboutHero";
import EducationSection from "./EducationSection";
import CertificationSection from "./CertificationSection";
import InteractiveSkillsDisplay from "./InteractiveSkillsDisplay";
import AboutHeroMobile from "./AboutHeroMobile";
import InteractiveDisplayMobile from "./InteractiveDisplayMobile";
import EducationSectionMobile from "./EducationSectionMobile";
import CertificationSectionMobile from "./CertificationSectionMobile";

export default function About() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

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
  const isMobile = useIsMobile(1024); //Defining brek point for mobile
  return isMobile?(
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
        <Header/>
      </div>
    </>
  ): (
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
        <AboutHero />
        <InteractiveSkillsDisplay />
        <EducationSection />
        <CertificationSection />
        <Header/>
      </div>
    </>
  );
}
