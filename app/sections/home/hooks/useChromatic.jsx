"use client";
import { useEffect, useRef } from "react";
import { subscribeToScroll, scrollProgressRef } from "../../../../components/ImmersiveView/scrollState";

export function useChromatic(ref) {
  const last = useRef(0);
  useEffect(() => {
    const unsub = subscribeToScroll(() => {
      const cur = scrollProgressRef.current?.offset ?? 0;
      const v = Math.min(Math.abs(cur - last.current) * 80, 5);
      last.current = cur;
      if (ref.current)
        ref.current.style.textShadow =
          v > 0.1
            ? `${-v}px 0 rgba(255,0,100,0.55), ${v}px 0 rgba(0,255,220,0.55)`
            : "none";
    });
    return unsub;
  }, [ref]);
}