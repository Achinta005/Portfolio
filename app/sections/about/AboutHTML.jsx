"use client";
import { useRef, useEffect, forwardRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState.jsx";
import { portfolioApi } from "../../lib/api/portfolioApi";
import { fetchGitHubData } from "../../lib/api/githubApi";
import useIsMobile from "../../../utils/useIsMobile";

const SECTION_START = 0.1;
const SECTION_END = 0.2;

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

const BLOCK_CFG = [
  { side: "left", delay: 0.00, color: "#00ffcc" },
  { side: "left", delay: 0.06, color: "#00d2ff" },
  { side: "left", delay: 0.12, color: "#a78bfa" },
  { side: "right", delay: 0.05, color: "#00b8ff" },
  { side: "right", delay: 0.18, color: "#7c3aed" },
  { side: "up", delay: 0.28, color: "#00ffcc" },
  { side: "up", delay: 0.33, color: "#00b8ff" },
  { side: "up", delay: 0.38, color: "#a78bfa" },
  { side: "up", delay: 0.43, color: "#f472b6" },
];

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

const LANG_COLORS = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572A5",
  "Jupyter Notebook": "#DA5B0B", Rust: "#dea584", Go: "#00add8",
  Java: "#b07219", C: "#555555", "C++": "#f34b7d", "C#": "#178600",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", Kotlin: "#A97BFF",
  Swift: "#ffac45", Ruby: "#701516", Dart: "#00B4AB", Vue: "#41b883",
};
function langColor(l) { return LANG_COLORS[l] ?? "#64748b"; }

function cellColor(count, max) {
  if (count === 0) return "rgba(255,255,255,0.05)";
  const t = Math.min(count / Math.max(max, 1), 1);
  if (t < 0.25) return "#0e4429";
  if (t < 0.50) return "#006d32";
  if (t < 0.75) return "#26a641";
  return "#39d353";
}

const Card = forwardRef(function Card({ children, color = "#00ffcc", style = {} }, ref) {
  return (
    <div
      ref={ref}
      style={{
        padding: "14px 16px",
        background: "rgba(0,8,24,0.72)",
        border: `1px solid ${color}22`,
        borderRadius: "14px",
        backdropFilter: "blur(18px)",
        boxShadow: `0 0 40px ${color}06`,
        position: "relative",
        overflow: "hidden",
        visibility: "hidden",
        willChange: "transform, opacity",
        boxSizing: "border-box",
        width: "100%",
        ...style,
      }}
    >
      <div data-corner style={{
        position: "absolute", top: 0, left: 0, width: 24, height: 24,
        borderTop: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`,
        borderRadius: "14px 0 0 0", opacity: 0.5, pointerEvents: "none",
        transformOrigin: "top left",
      }} />
      {children}
    </div>
  );
});

function HeaderCard({ header }) {
  const lines = header.title.split("\n");
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 3, height: 20, background: "linear-gradient(#00ffcc,#7c3aed)", borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontFamily: "monospace", fontSize: "clamp(0.58rem,1.5vw,0.68rem)", color: "#00ffcc", letterSpacing: "0.2em" }}>
          {header.tag}
        </span>
      </div>
      <h2 style={{
        margin: 0, fontFamily: "monospace",
        fontSize: "clamp(0.9rem,4vw,1.45rem)", fontWeight: 800,
        background: "linear-gradient(90deg,#fff 30%,#00d2ff)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        lineHeight: 1.25,
      }}>
        {lines.map((l, i) => <span key={i}>{l}{i < lines.length - 1 && <br />}</span>)}
      </h2>
    </div>
  );
}

function GitHubStreakCard({ gh }) {
  const color = "#00d2ff";
  if (!gh) return (
    <div style={{ color: "#334155", fontFamily: "monospace", fontSize: "0.72rem", textAlign: "center", padding: "8px 0" }}>
      loading…
    </div>
  );
  const items = [
    { label: "Total Contribs", value: gh.totalContribs, color: "#39d353" },
    { label: "Private", value: gh.privateContribs, color: "#a78bfa" },
    { label: "Current Streak", value: `${gh.streakCurrent}d`, color: "#00ffcc" },
    { label: "Longest Streak", value: `${gh.streakLongest}d`, color: "#f472b6" },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill={color}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span style={{ color, fontFamily: "monospace", fontSize: "clamp(0.58rem,1.4vw,0.68rem)", letterSpacing: "0.08em" }}>
          GITHUB ACTIVITY · LAST YEAR
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {items.map(it => (
          <div key={it.label} style={{
            background: `${it.color}0d`, border: `1px solid ${it.color}25`,
            borderRadius: 8, padding: "7px 8px",
          }}>
            <div style={{ color: it.color, fontFamily: "monospace", fontWeight: 800, fontSize: "clamp(0.85rem,3vw,1rem)" }}>{it.value}</div>
            <div style={{ color: "#475569", fontSize: "clamp(0.5rem,1.2vw,0.58rem)", letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 2 }}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TraitsCard({ traits }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {traits.map(t => (
        <motion.div
          key={t.label}
          whileHover={{ x: 4, backgroundColor: `${t.color}18` }}
          transition={{ duration: 0.2 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 8px",
            background: `${t.color}10`, border: `1px solid ${t.color}30`, borderRadius: 8,
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.color, boxShadow: `0 0 7px ${t.color}`, flexShrink: 0 }} />
          <span style={{ color: t.color, fontFamily: "monospace", fontSize: "clamp(0.68rem,2vw,0.8rem)", fontWeight: 700, flexShrink: 0 }}>{t.label}</span>
          <span style={{ color: "#64748b", fontSize: "clamp(0.6rem,1.6vw,0.72rem)" }}>{t.desc}</span>
        </motion.div>
      ))}
    </div>
  );
}

function GitHubProfileCard({ gh }) {
  if (!gh) return (
    <div style={{ color: "#334155", fontFamily: "monospace", fontSize: "0.78rem", textAlign: "center", padding: "16px 0" }}>
      loading github…
    </div>
  );
  const pills = [
    { label: "Repos", value: gh.publicRepos, color: "#00ffcc" },
    { label: "Stars", value: gh.totalStars, color: "#f7df1e" },
    { label: "Followers", value: gh.followers, color: "#00b8ff" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={gh.avatar} alt="avatar" loading="lazy" decoding="async" style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #00ffcc44", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ color: "#e2e8f0", fontFamily: "monospace", fontWeight: 700, fontSize: "clamp(0.78rem,2.2vw,0.9rem)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{gh.name}</div>
          {gh.bio && <div style={{ color: "#64748b", fontSize: "clamp(0.58rem,1.5vw,0.68rem)", marginTop: 2, lineHeight: 1.4 }}>
            {gh.bio.length > 55 ? gh.bio.slice(0, 55) + "…" : gh.bio}
          </div>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {pills.map(s => (
          <div key={s.label} style={{
            flex: 1, textAlign: "center", padding: "6px 2px",
            background: `${s.color}0d`, border: `1px solid ${s.color}30`, borderRadius: 8,
          }}>
            <div style={{ color: s.color, fontFamily: "monospace", fontWeight: 800, fontSize: "clamp(0.85rem,2.5vw,1rem)" }}>{s.value}</div>
            <div style={{ color: "#475569", fontSize: "clamp(0.48rem,1.2vw,0.58rem)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ color: "#334155", fontFamily: "monospace", fontSize: "clamp(0.52rem,1.3vw,0.62rem)", letterSpacing: "0.1em", marginBottom: 6 }}>TOP LANGUAGES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {(gh.languages ?? []).map(({ lang, pct }) => (
            <div key={lang}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ color: langColor(lang), fontFamily: "monospace", fontSize: "clamp(0.58rem,1.5vw,0.68rem)" }}>{lang}</span>
                <span style={{ color: "#334155", fontFamily: "monospace", fontSize: "clamp(0.58rem,1.5vw,0.68rem)" }}>{pct}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: langColor(lang), borderRadius: 4, opacity: 0.85 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommitHeatmapCard({ gh, isMobile }) {
  const grid = gh?.grid ?? Array(364).fill(0);
  const max = Math.max(...grid, 1);
  const totalContribs = gh?.totalContribs ?? 0;
  // Responsive cell size
  const CELL = isMobile ? 6 : 10;
  const GAP = 2;

  const today = new Date();
  const monthLabels = [];
  for (let w = 0; w < 52; w++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - (363 - w * 7));
    if (dt.getDate() <= 7) {
      monthLabels.push({ col: w, label: dt.toLocaleString("default", { month: "short" }) });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="#39d353">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "clamp(0.58rem,1.5vw,0.68rem)" }}>Contribution Activity</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {gh?.privateContribs > 0 && (
            <span style={{ color: "#a78bfa", fontFamily: "monospace", fontSize: "clamp(0.52rem,1.3vw,0.62rem)" }}>
              🔒 {gh.privateContribs} private
            </span>
          )}
          <span style={{ color: "#39d353", fontFamily: "monospace", fontSize: "clamp(0.58rem,1.5vw,0.68rem)", fontWeight: 700 }}>
            {totalContribs} commits
          </span>
        </div>
      </div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ position: "relative", paddingTop: 14, minWidth: `${52 * (CELL + GAP)}px` }}>
          {monthLabels.map(({ col, label }) => (
            <div key={col} style={{
              position: "absolute", top: 0,
              left: col * (CELL + GAP),
              color: "#475569", fontFamily: "monospace",
              fontSize: isMobile ? "0.45rem" : "0.58rem",
            }}>{label}</div>
          ))}
          <div style={{ display: "flex", gap: GAP }}>
            {Array.from({ length: 52 }, (_, w) => (
              <div key={w} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                {Array.from({ length: 7 }, (_, d) => {
                  const idx = w * 7 + d;
                  const count = grid[idx] ?? 0;
                  return (
                    <div key={d} title={`${count} contribution${count !== 1 ? "s" : ""}`}
                      style={{ width: CELL, height: CELL, borderRadius: 2, background: cellColor(count, max), flexShrink: 0 }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
        <span style={{ color: "#334155", fontFamily: "monospace", fontSize: "0.55rem" }}>Less</span>
        {["rgba(255,255,255,0.05)", "#0e4429", "#006d32", "#26a641", "#39d353"].map((c, i) => (
          <div key={i} style={{ width: CELL - 1, height: CELL - 1, borderRadius: 2, background: c }} />
        ))}
        <span style={{ color: "#334155", fontFamily: "monospace", fontSize: "0.55rem" }}>More</span>
      </div>
    </div>
  );
}

function BASE_SHADOW(c) {
  return `0 10px 24px rgba(0,0,0,0.5),0 0 0 1px ${c}1a,0 0 18px ${c}18,inset 0 1px 0 ${c}20`;
}

const StatChip = forwardRef(function StatChip({ s, isMobile }, ref) {
  const isUrl = s.icon?.startsWith("http");
  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{
        // On mobile: 2-column grid (calc 50% minus gap). On desktop: fixed width.
        flex: isMobile ? "1 1 calc(50% - 5px)" : "0 0 160px",
        minWidth: isMobile ? 0 : "120px",
        maxWidth: isMobile ? "none" : "160px",
        padding: isMobile ? "12px 8px 10px" : "20px 12px 16px",
        borderRadius: "14px", textAlign: "center",
        cursor: "default", position: "relative",
        visibility: "hidden", willChange: "transform, opacity",
        background: `linear-gradient(160deg,rgba(255,255,255,0.07) 0%,rgba(0,0,0,0) 55%,${s.color}0a 100%),rgba(0,8,24,0.85)`,
        boxShadow: BASE_SHADOW(s.color),
        borderTop: `1px solid ${s.color}30`, borderLeft: `1px solid ${s.color}14`,
        borderRight: `1px solid ${s.color}14`, borderBottom: `4px solid ${s.color}40`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ height: isMobile ? "1.1rem" : "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: isMobile ? 5 : 8 }}>
        {isUrl
          ? <img src={s.icon} alt={s.label} style={{ width: isMobile ? "1.2rem" : "2rem", height: isMobile ? "1.2rem" : "2rem", objectFit: "contain" }} />
          : s.icon ? <span style={{ fontSize: isMobile ? "1.1rem" : "1.5rem", lineHeight: 1 }}>{s.icon}</span>
            : <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%", background: `${s.color}33` }} />
        }
      </div>
      <span style={{ display: "block", fontFamily: "monospace", fontWeight: 800, fontSize: isMobile ? "clamp(1rem,5vw,1.2rem)" : "1.5rem", color: s.color, marginBottom: 4 }}>
        {s.value}+
      </span>
      <span style={{ display: "block", color: "#64748b", fontSize: isMobile ? "0.58rem" : "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {s.label}
      </span>
    </motion.div>
  );
});

export default function AboutHTML() {
  const isMobile = useIsMobile();
  // Use null as the initial state to detect "not yet resolved"
  const [hydrated, setHydrated] = useState(false);

  const blockRefs = useRef([]);
  const statRefs = useRef([null, null, null, null]);
  const sectionRef = useRef();
  const scrollProg = useMotionValue(0);
  const gsapFired = useRef(false);

  const [about, setAbout] = useState(null);
  const [gh, setGh] = useState(null);

  // Mark hydrated after first render so isMobile is reliable
  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    portfolioApi.getAbout().then(setAbout).catch(console.error);
    fetchGitHubData().then(setGh).catch(console.error);
  }, []);

  const stats = about?.stats ?? DEFAULT_STATS;
  const traits = about?.traits ?? DEFAULT_TRAITS;
  const header = about?.header ?? DEFAULT_HEADER;

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(0,255,204,0.0) 0%, transparent 70%)" },
        {
          backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(0,255,204,0.04) 0%, transparent 70%)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "bottom 20%", scrub: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const SLIDE = isMobile ? 40 : 120;
    const RISE = isMobile ? 20 : 40;
    return subscribeToScroll((offset) => {
      const raw = (offset - SECTION_START) / (SECTION_END - SECTION_START);
      const prog = Math.max(0, Math.min(1, raw));
      scrollProg.set(prog);

      for (let i = 0; i < 5; i++) {
        const el = blockRefs.current[i];
        const cfg = BLOCK_CFG[i];
        if (!el) continue;
        const lp = Math.max(0, Math.min(1, (prog - cfg.delay) / 0.35));
        const entered = easeOut(lp);
        const exitT = prog > 0.90 ? easeOut((prog - 0.90) / 0.10) : 0;
        const dir = isMobile ? 0 : (cfg.side === "left" ? -1 : 1);
        const ty = isMobile ? RISE * ((1 - entered) + exitT) : 0;
        const tx = isMobile ? 0 : dir * SLIDE * ((1 - entered) + exitT);
        const alpha = entered * (1 - exitT);
        el.style.opacity = alpha;
        el.style.transform = isMobile ? `translateY(${ty}px)` : `translateX(${tx}px)`;
        el.style.visibility = alpha < 0.01 ? "hidden" : "visible";
      }

      for (let i = 0; i < stats.length; i++) {
        const el = statRefs.current[i];
        const cfg = BLOCK_CFG[5 + i];
        if (!el) continue;
        const lp = Math.max(0, Math.min(1, (prog - cfg.delay) / 0.30));
        const entered = easeOut(lp);
        const exitT = prog > 0.90 ? easeOut((prog - 0.90) / 0.10) : 0;
        const ty = RISE * ((1 - entered) + exitT);
        const alpha = entered * (1 - exitT);
        el.style.opacity = alpha;
        el.style.transform = `translateY(${ty}px)`;
        el.style.visibility = alpha < 0.01 ? "hidden" : "visible";
      }
    });
  }, [stats.length, scrollProg, isMobile]);

  useEffect(() => {
    return scrollProg.on("change", (v) => {
      if (v > 0.01 && !gsapFired.current) {
        gsapFired.current = true;
        blockRefs.current.forEach((el, i) => {
          if (!el) return;
          const corner = el.querySelector("[data-corner]");
          if (!corner) return;
          gsap.fromTo(corner,
            { scaleX: 0, scaleY: 0, opacity: 0 },
            { scaleX: 1, scaleY: 1, opacity: 0.5, duration: 0.6, delay: i * 0.07, ease: "expo.out" }
          );
        });
      }
    });
  }, [scrollProg]);

  // Don't render with desktop styles before hydration to avoid flash of wrong layout
  if (!hydrated) return null;

  return (
    <div
      ref={sectionRef}
      id="About"
      style={{
        position: "absolute",
        top: isMobile ? "100vh" : "150vh",
        left: 0,
        // KEY FIX: width 100vw with overflow hidden kills the right-side bleed
        width: "100vw",
        overflow: "hidden",
        minHeight: isMobile ? "auto" : "100vh",
        height: isMobile ? "auto" : "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: isMobile ? "flex-start" : "center",
        gap: isMobile ? "10px" : "18px",
        pointerEvents: "none",
        // Only apply right padding on desktop
        paddingRight: isMobile ? "0" : "120px",
        paddingLeft: isMobile ? "0" : "0",
        paddingTop: isMobile ? "24px" : "0",
        paddingBottom: isMobile ? "32px" : "0",
        boxSizing: "border-box",
      }}
    >
      {/* ── Card Grid ─────────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 40px 1fr",
        gridTemplateRows: isMobile ? "auto" : "auto auto auto",
        gridTemplateAreas: isMobile
          ? `"header" "streak" "profile" "traits" "heatmap"`
          : `"header  gap  profile"
             "streak  gap  profile"
             "traits  gap  heatmap"`,
        gap: isMobile ? "8px" : "10px 0",
        // Mobile: full width with horizontal padding. Desktop: constrained.
        maxWidth: "940px",
        width: isMobile ? "100%" : "92%",
        paddingLeft: isMobile ? "16px" : "0",
        paddingRight: isMobile ? "16px" : "0",
        pointerEvents: "auto",
        alignItems: "stretch",
        boxSizing: "border-box",
      }}>
        <Card ref={el => blockRefs.current[0] = el} color={BLOCK_CFG[0].color} style={{ gridArea: "header" }}>
          <HeaderCard header={header} />
        </Card>
        <Card ref={el => blockRefs.current[1] = el} color={BLOCK_CFG[1].color} style={{ gridArea: "streak" }}>
          <GitHubStreakCard gh={gh} />
        </Card>
        <Card ref={el => blockRefs.current[2] = el} color={BLOCK_CFG[2].color} style={{ gridArea: "traits" }}>
          <TraitsCard traits={traits} />
        </Card>
        <Card ref={el => blockRefs.current[3] = el} color={BLOCK_CFG[3].color} style={{ gridArea: "profile" }}>
          <GitHubProfileCard gh={gh} />
        </Card>
        <Card ref={el => blockRefs.current[4] = el} color={BLOCK_CFG[4].color} style={{ gridArea: "heatmap" }}>
          <CommitHeatmapCard gh={gh} isMobile={isMobile} />
        </Card>
      </div>

      {/* ── Stat Chips ────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        gap: isMobile ? "8px" : "20px",
        maxWidth: "940px",
        // Mirror the card grid padding on mobile
        width: isMobile ? "100%" : "92%",
        paddingLeft: isMobile ? "16px" : "0",
        paddingRight: isMobile ? "16px" : "0",
        pointerEvents: "auto",
        flexWrap: "wrap",
        boxSizing: "border-box",
      }}>
        {stats.map((s, i) => (
          <StatChip key={s.label} s={s} isMobile={isMobile} ref={el => { statRefs.current[i] = el; }} />
        ))}
      </div>
    </div>
  );
}