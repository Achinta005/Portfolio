"use client";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import SceneContent from "../sections/SceneContent";
import CompassRing from "../components/ImmersiveView/CompassRing";
import BootOverlay from "../components/ImmersiveView/BootOverlay";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { scrollProgressRef, SECTION_OFFSETS } from "../components/ImmersiveView/scrollState";


const PdfModal = dynamic(() => import("../utils/PdfModal"), {
  ssr: false,
});

function ScrollWatcher() {
  const scroll = useScroll();

  useFrame(() => {
    // Register el once
    if (!window.__scrollEl && scroll?.el) {
      window.__scrollEl = scroll.el;
      console.log("[ScrollWatcher] el registered ✅");
    }

    // Update global scroll progress
    scrollProgressRef.current.offset = scroll.offset;

    // Update URL hash
    const found = Object.entries(SECTION_OFFSETS)
      .reverse()
      .find(([, start]) => scroll.offset >= start);

    if (found) {
      const newHash = "#" + found[0];
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash);
      }
    }
  });

  return null;
}

export default function Scene() {
  const [bootDone, setBootDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenPdf = () => {
    if (pdfUrl) {
      setIsModalOpen(true);
      return;
    }
    setPdfUrl(
      "https://drive.google.com/file/d/1WNeyAoiHDn_zRkJX-pKGPHA10hbJLAxN/view?usp=sharing",
    );
    setIsModalOpen(true);
  };

  const handleClosePdf = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <style>{`
        @keyframes scanDown {
          0%   { top: calc(50% - 32px); opacity: 0; }
          20%  { opacity: 1; }
          100% { top: calc(50% + 30px); opacity: 0; }
        }
        @keyframes bracketPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(0,255,200,0.5); }
          50%       { box-shadow: 0 0 18px rgba(0,255,200,0.9), 0 0 40px rgba(0,255,200,0.3); }
        }
        @keyframes fadeInLine { to { opacity: 1; } }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      <CompassRing />
      {!bootDone && <BootOverlay onDone={() => setBootDone(true)} />}

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PdfModal pdfUrl={pdfUrl} onClose={handleClosePdf} />
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#030712")}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} color="#00d2ff" intensity={0.5} />
        <pointLight position={[5, -5, 5]} color="#7c3aed" intensity={0.5} />
        <ScrollControls pages={6} damping={0.1}>
          {" "}
          <ScrollWatcher />
          <SceneContent bootDone={bootDone} onOpenPdf={handleOpenPdf}/>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
