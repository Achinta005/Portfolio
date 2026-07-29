"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";

function Model({ glb, scale }) {
  const { scene } = useGLTF(glb);
  return <primitive object={scene} scale={scale} />;
}

function Rotator({ children }) {
  return (
    <group
      onUpdate={(self) => {
        self.rotation.y += 0.005;
      }}
    >
      {children}
    </group>
  );
}

export default function SkillCard3D({ glb, scale, color }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 3]} intensity={1} color={color} />
      <Suspense fallback={null}>
        <Rotator>
          <Model glb={glb} scale={scale} />
        </Rotator>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
