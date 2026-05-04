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

gsap.registerPlugin(ScrollTrigger);

// ── Scroll config ─────────────────────────────────────────────────────────────
const TOTAL_PAGES = 7;
const WAVE_START = 0.15;  // ≈ 0.286 — starts right after About
const WAVE_END = 0.35;  // ≈ 0.429

// ── Skills ────────────────────────────────────────────────────────────────────
const SKILLS = [
  { id: "javascript", glb: "/Skills/js-logo.glb", color: "#f7df1e", scale: 0.5 },
  { id: "typescript", glb: "/Skills/ts-logo.glb", color: "#3178c6", scale:  0.5 },
  { id: "python", glb: "/Skills/python.glb", color: "#3776ab", scale:  0.5 },
  { id: "java", glb: "/Skills/java.glb", color: "#ed8b00", scale:  0.5 },
  { id: "cpp", glb: "/Skills/cpp-logo.glb", color: "#00599c", scale:  0.5 },
  { id: "react", glb: "/Skills/react_logo.glb", color: "#61dafb", scale: 0.4 },
  { id: "nextjs", glb: "/Skills/icons8-nextjs-480.png", color: "#ffffff", scale:  1.0 },
  { id: "nestjs", glb: "/Skills/logo-small-gradient.0ed287ce.png", color: "#e0234e", scale: 0.5 },
  { id: "nodejs", glb: "/Skills/node-js-logo.glb", color: "#339933", scale:  0.5 },
  { id: "tailwind", glb: "/Skills/tailwind_css_logo__3d_model.glb", color: "#06b6d4", scale: 0.5},
  { id: "docker", glb: "/Skills/docker-logo.glb", color: "#2496ed", scale:  0.5 },
  { id: "mongodb", glb: "/Skills/mongodb-logo.glb", color: "#47a248", scale:  0.5 },
  { id: "postgres", glb: "/Skills/icons8-postgres-480.png", color: "#336791", scale:  0.5 },
  { id: "mysql", glb: "/Skills/mysql-database.png", color: "#4479a1", scale:  0.5 },
  { id: "tensorflow", glb: "/Skills/tensor-flow.png", color: "#ff6f00", scale:  0.5 },
  { id: "github", glb: "/Skills/3d_github_logo.glb", color: "#000000", scale: 0.5 },
];

// ── Seeded random ─────────────────────────────────────────────────────────────
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Lane data ─────────────────────────────────────────────────────────────────
function makeLane(index) {
  const rand = seededRand(index * 6271 + 9001);
  const side = index % 2 === 0 ? 1 : -1;
  return {
    startX: (rand() - 0.5) * 20,
    startY: (rand() - 0.5) * 10,
    startZ: -30 - rand() * 15,
    midX: side * (2 + rand() * 3),
    midY: (rand() - 0.5) * 4,
    midZ: -4,
    exitX: side * (18 + rand() * 10),
    exitY: (rand() - 0.5) * 8,
    exitZ: 5 + rand() * 3,
    delay: rand() * 0.50,
    spinSpeed: 0.006 + rand() * 0.012,
    spinAxis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
    side,
  };
}

const LANES = SKILLS.map((_, i) => makeLane(i));

// ── Bezier ────────────────────────────────────────────────────────────────────
function bezier3(p0, p1, p2, t) {
  const mt = 1 - t;
  return p0 * mt * mt + p1 * 2 * mt * t + p2 * t * t;
}

// ── Normalize bounding box ────────────────────────────────────────────────────
function normalizeBoundingBox(object, targetSize = 1.5, modelScale = 0.5) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxAxis = Math.max(size.x, size.y, size.z);
  if (maxAxis === 0) return;
  object.scale.setScalar((targetSize / maxAxis) * modelScale);
}

function isPNG(path) { return /\.(png|jpg|jpeg|webp)$/i.test(path); }

// ── Fallback box ──────────────────────────────────────────────────────────────
function FallbackLogo({ color }) {
  return (
    <mesh>
      <boxGeometry args={[2.0, 2.0, 0.28]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.25} metalness={0.7} />
    </mesh>
  );
}

// ── PNG icon ──────────────────────────────────────────────────────────────────
function SkillPNG({ url, color, modelScale }) {
  const texture = useTexture(url);
  const size = 2.0 * (modelScale ?? 1.0);
  return (
    <mesh>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        map={texture} transparent alphaTest={0.05}
        emissive={color} emissiveIntensity={0.3}
        roughness={0.3} metalness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── GLB icon ──────────────────────────────────────────────────────────────────
function SkillGLB({ glb, color, modelScale }) {
  if (isPNG(glb)) return <SkillPNG url={glb} color={color} modelScale={modelScale} />;

  let scene;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ({ scene } = useGLTF(glb));
  } catch {
    return <FallbackLogo color={color} />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color(color);
        child.material.emissiveIntensity = 0.45;
        child.castShadow = false;
      }
    });
    normalizeBoundingBox(c, 1.5, modelScale);
    return c;
  }, [scene, color, modelScale]);

  return <primitive object={cloned} />;
}

// ── Animated icon — Lenis scroll → position/scale, GSAP → spin entrance ──────
function SkillIcon({ skill, lane }) {
  const groupRef = useRef();
  const rotRef = useRef(0);
  // Framer Motion value: opacity driven by scroll, read in useFrame
  const opacityMV = useMotionValue(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const raw = scrollProgressRef.current?.offset ?? 0;           // Lenis-fed
    const sectionT = THREE.MathUtils.clamp(
      (raw - WAVE_START) / (WAVE_END - WAVE_START), 0, 1
    );

    if (sectionT <= 0 || sectionT >= 1) {
      groupRef.current.visible = false;
      opacityMV.set(0);
      return;
    }
    groupRef.current.visible = true;

    const t = THREE.MathUtils.clamp((sectionT - lane.delay) / (1 - lane.delay), 0, 1);

    // Position via Bezier (Lenis drives sectionT)
    groupRef.current.position.set(
      bezier3(lane.startX, lane.midX, lane.exitX, t),
      bezier3(lane.startY, lane.midY, lane.exitY, t),
      bezier3(lane.startZ, lane.midZ, lane.exitZ, t),
    );

    // Scale
    const scaleCurve = Math.sin(Math.min(t, 0.85) * Math.PI);
    groupRef.current.scale.setScalar(Math.max(0.01, 0.6 + scaleCurve * 2.8));

    // Opacity → push into Framer Motion value
    const fadeIn = Math.min(t / 0.12, 1);
    const fadeOut = t > 0.72 ? Math.max(0, 1 - (t - 0.72) / 0.28) : 1;
    const opacity = fadeIn * fadeOut;
    opacityMV.set(opacity);
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });

    // Rotation — continuous spin (GSAP entrance kicks scale, this maintains spin)
    rotRef.current += lane.spinSpeed;
    groupRef.current.setRotationFromAxisAngle(lane.spinAxis, rotRef.current);
  });

  // GSAP: punch-in scale when icon first becomes visible
  useEffect(() => {
    const unsub = opacityMV.on("change", (v) => {
      if (v > 0.05 && groupRef.current) {
        // One-shot scale punch via GSAP
        gsap.fromTo(
          groupRef.current.scale,
          { x: 0.01, y: 0.01, z: 0.01 },
          { x: 1, y: 1, z: 1, duration: 0.55, ease: "back.out(1.7)", overwrite: "auto" }
        );
        unsub(); // fire once
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

// ── Lights ────────────────────────────────────────────────────────────────────
function SkillsLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 8, 4]} intensity={0.9} color="#00d2ff" />
      <directionalLight position={[-8, -4, 4]} intensity={0.4} color="#7c3aed" />
    </>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function SkillsScene() {
  return (
    <>
      <SkillsLights />
      {SKILLS.map((skill, i) => (
        <SkillIcon key={skill.id} skill={skill} lane={LANES[i]} />
      ))}
    </>
  );
}

// ── HTML wrapper — GSAP ScrollTrigger fades canvas in/out ─────────────────────
export default function SkillsHTML() {
  const wrapRef = useRef();
  const labelRef = useRef();
  const [canvasActive, setCanvasActive] = useState(false);

  // Framer Motion value: section visibility (0→1→0) from Lenis scroll
  const visibilityMV = useMotionValue(0);

  // ── Lenis RAF → visibilityMV ──
  useEffect(() => {
    return subscribeToScroll((offset) => {
      const sectionT = Math.max(0, Math.min(1,
        (offset - WAVE_START) / (WAVE_END - WAVE_START)
      ));
      visibilityMV.set(sectionT);
      setCanvasActive(sectionT > 0 && sectionT < 1);  // mount/unmount canvas
    });
  }, [visibilityMV]);

  // ── GSAP: fade + scale canvas wrapper based on visibilityMV ──
  useEffect(() => {
    const unsub = visibilityMV.on("change", (v) => {
      if (!wrapRef.current) return;
      // edge fade: 0–0.08 fade in, 0.92–1.0 fade out
      const fadeIn = Math.min(v / 0.08, 1);
      const fadeOut = v > 0.92 ? Math.max(0, 1 - (v - 0.92) / 0.08) : 1;
      const alpha = fadeIn * fadeOut;
      gsap.set(wrapRef.current, { opacity: alpha, scale: 0.94 + alpha * 0.06 });
    });
    return unsub;
  }, [visibilityMV]);

  // ── Framer Motion: section label slides in when section enters ──
  useEffect(() => {
    const unsub = visibilityMV.on("change", (v) => {
      if (!labelRef.current) return;
      const show = v > 0.8 && v < 0.95;
      labelRef.current.style.opacity = show ? "1" : "0";
      labelRef.current.style.transform = show ? "translateY(0)" : "translateY(12px)";
    });
    return unsub;
  }, [visibilityMV]);

  return (
    <div
      id="Skills"
      style={{
        position: "absolute",
        top: `${WAVE_START * 1000 + 75}vh`,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {/* Section label — Framer Motion entrance */}
      <motion.div
        ref={labelRef}
        initial={{ opacity: 0, y: 12 }}
        style={{
          position: "absolute",
          top: "8vh",
          left: "45%",
          translateX: "-50%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <div style={{ width: 3, height: 22, background: "linear-gradient(#00ffcc,#7c3aed)", borderRadius: 2 }} />
        <span style={{
          fontFamily: "monospace",
          fontSize: "0.72rem",
          color: "#00ffcc",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}>
          02 · Skills
        </span>
      </motion.div>

      {/* Canvas wrapper — GSAP drives opacity + scale */}
      <div
        ref={wrapRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 14], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ alpha: true, antialias: true }}
        >
          <SkillsScene />
        </Canvas>
      </div>
    </div>
  );
}