"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSpring, useTransform, useMotionValue, animate } from "framer-motion";
import { scrollProgressRef } from "../../../components/ImmersiveView/scrollState";

gsap.registerPlugin(ScrollTrigger);

// ── Hex geometry builder ────────────────────────────────────────────────────
function buildHexGeometry(R) {
  const positions = [], uvs = [], indices = [];
  positions.push(0, 0, 0);
  uvs.push(0.5, 0.5);
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i + 30);
    positions.push(R * Math.cos(a), R * Math.sin(a), 0);
    uvs.push((Math.cos(a)) * 0.5 + 0.5, (Math.sin(a)) * 0.5 + 0.5);
  }
  for (let i = 0; i < 6; i++) indices.push(0, i + 1, ((i + 1) % 6) + 1);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  geo.setAttribute("uv",       new THREE.BufferAttribute(new Float32Array(uvs),       2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildLoopGeo(R) {
  const pts = [];
  for (let i = 0; i <= 6; i++) {
    const a = (Math.PI / 180) * (60 * i + 30);
    pts.push(new THREE.Vector3(R * Math.cos(a), R * Math.sin(a), 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

function buildTicksGeo(R) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i + 30);
    pts.push(new THREE.Vector3((R + 0.02) * Math.cos(a), (R + 0.02) * Math.sin(a), 0));
    pts.push(new THREE.Vector3((R + 0.18) * Math.cos(a), (R + 0.18) * Math.sin(a), 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

function buildBorderGeo(INNER, OUTER) {
  const positions = [], uvs = [], indices = [];
  for (let i = 0; i < 6; i++) {
    const a0 = (Math.PI / 180) * (60 * i       + 30);
    const a1 = (Math.PI / 180) * (60 * (i + 1) + 30);
    const xi0 = INNER*Math.cos(a0), yi0 = INNER*Math.sin(a0);
    const xi1 = INNER*Math.cos(a1), yi1 = INNER*Math.sin(a1);
    const xo0 = OUTER*Math.cos(a0), yo0 = OUTER*Math.sin(a0);
    const xo1 = OUTER*Math.cos(a1), yo1 = OUTER*Math.sin(a1);
    const b   = i * 4;
    positions.push(xi0,yi0,0, xo0,yo0,0, xi1,yi1,0, xo1,yo1,0);
    const u0 = i/6, u1 = (i+1)/6;
    uvs.push(u0,0, u0,1, u1,0, u1,1);
    indices.push(b, b+1, b+2, b+1, b+3, b+2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  geo.setAttribute("uv",       new THREE.BufferAttribute(new Float32Array(uvs),       2));
  geo.setIndex(indices);
  return geo;
}

// ── Component ───────────────────────────────────────────────────────────────
const HEX_R       = 1.5;
const BORDER_OUT  = 1.58;
const OUTLINE_R   = 1.62;

export default function HexProfile({ bootDone, imageUrl }) {
  const groupRef  = useRef();
  const texture   = useTexture(imageUrl ?? "/profile.png");
  texture.wrapS   = THREE.ClampToEdgeWrapping;
  texture.wrapT   = THREE.ClampToEdgeWrapping;

  // ── Framer Motion motion value: reveal (0→1) ──
  const revealMV  = useMotionValue(0);

  // ── Framer Motion motion value: dissolve driven by Lenis scroll ──
  const dissolveMV = useMotionValue(0);

  // ── GSAP: drive reveal on bootDone ──
  useEffect(() => {
    if (!bootDone) return;
    // animate the raw number, then push into revealMV each tick
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v:        1,
      duration: 2.2,
      ease:     "power2.out",
      onUpdate: () => revealMV.set(obj.v),
    });
    return () => tween.kill();
  }, [bootDone, revealMV]);

  // ── Lenis RAF: push scroll offset into dissolveMV ──
  useEffect(() => {
    let raf;
    const tick = () => {
      const o = scrollProgressRef.current?.offset ?? 0;
      dissolveMV.set(Math.min(o / 0.125, 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dissolveMV]);

  // ── GSAP: entrance rotation + scale ──
  useEffect(() => {
    if (!bootDone || !groupRef.current) return;
    gsap.fromTo(
      groupRef.current.rotation,
      { z: Math.PI * 0.5 },
      { z: 0, duration: 1.6, ease: "expo.out", delay: 0.3 }
    );
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0.4, y: 0.4, z: 0.4 },
      { x: 1,   y: 1,   z: 1,   duration: 1.4, ease: "expo.out", delay: 0.3 }
    );
  }, [bootDone]);

  // ── Geometries ──
  const hexGeo         = useMemo(() => buildHexGeometry(HEX_R),                []);
  const innerLoopGeo   = useMemo(() => buildLoopGeo(HEX_R),                    []);
  const outerLoopGeo   = useMemo(() => buildLoopGeo(OUTLINE_R),                []);
  const ticksGeo       = useMemo(() => buildTicksGeo(HEX_R),                   []);
  const borderGeo      = useMemo(() => buildBorderGeo(HEX_R, BORDER_OUT),      []);

  // ── Materials ──
  const photoMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTexture:  { value: texture },
      uTime:     { value: 0 },
      uReveal:   { value: 0 },
      uDissolve: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uTime, uReveal, uDissolve;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      void main(){
        float wipe = step(vUv.y, uReveal * 1.05);
        if(uReveal < 0.99 && wipe < 0.5){
          float n = hash(vUv + uTime * 0.5);
          gl_FragColor = vec4(vec3(0.0,0.82,1.0)*n*0.3, n*0.25);
          return;
        }
        vec4 col = texture2D(uTexture, vUv);
        col.rgb *= sin(vUv.y*80.0 + uTime*2.0)*0.006 + 1.0;
        col.rgb  = mix(col.rgb, col.rgb*vec3(0.85,0.92,1.08), 0.25);
        if(uDissolve > 0.0){
          float n   = hash(vUv*60.0 + uTime*0.05);
          float cut = 1.0 - smoothstep(0.0,1.0,uDissolve);
          if(n > cut) discard;
          col.rgb   = mix(col.rgb, vec3(0.0,1.0,0.8), uDissolve*0.4);
        }
        gl_FragColor = vec4(col.rgb, col.a);
      }
    `,
    transparent: true,
  }), [texture]);

  const borderMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:     { value: 0 },
      uReveal:   { value: 0 },
      uDissolve: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      uniform float uTime, uReveal, uDissolve;
      varying vec2 vUv;
      void main(){
        float flow  = fract(vUv.x - uTime*0.18);
        float beam  = smoothstep(0.0,0.12,flow)*(1.0-smoothstep(0.12,0.55,flow));
        vec3  col   = mix(vec3(0.0,0.85,1.0), vec3(0.48,0.22,0.93), vUv.x);
        float alpha = (0.55 + beam*0.45)*uReveal*(1.0 - uDissolve*1.2);
        gl_FragColor = vec4(col + beam*vec3(0.3,0.9,1.0), clamp(alpha,0.0,1.0));
      }
    `,
    transparent:  true,
    blending:     THREE.AdditiveBlending,
    depthWrite:   false,
    side:         THREE.DoubleSide,
  }), []);

  // ── useFrame: sync Framer Motion values → shader uniforms + float ──
  useFrame(({ clock }) => {
    const t        = clock.elapsedTime;
    const reveal   = revealMV.get();
    const dissolve = dissolveMV.get();

    photoMat.uniforms.uTime.value     = t;
    photoMat.uniforms.uReveal.value   = reveal;
    photoMat.uniforms.uDissolve.value = dissolve;

    borderMat.uniforms.uTime.value     = t;
    borderMat.uniforms.uReveal.value   = reveal;
    borderMat.uniforms.uDissolve.value = dissolve;

    if (groupRef.current) {
      // gentle float — Framer Motion spring would need DOM, so keep in useFrame
      groupRef.current.position.y = Math.sin(t * 0.45) * 0.06;
      groupRef.current.visible    = dissolve < 0.99;

      // GSAP-driven scale/rotation already applied to groupRef directly
      // Framer Motion handles reveal + dissolve via motionValues → uniforms
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh geometry={hexGeo}>
        <primitive object={photoMat} attach="material" />
      </mesh>
      <mesh geometry={borderGeo}>
        <primitive object={borderMat} attach="material" />
      </mesh>
      <lineLoop geometry={innerLoopGeo}>
        <lineBasicMaterial color="#00e5ff" transparent opacity={0.7} />
      </lineLoop>
      <lineLoop geometry={outerLoopGeo}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.3} />
      </lineLoop>
      <lineSegments geometry={ticksGeo}>
        <lineBasicMaterial color="#00ffcc" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}