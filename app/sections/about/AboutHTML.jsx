"use client";
import { useRef, useEffect, forwardRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { gsap } from "gsap";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState.jsx";
import { scrollProgressRef } from "../../../components/ImmersiveView/scrollState.jsx";
import { portfolioApi } from "../../lib/api/portfolioApi";

const SECTION_START = 0.1;
const SECTION_END = 0.2;

// ── Fallbacks ────────────────────────────────────────────────────────────────
const DEFAULT_STATS = [
  { value: "18+", label: "Projects", icon: "🚀", color: "#00ffcc" },
  { value: "4+", label: "Yrs Learning", icon: "📚", color: "#00b8ff" },
  { value: "35+", label: "Technologies", icon: "⚡", color: "#a78bfa" },
  { value: "3+", label: "Team Works", icon: "👥", color: "#f472b6" },
];

const DEFAULT_TRAITS = [
  { label: "Full-Stack", desc: "React · Node · Docker", color: "#00ffcc" },
  { label: "AI / ML", desc: "PyTorch · NumPy · GenAI", color: "#00b8ff" },
  { label: "Systems", desc: "DSA · DBMS · Networking", color: "#a78bfa" },
];

const DEFAULT_HEADER = {
  tag: "01 · ABOUT",
  title: "Building at the\nintersection of\ncode & creativity.",
};

const DEFAULT_BIO =
  "CS undergrad passionate about Full-Stack and AI / ML. " +
  "I ship end-to-end products — from model to interface — " +
  "and obsess over clean systems and fast feedback loops.";

const DEFAULT_CODE = {
  mission: "ship things that matter",
  currently: "exploring Deep Learning",
  openTo: "opportunities",
};

// ── Animation config ─────────────────────────────────────────────────────────
const BLOCK_CFG = [
  { side: "left", delay: 0.00, color: "#00ffcc" },
  { side: "right", delay: 0.07, color: "#00b8ff" },
  { side: "left", delay: 0.14, color: "#a78bfa" },
  { side: "right", delay: 0.20, color: "#7c3aed" },
  { side: "up", delay: 0.27, color: "#00ffcc" },
  { side: "up", delay: 0.32, color: "#00b8ff" },
  { side: "up", delay: 0.37, color: "#a78bfa" },
  { side: "up", delay: 0.42, color: "#f472b6" },
];

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ── Card shell ───────────────────────────────────────────────────────────────
const Card = forwardRef(function Card({ children, color = "#00ffcc", motionStyle }, ref) {
  return (
    <motion.div
      ref={ref}
      style={{
        padding: "22px 26px",
        background: "rgba(0,8,24,0.72)",
        border: `1px solid ${color}22`,
        borderRadius: "16px",
        backdropFilter: "blur(18px)",
        boxShadow: `0 0 40px ${color}06`,
        position: "relative",
        overflow: "hidden",
        visibility: "hidden",
        willChange: "transform, opacity",
        ...motionStyle,
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: 36, height: 36,
        borderTop: `1.5px solid ${color}`,
        borderLeft: `1.5px solid ${color}`,
        borderRadius: "16px 0 0 0",
        opacity: 0.5,
        pointerEvents: "none",
      }} />
      {children}
    </motion.div>
  );
});

// ── Content cards ─────────────────────────────────────────────────────────────
function HeaderCard({ header }) {
  const lines = header.title.includes("\n")
    ? header.title.split("\n")
    : [header.title];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 3, height: 26, background: "linear-gradient(#00ffcc,#7c3aed)", borderRadius: 2 }} />
        <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#00ffcc", letterSpacing: "0.25em" }}>
          {header.tag}
        </span>
      </div>
      <h2 style={{
        margin: 0, fontFamily: "monospace",
        fontSize: "clamp(1.1rem,2.2vw,1.75rem)", fontWeight: 800,
        background: "linear-gradient(90deg,#fff 30%,#00d2ff)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        lineHeight: 1.2,
      }}>
        {lines.map((line, i) => (
          <span key={i}>{line}{i < lines.length - 1 && <br />}</span>
        ))}
      </h2>
    </div>
  );
}

function BioCard({ bio }) {
  return (
    <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.8 }}>
      {bio}
    </p>
  );
}

function TraitsCard({ traits }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {traits.map(t => (
        <motion.div
          key={t.label}
          whileHover={{ x: 4, backgroundColor: `${t.color}18` }}
          transition={{ duration: 0.2 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 12px",
            background: `${t.color}10`, border: `1px solid ${t.color}30`, borderRadius: 10,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, boxShadow: `0 0 8px ${t.color}`, flexShrink: 0 }} />
          <span style={{ color: t.color, fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, flexShrink: 0 }}>{t.label}</span>
          <span style={{ color: "#64748b", fontSize: "0.73rem" }}>{t.desc}</span>
        </motion.div>
      ))}
    </div>
  );
}

function CodeCard({ code }) {
  return (
    <div style={{
      fontFamily: "monospace", fontSize: "0.78rem",
      background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,210,255,0.1)",
      borderRadius: 10, padding: "14px 16px", color: "#64748b", lineHeight: 1.9,
    }}>
      <span style={{ color: "#475569" }}>const </span>
      <span style={{ color: "#00d2ff" }}>achinta</span>
      <span style={{ color: "#475569" }}> = {"{"}</span><br />
      <span style={{ marginLeft: 14, color: "#94a3b8" }}>mission</span>
      <span style={{ color: "#475569" }}>: </span>
      <span style={{ color: "#00ffcc" }}>"{code.mission}"</span>
      <span style={{ color: "#475569" }}>,</span><br />
      <span style={{ marginLeft: 14, color: "#94a3b8" }}>currently</span>
      <span style={{ color: "#475569" }}>: </span>
      <span style={{ color: "#a78bfa" }}>"{code.currently}"</span>
      <span style={{ color: "#475569" }}>,</span><br />
      <span style={{ marginLeft: 14, color: "#94a3b8" }}>openTo</span>
      <span style={{ color: "#475569" }}>: </span>
      <span style={{ color: "#f472b6" }}>"{code.openTo}"</span><br />
      <span style={{ color: "#475569" }}>{"}"}</span>
    </div>
  );
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
function BASE_SHADOW(color) {
  return `0 10px 24px rgba(0,0,0,0.5),0 0 0 1px ${color}1a,0 0 18px ${color}18,inset 0 1px 0 ${color}20`;
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
const StatChip = forwardRef(function StatChip({ s }, ref) {
  const isUrl = s.icon && (s.icon.startsWith("http://") || s.icon.startsWith("https://"));

  return (
    <motion.div
      ref={ref}
      whileHover={{
        y: -6,
        scale: 1.06,
        boxShadow: `0 20px 40px rgba(0,0,0,0.6),0 0 0 1px ${s.color}55,0 0 36px ${s.color}40,inset 0 1px 0 ${s.color}40`,
        rotateX: -8,
        rotateY: 5,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{
        width: "160px", padding: "20px 12px 16px",
        borderRadius: "16px", textAlign: "center",
        cursor: "default", position: "relative", flexShrink: 0,
        visibility: "hidden", willChange: "transform, opacity",
        background: `linear-gradient(160deg,rgba(255,255,255,0.07) 0%,rgba(0,0,0,0) 55%,${s.color}0a 100%),rgba(0,8,24,0.85)`,
        boxShadow: BASE_SHADOW(s.color),
        borderTop: `1px solid ${s.color}30`,
        borderLeft: `1px solid ${s.color}14`,
        borderRight: `1px solid ${s.color}14`,
        borderBottom: `4px solid ${s.color}40`,
        perspective: "500px",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: "12%", width: "76%", height: "1px", background: `linear-gradient(90deg,transparent,${s.color}66,transparent)` }} />
      <div style={{ position: "absolute", bottom: 6, left: "20%", width: "60%", height: "6px", borderRadius: "50%", background: `${s.color}18`, filter: "blur(4px)" }} />

      {/* Icon: image URL or emoji/text fallback */}
      <div style={{ height: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
        {isUrl ? (
          <img
            src={s.icon}
            alt={s.label}
            style={{
              width: "2rem",
              height: "2rem",
              objectFit: "contain",
              filter: `drop-shadow(0 0 6px ${s.color}88)`,
            }}
          />
        ) : s.icon ? (
          <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{s.icon}</span>
        ) : (
          <div style={{
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "50%",
            background: `${s.color}33`,
            border: `1px solid ${s.color}55`,
          }} />
        )}
      </div>

      <span style={{
        display: "block", fontFamily: "monospace", fontWeight: 800,
        fontSize: "1.5rem", color: s.color,
        textShadow: `0 0 22px ${s.color}bb,0 0 8px ${s.color}66`,
        letterSpacing: "0.02em", marginBottom: 6,
      }}>
        {s.value}+
      </span>
      <span style={{ display: "block", color: "#64748b", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {s.label}
      </span>
    </motion.div>
  );
});

// ── Main export ───────────────────────────────────────────────────────────────
export default function AboutHTML() {
  const blockRefs = useRef([]);
  const statRefs = useRef([null, null, null, null]);
  const sectionRef = useRef();
  const [about, setAbout] = useState(null);

  // Framer Motion value tracking scroll progress
  const scrollProg = useMotionValue(0);

  useEffect(() => {
    portfolioApi.getAbout().then(setAbout).catch(console.error);
  }, []);

  const stats = about?.stats ?? DEFAULT_STATS;
  const traits = about?.traits ?? DEFAULT_TRAITS;
  const header = about?.header ?? DEFAULT_HEADER;
  const bio = about?.bio ?? DEFAULT_BIO;
  const code = about?.code ?? DEFAULT_CODE;

  // ── GSAP ScrollTrigger: section-level entrance pin marker ──
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Subtle background pulse when section enters viewport
      gsap.fromTo(
        sectionRef.current,
        { backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(0,255,204,0.0) 0%, transparent 70%)" },
        {
          backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(0,255,204,0.04) 0%, transparent 70%)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const SLIDE_PX = 120;
    const RISE_PX = 40;

    return subscribeToScroll((offset) => {
      const raw = (offset - SECTION_START) / (SECTION_END - SECTION_START);
      const prog = Math.max(0, Math.min(1, raw));

      scrollProg.set(prog);

      for (let i = 0; i < 4; i++) {
        const el = blockRefs.current[i];
        const cfg = BLOCK_CFG[i];
        if (!el) continue;

        const lp = Math.max(0, Math.min(1, (prog - cfg.delay) / 0.35));
        const entered = easeOut(lp);
        const dir = cfg.side === "left" ? -1 : 1;
        const exitT = prog > 0.90 ? easeOut((prog - 0.90) / 0.10) : 0;
        const tx = dir * SLIDE_PX * ((1 - entered) + exitT);
        const alpha = entered * (1 - exitT);

        el.style.opacity = alpha;
        el.style.transform = `translateX(${tx}px)`;
        el.style.visibility = alpha < 0.01 ? "hidden" : "visible";
      }

      for (let i = 0; i < stats.length; i++) {
        const el = statRefs.current[i];
        const cfg = BLOCK_CFG[4 + i];
        if (!el) continue;

        const lp = Math.max(0, Math.min(1, (prog - cfg.delay) / 0.30));
        const entered = easeOut(lp);
        const exitT = prog > 0.90 ? easeOut((prog - 0.90) / 0.10) : 0;
        const ty = RISE_PX * ((1 - entered) + exitT);
        const alpha = entered * (1 - exitT);

        el.style.opacity = alpha;
        el.style.transform = `translateY(${ty}px)`;
        el.style.visibility = alpha < 0.01 ? "hidden" : "visible";
      }
    });
  }, [stats.length, scrollProg]);

  // ── GSAP: staggered entrance for cards when section first becomes visible ──
  // Fires once when scrollProg crosses 0.01
  const gsapFiredRef = useRef(false);
  useEffect(() => {
    return scrollProg.on("change", (v) => {
      if (v > 0.01 && !gsapFiredRef.current) {
        gsapFiredRef.current = true;
        // Corner accent lines on each card grow in
        blockRefs.current.forEach((el, i) => {
          if (!el) return;
          const corner = el.querySelector("[data-corner]");
          if (!corner) return;
          gsap.fromTo(corner,
            { scaleX: 0, scaleY: 0, opacity: 0 },
            { scaleX: 1, scaleY: 1, opacity: 0.5, duration: 0.6, delay: i * 0.08, ease: "expo.out" }
          );
        });
      }
    });
  }, [scrollProg]);

  return (
    <div
      ref={sectionRef}
      style={{
        position: "absolute", top: "150vh", left: 0,
        width: "100vw", height: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "22px", pointerEvents: "none",
      }}
    >
      {/* Cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 60px 1fr",
        gap: "14px 0",
        maxWidth: "920px", width: "92%",
        pointerEvents: "auto",
      }}>
        <Card ref={el => blockRefs.current[0] = el} color={BLOCK_CFG[0].color}>
          <div data-corner style={{ position: "absolute", top: 0, left: 0, width: 36, height: 36, borderTop: `1.5px solid ${BLOCK_CFG[0].color}`, borderLeft: `1.5px solid ${BLOCK_CFG[0].color}`, borderRadius: "16px 0 0 0", opacity: 0.5, pointerEvents: "none", transformOrigin: "top left" }} />
          <HeaderCard header={header} />
        </Card>
        <div />
        <Card ref={el => blockRefs.current[1] = el} color={BLOCK_CFG[1].color}>
          <div data-corner style={{ position: "absolute", top: 0, left: 0, width: 36, height: 36, borderTop: `1.5px solid ${BLOCK_CFG[1].color}`, borderLeft: `1.5px solid ${BLOCK_CFG[1].color}`, borderRadius: "16px 0 0 0", opacity: 0.5, pointerEvents: "none", transformOrigin: "top left" }} />
          <BioCard bio={bio} />
        </Card>
        <Card ref={el => blockRefs.current[2] = el} color={BLOCK_CFG[2].color}>
          <div data-corner style={{ position: "absolute", top: 0, left: 0, width: 36, height: 36, borderTop: `1.5px solid ${BLOCK_CFG[2].color}`, borderLeft: `1.5px solid ${BLOCK_CFG[2].color}`, borderRadius: "16px 0 0 0", opacity: 0.5, pointerEvents: "none", transformOrigin: "top left" }} />
          <TraitsCard traits={traits} />
        </Card>
        <div />
        <Card ref={el => blockRefs.current[3] = el} color={BLOCK_CFG[3].color}>
          <div data-corner style={{ position: "absolute", top: 0, left: 0, width: 36, height: 36, borderTop: `1.5px solid ${BLOCK_CFG[3].color}`, borderLeft: `1.5px solid ${BLOCK_CFG[3].color}`, borderRadius: "16px 0 0 0", opacity: 0.5, pointerEvents: "none", transformOrigin: "top left" }} />
          <CodeCard code={code} />
        </Card>
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex", flexDirection: "row",
        justifyContent: "center", alignItems: "stretch",
        gap: "20px", maxWidth: "920px", width: "92%",
        pointerEvents: "auto",
      }}>
        {stats.map((s, i) => (
          <StatChip key={s.label} s={s} ref={el => { statRefs.current[i] = el; }} />
        ))}
      </div>
    </div>
  );
}