"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { portfolioApi } from "@/app/lib/api/portfolioApi";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState";
import useIsMobile from "../../../utils/useIsMobile";
import { ExternalLink, Lock, Github } from "lucide-react";

const PROJ_START = 0.34;
const PROJ_END = 0.42;

function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
function easeInQuart(t) { return t * t * t * t; }

export const projAnimRef = { opacity: 0, scale: 0, active: false };

const SHUFFLE_INTERVAL = 3500;
const MEDIA_INTERVAL = 2200;

const CATEGORY_COLORS = {
  "Web Development": "#00b8ff",
  "Machine Learning": "#a78bfa",
  "Other": "#34d399",
};

const DESKTOP_CARD_WIDTH = "clamp(500px, 48vw, 700px)";
const DESKTOP_CARD_HEIGHT = "min(85vh, 600px)";
const DESKTOP_RIGHT_SHIFT = "10vw";

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function dedupeAndPick(rawList) {
  const seen = new Map();
  for (const p of rawList) {
    if (!seen.has(p._id)) seen.set(p._id, p);
  }
  return [...seen.values()].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
}

function toDisplay(p, idx) {
  const categoryColor = CATEGORY_COLORS[p.category] ?? "#00b8ff";
  const links = [];
  if (p.liveUrl) links.push({ label: "Live Demo", icon: <ExternalLink size={13} />, isLive: true, href: p.liveUrl });
  else links.push({ label: "Local Only", icon: <Lock size={13} />, isLive: false, href: null });
  if (p.githubUrl) links.push({ label: "Source Code", icon: <Github size={13} />, isLive: false, href: p.githubUrl });
  const media = Array.isArray(p.media) && p.media.length
    ? p.media.filter(m => !m.type || m.type === "image").map(m => ({ src: m.src, label: m.label ?? "" }))
    : p.image ? [{ src: p.image, label: "" }] : [];
  return {
    id: p._id,
    num: String(idx + 1).padStart(2, "0"),
    title: (p.title ?? "").replace(/^#+\s*/, "").trim().replace(/\bCutomer\b/g, "Customer"),
    tags: [...new Set(p.technologies ?? [])],
    category: p.category ?? "Other",
    categoryColor,
    desc: p.description ?? "",
    links,
    media,
    accent: categoryColor,
    modelAccuracy: p.modelAccuracy ?? null,
  };
}

function Tag({ label, accent }) {
  return (
    <span style={{
      padding: "5px 14px",
      borderRadius: "100px",
      background: `${accent}12`,
      border: `1px solid ${accent}35`,
      fontSize: "11px",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: `${accent}cc`,
      whiteSpace: "nowrap",
      letterSpacing: "0.3px",
    }}>{label}</span>
  );
}

// ── LEFT PANEL ────────────────────────────────────────────────────────────────
function LeftPanel({ project, visible, sectionOpacity, onHoverChange }) {
  const panelRef = useRef();
  const [mediaIdx, setMediaIdx] = useState(0);
  const [mediaFade, setMediaFade] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { setMediaIdx(0); setMediaFade(f => f + 1); }, [project?.id]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!project || project.media.length <= 1) return;
    timerRef.current = setInterval(() => {
      setMediaIdx(prev => { setMediaFade(f => f + 1); return (prev + 1) % project.media.length; });
    }, MEDIA_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [project?.id, project?.media?.length]);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      opacity: visible ? sectionOpacity : 0,
      x: visible ? 0 : -28,
      duration: 0.5,
      ease: "power3.out",
      pointerEvents: visible && sectionOpacity > 0.05 ? "auto" : "none",
    });
  }, [visible, sectionOpacity]);

  if (!project) return null;
  const current = project.media[mediaIdx];
  const goMedia = (i) => { setMediaIdx(i); setMediaFade(f => f + 1); };

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: "32px",
        // Push close to the main card — right edge lands ~20px from card left
        right: `calc(50vw - ${DESKTOP_RIGHT_SHIFT} + ${DESKTOP_CARD_WIDTH} / 2 + 20px)`,
        top: "50%",
        transform: "translateY(-50%)",
        // Wide left card - dynamic width filling space, constrained by min/max
        width: "auto",
        maxWidth: "460px",
        minWidth: "280px",
        height: DESKTOP_CARD_HEIGHT,
        background: "linear-gradient(145deg, rgba(0,6,18,0.92) 0%, rgba(0,10,28,0.88) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "18px",
        border: `1px solid ${project.accent}35`,
        boxShadow: `0 0 0 1px ${project.accent}10, 0 8px 40px rgba(0,0,0,0.6), 0 0 80px ${project.accent}12`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 200,
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      {/* Top shimmer line */}
      <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`, opacity: 0.7, zIndex: 2 }} />

      {/* IMAGE — 62% height, full bleed */}
      <div style={{ position: "relative", flex: "0 0 62%", overflow: "hidden", background: "rgba(0,4,12,0.9)" }} onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}>
        {current
          ? <img key={mediaFade} src={current.src} alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", animation: "mediaFadeIn 0.4s ease both" }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: `${project.accent}20`, fontSize: "40px" }}>⬡</div>
        }

        {/* Gradient fade into bottom section */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(transparent, rgba(0,6,18,0.98))", pointerEvents: "none" }} />

        {/* Num badge */}
        <div style={{ position: "absolute", top: "10px", right: "12px", fontFamily: "monospace", fontSize: "28px", fontWeight: 900, color: `${project.accent}18`, lineHeight: 1, pointerEvents: "none" }}>{project.num}</div>

        {/* Quick View label */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", alignItems: "center", gap: "5px", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", borderRadius: "6px", padding: "3px 8px", border: `1px solid ${project.accent}20` }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: project.accent, boxShadow: `0 0 6px ${project.accent}` }} />
          <span style={{ fontFamily: "monospace", fontSize: "8px", color: `${project.accent}cc`, letterSpacing: "2.5px", textTransform: "uppercase" }}>Quick View</span>
        </div>

        {/* Category + title overlay */}
        <div style={{ position: "absolute", bottom: "10px", left: "14px", right: "14px", pointerEvents: "none" }}>
          <div style={{ marginBottom: "6px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "2px 10px", borderRadius: "100px",
              background: `${project.categoryColor}22`,
              border: `1px solid ${project.categoryColor}55`,
              fontSize: "8px", fontFamily: "monospace",
              color: project.categoryColor, letterSpacing: "1px",
              boxShadow: `0 0 12px ${project.categoryColor}22`,
            }}>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: project.categoryColor, boxShadow: `0 0 4px ${project.categoryColor}` }} />
              {project.category}
            </span>
          </div>
          <div style={{ borderLeft: `3px solid ${project.accent}`, paddingLeft: "9px" }}>
            <h3 style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              color: "rgba(230,245,255,0.96)",
              lineHeight: 1.4,
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}># {project.title}</h3>
          </div>
        </div>

        {/* Image dots */}
        {project.media.length > 1 && (
          <div style={{ position: "absolute", bottom: "10px", right: "12px", display: "flex", gap: "4px", alignItems: "center" }}>
            {project.media.map((_, i) => (
              <div key={i} onClick={() => goMedia(i)} style={{ width: i === mediaIdx ? "16px" : "5px", height: "5px", borderRadius: "100px", background: i === mediaIdx ? project.accent : `${project.accent}35`, boxShadow: i === mediaIdx ? `0 0 6px ${project.accent}` : "none", transition: "all 0.3s ease", cursor: "pointer" }} />
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM — links */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "14px 16px 18px", gap: "8px", background: "linear-gradient(180deg, rgba(0,6,18,0) 0%, rgba(0,4,14,0.5) 100%)" }}>
        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${project.accent}30, transparent)`, marginBottom: "6px" }} />

        {project.links.map((link, i) => (
          <button
            key={link.label}
            onClick={() => link.href && window.open(link.href, "_blank")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "10px 16px", borderRadius: "12px",
              background: link.isLive
                ? `linear-gradient(135deg, ${project.accent}28 0%, ${project.accent}14 100%)`
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${link.isLive ? project.accent + "60" : "rgba(255,255,255,0.1)"}`,
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontWeight: link.isLive ? 600 : 400,
              color: link.isLive ? project.accent : "rgba(190,215,240,0.55)",
              cursor: link.href ? "pointer" : "default",
              width: "100%",
              transition: "all 0.22s ease",
              letterSpacing: "0.5px",
              boxShadow: link.isLive ? `inset 0 1px 0 ${project.accent}20` : "none",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-1px)";
              if (link.isLive) {
                e.currentTarget.style.boxShadow = `0 4px 20px ${project.accent}40, inset 0 1px 0 ${project.accent}30`;
                e.currentTarget.style.background = `linear-gradient(135deg, ${project.accent}38 0%, ${project.accent}20 100%)`;
              } else {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = link.isLive ? `inset 0 1px 0 ${project.accent}20` : "none";
              e.currentTarget.style.background = link.isLive
                ? `linear-gradient(135deg, ${project.accent}28 0%, ${project.accent}14 100%)`
                : "rgba(255,255,255,0.04)";
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center" }}>{link.icon}</span>
            {link.label}
          </button>
        ))}

        <p style={{ margin: "6px 0 0", textAlign: "center", fontFamily: "monospace", fontSize: "8px", color: `${project.accent}35`, letterSpacing: "2.5px", textTransform: "uppercase" }}>
          details on right →
        </p>
      </div>

      {/* Bottom shimmer */}
      <div style={{ position: "absolute", bottom: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(90deg, transparent, ${project.accent}50, transparent)` }} />
    </div>
  );
}

// ── RIGHT CARD — compact, text only ──────────────────────────────────────────
function ProjectCard({ project, fadeKey, onHoverChange, isMobile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={fadeKey}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => { setHovered(true); onHoverChange(true); }}
      onHoverEnd={() => { setHovered(false); onHoverChange(false); }}
      style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {isMobile ? (
        // MOBILE full layout
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflow: "hidden", minHeight: 0 }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "2px 10px", borderRadius: "100px", background: `${project.categoryColor}18`, border: `1px solid ${project.categoryColor}55`, fontSize: "10px", fontFamily: "monospace", color: project.categoryColor }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: project.categoryColor }} />{project.category}
            </span>
          </div>
          <div style={{ borderLeft: `2px solid ${project.accent}`, paddingLeft: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 700, fontFamily: "monospace", color: "rgba(220,240,255,0.95)", lineHeight: 1.35 }}># {project.title}</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {project.tags.map((t, i) => <Tag key={`${t}-${i}`} label={t} accent={project.accent} />)}
          </div>
          <p style={{ margin: 0, fontSize: "10px", lineHeight: 1.6, color: "rgba(180,210,235,0.7)", fontFamily: "monospace" }}>{project.desc}</p>
          {project.modelAccuracy != null && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 12px", borderRadius: "100px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", fontSize: "10px", fontFamily: "monospace", color: "#34d399" }}>✦ {project.modelAccuracy}% accuracy</span>
          )}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {project.links.map(link => (
              <motion.button key={link.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                onClick={() => link.href && window.open(link.href, "_blank")}
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "100px", background: link.isLive ? `${project.accent}22` : "rgba(255,255,255,0.04)", border: `1px solid ${link.isLive ? project.accent + "66" : "rgba(255,255,255,0.1)"}`, fontSize: "10px", fontFamily: "monospace", color: link.isLive ? project.accent : "rgba(200,220,240,0.6)", cursor: link.href ? "pointer" : "default" }}
              >{link.icon} {link.label}</motion.button>
            ))}
          </div>
        </div>
      ) : (
        // DESKTOP — text only, rich styling
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* Title block */}
          <div style={{ flexShrink: 0, marginBottom: "12px" }} onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}>
            {/* Category pill */}
            <div style={{ marginBottom: "8px" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "3px 10px", borderRadius: "100px",
                background: `${project.categoryColor}18`,
                border: `1px solid ${project.categoryColor}50`,
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                color: project.categoryColor,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                boxShadow: `0 0 16px ${project.categoryColor}18`,
              }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: project.categoryColor, boxShadow: `0 0 6px ${project.categoryColor}` }} />
                {project.category}
              </span>
            </div>

            {/* Title */}
            <div style={{ borderLeft: `3.5px solid ${project.accent}`, paddingLeft: "14px", position: "relative" }}>
              {/* Glow on border */}
              <div style={{ position: "absolute", left: "-1px", top: 0, bottom: 0, width: "3.5px", background: project.accent, borderRadius: "2.5px", boxShadow: `0 0 10px ${project.accent}, 0 0 20px ${project.accent}60`, pointerEvents: "none" }} />
              <h3 style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                color: "rgba(230,245,255,0.96)",
                lineHeight: 1.35,
                letterSpacing: "-0.3px",
              }}>
                <span style={{ color: `${project.accent}80`, fontSize: "15px" }}># </span>
                {project.title}
              </h3>
            </div>

            {/* Thin divider */}
            <div style={{ height: "1px", background: `linear-gradient(90deg, ${project.accent}30, transparent)`, marginTop: "10px" }} />
          </div>

          {/* Tech Stack */}
          <div style={{ flexShrink: 0, marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: `${project.accent}70`, letterSpacing: "3px", textTransform: "uppercase" }}>Tech Stack</span>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${project.accent}25, transparent)` }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {project.tags.map((t, i) => <Tag key={`${t}-${i}`} label={t} accent={project.accent} />)}
            </div>
          </div>

          {/* About */}
          <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", minHeight: 0, marginBottom: "12px" }} onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: `${project.accent}70`, letterSpacing: "3px", textTransform: "uppercase" }}>About</span>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${project.accent}25, transparent)` }} />
            </div>
            <p style={{
              margin: 0,
              fontSize: "12.5px",
              lineHeight: 1.65,
              color: "rgba(185,215,240,0.70)",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              letterSpacing: "0.1px",
            }}>
              {project.desc}
            </p>
          </div>

          {/* Accuracy */}
          {project.modelAccuracy != null && (
            <div style={{ flexShrink: 0, paddingTop: "10px", borderTop: `1px solid ${project.accent}15` }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "5px 14px", borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(52,211,153,0.06) 100%)",
                border: "1px solid rgba(52,211,153,0.35)",
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#34d399",
                boxShadow: "0 0 20px rgba(52,211,153,0.12), inset 0 1px 0 rgba(52,211,153,0.15)",
                letterSpacing: "0.3px",
              }}>
                <span style={{ fontSize: "14px" }}>✦</span>
                <span><span style={{ color: "rgba(52,211,153,0.6)", fontSize: "9px" }}>MODEL ACCURACY </span>{project.modelAccuracy}%</span>
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function NavBtn({ onClick, children, label }) {
  return (
    <motion.button onClick={onClick} aria-label={label}
      whileHover={{ scale: 1.12, background: "rgba(0,210,255,0.18)", borderColor: "rgba(0,210,255,0.6)" }}
      whileTap={{ scale: 0.92 }}
      style={{ background: "rgba(0,210,255,0.07)", border: "1px solid rgba(0,210,255,0.25)", color: "rgba(0,210,255,0.8)", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", cursor: "pointer", fontFamily: "monospace", flexShrink: 0, userSelect: "none" }}
    >{children}</motion.button>
  );
}

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
      <div style={{ fontSize: "22px", marginBottom: "8px" }}>⚠</div><div>{message}</div>
    </div>
  );
}

export default function ProjectsHTML() {
  const isMobile = useIsMobile();
  const overlayRef = useRef();
  const intervalRef = useRef(null);
  const isActiveRef = useRef(false);
  const hoveredRef = useRef(false);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [panelVisible, setPanelVisible] = useState(false);
  const [sectionOpacity, setSectionOpacity] = useState(0);

  const opacityMV = useMotionValue(0);
  const scaleMV = useMotionValue(0);

  useEffect(() => {
    setLoading(true);
    portfolioApi.getProjects()
      .then((raw) => {
        const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
        setProjects(dedupeAndPick(list).map(toDisplay));
        setLoading(false);
      })
      .catch((err) => { setError(err.message ?? "Failed to load projects"); setLoading(false); });
  }, []);

  const handleHoverChange = useCallback((v) => { hoveredRef.current = v; }, []);

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

  useEffect(() => {
    return subscribeToScroll((offset) => {
      const secT = clamp((offset - PROJ_START) / (PROJ_END - PROJ_START), 0, 1);
      const alive = offset >= PROJ_START && secT < 1;
      if (!alive) {
        opacityMV.set(0); scaleMV.set(0);
        projAnimRef.opacity = 0; projAnimRef.scale = 0; projAnimRef.active = false;
        isActiveRef.current = false;
        setPanelVisible(false); setSectionOpacity(0);
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
      opacityMV.set(opacity); scaleMV.set(sc);
      projAnimRef.opacity = opacity; projAnimRef.scale = sc;
      setSectionOpacity(opacity);
      setPanelVisible(opacity > 0.3 && !isMobile);
    });
  }, [opacityMV, scaleMV, isMobile]);

  useEffect(() => {
    const unsubO = opacityMV.on("change", (v) => {
      if (!overlayRef.current) return;
      gsap.set(overlayRef.current, { opacity: v, pointerEvents: v > 0.05 ? "auto" : "none" });
    });
    const unsubS = scaleMV.on("change", (v) => {
      if (!overlayRef.current) return;
      gsap.set(overlayRef.current, { scale: Math.max(0.01, v) });
    });
    const ctx = gsap.context(() => {
      if (!overlayRef.current) return;
      gsap.to(overlayRef.current, { boxShadow: "0 0 60px rgba(0,210,255,0.12), 0 0 0 1px rgba(0,210,255,0.15)", duration: 0.6, paused: true, id: "proj-glow" });
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
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes mediaFadeIn { from { opacity:0; transform:scale(1.04); } to { opacity:1; transform:scale(1); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {!loading && !error && project && (
        <LeftPanel project={project} visible={panelVisible} sectionOpacity={sectionOpacity} onHoverChange={handleHoverChange} />
      )}

      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: "380vh",
          // Shift right card slightly right so it's closer to center-right
          left: isMobile ? "50%" : `calc(50% + ${DESKTOP_RIGHT_SHIFT})`,
          transform: "translate(-50%, -50%) scale(0.01)",
          transformOrigin: "center center",
          width: isMobile ? "94vw" : DESKTOP_CARD_WIDTH,
          height: isMobile ? "min(85vh,600px)" : DESKTOP_CARD_HEIGHT,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 100,
          padding: isMobile ? "24px 28px" : "20px 24px",
          boxSizing: "border-box",
          color: "rgba(220,240,255,0.95)",
          background: "linear-gradient(145deg, rgba(0,5,15,0.88) 0%, rgba(0,8,22,0.82) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "18px",
          border: "1px solid rgba(0,210,255,0.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 0 0 1px rgba(0,210,255,0.06), 0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Top shimmer */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,210,255,0.7), transparent)", opacity: 0.5 }} />

        {/* Header */}
        <div style={{ marginBottom: "12px", textAlign: "center", flexShrink: 0 }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "rgba(225,242,255,0.96)", letterSpacing: "-0.5px", margin: 0, textShadow: "0 0 30px rgba(0,210,255,0.2)" }}>Projects</h2>
        </div>

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && project && (
          <>
            <ProjectCard project={project} fadeKey={fadeKey} onHoverChange={handleHoverChange} isMobile={isMobile} />

            {/* Nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "10px", flexShrink: 0 }}>
              <NavBtn onClick={goPrev} label="Previous">‹</NavBtn>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {projects.map((_, i) => (
                  <motion.div key={i} onClick={() => goTo(i)}
                    animate={{
                      scale: i === currentIndex ? 1.3 : 1,
                      background: i === currentIndex ? "#00d2ff" : "rgba(0,210,255,0.18)",
                      boxShadow: i === currentIndex ? "0 0 8px #00d2ff80" : "none",
                    }}
                    transition={{ duration: 0.25 }}
                    style={{ width: "6px", height: "6px", borderRadius: "50%", border: "1px solid rgba(0,210,255,0.3)", cursor: "pointer" }}
                  />
                ))}
              </div>
              <NavBtn onClick={goNext} label="Next">›</NavBtn>
            </div>

            {/* Counter */}
            <div style={{ textAlign: "center", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(0,210,255,0.35)", letterSpacing: "3px", flexShrink: 0 }}>
              {String(currentIndex + 1).padStart(2, "0")} <span style={{ color: "rgba(0,210,255,0.18)" }}>/</span> {String(projects.length).padStart(2, "0")}
            </div>
          </>
        )}

        {/* Bottom shimmer */}
        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,210,255,0.4), transparent)" }} />
      </div>
    </>
  );
}