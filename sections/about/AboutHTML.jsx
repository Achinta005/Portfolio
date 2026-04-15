"use client";
import { useRef, useEffect, forwardRef } from "react";
import { scrollProgressRef } from "../../components/ImmersiveView/scrollState";

const TOTAL_PAGES = 7;
const SECTION_START = 0.9 / TOTAL_PAGES;   // 0.125 ✓ unchanged
const SECTION_END   = 2 / TOTAL_PAGES; // 0.225 — tighter, ends before projects

const STATS = [
    { value: "18+", label: "Projects", icon: "🚀", color: "#00ffcc" },
    { value: "4+", label: "Yrs Learning", icon: "📚", color: "#00b8ff" },
    { value: "35+", label: "Technologies", icon: "⚡", color: "#a78bfa" },
    { value: "3+", label: "Team Works", icon: "👥", color: "#f472b6" },
];

const TRAITS = [
    { label: "Full-Stack", desc: "React · Node · Docker", color: "#00ffcc" },
    { label: "AI / ML", desc: "PyTorch · NumPy · GenAI", color: "#00b8ff" },
    { label: "Systems", desc: "DSA · DBMS · Networking", color: "#a78bfa" },
];

// 0-3 = upper cards (slide left/right), 4-7 = stat chips (rise from below)
const BLOCK_CFG = [
    { side: "left", delay: 0.00, color: "#00ffcc" }, // header
    { side: "right", delay: 0.07, color: "#00b8ff" }, // bio
    { side: "left", delay: 0.14, color: "#a78bfa" }, // traits
    { side: "right", delay: 0.20, color: "#7c3aed" }, // code
    { side: "up", delay: 0.27, color: "#00ffcc" }, // stat 0
    { side: "up", delay: 0.32, color: "#00b8ff" }, // stat 1
    { side: "up", delay: 0.37, color: "#a78bfa" }, // stat 2
    { side: "up", delay: 0.42, color: "#f472b6" }, // stat 3
];

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ── Upper card shell ────────────────────────────────────────────────────────
const Card = forwardRef(function Card({ children, color = "#00ffcc" }, ref) {
    return (
        <div ref={ref} style={{
            padding: "22px 26px",
            background: "rgba(0,8,24,0.72)",
            border: `1px solid ${color}22`,
            borderRadius: "16px",
            backdropFilter: "blur(18px)",
            boxShadow: `0 0 40px ${color}06`,
            willChange: "transform, opacity",
            position: "relative",
            overflow: "hidden",
            visibility: "hidden",
        }}>
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
        </div>
    );
});

// ── Content ─────────────────────────────────────────────────────────────────
function HeaderCard() {
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 3, height: 26, background: "linear-gradient(#00ffcc,#7c3aed)", borderRadius: 2 }} />
                <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#00ffcc", letterSpacing: "0.25em" }}>
                    01 · ABOUT
                </span>
            </div>
            <h2 style={{
                margin: 0, fontFamily: "monospace",
                fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)", fontWeight: 800,
                background: "linear-gradient(90deg,#fff 30%,#00d2ff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
            }}>
                Building at the<br />intersection of<br />code &amp; creativity.
            </h2>
        </div>
    );
}

function BioCard() {
    return (
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.8 }}>
            CS undergrad passionate about{" "}
            <span style={{ color: "#00d2ff", fontWeight: 600 }}>Full-Stack</span> and{" "}
            <span style={{ color: "#a78bfa", fontWeight: 600 }}>AI / ML</span>.
            I ship end-to-end products — from model to interface — and obsess over clean systems and fast feedback loops.
        </p>
    );
}

function TraitsCard() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TRAITS.map(t => (
                <div key={t.label} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px",
                    background: `${t.color}10`, border: `1px solid ${t.color}30`, borderRadius: 10,
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, boxShadow: `0 0 8px ${t.color}`, flexShrink: 0 }} />
                    <span style={{ color: t.color, fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, flexShrink: 0 }}>{t.label}</span>
                    <span style={{ color: "#64748b", fontSize: "0.73rem" }}>{t.desc}</span>
                </div>
            ))}
        </div>
    );
}

function CodeCard() {
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
            <span style={{ color: "#00ffcc" }}>"ship things that matter"</span>
            <span style={{ color: "#475569" }}>,</span><br />
            <span style={{ marginLeft: 14, color: "#94a3b8" }}>currently</span>
            <span style={{ color: "#475569" }}>: </span>
            <span style={{ color: "#a78bfa" }}>"exploring Deep Learning"</span>
            <span style={{ color: "#475569" }}>,</span><br />
            <span style={{ marginLeft: 14, color: "#94a3b8" }}>openTo</span>
            <span style={{ color: "#475569" }}>: </span>
            <span style={{ color: "#f472b6" }}>"opportunities"</span><br />
            <span style={{ color: "#475569" }}>{"}"}</span>
        </div>
    );
}

// ── 3-D Stat chip — standalone, no parent card ──────────────────────────────
const StatChip = forwardRef(function StatChip({ s }, ref) {
    const onEnter = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = "transform 0.15s ease, box-shadow 0.15s ease";
        el.style.transform = `perspective(500px) rotateX(-8deg) rotateY(5deg) translateY(-6px) scale(1.06)`;
        el.style.boxShadow = `
            0 20px 40px rgba(0,0,0,0.6),
            0 0 0 1px ${s.color}55,
            0 0 36px ${s.color}40,
            inset 0 1px 0 ${s.color}40
        `;
    };
    const onLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
        el.style.transform = `perspective(500px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
        el.style.boxShadow = BASE_SHADOW(s.color);
    };

    return (
        <div
            ref={ref}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            style={{
                /* fixed size so all four chips are identical */
                width: "160px",
                padding: "20px 12px 16px",
                borderRadius: "16px",
                textAlign: "center",
                cursor: "default",
                position: "relative",
                flexShrink: 0,
                visibility: "hidden",
                willChange: "transform, opacity",
                /* 3-D layered look */
                background: `
                    linear-gradient(160deg,
                        rgba(255,255,255,0.07) 0%,
                        rgba(0,0,0,0.0)        55%,
                        ${s.color}0a           100%),
                    rgba(0,8,24,0.85)
                `,
                boxShadow: BASE_SHADOW(s.color),
                borderTop: `1px solid ${s.color}30`,
                borderLeft: `1px solid ${s.color}14`,
                borderRight: `1px solid ${s.color}14`,
                borderBottom: `4px solid ${s.color}40`,  /* extruded bottom face */
            }}
        >
            {/* gloss streak at very top */}
            <div style={{
                position: "absolute", top: 0, left: "12%",
                width: "76%", height: "1px",
                background: `linear-gradient(90deg, transparent, ${s.color}66, transparent)`,
            }} />
            {/* subtle inner glow at bottom */}
            <div style={{
                position: "absolute", bottom: 6, left: "20%",
                width: "60%", height: "6px",
                borderRadius: "50%",
                background: `${s.color}18`,
                filter: "blur(4px)",
            }} />

            <span style={{ fontSize: "1.5rem", lineHeight: 1, display: "block", marginBottom: 8 }}>{s.icon}</span>
            <span style={{
                display: "block",
                fontFamily: "monospace", fontWeight: 800, fontSize: "1.5rem",
                color: s.color,
                textShadow: `0 0 22px ${s.color}bb, 0 0 8px ${s.color}66`,
                letterSpacing: "0.02em",
                marginBottom: 6,
            }}>{s.value}</span>
            <span style={{
                display: "block",
                color: "#64748b", fontSize: "0.65rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
            }}>{s.label}</span>
        </div>
    );
});

function BASE_SHADOW(color) {
    return `
        0 10px 24px rgba(0,0,0,0.5),
        0 0 0 1px ${color}1a,
        0 0 18px ${color}18,
        inset 0 1px 0 ${color}20
    `;
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function AboutHTML() {
    const blockRefs = useRef([]);   // 0-3: upper cards, 4-7: stat chips

    // Create individual refs for StatChip (needs forwardRef pattern)
    const statRefs = useRef([null, null, null, null]);

    useEffect(() => {
        let raf;
        const SLIDE_PX = 120;
        const RISE_PX = 40;

        const tick = () => {
            const offset = scrollProgressRef.current?.offset ?? 0;
            const raw = (offset - SECTION_START) / (SECTION_END - SECTION_START);
            const prog = Math.max(0, Math.min(1, raw));

            // Upper four cards
            for (let i = 0; i < 4; i++) {
                const el = blockRefs.current[i];
                const cfg = BLOCK_CFG[i];
                if (!el) continue;

                const lp = Math.max(0, Math.min(1, (prog - cfg.delay) / 0.35));
                const entered = easeOut(lp);
                // same direction for both enter AND exit — cards retrace their path
                const dir = cfg.side === "left" ? -1 : 1;
                const exitT = prog > 0.90 ? easeOut((prog - 0.90) / 0.10) : 0;
                // enter: slide in from dir side; exit: slide back out the same dir side
                const tx = dir * SLIDE_PX * ((1 - entered) + exitT);
                const alpha = entered * (1 - exitT);

                el.style.opacity = alpha;
                el.style.transform = `translateX(${tx}px)`;
                el.style.visibility = alpha < 0.01 ? "hidden" : "visible";
            }

            // Stat chips — rise from below, drop back down on exit
            for (let i = 0; i < 4; i++) {
                const el = statRefs.current[i];
                const cfg = BLOCK_CFG[4 + i];
                if (!el) continue;

                const lp = Math.max(0, Math.min(1, (prog - cfg.delay) / 0.30));
                const entered = easeOut(lp);
                // enter: rise up from +RISE_PX; exit: drop back down to +RISE_PX
                const exitT = prog > 0.90 ? easeOut((prog - 0.90) / 0.10) : 0;
                const ty = RISE_PX * ((1 - entered) + exitT);
                const alpha = entered * (1 - exitT);

                el.style.opacity = alpha;
                el.style.transform = `translateY(${ty}px)`;
                el.style.visibility = alpha < 0.01 ? "hidden" : "visible";
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div style={{
            position: "absolute", top: "125vh", left: 0,
            width: "100vw", height: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "22px",
            pointerEvents: "none",
        }}>
            {/* ── Upper two-column grid ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr",
                gap: "14px 0",
                maxWidth: "920px",
                width: "92%",
                pointerEvents: "auto",
            }}>
                <Card ref={el => blockRefs.current[0] = el} color={BLOCK_CFG[0].color}>
                    <HeaderCard />
                </Card>
                <div />
                <Card ref={el => blockRefs.current[1] = el} color={BLOCK_CFG[1].color}>
                    <BioCard />
                </Card>

                <Card ref={el => blockRefs.current[2] = el} color={BLOCK_CFG[2].color}>
                    <TraitsCard />
                </Card>
                <div />
                <Card ref={el => blockRefs.current[3] = el} color={BLOCK_CFG[3].color}>
                    <CodeCard />
                </Card>
            </div>

            {/* ── Stat chips — free-standing, equally spaced, centred ── */}
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "stretch",
                gap: "20px",
                maxWidth: "920px",
                width: "92%",
                pointerEvents: "auto",
            }}>
                {STATS.map((s, i) => (
                    <StatChip key={s.label} s={s} ref={el => { statRefs.current[i] = el; }} />
                ))}
            </div>
        </div>
    );
}