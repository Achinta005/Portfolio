"use client";
import { useRef, useEffect } from "react";
import { scrollProgressRef } from "../../../../components/ImmersiveView/scrollState";

export function useParallax(ref, speed, sectionEnd = 0.17) {
  const raf = useRef();
  useEffect(() => {
    const tick = () => {
      const o = scrollProgressRef.current?.offset ?? 0;
      const c = Math.min(o / sectionEnd, 1);
      if (ref.current) {
        ref.current.style.transform = `translateY(${c * speed * -100}px)`;
        ref.current.style.opacity = `${Math.max(0, Math.min(1, 1 - c * speed * 2.2))}`;  // ← add Math.max(0,...)
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [ref, speed, sectionEnd]);
}