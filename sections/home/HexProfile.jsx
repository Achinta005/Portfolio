"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollProgressRef } from "../../components/ImmersiveView/scrollState";

function buildHexGeometry(R) {
  const positions = [];
  const uvs = [];
  const indices = [];

  positions.push(0, 0, 0);
  uvs.push(0.5, 0.5);

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i + 30);
    const x = R * Math.cos(angle);
    const y = R * Math.sin(angle);
    positions.push(x, y, 0);
    uvs.push((x / R) * 0.5 + 0.5, (y / R) * 0.5 + 0.5);
  }

  for (let i = 0; i < 6; i++) {
    indices.push(0, i + 1, ((i + 1) % 6) + 1);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export default function HexProfile({ bootDone }) {
  const groupRef = useRef();
  const texture = useTexture("/profile.png");

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const HEX_R = 1.5;
  const BORDER_OUTER = 1.58;
  const OUTLINE_R = 1.62;

  const hexGeo = useMemo(() => buildHexGeometry(HEX_R), []);

  const innerOutlineGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const a = (Math.PI / 180) * (60 * i + 30);
      pts.push(new THREE.Vector3(HEX_R * Math.cos(a), HEX_R * Math.sin(a), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const outerOutlineGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const a = (Math.PI / 180) * (60 * i + 30);
      pts.push(new THREE.Vector3(OUTLINE_R * Math.cos(a), OUTLINE_R * Math.sin(a), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const cornerTicksGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i + 30);
      const r1 = HEX_R + 0.02;
      const r2 = HEX_R + 0.18;
      pts.push(new THREE.Vector3(r1 * Math.cos(a), r1 * Math.sin(a), 0));
      pts.push(new THREE.Vector3(r2 * Math.cos(a), r2 * Math.sin(a), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const photoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uDissolve: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uTime;
          uniform float uReveal;
          uniform float uDissolve;
          varying vec2 vUv;

          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

          void main() {
            float wipe = step(vUv.y, uReveal * 1.05);
            if (uReveal < 0.99 && wipe < 0.5) {
              float n = hash(vUv + uTime * 0.5);
              gl_FragColor = vec4(vec3(0.0, 0.82, 1.0) * n * 0.3, n * 0.25);
              return;
            }
            vec4 col = texture2D(uTexture, vUv);
            col.rgb *= sin(vUv.y * 80.0 + uTime * 2.0) * 0.006 + 1.0;
            col.rgb = mix(col.rgb, col.rgb * vec3(0.85, 0.92, 1.08), 0.25);
            if (uDissolve > 0.0) {
              float n   = hash(vUv * 60.0 + uTime * 0.05);
              float cut = 1.0 - smoothstep(0.0, 1.0, uDissolve);
              if (n > cut) discard;
              col.rgb = mix(col.rgb, vec3(0.0, 1.0, 0.8), uDissolve * 0.4);
            }
            gl_FragColor = vec4(col.rgb, col.a);
          }
        `,
        transparent: true,
      }),
    [texture],
  );

  const borderGeo = useMemo(() => {
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i < 6; i++) {
      const a0 = (Math.PI / 180) * (60 * i + 30);
      const a1 = (Math.PI / 180) * (60 * (i + 1) + 30);

      const xi0 = HEX_R * Math.cos(a0), yi0 = HEX_R * Math.sin(a0);
      const xi1 = HEX_R * Math.cos(a1), yi1 = HEX_R * Math.sin(a1);
      const xo0 = BORDER_OUTER * Math.cos(a0), yo0 = BORDER_OUTER * Math.sin(a0);
      const xo1 = BORDER_OUTER * Math.cos(a1), yo1 = BORDER_OUTER * Math.sin(a1);

      const base = i * 4;
      positions.push(xi0, yi0, 0, xo0, yo0, 0, xi1, yi1, 0, xo1, yo1, 0);
      const u0 = i / 6, u1 = (i + 1) / 6;
      uvs.push(u0, 0, u0, 1, u1, 0, u1, 1);
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geo.setIndex(indices);
    return geo;
  }, []);

  const borderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uDissolve: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
          uniform float uTime; uniform float uReveal; uniform float uDissolve;
          varying vec2 vUv;
          void main() {
            float flow  = fract(vUv.x * 1.0 - uTime * 0.18);
            float beam  = smoothstep(0.0, 0.12, flow) * (1.0 - smoothstep(0.12, 0.55, flow));
            float base  = 0.55;
            vec3  cyan  = vec3(0.0, 0.85, 1.0);
            vec3  purp  = vec3(0.48, 0.22, 0.93);
            vec3  col   = mix(cyan, purp, vUv.x);
            float alpha = (base + beam * 0.45) * uReveal * (1.0 - uDissolve * 1.2);
            alpha = clamp(alpha, 0.0, 1.0);
            gl_FragColor = vec4(col + beam * vec3(0.3,0.9,1.0), alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const revealRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const offset = scrollProgressRef.current?.offset ?? 0;

    if (bootDone && revealRef.current < 1)
      revealRef.current = Math.min(revealRef.current + 0.009, 1);

    const reveal = revealRef.current;
    const dissolve = Math.min(offset / 0.125, 1);

    photoMat.uniforms.uTime.value = t;
    photoMat.uniforms.uReveal.value = reveal;
    photoMat.uniforms.uDissolve.value = dissolve;
    borderMat.uniforms.uTime.value = t;
    borderMat.uniforms.uReveal.value = reveal;
    borderMat.uniforms.uDissolve.value = dissolve;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.45) * 0.06;
      groupRef.current.visible = dissolve < 0.99;
    }
  });

  return (
    <group ref={groupRef} position={[-6.5, 0.0, 0]}>
      <mesh geometry={hexGeo}>
        <primitive object={photoMat} attach="material" />
      </mesh>
      <mesh geometry={borderGeo}>
        <primitive object={borderMat} attach="material" />
      </mesh>
      <lineLoop geometry={innerOutlineGeo}>
        <lineBasicMaterial color="#00e5ff" transparent opacity={0.7} />
      </lineLoop>
      <lineLoop geometry={outerOutlineGeo}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.3} />
      </lineLoop>
      <lineSegments geometry={cornerTicksGeo}>
        <lineBasicMaterial color="#00ffcc" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}