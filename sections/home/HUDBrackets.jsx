"use client";
import { useRef, useEffect } from "react";
import { scrollProgressRef } from "../../components/ImmersiveView/scrollState";

export default function HUDBrackets() {
  const ref = useRef();
  const raf = useRef();

  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) {
        ref.current.style.opacity = "1";
        ref.current.style.transform = "scaleX(1)";
      }
    }, 1800);

    const tick = () => {
      const o = scrollProgressRef.current?.offset ?? 0;
      if (ref.current && o > 0.04) {
        const fade = Math.max(0, 1 - (o - 0.04) / 0.06);  // smooth 0.04→0.10 fadeout
        ref.current.style.opacity = `${fade}`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const b = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "10px",
    height: "48px",
    boxShadow: "0 0 8px rgba(0,255,200,0.5)",
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0,
        transform: "scaleX(1.2)",
        transition: "opacity 0.5s, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          ...b,
          left: "-14px",
          borderTop: "2px solid #00ffcc",
          borderLeft: "2px solid #00ffcc",
          borderBottom: "2px solid #00ffcc",
          borderRadius: "2px 0 0 2px",
        }}
      />
      <div
        style={{
          ...b,
          right: "-14px",
          borderTop: "2px solid #00ffcc",
          borderRight: "2px solid #00ffcc",
          borderBottom: "2px solid #00ffcc",
          borderRadius: "0 2px 2px 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg,transparent,rgba(0,255,200,0.7),transparent)",
          animation: "scanDown 1.4s ease forwards",
          animationDelay: "1.8s",
        }}
      />
    </div>
  );
}