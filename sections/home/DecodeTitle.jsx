"use client";
import { useRef, useEffect, useState } from "react";
import { useChromatic } from "./hooks/useChromatic";
import HUDBrackets from "./HUDBrackets";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#_ABCDEF01";
const TARGET_TEXT = "ACHINTA HAZRA";

function scramble(progress, target) {
  return target
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      return progress > i / target.length
        ? char
        : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    })
    .join("");
}

export default function DecodeTitle() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const progress = useRef(0);
  const h1Ref = useRef();
  useChromatic(h1Ref);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      progress.current = Math.min((now - start) / 1600, 1);
      setText(scramble(progress.current, TARGET_TEXT));
      if (progress.current < 1) raf = requestAnimationFrame(tick);
      else {
        setText(TARGET_TEXT);
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ minHeight: "80px" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "16px",
        }}
      >
        <HUDBrackets />
        <h1
          ref={h1Ref}
          style={{
            fontWeight: 800,
            fontFamily: "monospace",
            background: "linear-gradient(90deg, #00d2ff, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: done ? "0.02em" : "0.08em",
            transition: "letter-spacing 0.6s ease",
            fontSize: "clamp(1.6rem, 4vw, 4.2rem)",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            minWidth: "max-content",
            display: "block",
          }}
        >
          {text}
        </h1>
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg,#00d2ff,#7c3aed)",
            marginTop: "6px",
            width: done ? "100%" : "0%",
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: "0 0 10px rgba(0,210,255,0.6)",
          }}
        />
      </div>
    </div>
  );
}