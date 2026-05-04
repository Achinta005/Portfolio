"use client";
import { useRef, useEffect, forwardRef, useState } from "react";
import { portfolioApi } from "../../lib/api/portfolioApi";
import { scrollProgressRef } from "../../../components/ImmersiveView/scrollState";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState";

const SECTION_START = 0.471;  // ≈ 0.571 — starts right after Projects
const SECTION_END = 0.55;  // ≈ 0.714

const DEFAULT_EDUCATION = [
    {
        degree: "Secondary Education",
        university: "West Bengal Board of Secondary Education",
        college: "Baradongal Ramanath Institution",
        year: "2018 – 2020",
        description: "Foundation education with excellent grades in Mathematics and Science subjects.",
        icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346172/baradongal-ramanath-institution-baradangal-hooghly-schools-67ow2odqsn_wbbog0.jpg",
        accent: "#00ffcc", status: "done", num: "01",
    },
    {
        degree: "Higher Secondary Education",
        university: "West Bengal Council of Higher Secondary Education",
        college: "Baradongal Ramanath Institution",
        year: "2020 – 2022",
        description: "Completed with Science stream focusing on Mathematics, Physics, and Computer Science.",
        icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755346172/baradongal-ramanath-institution-baradangal-hooghly-schools-67ow2odqsn_wbbog0.jpg",
        accent: "#00b8ff", status: "done", num: "02",
    },
    {
        degree: "Bachelor of Technology in Computer Science",
        university: "West Bengal University of Technology",
        college: "Durgapur Institute of Advance Technology & Management",
        year: "2022 – 2026",
        description: "Currently pursuing B.Tech(CSE) with focus on software engineering and web development.",
        icon: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1753025127/img_xel2z6.jpg",
        accent: "#a78bfa", status: "ongoing", num: "03",
    },
];

function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
function easeIn(t) { return t * t * t * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const NodeCard = forwardRef(function NodeCard({ edu }, ref) {
    return (
        <div ref={ref} style={{
            visibility: "hidden",
            willChange: "transform, opacity",
            width: "min(88vw, 780px)",
            padding: "28px 32px",
            background: "rgba(0,6,20,0.82)",
            border: `1px solid ${edu.accent}35`,
            borderRadius: "20px",
            backdropFilter: "blur(24px)",
            boxShadow: `0 0 60px ${edu.accent}12, 0 0 120px ${edu.accent}06, inset 0 1px 0 ${edu.accent}22`,
            position: "relative",
            overflow: "hidden",
        }}>
            {/* top-left corner bracket */}
            <div style={{
                position: "absolute", top: 0, left: 0, width: 36, height: 36,
                borderTop: `2px solid ${edu.accent}`, borderLeft: `2px solid ${edu.accent}`,
                borderRadius: "20px 0 0 0", opacity: 0.7,
            }} />
            {/* bottom-right corner bracket */}
            <div style={{
                position: "absolute", bottom: 0, right: 0, width: 36, height: 36,
                borderBottom: `2px solid ${edu.accent}`, borderRight: `2px solid ${edu.accent}`,
                borderRadius: "0 0 20px 0", opacity: 0.7,
            }} />
            {/* index number watermark */}
            <div style={{
                position: "absolute", top: 16, right: 20,
                fontFamily: "monospace", fontSize: "2.5rem", fontWeight: 800,
                color: `${edu.accent}18`, lineHeight: 1,
            }}>{edu.num}</div>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* institution photo */}
                <div style={{
                    width: 96, height: 96, flexShrink: 0,
                    borderRadius: 14,
                    border: `2px solid ${edu.accent}50`,
                    overflow: "hidden",
                    background: "rgba(0,0,0,0.5)",
                    boxShadow: `0 0 20px ${edu.accent}30`,
                }}>
                    <img src={edu.icon} alt={edu.college}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.currentTarget.style.display = "none"; }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* status pill */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 10,
                        padding: "3px 12px", borderRadius: 100,
                        background: `${edu.accent}14`, border: `1px solid ${edu.accent}40`,
                    }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: edu.accent, boxShadow: `0 0 8px ${edu.accent}`,
                            animation: edu.status === "ongoing" ? "eduPulse 1.8s ease-in-out infinite" : "none",
                        }} />
                        <span style={{
                            fontFamily: "monospace", fontSize: "0.68rem",
                            color: edu.accent, letterSpacing: "0.2em", textTransform: "uppercase"
                        }}>
                            {edu.year}
                        </span>
                    </div>

                    <h3 style={{
                        margin: "0 0 6px", fontFamily: "monospace",
                        fontSize: "clamp(1rem, 2vw, 1.3rem)",
                        fontWeight: 800, color: "#e2e8f0", lineHeight: 1.25,
                    }}>{edu.degree}</h3>

                    <p style={{
                        margin: "0 0 3px", fontSize: "0.82rem",
                        color: edu.accent, fontWeight: 600
                    }}>{edu.university}</p>
                    <p style={{ margin: "0 0 10px", fontSize: "0.75rem", color: "#94a3b8" }}>{edu.college}</p>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b", lineHeight: 1.7 }}>
                        {edu.description}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default function EducationHTML() {
    const [education, setEducation] = useState(null);

    useEffect(() => {
        portfolioApi.getEducation().then(setEducation).catch(console.error);
    }, []);

    
    const EDUCATION = education ?? DEFAULT_EDUCATION;
    const NUM = EDUCATION.length;

    const wrapperRef = useRef();
    const headerRef = useRef();
    const progressRef = useRef();
    const cardRefs = useRef([]);
    const dotRefs = useRef([]);


    useEffect(() => {
        return subscribeToScroll((offset) => {
            const secT = clamp((offset - SECTION_START) / (SECTION_END - SECTION_START), 0, 1);

            const wrap = wrapperRef.current;
            if (wrap) {
                const wIn = clamp(secT / 0.04, 0, 1);
                const wOut = secT > 0.96 ? clamp((secT - 0.96) / 0.04, 0, 1) : 0;
                const wOp = easeOut(wIn) * (1 - easeIn(wOut));
                wrap.style.opacity = wOp;
                wrap.style.pointerEvents = wOp > 0.05 ? "auto" : "none";
                wrap.style.visibility = wOp < 0.01 ? "hidden" : "visible";
            }

            const slotSize = 1 / NUM;
            const activeIndex = Math.min(Math.floor(secT / slotSize), NUM - 1);
            const slotT = (secT - activeIndex * slotSize) / slotSize;

            const fadeIn = clamp(slotT / 0.28, 0, 1);
            const fadeOut = slotT > 0.72 ? clamp((slotT - 0.72) / 0.28, 0, 1) : 0;
            const cardOp = easeOut(fadeIn) * (1 - easeIn(fadeOut));

            const zoomIn = 0.82 + easeOut(fadeIn) * 0.18;
            const zoomOut = 1 - easeIn(fadeOut) * 0.06;

            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                const isActive = i === activeIndex;
                if (isActive) {
                    const sc = zoomIn * zoomOut;
                    el.style.opacity = cardOp;
                    el.style.transform = `scale(${sc})`;
                    el.style.visibility = cardOp < 0.01 ? "hidden" : "visible";
                } else {
                    el.style.opacity = 0;
                    el.style.visibility = "hidden";
                }
            });

            const hdr = headerRef.current;
            if (hdr) {
                const hIn = clamp(secT / 0.06, 0, 1);
                const hOut = secT > 0.94 ? clamp((secT - 0.94) / 0.06, 0, 1) : 0;
                const hOp = easeOut(hIn) * (1 - easeIn(hOut));
                hdr.style.opacity = hOp;
                hdr.style.visibility = hOp < 0.01 ? "hidden" : "visible";
            }

            dotRefs.current.forEach((el, i) => {
                if (!el) return;
                const isActive = i === activeIndex;
                el.style.background = isActive ? EDUCATION[i].accent : `${EDUCATION[i].accent}30`;
                el.style.boxShadow = isActive ? `0 0 12px ${EDUCATION[i].accent}` : "none";
                el.style.transform = isActive ? "scale(1.4)" : "scale(1)";
            });

            const pb = progressRef.current;
            if (pb) pb.style.width = `${secT * 100}%`;
        });
    }, []);

    return (
        <>
            <style>{`
                @keyframes eduPulse {
                    0%,100% { box-shadow: 0 0 6px #a78bfa; }
                    50%      { box-shadow: 0 0 18px #a78bfa, 0 0 0 6px #a78bfa00; }
                }
            `}</style>

            <div ref={wrapperRef} style={{
                position: "absolute",
                top: "450vh",
                left: "50%",
                transform: "translateX(-50%)",
                transformOrigin: "center top",
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                visibility: "hidden",
                pointerEvents: "none",
                zIndex: 100,
                gap: 24,
            }}>
                {/* ── Header ── */}
                <div ref={headerRef} style={{
                    textAlign: "center", visibility: "hidden",
                }}>
                    <p style={{
                        fontFamily: "monospace", fontSize: "0.68rem",
                        color: "#00ffcc", letterSpacing: "0.28em",
                        textTransform: "uppercase", margin: "0 0 4px"
                    }}>
                        — EDUCATION —
                    </p>
                    <h2 style={{
                        margin: 0, fontFamily: "monospace",
                        fontSize: "clamp(1.1rem, 2vw, 1.6rem)", fontWeight: 800,
                        background: "linear-gradient(90deg,#fff 30%,#00d2ff)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>
                        Academic Journey
                    </h2>
                </div>

                {/* ── Cards (stacked, only active shown) ── */}
                <div style={{
                    position: "relative", width: "min(88vw, 780px)", display: "flex",
                    alignItems: "center", justifyContent: "center"
                }}>
                    {EDUCATION.map((edu, i) => (
                        <div key={i} style={{
                            position: i === 0 ? "relative" : "absolute",
                            top: 0, left: 0, width: "100%",
                            transformOrigin: "center center",
                        }}>
                            <NodeCard ref={el => cardRefs.current[i] = el} edu={edu} />
                        </div>
                    ))}
                </div>

                {/* ── Step indicator dots ── */}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {EDUCATION.map((edu, i) => (
                        <div key={i} ref={el => dotRefs.current[i] = el} style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: `${edu.accent}30`,
                            transition: "transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
                        }} />
                    ))}
                </div>

                {/* ── Thin progress bar at bottom ── */}
                <div style={{
                    width: "80%",
                    height: 2,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 2,
                    marginTop: 8,       // ← in-flow spacing instead of position:absolute bottom:24
                }}>
                    <div ref={progressRef} style={{
                        height: "100%",
                        width: "0%",
                        borderRadius: 2,
                        background: "linear-gradient(90deg,#00ffcc,#00b8ff,#a78bfa)",
                        transition: "width 0.05s linear",
                    }} />
                </div>
            </div>
        </>
    );
}