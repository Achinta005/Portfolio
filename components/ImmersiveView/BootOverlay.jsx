"use client";
import { useState, useEffect, useRef } from "react";
import useIsMobile from "../../utils/useIsMobile";
import { loadLottiePlayer } from "../../utils/loadLottie";

const STEPS = [
  { id: "id", cmd: "identify --user", result: "ACHINTA HAZRA", lottie: "Lottifiles/face.json", time: 520 },
  { id: "sk", cmd: "load skills", result: "35 modules found", lottie: "Lottifiles/code.json", time: 480 },
  { id: "pr", cmd: "map projects", result: "18 nodes indexed", lottie: "Lottifiles/network.json", time: 440 },
  { id: "cal", cmd: "calibrate", result: "compass locked", lottie: "Lottifiles/radar.json", time: 400 },
  { id: "ok", cmd: "exec portfolio.sh", result: "OK", lottie: "Lottifiles/success.json", time: 320, isLast: true },
];

const V = "#a78bfa";
const V2 = "#7c3aed";
const V3 = "#c4b5fd";

export default function BootOverlay({ onDone }) {
  const isMobile = useIsMobile();
  const [done, setDone] = useState([]);
  const [active, setActive] = useState(null);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [playerLoaded, setPL] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    loadLottiePlayer().then(() => setPL(true));
  }, []);

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

        /* Mobile-specific overrides */
        @media (max-width: 640px) {
          .boot-cmd-text {
            font-size: clamp(0.75rem, 4vw, 0.95rem) !important;
          }
          .boot-result-text {
            font-size: 0.55rem !important;
          }
          .boot-done-cmd {
            font-size: 0.68rem !important;
          }
          .boot-done-result {
            font-size: 0.52rem !important;
          }
        }
      `}</style>

      <div
        className={exiting ? "overlay-exit" : ""}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#08060f",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        {/* ── MOBILE TOP BAR (lottie strip) — visible only on mobile ── */}
        {isMobile && (
          <div style={{
            width: "100%",
            borderBottom: `1px solid ${V2}33`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: `radial-gradient(ellipse at 50% 80%, ${V2}0d 0%, transparent 70%)`,
            flexShrink: 0,
            minHeight: 72,
            position: "relative",
          }}>
            {/* AH_OS tag */}
            <div style={{
              fontFamily: "monospace", fontSize: "0.55rem",
              color: `${V}55`, letterSpacing: "0.2em",
            }}>AH_OS v1.0</div>

            {/* Lottie — small, inline */}
            {active && playerLoaded && (
              <div
                key={active.id}
                className="lottie-wrap"
                style={{ width: 48, height: 48, flexShrink: 0 }}
              >
                <lottie-player
                  src={active.lottie}
                  background="transparent"
                  speed="1"
                  style={{ width: "48px", height: "48px" }}
                  autoplay
                />
              </div>
            )}

            {/* Step counter */}
            <div style={{
              fontFamily: "monospace", fontSize: "0.55rem",
              color: `${V}55`, letterSpacing: "0.2em",
            }}>
              {String(done.length + (active ? 1 : 0)).padStart(2, "0")}
              <span style={{ color: `${V}22` }}> / {String(STEPS.length).padStart(2, "0")}</span>
            </div>

            {/* Mobile progress bar — horizontal at bottom of this strip */}
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              height: 2, width: "100%",
              background: `${V}18`,
            }}>
              <div style={{
                height: "100%",
                width: `${((done.length) / STEPS.length) * 100}%`,
                background: `linear-gradient(90deg, ${V2}, ${V})`,
                transition: "width 0.35s ease",
                boxShadow: `0 0 8px ${V}`,
              }} />
            </div>
          </div>
        )}

        {/* ── DESKTOP layout: side-by-side ── */}
        {!isMobile && (
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            height: "100vh",
            width: "100%",
          }}>
            {/* LEFT — lottie panel */}
            <div style={{
              width: "38vw",
              borderRight: `1px solid ${V2}33`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              position: "relative",
              background: `radial-gradient(ellipse at 50% 60%, ${V2}0d 0%, transparent 70%)`,
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", top: 24, left: 24,
                fontFamily: "monospace", fontSize: "0.6rem",
                color: `${V}55`, letterSpacing: "0.2em",
              }}>AH_OS v1.0</div>

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

              <div style={{
                position: "absolute", bottom: 28,
                fontFamily: "monospace", fontSize: "0.58rem",
                color: `${V}44`, letterSpacing: "0.25em",
              }}>
                {String(done.length + (active ? 1 : 0)).padStart(2, "0")}
                <span style={{ color: `${V}22` }}> / {String(STEPS.length).padStart(2, "0")}</span>
              </div>
            </div>

            {/* RIGHT — terminal panel (desktop) */}
            <TerminalPanel
              done={done}
              active={active}
              charCount={charCount}
              isMobile={false}
            />
          </div>
        )}

        {/* ── MOBILE: terminal panel fills remaining space ── */}
        {isMobile && (
          <TerminalPanel
            done={done}
            active={active}
            charCount={charCount}
            isMobile={true}
          />
        )}
      </div>
    </>
  );
}

function TerminalPanel({ done, active, charCount, isMobile }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: isMobile ? "flex-start" : "center",
      padding: isMobile ? "24px 6vw 24px 6vw" : "0 10vw",
      overflowY: isMobile ? "auto" : "hidden",
      position: "relative",
      minHeight: 0,
    }}>
      {/* header */}
      <div style={{
        fontFamily: "monospace",
        fontSize: "0.58rem",
        color: `${V}33`,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        marginBottom: isMobile ? 20 : 32,
        flexShrink: 0,
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
            gap: isMobile ? "0 8px" : "0 14px",
            marginBottom: isMobile ? 10 : 14,
            opacity: 0.28,
            flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: "monospace", fontSize: "0.55rem",
            color: V2,
          }}>✓</span>
          <span
            className="boot-done-cmd"
            style={{
              fontFamily: "monospace",
              fontSize: "0.78rem",
              color: "#4a4060",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >{s.cmd}</span>
          <span
            className="boot-done-result"
            style={{
              fontFamily: "monospace", fontSize: "0.6rem",
              color: "#3a3050", letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >{s.result}</span>
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
            gap: isMobile ? "0 8px" : "0 14px",
            marginBottom: 14,
            flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: "monospace", fontSize: "0.6rem",
            color: V,
            textShadow: `0 0 8px ${V}`,
          }}>$</span>
          <span
            className="boot-cmd-text"
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(0.85rem, 3.5vw, 1.1rem)",
              fontWeight: 700,
              color: "#e2d9ff",
              letterSpacing: "0.02em",
              textShadow: `0 0 20px ${V}44`,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {active.cmd.slice(0, charCount)}
            {charCount < active.cmd.length
              ? <span className="boot-cursor" />
              : <span className="boot-cursor" style={{ background: V3 }} />
            }
          </span>
          {charCount >= active.cmd.length && (
            <span
              className="boot-result-text"
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "0.58rem" : "0.65rem",
                color: active.isLast ? V : `${V}88`,
                letterSpacing: "0.12em",
                textShadow: active.isLast ? `0 0 12px ${V}` : "none",
                whiteSpace: "nowrap",
                animation: "rowIn 0.15s ease forwards",
              }}
            >{active.result}</span>
          )}
        </div>
      )}

      {/* blinking underscore idle */}
      <div style={{
        fontFamily: "monospace", fontSize: "0.78rem",
        color: `${V}33`, marginTop: 4,
        flexShrink: 0,
      }}>
        <span className="boot-cursor"
          style={{ background: `${V}33`, width: 10 }}
        />
      </div>

      {/* bottom tag */}
      <div style={{
        position: isMobile ? "relative" : "absolute",
        bottom: isMobile ? undefined : 28,
        right: isMobile ? undefined : "10vw",
        marginTop: isMobile ? 24 : 0,
        fontFamily: "monospace", fontSize: "0.55rem",
        color: `${V}22`, letterSpacing: "0.2em",
        flexShrink: 0,
      }}>PORTFOLIO_OS</div>
    </div>
  );
}