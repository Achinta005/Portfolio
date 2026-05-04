"use client";
import { useRef, useEffect } from "react";
import { scrollProgressRef } from "../../../../components/ImmersiveView/scrollState";

export function useChromatic(ref) {
  const last = useRef(0);
  const raf = useRef();
  useEffect(() => {
    const tick = () => {
      const cur = scrollProgressRef.current?.offset ?? 0;
      const v = Math.min(Math.abs(cur - last.current) * 80, 5);
      last.current = cur;
      if (ref.current)
        ref.current.style.textShadow =
          v > 0.1
            ? `${-v}px 0 rgba(255,0,100,0.55), ${v}px 0 rgba(0,255,220,0.55)`
            : "none";
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [ref]);
}