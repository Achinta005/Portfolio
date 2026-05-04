"use client";
import { useRef, useEffect, forwardRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { portfolioApi } from "@/app/lib/api/portfolioApi";
import dynamic from "next/dynamic";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState";


const PdfModal = dynamic(() => import("../../../utils/PdfModal"), { ssr: false });

const SECTION_START = 4 / 7;
const SECTION_END = 6 / 7;  // ← hard cap, give it 2/7 of scroll range
const CARD_HEIGHT = 160;
const CARD_GAP = 60; // vertical gap between cards in the stack
const CARD_STEP = CARD_HEIGHT + CARD_GAP; // total vertical step per cert

export const certSectionEndRef = { current: SECTION_END };

const ACCENT_PALETTE = [
  "#f97316", "#00b8ff", "#00ffcc", "#a78bfa",
  "#fb923c", "#34d399", "#f472b6", "#facc15",
  "#60a5fa", "#c084fc",
];

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t) { return t * t * t; }

// ── CertCard ──────────────────────────────────────────────────────────────────
const CertCard = forwardRef(function CertCard({ cert, side, onOpenPdf }, ref) {
  return (
    <div
      ref={ref}
      onClick={onOpenPdf}
      style={{
        position: "absolute",
        width: "min(42vw, 380px)",
        height: CARD_HEIGHT,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        cursor: "pointer",
        border: `1px solid ${cert.accent}33`,
        background: "rgba(4,8,28,0.88)",
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 50px ${cert.accent}10, inset 0 1px 0 ${cert.accent}18`,
        overflow: "hidden",
        willChange: "transform, opacity",
        // Position from center spine
        // left side: right edge touches spine (left: calc(50% - cardWidth - 28px))
        // right side: left edge touches spine (left: calc(50% + 28px))
        left: side === "left"
          ? "calc(50% - min(42vw, 380px) - 28px)"
          : "calc(50% + 28px)",
        top: 0,
      }}
    >
      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 18, height: 18, borderTop: `1.5px solid ${cert.accent}`, borderLeft: `1.5px solid ${cert.accent}`, borderRadius: "14px 0 0 0", opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 18, height: 18, borderBottom: `1.5px solid ${cert.accent}`, borderRight: `1.5px solid ${cert.accent}`, borderRadius: "0 0 14px 0", opacity: 0.6 }} />
      <div style={{ position: "absolute", top: 8, right: 12, fontFamily: "monospace", fontSize: "1.6rem", fontWeight: 800, color: `${cert.accent}10`, lineHeight: 1 }}>{cert.num}</div>

      {/* Icon */}
      <div style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${cert.accent}40`, background: "rgba(255,255,255,0.04)", boxShadow: `0 0 16px ${cert.accent}20`, fontSize: "1.8rem" }}>
        {cert.icon
          ? <img src={cert.icon} alt={cert.org} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "block"; }} />
          : null}
        <span style={{ display: cert.icon ? "none" : "block" }}>{cert.emoji}</span>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: cert.accent, marginBottom: 5 }}>{cert.org}</div>
        <div style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, marginBottom: 7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cert.title}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 100, border: `1px solid ${cert.accent}40`, background: `${cert.accent}12`, fontFamily: "monospace", fontSize: "0.55rem", letterSpacing: "0.15em", color: cert.accent }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: cert.accent, display: "inline-block" }} />
          {cert.year}
        </div>
      </div>
    </div>
  );
});

// ── Fixed Header Portal ───────────────────────────────────────────────────────
function CertFixedHeader({ headerRef, counterRef, N }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      ref={headerRef}
      style={{
        position: "fixed",
        top: "6vh",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        zIndex: 500,
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        width: "max-content",
      }}
    >
      <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#00ffcc", letterSpacing: "0.28em", textTransform: "uppercase", margin: "0 0 4px" }}>
        — CERTIFICATIONS —
      </p>
      <h2 style={{ margin: "0 0 6px", fontFamily: "monospace", fontSize: "clamp(1rem,2vw,1.5rem)", fontWeight: 800, background: "linear-gradient(90deg,#fff 40%,#00d2ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Achievements &amp; Credentials
      </h2>
      <span ref={counterRef} style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(148,163,184,0.45)", letterSpacing: "0.15em" }}>
        01 / {String(N).padStart(2, "0")}
      </span>
    </div>,
    document.body
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CertHTML() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfHeader, setPdfHeader] = useState("");

  const wrapperRef = useRef();
  const headerRef = useRef();
  const trackRef = useRef();   // the scrolling track
  const counterRef = useRef();
  const cardRefsRef = useRef([]);
  const dotRefsRef = useRef([]);

  const sectionT = useMotionValue(0);

  const handleClosePdf = () => { setIsModalOpen(false); setPdfUrl(null); };

  // ── Fetch ──
  useEffect(() => {
    portfolioApi.getCertifications()
      .then((raw) => {
        const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
        const mapped = list.map((item) => ({
          _id: item._id,
          title: item.name,
          org: item.issuer,
          year: item.year,
          icon: item.icon || "",
          emoji: "🏆",
          path: item.path || "#",
          // placeholders, overwritten below
          accent: "", num: "", side: "",
        }));

        mapped.sort((a, b) => Number(b.year) - Number(a.year));
        mapped.forEach((item, idx) => {
          item.num = String(idx + 1).padStart(2, "0");
          item.side = idx % 2 === 0 ? "left" : "right";
          item.accent = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
        });

        setCerts(mapped);
        setLoading(false);
      })
      .catch((err) => { setError(err.message ?? "Failed"); setLoading(false); });
  }, []);

  // ── Lenis RAF → sectionT ──
  useEffect(() => {
    return subscribeToScroll((offset) => {
      const t = clamp(
        (offset - SECTION_START) / (SECTION_END - SECTION_START),
        0, 1
      );
      sectionT.set(t);
    });
  }, [sectionT]);

  // ── sectionT → DOM ──
  useEffect(() => {
    const unsub = sectionT.on("change", (t) => {
      // Wrapper fade in/out
      const wIn = clamp(t / 0.05, 0, 1);
      const wOut = t > 0.95 ? clamp((t - 0.95) / 0.05, 0, 1) : 0;
      const wOp = easeOut(wIn) * (1 - easeIn(wOut));

      if (wrapperRef.current) {
        gsap.set(wrapperRef.current, {
          opacity: wOp,
          pointerEvents: wOp > 0.05 ? "auto" : "none",
          visibility: wOp < 0.01 ? "hidden" : "visible",
        });
      }

      // Header fade
      if (headerRef.current) {
        const hIn = clamp(t / 0.06, 0, 1);
        const hOut = t > 0.92 ? clamp((t - 0.92) / 0.08, 0, 1) : 0;
        const hOp = easeOut(hIn) * (1 - easeIn(hOut));
        gsap.set(headerRef.current, {
          opacity: hOp,
          visibility: hOp < 0.01 ? "hidden" : "visible",
        });
      }

      if (certs.length === 0) return;

      // scrollT drives which card is "active" (0 = first, 1 = last)
      const scrollT = clamp((t - 0.06) / 0.88, 0, 1);
      const activeFloat = scrollT * (certs.length - 1); // e.g. 4.7 means between card 4 and 5

      // Scroll the track: move so active card is vertically centered
      // Each card slot = CARD_STEP px. Center = 50vh - 160px/2 = 50vh - 80px
      // We want activeFloat * CARD_STEP to be at screen center
      if (trackRef.current) {
        const centerOffset = window.innerHeight / 2 - 80; // 80 = half card height
        gsap.set(trackRef.current, {
          y: centerOffset - activeFloat * CARD_STEP,
        });
      }

      // Per-card opacity/scale based on distance from active
      cardRefsRef.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(i - activeFloat);
        const opacity = easeOut(clamp(1 - dist / 1.2, 0, 1));
        const scale = 0.85 + opacity * 0.15;
        const side = certs[i]?.side;
        // Slide cards in from side when far
        const slideX = (side === "left" ? -1 : 1) * clamp(dist / 1.5, 0, 1) * 80;
        gsap.set(el, {
          opacity,
          scale,
          x: slideX,
          visibility: opacity < 0.02 ? "hidden" : "visible",
        });
      });

      // Dot glow
      dotRefsRef.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(i - activeFloat);
        const glow = clamp(1 - dist / 1.0, 0, 1);
        el.style.opacity = 0.3 + glow * 0.7;
        el.style.transform = `translate(-50%, -50%) scale(${0.7 + glow * 0.6})`;
      });

      // Counter
      if (counterRef.current) {
        const activeIdx = Math.round(activeFloat);
        counterRef.current.textContent = `${String(activeIdx + 1).padStart(2, "0")} / ${String(certs.length).padStart(2, "0")}`;
      }
    });
    return unsub;
  }, [sectionT, certs]);

  const N = certs.length;

  return (
    <>
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PdfModal pdfUrl={pdfUrl} onClose={handleClosePdf} header={pdfHeader} />
        </div>
      )}

      <CertFixedHeader headerRef={headerRef} counterRef={counterRef} N={N} />
      <div style={{
        position: "absolute",
        top: `${SECTION_START * 100}vh`,   // where cert section starts
        left: 0,
        width: "1px",
        height: `${(SECTION_END - SECTION_START) * 100}vh`,  // how long it lasts
        pointerEvents: "none",
      }} />

      {/* Fixed viewport overlay — always covers screen when section is active */}
      <div
        ref={wrapperRef}
        style={{
          position: "fixed",   // ← KEY CHANGE: fixed not absolute
          inset: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: 100,
          overflow: "hidden",
        }}
      >
        {/* Scroll hint */}
        <motion.p
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "6vh", left: "50%", transform: "translateX(-50%)", fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(148,163,184,0.35)", margin: 0, zIndex: 20, whiteSpace: "nowrap" }}
        >↓ scroll to explore</motion.p>

        {loading && (
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "monospace", color: "rgba(148,163,184,0.5)", fontSize: "0.75rem", letterSpacing: "0.2em" }}
          >LOADING CERTIFICATES...</motion.p>
        )}
        {error && (
          <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "monospace", color: "#f87171", fontSize: "0.75rem" }}>{error}</p>
        )}

        {!loading && !error && N > 0 && (
          <>
            {/* Central spine — fixed in viewport center */}
            <div style={{
              position: "absolute",
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              width: 2,
              height: "100%",
              background: "linear-gradient(180deg,transparent,rgba(0,255,204,0.15) 20%,rgba(0,184,255,0.15) 80%,transparent)",
              zIndex: 0,
            }} />

            {/* Scrolling track — GSAP moves this up/down */}
            <div
              ref={trackRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                willChange: "transform",
              }}
            >
              {certs.map((cert, i) => (
                <div
                  key={cert._id}
                  style={{
                    position: "absolute",
                    top: i * CARD_STEP,
                    left: 0,
                    width: "100%",
                    height: CARD_HEIGHT,
                  }}
                >
                  {/* Spine dot */}
                  <div
                    ref={el => dotRefsRef.current[i] = el}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: cert.accent,
                      boxShadow: `0 0 12px ${cert.accent}, 0 0 24px ${cert.accent}66`,
                      zIndex: 10,
                      transition: "opacity 0.1s, transform 0.1s",
                    }}
                  />

                  {/* Crossbar */}
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: cert.side === "right" ? "50%" : "auto",
                    right: cert.side === "left" ? "50%" : "auto",
                    width: "calc(min(42vw, 380px) / 2 + 28px)",
                    height: 1.5,
                    background: `linear-gradient(${cert.side === "left" ? "270deg" : "90deg"}, ${cert.accent}88, transparent)`,
                    transform: "translateY(-50%)",
                    zIndex: 2,
                  }} />

                  <CertCard
                    ref={el => cardRefsRef.current[i] = el}
                    cert={cert}
                    side={cert.side}
                    onOpenPdf={() => {
                      setPdfUrl(cert.path);
                      setPdfHeader(`${cert.org} – ${cert.title}`);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}