"use client";
import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollProgressRef } from "../../components/ImmersiveView/scrollState";

// ─── SCROLL CONFIG ────────────────────────────────────────────────────────────
const TOTAL_PAGES = 8;
const WAVE_START = 1.7 / TOTAL_PAGES;
const WAVE_END = 2.6 / TOTAL_PAGES;

// ─── SKILLS ──────────────────────────────────────────────────────────────────
const SKILLS = [
    { id: "javascript", glb: "/Skills/js-logo.glb", color: "#f7df1e", scale: 0.3 },
    { id: "typescript", glb: "/Skills/ts-logo.glb", color: "#3178c6", scale: 0.3 },
    { id: "react", glb: "/Skills/react_logo.glb", color: "#61dafb", scale: 0.3 },
    { id: "nextjs", glb: "/Skills/icons8-nextjs-480.png", color: "#ffffff", scale: 1.0 },
    { id: "docker", glb: "/Skills/docker-logo.glb", color: "#2496ed", scale: 0.4 },
    { id: "python", glb: "/Skills/python.glb", color: "#3776ab", scale: 0.3 },
    { id: "nodejs", glb: "/Skills/node-js-logo.glb", color: "#339933", scale: 0.3 },
    { id: "mongodb", glb: "/Skills/mongodb-logo.glb", color: "#47a248", scale: 0.4 },
    { id: "postgres", glb: "/Skills/icons8-postgres-480.png", color: "#336791", scale: 0.3 },
    { id: "cpp", glb: "/Skills/cpp-logo.glb", color: "#00599c", scale: 0.3 },
];

// ─── SEEDED RANDOM ────────────────────────────────────────────────────────────
function seededRand(seed) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

// ─── LANE DATA ────────────────────────────────────────────────────────────────
function makeLane(index) {
    const rand = seededRand(index * 6271 + 9001);
    const side = index % 2 === 0 ? 1 : -1;

    const startX = (rand() - 0.5) * 20;
    const startY = (rand() - 0.5) * 10;
    const startZ = -30 - rand() * 15;

    const midX = side * (2 + rand() * 3);
    const midY = (rand() - 0.5) * 4;
    const midZ = -4;

    const exitX = side * (18 + rand() * 10);
    const exitY = (rand() - 0.5) * 8;
    const exitZ = 5 + rand() * 3;

    const delay = rand() * 0.50;
    const spinSpeed = 0.006 + rand() * 0.012;
    const spinAxis = new THREE.Vector3(
        rand() - 0.5, rand() - 0.5, rand() - 0.5
    ).normalize();

    return { startX, startY, startZ, midX, midY, midZ, exitX, exitY, exitZ, delay, spinSpeed, spinAxis, side };
}

const LANES = SKILLS.map((_, i) => makeLane(i));

// ─── QUADRATIC BEZIER ─────────────────────────────────────────────────────────
function bezier3(p0, p1, p2, t) {
    const mt = 1 - t;
    return p0 * mt * mt + p1 * 2 * mt * t + p2 * t * t;
}

// ─── NORMALIZE GLB BOUNDING BOX ───────────────────────────────────────────────
function normalizeBoundingBox(object, targetSize = 1.5, modelScale = 0.5) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxAxis = Math.max(size.x, size.y, size.z);
    if (maxAxis === 0) return;
    const factor = (targetSize / maxAxis) * modelScale;
    object.scale.setScalar(factor);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function isPNG(path) {
    return /\.(png|jpg|jpeg|webp)$/i.test(path);
}

// ─── FALLBACK BOX ─────────────────────────────────────────────────────────────
function FallbackLogo({ color }) {
    return (
        <mesh>
            <boxGeometry args={[2.0, 2.0, 0.28]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                roughness={0.25}
                metalness={0.7}
            />
        </mesh>
    );
}

// ─── PNG ICON ─────────────────────────────────────────────────────────────────
function SkillPNG({ url, color, modelScale }) {
    const texture = useTexture(url);
    const size = 2.0 * (modelScale ?? 1.0);  // scale plane size
    return (
        <mesh>
            <planeGeometry args={[size, size]} />
            <meshStandardMaterial
                map={texture}
                transparent={true}          // respects PNG alpha channel
                alphaTest={0.05}            // clip near-transparent edges
                emissive={color}
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.4}
                side={THREE.DoubleSide}     // visible from both sides during spin
            />
        </mesh>
    );
}

// ─── GLB ICON ─────────────────────────────────────────────────────────────────
function SkillGLB({ glb, color, modelScale }) {
    // ── PNG branch ────────────────────────────────────────────────────────────
    if (isPNG(glb)) {
        return <SkillPNG url={glb} color={color} modelScale={modelScale} />;
    }

    // ── GLB branch ────────────────────────────────────────────────────────────
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

// ─── ANIMATED ICON ────────────────────────────────────────────────────────────
function SkillIcon({ skill, lane }) {
    const groupRef = useRef();
    const rotRef = useRef(0);

    useFrame(() => {
        if (!groupRef.current) return;

        const raw = scrollProgressRef.current?.offset ?? 0;
        const sectionT = THREE.MathUtils.clamp(
            (raw - WAVE_START) / (WAVE_END - WAVE_START), 0, 1
        );

        if (sectionT <= 0 || sectionT >= 1) {
            groupRef.current.visible = false;
            return;
        }
        groupRef.current.visible = true;

        // Per-icon stagger
        const t = THREE.MathUtils.clamp(
            (sectionT - lane.delay) / (1 - lane.delay), 0, 1
        );

        // ── POSITION ──────────────────────────────────────────────────────────
        const px = bezier3(lane.startX, lane.midX, lane.exitX, t);
        const py = bezier3(lane.startY, lane.midY, lane.exitY, t);
        const pz = bezier3(lane.startZ, lane.midZ, lane.exitZ, t);
        groupRef.current.position.set(px, py, pz);

        // ── ANIM SCALE ────────────────────────────────────────────────────────
        const scaleCurve = Math.sin(Math.min(t, 0.85) * Math.PI);
        const animScale = 0.6 + scaleCurve * 2.8;
        groupRef.current.scale.setScalar(Math.max(0.01, animScale));

        // ── OPACITY ───────────────────────────────────────────────────────────
        const fadeIn = Math.min(t / 0.12, 1);
        const fadeOut = t > 0.72 ? Math.max(0, 1 - (t - 0.72) / 0.28) : 1;
        const opacity = fadeIn * fadeOut;
        groupRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = opacity;
            }
        });

        // ── ROTATION ──────────────────────────────────────────────────────────
        rotRef.current += lane.spinSpeed;
        groupRef.current.setRotationFromAxisAngle(lane.spinAxis, rotRef.current);
    });

    return (
        <group ref={groupRef} visible={false}>
            <Suspense fallback={<FallbackLogo color={skill.color} />}>
                <SkillGLB glb={skill.glb} color={skill.color} modelScale={skill.scale} />
            </Suspense>
            <pointLight color={skill.color} intensity={1.2} distance={6} decay={2} />
        </group>
    );
}

// ─── LIGHTS ───────────────────────────────────────────────────────────────────
function SkillsLights() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[8, 8, 4]} intensity={0.9} color="#00d2ff" />
            <directionalLight position={[-8, -4, 4]} intensity={0.4} color="#7c3aed" />
        </>
    );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function SkillsSection() {
    const groupRef = useRef();
    useFrame(() => { if (groupRef.current) groupRef.current.visible = false; });

    return (
        <>
            <group ref={groupRef} visible={false} />
            <SkillsLights />
            {SKILLS.map((skill, i) => (
                <SkillIcon key={skill.id} skill={skill} lane={LANES[i]} />
            ))}
        </>
    );
}