"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function EducationSection() {
    const groupRef = useRef();
    useFrame(() => {
        if (groupRef.current) groupRef.current.visible = false;
    });
    return <group ref={groupRef} visible={false} />;
}