"use client";
import { useEffect } from "react";
import { subscribeToScroll, scrollProgressRef } from "../../../../components/ImmersiveView/scrollState";

export function useParallax(ref, speed, sectionEnd = 0.17) {
  useEffect(() => {
    const unsub = subscribeToScroll(() => {
      const o = scrollProgressRef.current?.offset ?? 0;
      const c = Math.min(o / sectionEnd, 1);
      if (ref.current) {
        ref.current.style.transform = `translateY(${c * speed * -100}px)`;
        ref.current.style.opacity = `${Math.max(0, Math.min(1, 1 - c * speed * 2.2))}`;
      }
    });
    return unsub;
  }, [ref, speed, sectionEnd]);
}