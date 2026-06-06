"use client";
import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { motion, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { scrollProgressRef } from "../../../components/ImmersiveView/scrollState";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState";
import useIsMobile from "../../../utils/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

const WAVE_START = 0.18;
const WAVE_END = 0.35;

const SKILLS = [
  { id: "javascript", glb: "/Skills/js-logo.glb", color: "#f7df1e", scale: 0.5 },
  { id: "typescript", glb: "/Skills/ts-logo.glb", color: "#3178c6", scale: 0.5 },
  { id: "python", glb: "/Skills/python.glb", color: "#3776ab", scale: 0.5 },
  { id: "java", glb: "/Skills/java.glb", color: "#ed8b00", scale: 0.5 },
  { id: "cpp", glb: "/Skills/cpp-logo.glb", color: "#00599c", scale: 0.5 },
  { id: "react", glb: "/Skills/react_logo.glb", color: "#61dafb", scale: 0.4 },
  { id: "nextjs", glb: "/Skills/icons8-nextjs-480.png", color: "#ffffff", scale: 1.0 },
  { id: "nestjs", glb: "/Skills/logo-small-gradient.0ed287ce.png", color: "#e0234e", scale: 0.5 },
  { id: "nodejs", glb: "/Skills/node-js-logo.glb", color: "#339933", scale: 0.5 },
  { id: "tailwind", glb: "/Skills/tailwind_css_logo__3d_model.glb", color: "#06b6d4", scale: 0.5 },
  { id: "docker", glb: "/Skills/docker-logo.glb", color: "#2496ed", scale: 0.5 },
  { id: "mongodb", glb: "/Skills/mongodb-logo.glb", color: "#47a248", scale: 0.5 },
  { id: "postgres", glb: "/Skills/icons8-postgres-480.png", color: "#336791", scale: 0.5 },
  { id: "mysql", glb: "/Skills/mysql-database.png", color: "#4479a1", scale: 0.5 },
  { id: "tensorflow", glb: "/Skills/tensor-flow.png", color: "#ff6f00", scale: 0.5 },
  { id: "github", glb: "/Skills/3d_github_logo.glb", color: "#ffffff", scale: 0.5 },
];

// Emoji fallback for GLB models on mobile (shown when PNG not available)
const GLB_EMOJI = {
  javascript: "⚡",
  typescript: "🔷",
  python: "🐍",
  java: "☕",
  cpp: "⚙️",
  react: "⚛️",
  nodejs: "🟢",
  tailwind: "🌊",
  docker: "🐳",
  mongodb: "🍃",
  github: "🐙",
};

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function makeLane(index) {
  const rand = seededRand(index * 6271 + 9001);
  const side = index % 2 === 0 ? 1 : -1;
  return {
    startX: (rand() - 0.5) * 20, startY: (rand() - 0.5) * 10, startZ: -30 - rand() * 15,
    midX: side * (2 + rand() * 3), midY: (rand() - 0.5) * 4, midZ: -4,
    exitX: side * (18 + rand() * 10), exitY: (rand() - 0.5) * 8, exitZ: 5 + rand() * 3,
    delay: rand() * 0.50,
    spinSpeed: 0.006 + rand() * 0.012,
    spinAxis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
    side,
  };
}

const LANES = SKILLS.map((_, i) => makeLane(i));

function bezier3(p0, p1, p2, t) {
  const mt = 1 - t;
  return p0 * mt * mt + p1 * 2 * mt * t + p2 * t * t;
}

function normalizeBoundingBox(object, targetSize = 1.5, modelScale = 0.5) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxAxis = Math.max(size.x, size.y, size.z);
  if (maxAxis === 0) return;
  object.scale.setScalar((targetSize / maxAxis) * modelScale);
}

function isPNG(path) { return /\.(png|jpg|jpeg|webp)$/i.test(path); }

function FallbackLogo({ color }) {
  return (
    <mesh>
      <boxGeometry args={[2.0, 2.0, 0.28]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.25} metalness={0.7} />
    </mesh>
  );
}

function SkillPNG({ url, color, modelScale }) {
  const texture = useTexture(url);
  const size = 2.0 * (modelScale ?? 1.0);
  return (
    <mesh>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.05} emissive={color} emissiveIntensity={0.3} roughness={0.3} metalness={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SkillGLB({ glb, color, modelScale }) {
  if (isPNG(glb)) return <SkillPNG url={glb} color={color} modelScale={modelScale} />;
  let scene;
  try {
    ({ scene } = useGLTF(glb));
  } catch {
    return <FallbackLogo color={color} />;
  }
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color(color);
        child.material.emissiveIntensity = 0.45;
      }
    });
    normalizeBoundingBox(c, 1.5, modelScale);
    return c;
  }, [scene, color, modelScale]);
  return <primitive object={cloned} />;
}

function SkillIcon({ skill, lane }) {
  const groupRef = useRef();
  const rotRef = useRef(0);
  const materialsRef = useRef(null);
  const opacityMV = useMotionValue(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const raw = scrollProgressRef.current?.offset ?? 0;
    const sectionT = THREE.MathUtils.clamp((raw - WAVE_START) / (WAVE_END - WAVE_START), 0, 1);
    if (sectionT <= 0 || sectionT >= 1) { groupRef.current.visible = false; opacityMV.set(0); return; }
    groupRef.current.visible = true;
    const t = THREE.MathUtils.clamp((sectionT - lane.delay) / (1 - lane.delay), 0, 1);
    groupRef.current.position.set(bezier3(lane.startX, lane.midX, lane.exitX, t), bezier3(lane.startY, lane.midY, lane.exitY, t), bezier3(lane.startZ, lane.midZ, lane.exitZ, t));
    const scaleCurve = Math.sin(Math.min(t, 0.85) * Math.PI);
    groupRef.current.scale.setScalar(Math.max(0.01, 0.6 + scaleCurve * 2.8));
    const fadeIn = Math.min(t / 0.12, 1);
    const fadeOut = t > 0.72 ? Math.max(0, 1 - (t - 0.72) / 0.28) : 1;
    const opacity = fadeIn * fadeOut;
    opacityMV.set(opacity);
    if (!materialsRef.current) {
      const mats = [];
      groupRef.current.traverse((child) => { if (child.isMesh && child.material) { child.material.transparent = true; mats.push(child.material); } });
      materialsRef.current = mats;
    }
    for (let k = 0; k < materialsRef.current.length; k++) materialsRef.current[k].opacity = opacity;
    rotRef.current += lane.spinSpeed;
    groupRef.current.setRotationFromAxisAngle(lane.spinAxis, rotRef.current);
  });

  useEffect(() => {
    const unsub = opacityMV.on("change", (v) => {
      if (v > 0.05 && groupRef.current) {
        gsap.fromTo(groupRef.current.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: 0.55, ease: "back.out(1.7)", overwrite: "auto" });
        unsub();
      }
    });
    return unsub;
  }, [opacityMV]);

  return (
    <group ref={groupRef} visible={false}>
      <Suspense fallback={<FallbackLogo color={skill.color} />}>
        <SkillGLB glb={skill.glb} color={skill.color} modelScale={skill.scale} />
      </Suspense>
      <pointLight color={skill.color} intensity={1.2} distance={6} decay={2} />
    </group>
  );
}

function SkillsScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 8, 4]} intensity={0.9} color="#00d2ff" />
      <directionalLight position={[-8, -4, 4]} intensity={0.4} color="#7c3aed" />
      {SKILLS.map((skill, i) => <SkillIcon key={skill.id} skill={skill} lane={LANES[i]} />)}
    </>
  );
}

// ── Mobile static grid ────────────────────────────────────────────────────────
function MobileSkillsGrid({ visible }) {
  return (
    <div style={{
      width: "100%",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "0 16px",
      boxSizing: "border-box",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "10px",
        width: "100%",
        maxWidth: "380px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}>
        {SKILLS.map((skill) => {
          const isPng = /\.(png|jpg|jpeg|webp)$/i.test(skill.glb);
          const emoji = GLB_EMOJI[skill.id];
          return (
            <div key={skill.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              <div style={{
                width: "56px", height: "56px",
                borderRadius: "14px",
                border: `1px solid ${skill.color}40`,
                background: "rgba(0,8,24,0.85)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 18px ${skill.color}20, inset 0 1px 0 ${skill.color}15`,
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Subtle corner accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: 10, height: 10,
                  borderTop: `1px solid ${skill.color}60`, borderLeft: `1px solid ${skill.color}60`,
                  borderRadius: "14px 0 0 0", pointerEvents: "none",
                }} />
                {isPng ? (
                  <img
                    src={skill.glb}
                    alt={skill.id}
                    loading="lazy"
                    decoding="async"
                    style={{ width: 34, height: 34, objectFit: "contain" }}
                  />
                ) : emoji ? (
                  // Emoji for GLB files — colored glow
                  <span style={{
                    fontSize: "1.7rem",
                    lineHeight: 1,
                    filter: `drop-shadow(0 0 8px ${skill.color}cc)`,
                  }}>
                    {emoji}
                  </span>
                ) : (
                  // Final fallback: colored orb
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 35%, ${skill.color}cc, ${skill.color}44)`,
                    boxShadow: `0 0 12px ${skill.color}80`,
                  }} />
                )}
              </div>
              <span style={{
                fontFamily: "monospace",
                fontSize: "0.48rem",
                color: `${skill.color}bb`,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                textAlign: "center",
                lineHeight: 1.2,
                maxWidth: "56px",
                wordBreak: "break-word",
              }}>{skill.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsHTML() {
  const isMobile = useIsMobile();
  const [hydrated, setHydrated] = useState(false);
  const wrapRef = useRef();
  const labelRef = useRef();
  const [mobileVisible, setMobileVisible] = useState(false);

  // ── KEY FIX: use ResizeObserver instead of one-shot measure ──────────────
  // About section grows asynchronously as GitHub data loads in, so we need
  // to re-measure whenever its height changes.
  const [aboutBottom, setAboutBottom] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isMobile || !hydrated) return;

    const measure = () => {
      const el = document.getElementById("About");
      if (!el) return;
      // offsetTop + offsetHeight gives the absolute bottom of About
      setAboutBottom(el.offsetTop + el.offsetHeight);
    };

    measure();

    const el = document.getElementById("About");
    if (!el) return;

    // ResizeObserver fires whenever About's height changes (data loads, fonts shift, etc.)
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Also listen for window resize (orientation change, etc.)
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile, hydrated]);

  const visibilityMV = useMotionValue(0);

  useEffect(() => {
    return subscribeToScroll((offset) => {
      const sectionT = Math.max(0, Math.min(1, (offset - WAVE_START) / (WAVE_END - WAVE_START)));
      visibilityMV.set(sectionT);
      if (isMobile) {
        setMobileVisible(sectionT > 0.05 && sectionT < 0.95);
      }
    });
  }, [visibilityMV, isMobile]);

  useEffect(() => {
    const unsub = visibilityMV.on("change", (v) => {
      if (!wrapRef.current) return;
      const fadeIn = Math.min(v / 0.08, 1);
      const fadeOut = v > 0.92 ? Math.max(0, 1 - (v - 0.92) / 0.08) : 1;
      const alpha = fadeIn * fadeOut;
      gsap.set(wrapRef.current, { opacity: alpha, scale: isMobile ? 1 : (0.94 + alpha * 0.06) });
    });
    return unsub;
  }, [visibilityMV, isMobile]);

  useEffect(() => {
    const unsub = visibilityMV.on("change", (v) => {
      if (!labelRef.current) return;
      const show = v > 0.05 && v < 0.95;
      labelRef.current.style.opacity = show ? "1" : "0";
      labelRef.current.style.transform = show ? "translateY(0)" : "translateY(12px)";
    });
    return unsub;
  }, [visibilityMV]);

  if (!hydrated) return null;

  // ── Mobile positioning ────────────────────────────────────────────────────
  // Skills must sit exactly below the About section's actual rendered bottom.
  // We use the live-measured aboutBottom (absolute px from page top).
  // If not yet measured, render off-screen until measurement is ready.
  const mobileTopStyle = isMobile
    ? (aboutBottom > 0 ? `${aboutBottom}px` : "-9999px")
    : undefined;

  // Desktop positioning unchanged: percentage-based on scroll
  const desktopTopStyle = `${WAVE_START * 1000 + 75}vh`;

  return (
    <div
      id="Skills"
      style={{
        position: "absolute",
        top: isMobile ? mobileTopStyle : desktopTopStyle,
        left: 0,
        width: "100vw",
        height: isMobile ? "auto" : "100vh",
        minHeight: isMobile ? "auto" : "100vh",
        pointerEvents: "none",
        zIndex: 1,
        // Add bottom padding on mobile so the section below has breathing room
        paddingBottom: isMobile ? "40px" : "0",
        boxSizing: "border-box",
        overflow: isMobile ? "hidden" : "visible",
      }}
    >
      {/* ── Section label ─────────────────────────────────────────────────── */}
      <div
        ref={labelRef}
        style={{
          position: isMobile ? "relative" : "absolute",
          top: isMobile ? undefined : "8vh",
          left: isMobile ? undefined : "45%",
          transform: isMobile ? undefined : "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          opacity: 0,
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: "none",
          padding: isMobile ? "20px 16px 14px" : "0",
          justifyContent: isMobile ? "flex-start" : undefined,
        }}
      >
        <div style={{ width: 3, height: 22, background: "linear-gradient(#00ffcc,#7c3aed)", borderRadius: 2, flexShrink: 0 }} />
        <span style={{
          fontFamily: "monospace",
          fontSize: "clamp(0.62rem,2vw,0.72rem)",
          color: "#00ffcc",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}>
          02 · Skills
        </span>
      </div>

      {/* ── Content area ──────────────────────────────────────────────────── */}
      <div
        ref={wrapRef}
        style={{
          position: isMobile ? "relative" : "absolute",
          inset: isMobile ? undefined : 0,
          opacity: 0,
          width: "100%",
        }}
      >
        {isMobile ? (
          <MobileSkillsGrid visible={mobileVisible} />
        ) : (
          <Canvas
            camera={{ position: [0, 0, 14], fov: 50 }}
            style={{ width: "100%", height: "100%" }}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
          >
            <SkillsScene />
          </Canvas>
        )}
      </div>
    </div>
  );
}