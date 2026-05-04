"use client";
import { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: "id",  cmd: "identify --user",  result: "ACHINTA HAZRA",    lottie: "Lottifiles/face.json",    time: 520 },
  { id: "sk",  cmd: "load skills",      result: "35 modules found", lottie: "Lottifiles/code.json",    time: 480 },
  { id: "pr",  cmd: "map projects",     result: "18 nodes indexed", lottie: "Lottifiles/network.json", time: 440 },
  { id: "cal", cmd: "calibrate",        result: "compass locked",   lottie: "Lottifiles/radar.json",   time: 400 },
  { id: "ok",  cmd: "exec portfolio.sh",result: "OK",               lottie: "Lottifiles/success.json", time: 320, isLast: true },
];

const V  = "#a78bfa";
const V2 = "#7c3aed";
const V3 = "#c4b5fd";

export default function BootOverlay({ onDone }) {
  const [done, setDone]           = useState([]);
  const [active, setActive]       = useState(null);
  const [exiting, setExiting]     = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [playerLoaded, setPL]     = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!customElements.get("lottie-player")) {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      s.onload = () => setPL(true);
      document.head.appendChild(s);
    } else {
      setPL(true);
    }
  }, []);

  // typewriter per active step
  useEffect(() => {
    if (!active) return;
    setCharCount(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setCharCount(i);
      if (i >= active.cmd.length) clearInterval(iv);
    }, 26);
    return () => clearInterval(iv);
  }, [active?.id]);

  useEffect(() => {
    if (!mounted || !playerLoaded) return;
    let idx = 0;

    const run = () => {
      if (idx >= STEPS.length) return;
      const step = STEPS[idx];
      setActive(step);

      setTimeout(() => {
        if (!step.isLast) {
          setDone(prev => [...prev, step]);
        }
        idx++;
        if (idx >= STEPS.length) {
          setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDone(), 420);
          }, 380);
        } else {
          setTimeout(run, 80);
        }
      }, step.time);
    };

    setTimeout(run, 200);
  }, [mounted, playerLoaded, onDone]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes cur { 50% { opacity: 0; } }
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes overlayOut {
          to { opacity: 0; transform: scale(1.015); }
        }
        @keyframes lottieIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        .boot-cursor {
          display: inline-block;
          width: 7px; height: 1em;
          background: ${V};
          margin-left: 3px;
          vertical-align: text-bottom;
          animation: cur 0.65s step-end infinite;
        }
        .boot-row {
          animation: rowIn 0.18s ease forwards;
        }
        .lottie-wrap {
          animation: lottieIn 0.25s ease forwards;
        }
        .overlay-exit {
          animation: overlayOut 0.4s ease forwards;
        }
      `}</style>

      <div
        className={exiting ? "overlay-exit" : ""}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#08060f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* ── LEFT — lottie panel ── */}
        <div style={{
          width: "38vw", height: "100vh",
          borderRight: `1px solid ${V2}33`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative",
          background: `radial-gradient(ellipse at 50% 60%, ${V2}0d 0%, transparent 70%)`,
        }}>
          {/* top-left mark */}
          <div style={{
            position: "absolute", top: 24, left: 24,
            fontFamily: "monospace", fontSize: "0.6rem",
            color: `${V}55`, letterSpacing: "0.2em",
          }}>AH_OS v1.0</div>

          {/* lottie */}
          {active && playerLoaded && (
            <div
              key={active.id}
              className="lottie-wrap"
              style={{
                width: 180, height: 180,
                filter: `drop-shadow(0 0 32px ${V}55)`,
              }}
            >
              <lottie-player
                src={active.lottie}
                background="transparent"
                speed="1"
                style={{ width: "180px", height: "180px" }}
                autoplay
              />
            </div>
          )}

          {/* progress bar — vertical on left edge */}
          <div style={{
            position: "absolute", left: 0, top: 0,
            width: 2, height: "100%",
            background: `${V}18`,
          }}>
            <div style={{
              width: "100%",
              height: `${((done.length) / STEPS.length) * 100}%`,
              background: `linear-gradient(180deg, ${V2}, ${V})`,
              transition: "height 0.35s ease",
              boxShadow: `0 0 12px ${V}`,
            }} />
          </div>

          {/* step counter bottom */}
          <div style={{
            position: "absolute", bottom: 28,
            fontFamily: "monospace", fontSize: "0.58rem",
            color: `${V}44`, letterSpacing: "0.25em",
          }}>
            {String(done.length + (active ? 1 : 0)).padStart(2,"0")}
            <span style={{ color: `${V}22` }}> / {String(STEPS.length).padStart(2,"0")}</span>
          </div>
        </div>

        {/* ── RIGHT — terminal panel ── */}
        <div style={{
          flex: 1, height: "100vh",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "0 10vw",
          gap: 0,
        }}>
          {/* header */}
          <div style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            color: `${V}33`,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}>
            boot_sequence.sh —
          </div>

          {/* completed rows */}
          {done.map((s) => (
            <div
              key={s.id}
              className="boot-row"
              style={{
                display: "grid",
                gridTemplateColumns: "16px 1fr auto",
                alignItems: "baseline",
                gap: "0 14px",
                marginBottom: 14,
                opacity: 0.28,
              }}
            >
              <span style={{
                fontFamily: "monospace", fontSize: "0.55rem",
                color: V2,
              }}>✓</span>
              <span style={{
                fontFamily: "monospace", fontSize: "0.78rem",
                color: "#4a4060",
              }}>{s.cmd}</span>
              <span style={{
                fontFamily: "monospace", fontSize: "0.6rem",
                color: "#3a3050", letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}>{s.result}</span>
            </div>
          ))}

          {/* active row */}
          {active && (
            <div
              key={active.id + "_active"}
              className="boot-row"
              style={{
                display: "grid",
                gridTemplateColumns: "16px 1fr auto",
                alignItems: "baseline",
                gap: "0 14px",
                marginBottom: 14,
              }}
            >
              <span style={{
                fontFamily: "monospace", fontSize: "0.6rem",
                color: V,
                textShadow: `0 0 8px ${V}`,
              }}>$</span>
              <span style={{
                fontFamily: "monospace",
                fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
                fontWeight: 700,
                color: "#e2d9ff",
                letterSpacing: "0.02em",
                textShadow: `0 0 20px ${V}44`,
              }}>
                {active.cmd.slice(0, charCount)}
                {charCount < active.cmd.length
                  ? <span className="boot-cursor" />
                  : <span className="boot-cursor" style={{ background: V3 }} />
                }
              </span>
              {charCount >= active.cmd.length && (
                <span style={{
                  fontFamily: "monospace", fontSize: "0.65rem",
                  color: active.isLast ? V : `${V}88`,
                  letterSpacing: "0.12em",
                  textShadow: active.isLast ? `0 0 12px ${V}` : "none",
                  whiteSpace: "nowrap",
                  animation: "rowIn 0.15s ease forwards",
                }}>{active.result}</span>
              )}
            </div>
          )}

          {/* blinking underscore idle */}
          <div style={{
            fontFamily: "monospace", fontSize: "0.78rem",
            color: `${V}33`, marginTop: 4,
          }}>
            <span className="boot-cursor"
              style={{ background: `${V}33`, width: 10 }}
            />
          </div>

          {/* bottom tag */}
          <div style={{
            position: "absolute", bottom: 28, right: "10vw",
            fontFamily: "monospace", fontSize: "0.55rem",
            color: `${V}22`, letterSpacing: "0.2em",
          }}>PORTFOLIO_OS</div>
        </div>
      </div>
    </>
  );
}