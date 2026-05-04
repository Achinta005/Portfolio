"use client";
import { useEffect, useRef, useState } from "react";
import { scrollProgressRef } from "./scrollState";

const SECTION_BOUNDARIES = [
  { name: "Home", start: 0, end: 0.123 },
  { name: "About", start: 0.123, end: 0.198 },
  { name: "Skills", start: 0.198, end: 0.3464 },
  { name: "Projects", start: 0.3464, end: 0.4826 },
  { name: "Education", start: 0.4826, end: 0.5815 },
  { name: "Certs", start: 0.5815, end: 0.858 },
  { name: "Contact", start: 0.858, end: 1.000 },
];

const SECTION_DEG = [22, 58, 98, 149, 191, 259, 334];

const SECTION_LABELS = {
  22: "HOME",
  58: "ABOUT",
  98: "SKILLS",
  149: "PROJ",
  191: "EDU",
  259: "CERTS",
  334: "CONTACT",
};

export default function CompassRing() {
  const ringRef = useRef();
  const degRef = useRef();
  const sectionRef = useRef();
  const subRef = useRef();
  const progressRef = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ✅ add this
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let animFrame = null;
    let currentDeg = 0;
    let targetDeg = 0;
    const animate = () => {
      const offset = scrollProgressRef.current?.offset ?? 0; // ✅ still works — Lenis updates this
      const targetDeg = offset * 360;

      const found =
        SECTION_BOUNDARIES.find(s => offset >= s.start && offset < s.end) ??
        SECTION_BOUNDARIES[SECTION_BOUNDARIES.length - 1];

      if (sectionRef.current)
        sectionRef.current.textContent = found.name.toUpperCase();
      if (subRef.current)
        subRef.current.textContent = `${String(SECTION_BOUNDARIES.indexOf(found) + 1).padStart(2, "0")} · ${String(SECTION_BOUNDARIES.length).padStart(2, "0")}`;

      let diff = targetDeg - currentDeg;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      currentDeg += diff * 0.06;
      if (currentDeg < 0) currentDeg += 360;
      if (currentDeg >= 360) currentDeg -= 360;

      if (ringRef.current)
        ringRef.current.style.transform = `rotate(${currentDeg}deg)`;
      if (degRef.current)
        degRef.current.textContent = `${Math.round(currentDeg)}°`;
      if (progressRef.current) {
        const c = 2 * Math.PI * 138;
        progressRef.current.style.strokeDashoffset = c - (currentDeg / 360) * c;
      }

      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [mounted]);

  if (!mounted) return null;

  const sectionSet = new Set(SECTION_DEG);
  const midSet = new Set(
    Array.from({ length: 32 }, (_, k) => +(k * 11.25).toFixed(4)).filter(
      v => !sectionSet.has(v)
    )
  );

  const ticks = [];
  for (let i = 0; i < 360; i += 3) {
    const deg = i;
    // Check if close to any section deg (within 1.5°)
    const isSection = SECTION_DEG.some(s => Math.abs(s - deg) < 1.5);
    const isMid = !isSection && midSet.has(+(deg.toFixed(4)));
    const rad = ((deg - 90) * Math.PI) / 180;
    const outerR = 138;
    const innerR = isSection ? 110 : isMid ? 128 : 134;
    const labelR = 94;
    ticks.push({
      deg, rad,
      x1: Math.cos(rad) * outerR, y1: Math.sin(rad) * outerR,
      x2: Math.cos(rad) * innerR, y2: Math.sin(rad) * innerR,
      lx: Math.cos(rad) * labelR, ly: Math.sin(rad) * labelR,
      isSection, isMid,
      label: SECTION_DEG.find(s => Math.abs(s - deg) < 1.5),
    });
  }

  SECTION_DEG.forEach(deg => {
    const rad = ((deg - 90) * Math.PI) / 180;
    const outerR = 138;
    const labelR = 94;
    ticks.push({
      deg, rad,
      x1: Math.cos(rad) * outerR, y1: Math.sin(rad) * outerR,
      x2: Math.cos(rad) * 110, y2: Math.sin(rad) * 110,
      lx: Math.cos(rad) * labelR, ly: Math.sin(rad) * labelR,
      isSection: true, isMid: false, label: deg,
    });
  });

  const hex = (cx, cy, r, flat = false) => {
    const pts = [];
    for (let j = 0; j < 6; j++) {
      const a = ((j * 60 + (flat ? 0 : 30)) * Math.PI) / 180;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(" ");
  };

  const HEX_R = 168;
  const MID_R = 150;


  return (
    <div
      style={{
        position: "fixed",
        right: "-175px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "400px",
        height: "400px",
        zIndex: 50,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width="370"
        height="390"
        viewBox="-185 -195 370 390"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="hexBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#001628" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#000608" stopOpacity="0.95" />
          </radialGradient>
          <linearGradient id="bezelG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#00b8ff" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#7c3aed" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="needleG" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#00e5ff" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tailG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arcG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#00b8ff" />
            <stop offset="100%" stopColor="#00ffcc" />
          </linearGradient>
          <filter id="g2" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="g5" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="g14" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="hexClip">
            <polygon points={hex(0, 0, HEX_R, true)} />
          </clipPath>
        </defs>

        {/* OUTER HALO */}
        <polygon points={hex(0, 0, HEX_R + 20, true)} fill="none" stroke="#00d2ff" strokeWidth="1" opacity="0.04" filter="url(#g14)" />

        {/* HEX BODY */}
        <polygon points={hex(0, 0, HEX_R, true)} fill="url(#hexBg)" />

        {/* BEZEL */}
        <polygon points={hex(0, 0, HEX_R, true)} fill="none" stroke="url(#bezelG)" strokeWidth="2" filter="url(#g2)" />
        <polygon points={hex(0, 0, HEX_R - 5, true)} fill="none" stroke="rgba(0,210,255,0.06)" strokeWidth="1" />

        {/* CORNER GEMS */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const ang = (i * 60 * Math.PI) / 180;
          const a1 = ((i * 60 - 8) * Math.PI) / 180;
          const a2 = ((i * 60 + 8) * Math.PI) / 180;
          return (
            <g key={i}>
              <line x1={Math.cos(a1) * (HEX_R - 2)} y1={Math.sin(a1) * (HEX_R - 2)} x2={Math.cos(a1) * (HEX_R - 14)} y2={Math.sin(a1) * (HEX_R - 14)} stroke="#00d2ff" strokeWidth="1.2" opacity="0.55" filter="url(#g2)" />
              <line x1={Math.cos(a2) * (HEX_R - 2)} y1={Math.sin(a2) * (HEX_R - 2)} x2={Math.cos(a2) * (HEX_R - 14)} y2={Math.sin(a2) * (HEX_R - 14)} stroke="#00d2ff" strokeWidth="1.2" opacity="0.55" filter="url(#g2)" />
              <circle cx={Math.cos(ang) * (HEX_R - 5)} cy={Math.sin(ang) * (HEX_R - 5)} r="3" fill="#00ffcc" opacity="0.65" filter="url(#g5)" />
            </g>
          );
        })}

        {/* MID HEX RING */}
        <polygon points={hex(0, 0, MID_R, true)} fill="none" stroke="rgba(0,210,255,0.06)" strokeWidth="1" />

        {/* PROGRESS ARC TRACK */}
        <circle cx="0" cy="0" r="138" fill="none" stroke="rgba(0,210,255,0.04)" strokeWidth="5" />
        <circle
          ref={progressRef}
          cx="0" cy="0" r="138"
          fill="none" stroke="url(#arcG)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 138}`}
          strokeDashoffset={`${2 * Math.PI * 138}`}
          transform="rotate(-90)"
          filter="url(#g2)"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />

        {/* ROTATING DIAL */}
        <g ref={ringRef} style={{ transformOrigin: "0px 0px" }}>
          <circle cx="0" cy="0" r="145" fill="rgba(0,3,14,0.5)" />
          <circle cx="0" cy="0" r="145" fill="none" stroke="rgba(0,210,255,0.1)" strokeWidth="0.8" />

          {ticks.map(({ deg, x1, y1, x2, y2, lx, ly, isSection, isMid, label }) => (
            <g key={`${deg}-${label}`}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isSection ? "#00ffcc" : isMid ? "rgba(0,210,255,0.25)" : "rgba(0,210,255,0.08)"}
                strokeWidth={isSection ? 2 : isMid ? 0.8 : 0.35}
                filter={isSection ? "url(#g2)" : undefined}
              />
              {isSection && SECTION_LABELS[label] && (
                <>
                  <circle
                    cx={Math.cos(((deg - 90) * Math.PI) / 180) * 124}
                    cy={Math.sin(((deg - 90) * Math.PI) / 180) * 124}
                    r="2" fill="#00ffcc" opacity="0.9" filter="url(#g2)"
                  />
                  <text
                    x={lx} y={ly}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="#00ffcc" fontSize="6" fontWeight="700"
                    fontFamily="monospace" letterSpacing="1.5"
                    transform={`rotate(${deg}, ${lx}, ${ly})`}
                    filter="url(#g2)"
                  >
                    {SECTION_LABELS[label]}
                  </text>
                </>
              )}
            </g>
          ))}
        </g>

        {/* STATIC NEEDLE */}
        <rect x="5" y="-1.2" width="36" height="2.4" rx="1.2" fill="url(#tailG)" />
        <polygon points="-138,0 -3,-2.8 2,0 -3,2.8" fill="url(#needleG)" filter="url(#g5)" />

        {/* INNER FACE */}
        <circle cx="0" cy="0" r="55" fill="rgba(0,6,18,0.92)" />
        <circle cx="0" cy="0" r="55" fill="none" stroke="rgba(0,210,255,0.18)" strokeWidth="1" filter="url(#g2)" />
        <circle cx="0" cy="0" r="49" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="0.6" />
        <polygon points={hex(0, 0, 40, true)} fill="none" stroke="rgba(0,210,255,0.07)" strokeWidth="0.8" />

        {[0, 90, 180, 270].map((a) => {
          const r = ((a - 90) * Math.PI) / 180;
          return <line key={a} x1={Math.cos(r) * 55} y1={Math.sin(r) * 55} x2={Math.cos(r) * 47} y2={Math.sin(r) * 47} stroke="rgba(0,210,255,0.4)" strokeWidth="1" />;
        })}

        <text ref={sectionRef} x="0" y="6" textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="700" fill="#00ffcc" filter="url(#g5)">HOME</text>
        <text ref={degRef} x="0" y="22" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="rgba(0,210,255,0.4)" letterSpacing="3">0°</text>
      </svg>
    </div>
  );
}