"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollProgressRef } from "../../components/ImmersiveView/scrollState";

const TOTAL_PAGES = 7;
const PROJ_START = 2.1 / TOTAL_PAGES;
const PROJ_END =  2.8/ TOTAL_PAGES;

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
function easeInQuart(t) { return t * t * t * t; }

export const projAnimRef = { opacity: 0, scale: 0, active: false };

export default function ProjectsSection() {
    const groupRef = useRef();
    const lightRef = useRef();

    useFrame(() => {
        const g = groupRef.current;
        if (!g) return;

        const raw = scrollProgressRef.current?.offset ?? 0;
        const secT = THREE.MathUtils.clamp((raw - PROJ_START) / (PROJ_END - PROJ_START), 0, 1);

        if (raw < PROJ_START || secT >= 1) {
            g.visible = false;
            projAnimRef.opacity = 0;
            projAnimRef.scale = 0;
            projAnimRef.active = false;
            return;
        }
        g.visible = true;
        projAnimRef.active = true;

        const arriveT = easeOutQuart(Math.min(secT / 0.45, 1));
        g.position.set(0, 0, THREE.MathUtils.lerp(-150, 0, arriveT));

        const growT = easeOutQuart(Math.min(secT / 0.40, 1));
        const shrinkT = secT > 0.82 ? easeInQuart((secT - 0.82) / 0.18) : 0;
        const sc = Math.max(0.005, (0.02 + growT * 0.98) * (1 - shrinkT * 0.95));
        g.scale.setScalar(sc);

        const sectionFadeIn = THREE.MathUtils.clamp(secT / 0.10, 0, 1);
        const sectionFadeOut = secT > 0.85 ? 1 - THREE.MathUtils.clamp((secT - 0.85) / 0.15, 0, 1) : 1;
        const opacity = sectionFadeIn * sectionFadeOut;

        if (lightRef.current) lightRef.current.intensity = opacity * 1.2;
        g.rotation.x = (1 - arriveT) * 0.15;

        projAnimRef.opacity = opacity;
        projAnimRef.scale = sc;
    });

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[6, 6, 4]} intensity={0.7} color="#00d2ff" />
            <directionalLight position={[-6, -4, 4]} intensity={0.3} color="#7c3aed" />
            <group ref={groupRef}>
                <pointLight ref={lightRef} color="#00b8ff" intensity={1.2} distance={8} decay={2} position={[0, 0, 2]} />
            </group>
        </>
    );
}