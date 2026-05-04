"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";
import { scrollProgressRef } from "../../../components/ImmersiveView/scrollState";
import { portfolioApi } from "@/app/lib/api/portfolioApi";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState";

// ── Scroll config ─────────────────────────────────────────────────────────────
const TOTAL_PAGES = 7;
const PROJ_START = 0.34;  // ≈ 0.429 — starts right after Skills
const PROJ_END = 0.42;  // ≈ 0.571

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
function easeInQuart(t) { return t * t * t * t; }

// Shared ref so ProjectsSection (Three.js) can still read these if needed
export const projAnimRef = { opacity: 0, scale: 0, active: false };

// ── Constants ─────────────────────────────────────────────────────────────────
const SHUFFLE_INTERVAL = 3500;
const MEDIA_INTERVAL = 2200;

const CATEGORY_COLORS = {
  "Web Development": "#00b8ff",
  "Machine Learning": "#a78bfa",
  "Other": "#34d399",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function dedupeAndPick(rawList) {
  const seen = new Map();
  for (const p of rawList) {
    const key = p._id; // ← use _id, not githubUrl — multiple projects share same repo
    if (!seen.has(key)) seen.set(key, p);
  }
  return [...seen.values()].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
}

function toDisplay(p, idx) {
  const categoryColor = CATEGORY_COLORS[p.category] ?? "#00b8ff";
  const links = [];
  if (p.liveUrl) links.push({ label: "Live Demo", icon: "↗", isLive: true, href: p.liveUrl });
  else links.push({ label: "Local Only", icon: "○", isLive: false, href: null });
  if (p.githubUrl) links.push({ label: "Source Code", icon: "⊙", isLive: false, href: p.githubUrl });

  const media = Array.isArray(p.media) && p.media.length
    ? p.media.filter(m => !m.type || m.type === "image").map(m => ({ src: m.src, label: m.label ?? "" }))
    : p.image ? [{ src: p.image, label: "" }] : [];

  return {
    id: p._id,
    num: String(idx + 1).padStart(2, "0"),
    title: (p.title ?? "").replace(/^#+\s*/, "").trim(),
    tags: [...new Set(p.technologies ?? [])],  // ← dedupe tags
    category: p.category ?? "Other",
    categoryColor,
    desc: p.description ?? "",
    links,
    media,
    accent: categoryColor,
    modelAccuracy: p.modelAccuracy ?? null,
  };
}

// ── Tag ───────────────────────────────────────────────────────────────────────
function Tag({ label }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "100px",
      background: "rgba(0,210,255,0.08)", border: "1px solid rgba(0,210,255,0.2)",
      fontSize: "11px", fontFamily: "monospace",
      color: "rgba(180,220,255,0.75)", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// ── MediaGallery ──────────────────────────────────────────────────────────────
function MediaGallery({ media, accent, num, hovered }) {
  const [mediaIdx, setMediaIdx] = useState(0);
  const [mediaFade, setMediaFade] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { setMediaIdx(0); setMediaFade(f => f + 1); }, [media]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (media.length <= 1 || hovered) return;
    timerRef.current = setInterval(() => {
      setMediaIdx(prev => { setMediaFade(f => f + 1); return (prev + 1) % media.length; });
    }, MEDIA_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [media.length, hovered]);

  const goMedia = (i) => { setMediaIdx(i); setMediaFade(f => f + 1); };
  const current = media[mediaIdx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", height: "100%" }}>
      <div style={{
        borderRadius: "10px", overflow: "hidden",
        border: `1px solid ${accent}30`,
        background: "rgba(0,6,16,0.95)",
        position: "relative",
        flex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: 0,
      }}>
        {current
          ? <img
            key={mediaFade}
            src={current.src}
            alt={current.label || "screenshot"}
            style={{ width: "100%", height: "100%", objectFit: "cover", animation: "mediaFadeIn 0.35s ease both" }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          : <div style={{ textAlign: "center", color: "rgba(0,210,255,0.25)", fontFamily: "monospace", fontSize: "11px" }}>
            <div style={{ fontSize: "26px", marginBottom: "6px" }}>⬡</div>No media
          </div>
        }

        <div style={{ position: "absolute", top: "6px", right: "8px", fontSize: "18px", fontWeight: 800, fontFamily: "monospace", color: `${accent}35`, pointerEvents: "none" }}>{num}</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,transparent,${accent}80,transparent)`, pointerEvents: "none" }} />
        {current?.label && (
          <div style={{ position: "absolute", bottom: "6px", left: "8px", fontSize: "9px", fontFamily: "monospace", color: "rgba(200,230,255,0.35)", letterSpacing: "1px", pointerEvents: "none" }}>
            {current.label}
          </div>
        )}

        {media.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); goMedia((mediaIdx - 1 + media.length) % media.length); }} style={{ position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: `1px solid ${accent}44`, color: accent, borderRadius: "50%", width: "22px", height: "22px", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "monospace", opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}>‹</button>
            <button onClick={e => { e.stopPropagation(); goMedia((mediaIdx + 1) % media.length); }} style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: `1px solid ${accent}44`, color: accent, borderRadius: "50%", width: "22px", height: "22px", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "monospace", opacity: 0.7, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}>›</button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
          {media.map((_, i) => (
            <div key={i} onClick={() => goMedia(i)} style={{ height: "5px", width: i === mediaIdx ? "16px" : "5px", borderRadius: "100px", background: i === mediaIdx ? accent : `${accent}35`, border: `1px solid ${accent}45`, transition: "all 0.3s ease", cursor: "pointer" }} />
          ))}
        </div>
      )}
      {media.length > 1 && (
        <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: "8px", color: `${accent}45`, letterSpacing: "1.5px" }}>
          {String(mediaIdx + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
        </div>
      )}
    </div>
  );
}

// ── ProjectCard — Framer Motion entrance + hover ───────────────────────────────
function ProjectCard({ project, fadeKey, onHoverChange }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={fadeKey}
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => { setHovered(true); onHoverChange(true); }}
      onHoverEnd={() => { setHovered(false); onHoverChange(false); }}
      style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}  // ← ADD style
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: "16px",
        alignItems: "stretch",
        marginBottom: "10px",
        flex: 1,              // ← ADD
        overflow: "hidden",       // ← ADD
        minHeight: 0,
      }}>

        {/* TEXT COLUMN */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",       // ← change from "center" to "flex-start"
          overflowY: "auto",             // ← ADD scroll on text column
          paddingRight: "4px",
        }}>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "2px 10px", borderRadius: "100px", background: `${project.categoryColor}18`, border: `1px solid ${project.categoryColor}55`, fontSize: "10px", fontFamily: "monospace", color: project.categoryColor }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: project.categoryColor, display: "inline-block" }} />
              {project.category}
            </span>
          </div>

          <div style={{ borderLeft: `2px solid ${project.accent}`, paddingLeft: "10px", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "12px", fontWeight: 700, fontFamily: "monospace", color: "rgba(220,240,255,0.95)", lineHeight: 1.35 }}>
              # {project.title}
            </h3>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
            {project.tags.map((t, i) => <Tag key={`${t}-${i}`} label={t} />)}
          </div>

          <p style={{ margin: "0 0 8px", fontSize: "10px", lineHeight: 1.5, color: "rgba(180,210,235,0.65)", fontFamily: "monospace" }}>
            {project.desc}
          </p>

          {project.modelAccuracy != null && (
            <div style={{ marginBottom: "8px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "2px 10px", borderRadius: "100px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", fontSize: "10px", fontFamily: "monospace", color: "#34d399" }}>
                ✦ {project.modelAccuracy}% accuracy
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {project.links.map(link => (
              <motion.button
                key={link.label}
                whileHover={{ scale: 1.05, boxShadow: link.isLive ? `0 0 12px ${project.accent}44` : "none" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => link.href && window.open(link.href, "_blank")}
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "100px", background: link.isLive ? `${project.accent}22` : "rgba(255,255,255,0.04)", border: `1px solid ${link.isLive ? project.accent + "66" : "rgba(255,255,255,0.1)"}`, fontSize: "10px", fontFamily: "monospace", color: link.isLive ? project.accent : "rgba(200,220,240,0.6)", cursor: link.href ? "pointer" : "default" }}
              >{link.icon} {link.label}</motion.button>
            ))}
          </div>
        </div>

        {/* MEDIA COLUMN */}
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <MediaGallery media={project.media} accent={project.accent} num={project.num} hovered={hovered} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Nav button ────────────────────────────────────────────────────────────────
function NavBtn({ onClick, children, label }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.12, background: "rgba(0,210,255,0.18)", borderColor: "rgba(0,210,255,0.6)" }}
      whileTap={{ scale: 0.92 }}
      style={{ background: "rgba(0,210,255,0.07)", border: "1px solid rgba(0,210,255,0.25)", color: "rgba(0,210,255,0.8)", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", cursor: "pointer", fontFamily: "monospace", flexShrink: 0, userSelect: "none" }}
    >{children}</motion.button>
  );
}

// ── Loading / Error ───────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "monospace", color: "rgba(0,210,255,0.45)", fontSize: "11px" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} style={{ fontSize: "22px", marginBottom: "8px", display: "inline-block" }}>◌</motion.div>
      <div style={{ letterSpacing: "3px", textTransform: "uppercase" }}>Loading projects…</div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "monospace", color: "rgba(255,80,80,0.6)", fontSize: "11px" }}>
      <div style={{ fontSize: "22px", marginBottom: "8px" }}>⚠</div>
      <div>{message}</div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProjectsHTML() {
  const overlayRef = useRef();
  const intervalRef = useRef(null);
  const isActiveRef = useRef(false);
  const hoveredRef = useRef(false);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  // Framer Motion values for scroll-driven opacity + scale
  const opacityMV = useMotionValue(0);
  const scaleMV = useMotionValue(0);

  // ── Map prop → state ──
  useEffect(() => {
    setLoading(true);
    portfolioApi.getProjects()
      .then((raw) => {
        const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
        const display = dedupeAndPick(list).map(toDisplay);
        setProjects(display);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load projects");
        setLoading(false);
      });
  }, []);

  const handleHoverChange = useCallback((v) => { hoveredRef.current = v; }, []);

  // ── Navigation ──
  const goTo = useCallback((idx) => {
    if (!projects.length) return;
    setCurrentIndex(((idx % projects.length) + projects.length) % projects.length);
    setFadeKey(k => k + 1);
  }, [projects.length]);

  const startAutoShuffle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!projects.length) return;
    intervalRef.current = setInterval(() => {
      if (!isActiveRef.current || hoveredRef.current) return;
      setCurrentIndex(prev => { setFadeKey(k => k + 1); return (prev + 1) % projects.length; });
    }, SHUFFLE_INTERVAL);
  }, [projects.length]);

  const goNext = useCallback(() => { goTo(currentIndex + 1); startAutoShuffle(); }, [currentIndex, goTo, startAutoShuffle]);
  const goPrev = useCallback(() => { goTo(currentIndex - 1); startAutoShuffle(); }, [currentIndex, goTo, startAutoShuffle]);

  useEffect(() => { startAutoShuffle(); return () => clearInterval(intervalRef.current); }, [startAutoShuffle]);
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  // ── Lenis RAF → Framer Motion values + projAnimRef ──
  useEffect(() => {
    return subscribeToScroll((offset) => {
      const secT = clamp((offset - PROJ_START) / (PROJ_END - PROJ_START), 0, 1);
      const alive = offset >= PROJ_START && secT < 1;

      if (!alive) {
        opacityMV.set(0);
        scaleMV.set(0);
        projAnimRef.opacity = 0;
        projAnimRef.scale = 0;
        projAnimRef.active = false;
        isActiveRef.current = false;
        return;
      }

      isActiveRef.current = true;
      projAnimRef.active = true;

      const growT = easeOutQuart(Math.min(secT / 0.40, 1));
      const shrinkT = secT > 0.82 ? easeInQuart((secT - 0.82) / 0.18) : 0;
      const sc = Math.max(0.005, (0.02 + growT * 0.98) * (1 - shrinkT * 0.95));

      const fadeIn = clamp(secT / 0.10, 0, 1);
      const fadeOut = secT > 0.85 ? 1 - clamp((secT - 0.85) / 0.15, 0, 1) : 1;
      const opacity = fadeIn * fadeOut;

      opacityMV.set(opacity);
      scaleMV.set(sc);
      projAnimRef.opacity = opacity;
      projAnimRef.scale = sc;
    });
  }, [opacityMV, scaleMV]);

  // ── GSAP: write opacity + scale to overlay DOM directly (perf: no re-render) ──
  useEffect(() => {
    const unsubO = opacityMV.on("change", (v) => {
      if (!overlayRef.current) return;
      gsap.set(overlayRef.current, { opacity: v, pointerEvents: v > 0.05 ? "auto" : "none" });
    });
    const unsubS = scaleMV.on("change", (v) => {
      if (!overlayRef.current) return;
      gsap.set(overlayRef.current, { scale: Math.max(0.01, v) });
    });

    // GSAP ScrollTrigger: accent border glow when section is active
    const ctx = gsap.context(() => {
      if (!overlayRef.current) return;
      gsap.to(overlayRef.current, {
        boxShadow: "0 0 60px rgba(0,210,255,0.12), 0 0 0 1px rgba(0,210,255,0.15)",
        duration: 0.6,
        paused: true,
        id: "proj-glow",
      });
    });

    const unsubActive = opacityMV.on("change", (v) => {
      const tween = gsap.getById("proj-glow");
      if (!tween) return;
      if (v > 0.5) tween.play(); else tween.reverse();
    });

    return () => { unsubO(); unsubS(); unsubActive(); ctx.revert(); };
  }, [opacityMV, scaleMV]);

  const project = projects[currentIndex];

  return (
    <>
      <style>{`
        @keyframes mediaFadeIn {
          from { opacity:0; transform:scale(1.025); }
          to   { opacity:1; transform:scale(1);     }
        }
      `}</style>

      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: "380vh",
          left: "50%",
          transform: "translate(-50%,-50%) scale(0.01)",
          transformOrigin: "center center",
          width: "min(88vw,860px)",
          height: "min(80vh,520px)",   // ← ADD fixed height
          opacity: 0,
          pointerEvents: "none",
          zIndex: 100,
          padding: "20px 28px",
          boxSizing: "border-box",
          color: "rgba(220,240,255,0.95)",
          background: "rgba(0,4,12,0.55)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          border: "1px solid rgba(0,210,255,0.1)",
          display: "flex",             // ← ADD
          flexDirection: "column",           // ← ADD
          overflow: "hidden",           // ← ADD
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "14px", textAlign: "center" }}>
          <p style={{ fontSize: "9px", fontFamily: "monospace", color: "rgba(0,255,204,0.5)", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 2px" }}>— SELECTED WORK —</p>
          <h2 style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: "rgba(220,240,255,0.95)", letterSpacing: "-0.5px", margin: 0 }}>Projects</h2>
        </div>

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && project && (
          <>
            <ProjectCard project={project} fadeKey={fadeKey} onHoverChange={handleHoverChange} />

            {/* Nav row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "12px" }}>
              <NavBtn onClick={goPrev} label="Previous">‹</NavBtn>
              <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                {projects.map((_, i) => (
                  <motion.div
                    key={i}
                    onClick={() => goTo(i)}
                    animate={{ scale: i === currentIndex ? 1.3 : 1, background: i === currentIndex ? "#00d2ff" : "rgba(0,210,255,0.2)" }}
                    transition={{ duration: 0.25 }}
                    style={{ width: "6px", height: "6px", borderRadius: "50%", border: "1px solid rgba(0,210,255,0.3)", cursor: "pointer" }}
                  />
                ))}
              </div>
              <NavBtn onClick={goNext} label="Next">›</NavBtn>
            </div>

            {/* Counter */}
            <div style={{ textAlign: "center", marginTop: "8px", fontFamily: "monospace", fontSize: "9px", color: "rgba(0,210,255,0.35)", letterSpacing: "2px" }}>
              {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </div>
          </>
        )}
      </div>
    </>
  );
}