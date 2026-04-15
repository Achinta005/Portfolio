"use client";
import { useState, useEffect } from "react";

const BOOT_STEPS = [
  {
    line: "> SCANNING IDENTITY................",
    lottie: "Lottifiles/face.json",
    color: "#00ffcc",
  },
  {
    line: "> LOADING SKILL MATRIX..............OK",
    lottie: "Lottifiles/code.json", // code typing
    color: "#00b8ff",
  },
  {
    line: "> MAPPING PROJECT NODES.............OK",
    lottie: "Lottifiles/network.json", // network graph
    color: "#a78bfa",
  },
  {
    line: "> CALIBRATING COMPASS...............OK",
    lottie: "Lottifiles/radar.json", // radar sweep
    color: "#f472b6",
  },
  {
    line: "> SYSTEM READY ✓",
    lottie: "Lottifiles/success.json", // success checkmark
    color: "#00ffcc",
    isLast: true,
  },
];

export default function BootOverlay({ onDone }) {
  const [currentStep, setCurrentStep] = useState(0); // which step is animating
  const [completedLines, setCompletedLines] = useState([]); // lines already done
  const [visible, setVisible] = useState(true);
  const [playerLoaded, setPlayerLoaded] = useState(false);

  // Load lottie-player once
  useEffect(() => {
    if (!customElements.get("lottie-player")) {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      s.onload = () => setPlayerLoaded(true);
      document.head.appendChild(s);
    } else {
      setPlayerLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!playerLoaded) return;

    let step = 0;

    const advance = () => {
      if (step >= BOOT_STEPS.length) return;

      const current = BOOT_STEPS[step];
      setCurrentStep(step);

      // After animation plays (~1.2s), commit line and move on
      setTimeout(() => {
        setCompletedLines((prev) => [...prev, current]);
        step++;

        if (step >= BOOT_STEPS.length) {
          // All done — fade out
          setTimeout(() => {
            setVisible(false);
            onDone();
          }, 600);
        } else {
          setTimeout(advance, 200); // brief pause between steps
        }
      }, step === BOOT_STEPS.length - 1 ? 1800 : 1100); // last step lingers longer
    };

    advance();
  }, [playerLoaded]);

  if (!visible) return null;

  const activeStep = BOOT_STEPS[currentStep];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "#030712",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "32px",
      transition: "opacity 0.5s ease",
    }}>

      {/* ── Lottie animation for current step ── */}
      <div style={{
        width: 160,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: `drop-shadow(0 0 24px ${activeStep.color}88)`,
        transition: "filter 0.4s ease",
      }}>
        {playerLoaded && (
          <lottie-player
            key={currentStep} // remount on each step change
            src={activeStep.lottie}
            background="transparent"
            speed="1"
            style={{ width: "160px", height: "160px" }}
            autoplay
          />
        )}
      </div>

      {/* ── Terminal lines ── */}
      <div style={{
        fontFamily: "monospace",
        fontSize: "0.88rem",
        lineHeight: 2,
        minWidth: "340px",
      }}>
        {/* Completed lines — static, muted */}
        {completedLines.map((step, i) => (
          <div key={i} style={{
            color: "#334155",
            textShadow: "none",
          }}>
            {step.line}
          </div>
        ))}

        {/* Active line — glowing, typing in */}
        <div style={{
          color: activeStep.color,
          textShadow: `0 0 10px ${activeStep.color}99`,
          animation: "fadeInLine 0.25s ease forwards",
        }}>
          {activeStep.line}
          {/* blinking cursor */}
          <span style={{
            display: "inline-block",
            width: "9px",
            height: "1.1em",
            background: activeStep.color,
            marginLeft: "4px",
            animation: "blink 0.7s step-end infinite",
            verticalAlign: "middle",
            boxShadow: `0 0 8px ${activeStep.color}cc`,
          }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}