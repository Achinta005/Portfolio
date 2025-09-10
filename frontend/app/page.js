"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Homepage from "./Homepage/page";
import Header from "../components/Navbar";

export default function Page() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    // Set CSS custom properties for mobile viewport handling
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const handleResize = () => {
      setVH();
      if (vantaEffect) {
        vantaEffect.resize();
      }
    };

    setVH();
    window.addEventListener('resize', handleResize);

    async function loadVanta() {
      if (!window.VANTA) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
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
            scaleMobile: 0.8,
            backgroundColor: 0x0,
            points: 15.0,
            maxDistance: 8.0,
            spacing: 18.0,
          })
        );
      }
    }

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [vantaEffect]);

  return (
    <>
      {/* Add global styles for mobile viewport fix */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
        }

        #__next {
          overflow-x: hidden;
        }
      `}</style>

      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "calc(var(--vh, 1vh) * 100)",
          zIndex: -1,
          overflow: "hidden",
        }}
      />

      <div 
        style={{ 
          position: "relative", 
          zIndex: 1,
          width: "100%",
          minHeight: "calc(var(--vh, 1vh) * 100)",
          overflow: "hidden",
        }}
      >
        <Header />
        <Homepage />
      </div>
    </>
  );
}