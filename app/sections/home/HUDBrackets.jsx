"use client";
import { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";
import { scrollProgressRef } from "../../../components/ImmersiveView/scrollState";

// ── Framer Motion variants ──────────────────────────────────────────────────
const bracketVariants = {
  hidden:   { scaleX: 1.25, opacity: 0 },
  visible:  {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.8 },
  },
};

const scanVariants = {
  hidden:   { scaleX: 0, opacity: 0 },
  visible:  {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.8 },
  },
};

// ── Single bracket bar (left or right) ─────────────────────────────────────
function Bracket({ side }) {
  const isLeft = side === "left";
  return (
    <motion.div
      variants={bracketVariants}
      style={{
        position:    "absolute",
        top:         "50%",
        [side]:      "-14px",
        translateY:  "-50%",
        width:       "10px",
        height:      "48px",
        borderTop:   "2px solid #00ffcc",
        borderBottom:"2px solid #00ffcc",
        [isLeft ? "borderLeft" : "borderRight"]: "2px solid #00ffcc",
        borderRadius: isLeft ? "2px 0 0 2px" : "0 2px 2px 0",
        boxShadow:   "0 0 8px rgba(0,255,200,0.5)",
      }}
    />
  );
}

// ── Component ───────────────────────────────────────────────────────────────
export default function HUDBrackets() {
  const wrapRef    = useRef();
  const scanRef    = useRef();
  const controls   = useAnimation();
  const rafRef     = useRef();

  // ── Framer Motion: entrance on mount ──
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  // ── GSAP: animate scan line downward after reveal ──
  useEffect(() => {
    if (!scanRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        scanRef.current,
        { top: "0%", opacity: 0 },
        {
          top:      "100%",
          opacity:  1,
          duration: 1.4,
          ease:     "power2.inOut",
          delay:    1.8,
          onComplete: () => {
            gsap.to(scanRef.current, { opacity: 0, duration: 0.3 });
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // ── Lenis scroll: fade out brackets as user scrolls ──
  useEffect(() => {
    const tick = () => {
      const o = scrollProgressRef.current?.offset ?? 0;
      if (wrapRef.current) {
        // smooth fade 0.04 → 0.10 scroll offset
        const fade = o > 0.04 ? Math.max(0, 1 - (o - 0.04) / 0.06) : null;
        if (fade !== null) {
          wrapRef.current.style.opacity = fade;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      initial="hidden"
      animate={controls}
      style={{
        position:      "absolute",
        inset:         0,
        pointerEvents: "none",
      }}
    >
      {/* Left bracket */}
      <Bracket side="left" />

      {/* Right bracket */}
      <Bracket side="right" />

      {/* Scan line — GSAP animates top 0%→100% */}
      <div
        ref={scanRef}
        style={{
          position:   "absolute",
          left:       0,
          width:      "100%",
          height:     "1px",
          background: "linear-gradient(90deg,transparent,rgba(0,255,200,0.7),transparent)",
          opacity:    0,
          top:        "0%",
        }}
      />

      {/* Corner glows — pure Framer Motion pulse */}
      {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((corner) => {
        const isTop    = corner.startsWith("top");
        const isLeft   = corner.endsWith("Left");
        return (
          <motion.div
            key={corner}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.1, 0.8] }}
            transition={{
              duration: 2.4,
              repeat:   Infinity,
              ease:     "easeInOut",
              delay:    2.6 + (isLeft ? 0 : 0.4) + (isTop ? 0 : 0.8),
            }}
            style={{
              position:     "absolute",
              [isTop    ? "top"    : "bottom"]: "-2px",
              [isLeft   ? "left"   : "right" ]: "-2px",
              width:        "6px",
              height:       "6px",
              borderRadius: "50%",
              background:   "#00ffcc",
              boxShadow:    "0 0 8px 2px #00ffcc",
            }}
          />
        );
      })}
    </motion.div>
  );
}