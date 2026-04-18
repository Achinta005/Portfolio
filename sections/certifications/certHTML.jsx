"use client";
import { useRef, useEffect, forwardRef, useState } from "react";
import { scrollProgressRef } from "../../components/ImmersiveView/scrollState";
import dynamic from "next/dynamic";
import { set } from "react-hook-form";

const PdfModal = dynamic(() => import("../../utils/PdfModal"), {
    ssr: false,
});

const SECTION_START = 0.66;
const SECTION_END = 0.79;

const ACCENT_PALETTE = [
    "#f97316", "#00b8ff", "#00ffcc", "#a78bfa",
    "#fb923c", "#34d399", "#f472b6", "#facc15",
    "#60a5fa", "#c084fc",
];

const ANGLE_STEP_BASE = 36; // will be recalculated based on N
const RADIUS = 320;

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t) { return t * t * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

/* ── single card DOM node ─────────────────────────────────────── */
const CertCard = forwardRef(function CertCard({ cert, onOpenPdf }, ref) {
    return (
        <div
            ref={ref}
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "min(88vw, 480px)",
                marginLeft: "calc(min(88vw, 480px) / -2)",
                marginTop: -96,
                height: 192,
                borderRadius: 16,
                padding: "18px 20px",
                display: "flex",
                gap: 14,
                alignItems: "center",
                willChange: "transform, opacity, filter",
                transformStyle: "preserve-3d",
                cursor: "pointer",
                border: `1px solid ${cert.accent}33`,
                background: "rgba(4,8,28,0.90)",
                backdropFilter: "blur(22px)",
                boxShadow: `0 0 60px ${cert.accent}10, inset 0 1px 0 ${cert.accent}18`,
                overflow: "hidden",
                visibility: "hidden",
                opacity: 0,
            }}
            onClick={onOpenPdf}
        >
            {/* corner brackets */}
            <div style={{
                position: "absolute", top: 0, left: 0, width: 22, height: 22,
                borderTop: `1.5px solid ${cert.accent}`, borderLeft: `1.5px solid ${cert.accent}`,
                borderRadius: "16px 0 0 0", opacity: 0.55,
            }} />
            <div style={{
                position: "absolute", bottom: 0, right: 0, width: 22, height: 22,
                borderBottom: `1.5px solid ${cert.accent}`, borderRight: `1.5px solid ${cert.accent}`,
                borderRadius: "0 0 16px 0", opacity: 0.55,
            }} />

            {/* index watermark */}
            <div style={{
                position: "absolute", top: 12, right: 16,
                fontFamily: "monospace", fontSize: "2rem", fontWeight: 800,
                color: `${cert.accent}10`, lineHeight: 1,
            }}>{cert.num}</div>

            {/* icon */}
            <div style={{
                width: 72, height: 72, borderRadius: 12, overflow: "hidden",
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                border: `1.5px solid ${cert.accent}40`,
                background: "rgba(255,255,255,0.04)",
                boxShadow: `0 0 18px ${cert.accent}20`,
                fontSize: "2rem",
            }}>
                {cert.icon
                    ? <img
                        src={cert.icon}
                        alt={cert.org}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = "block";
                            }
                        }}
                    />
                    : null}
                <span style={{ display: cert.icon ? "none" : "block" }}>{cert.emoji}</span>
            </div>

            {/* clickable title → opens cert path */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontFamily: "monospace", fontSize: "0.6rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: cert.accent, marginBottom: 6,
                }}>{cert.org}</div>

                <a
                    style={{
                        display: "block",
                        fontFamily: "monospace", fontSize: "0.95rem",
                        fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, marginBottom: 8,
                        textDecoration: "none",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = cert.accent}
                    onMouseLeave={e => e.currentTarget.style.color = "#e2e8f0"}
                >
                    {cert.title}
                </a>

                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "2px 10px", borderRadius: 100,
                    border: `1px solid ${cert.accent}40`,
                    background: `${cert.accent}12`,
                    fontFamily: "monospace", fontSize: "0.6rem",
                    letterSpacing: "0.15em", color: cert.accent,
                }}>
                    <span style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: cert.accent, display: "inline-block",
                    }} />
                    {cert.year}
                </div>
            </div>
        </div>
    );
});

/* ── main component ───────────────────────────────────────────── */
export default function CertHTML() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [header, setHeader] = useState("Achinta Hazra Resume.pdf");

    const handleClosePdf = () => {
        setIsModalOpen(false);
        setPdfUrl(null);
    };

    const wrapperRef = useRef();
    const sceneRef = useRef();
    const headerRef = useRef();
    const progRef = useRef();
    const ctrRef = useRef();

    // Dynamic refs — rebuilt whenever certs change
    const dotRefsRef = useRef([]);
    const cardRefsRef = useRef([]);
    const lastFrontRef = useRef(-1);
    const state = useRef({ displayProgress: 0, targetProgress: 0, rafId: null });
    const cleanupRef = useRef(null);

    /* ── fetch data ── */
    useEffect(() => {
        const controller = new AbortController();

        const url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/about/Certificatesdata`;

        console.log("🚀 API CALL →", url);

        fetch(url, {
            signal: controller.signal,
        })
            .then(res => {
                console.log("📥 RAW RESPONSE →", res);

                if (!res.ok) {
                    console.error("❌ HTTP ERROR →", res.status);
                    throw new Error(`HTTP ${res.status}`);
                }

                return res.json();
            })
            .then(data => {
                console.log("✅ RESPONSE DATA →", data);

                const mapped = data.map((item, idx) => {
                    const mappedItem = {
                        _id: item._id,
                        title: item.name,
                        org: item.issuer,
                        year: item.year,
                        accent: ACCENT_PALETTE[idx % ACCENT_PALETTE.length],
                        icon: item.icon || "",
                        emoji: "🏆",
                        num: String(idx + 1).padStart(2, "0"),
                        path: item.path || "#",
                    };

                    console.log(`🔄 MAPPED ITEM ${idx} →`, mappedItem);

                    return mappedItem;
                });

                console.log("🎯 FINAL STATE DATA →", mapped);

                setCerts(mapped);
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("🔥 FETCH ERROR →", err);
                    setError("Failed to load certificates.");
                    setLoading(false);
                } else {
                    console.warn("⚠️ Request Aborted");
                }
            });

        return () => {
            console.log("🛑 Aborting API call...");
            controller.abort();
        };
    }, []);

    /* ── animation & interaction (runs after certs load) ── */
    useEffect(() => {
        if (certs.length === 0) return;

        const N = certs.length;
        const ANGLE_STEP = 360 / N;

        // Ensure ref arrays are the right size
        dotRefsRef.current = dotRefsRef.current.slice(0, N);
        cardRefsRef.current = cardRefsRef.current.slice(0, N);

        function triggerSlideIn(el) {
            if (!el) return;
            el.classList.remove("cert-slide-in", "cert-slide-out");
            void el.offsetWidth;
            el.classList.add("cert-slide-in");
        }

        function triggerSlideOut(el) {
            if (!el) return;
            el.classList.remove("cert-slide-in", "cert-slide-out");
            void el.offsetWidth;
            el.classList.add("cert-slide-out");
        }

        function applyLayout(progress) {
            const frontIdx = ((Math.round(progress) % N) + N) % N;

            if (frontIdx !== lastFrontRef.current) {
                const prevFront = lastFrontRef.current;
                if (frontIdx === 0 && prevFront !== -1) triggerSlideIn(cardRefsRef.current[0]);
                if (frontIdx === N - 1) triggerSlideIn(cardRefsRef.current[N - 1]);
                if (prevFront === 0 && frontIdx === N - 1) triggerSlideOut(cardRefsRef.current[0]);
                if (prevFront === N - 1 && frontIdx === 0) triggerSlideOut(cardRefsRef.current[N - 1]);
                lastFrontRef.current = frontIdx;
            }

            cardRefsRef.current.forEach((el, i) => {
                if (!el) return;

                let slot = i - progress;
                while (slot > N / 2) slot -= N;
                while (slot < -N / 2) slot += N;

                const angleDeg = slot * ANGLE_STEP;
                const rad = (angleDeg * Math.PI) / 180;
                const cosA = Math.cos(rad);
                const sinA = Math.sin(rad);

                const tx = sinA * RADIUS;
                const tz = cosA * RADIUS - RADIUS;

                const absAngle = Math.abs(angleDeg);
                let op;
                if (absAngle < 30) op = lerp(1, 0.65, absAngle / 30);
                else if (absAngle < 90) op = lerp(0.65, 0.05, (absAngle - 30) / 60);
                else op = 0;

                const sc = lerp(0.80, 1.0, clamp(1 - absAngle / 90, 0, 1));
                const bright = lerp(0.35, 1.0, clamp(1 - absAngle / 90, 0, 1));

                const hasAnim = el.classList.contains("cert-slide-in") || el.classList.contains("cert-slide-out");

                el.style.transform = `translateX(${tx.toFixed(1)}px) translateZ(${tz.toFixed(1)}px) rotateY(${angleDeg.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
                if (!hasAnim) el.style.opacity = op.toFixed(3);
                el.style.filter = `brightness(${bright.toFixed(2)})`;
                el.style.zIndex = Math.round(cosA * 100 + 100);
                el.style.visibility = op < 0.01 ? "hidden" : "visible";
            });
        }

        function updateUI(progress) {
            const idx = ((Math.round(progress) % N) + N) % N;
            const frac = ((progress % N) + N) % N / N;

            if (ctrRef.current) ctrRef.current.textContent = String(idx + 1).padStart(2, "0");
            if (progRef.current) progRef.current.style.width = (frac * 100).toFixed(1) + "%";

            dotRefsRef.current.forEach((el, i) => {
                if (!el) return;
                const active = i === idx;
                el.style.background = active ? certs[i].accent : `${certs[i].accent}28`;
                el.style.boxShadow = active ? `0 0 10px ${certs[i].accent}` : "none";
                el.style.transform = active ? "scale(1.5)" : "scale(1)";
            });
        }

        function runSpring() {
            const s = state.current;
            const diff = s.targetProgress - s.displayProgress;
            if (Math.abs(diff) < 0.001) {
                s.displayProgress = s.targetProgress;
                applyLayout(s.displayProgress);
                updateUI(s.displayProgress);
                s.rafId = null;
                return;
            }
            s.displayProgress += diff * 0.12;
            applyLayout(s.displayProgress);
            updateUI(s.displayProgress);
            s.rafId = requestAnimationFrame(runSpring);
        }

        function step(dir) {
            const s = state.current;
            s.targetProgress += dir;
            if (s.rafId) cancelAnimationFrame(s.rafId);
            s.rafId = requestAnimationFrame(runSpring);
        }

        let outerRaf;
        const tick = () => {
            const offset = scrollProgressRef.current?.offset ?? 0;
            const secT = clamp(
                (offset - SECTION_START) / (SECTION_END - SECTION_START),
                0, 1
            );

            const wrap = wrapperRef.current;
            if (wrap) {
                const wIn = clamp(secT / 0.04, 0, 1);
                const wOut = secT > 0.96 ? clamp((secT - 0.96) / 0.04, 0, 1) : 0;
                const wOp = easeOut(wIn) * (1 - easeIn(wOut));
                wrap.style.opacity = wOp;
                wrap.style.pointerEvents = wOp > 0.05 ? "auto" : "none";
                wrap.style.visibility = wOp < 0.01 ? "hidden" : "visible";
            }

            const hdr = headerRef.current;
            if (hdr) {
                const hIn = clamp(secT / 0.06, 0, 1);
                const hOut = secT > 0.94 ? clamp((secT - 0.94) / 0.06, 0, 1) : 0;
                const hOp = easeOut(hIn) * (1 - easeIn(hOut));
                hdr.style.opacity = hOp;
                hdr.style.visibility = hOp < 0.01 ? "hidden" : "visible";
            }

            outerRaf = requestAnimationFrame(tick);
        };
        outerRaf = requestAnimationFrame(tick);

        let scrollAcc = 0, scrollTimer = null;
        const onWheel = e => {
            e.preventDefault();
            scrollAcc += e.deltaY;
            if (Math.abs(scrollAcc) > 60) {
                step(scrollAcc > 0 ? 1 : -1);
                scrollAcc = 0;
            }
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => scrollAcc = 0, 300);
        };

        let touchY = null;
        const onTouchStart = e => { touchY = e.touches[0].clientY; };
        const onTouchEnd = e => {
            if (touchY === null) return;
            const dy = touchY - e.changedTouches[0].clientY;
            if (Math.abs(dy) > 30) step(dy > 0 ? 1 : -1);
            touchY = null;
        };

        const onKey = e => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
        };

        // Expose step for dot/card click handlers via closure stored in ref
        cleanupRef.current = { step, N };

        const scene = sceneRef.current;
        scene?.addEventListener("wheel", onWheel, { passive: false });
        scene?.addEventListener("touchstart", onTouchStart, { passive: true });
        scene?.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("keydown", onKey);

        lastFrontRef.current = -1;
        state.current.displayProgress = 0;
        state.current.targetProgress = 0;
        applyLayout(0);
        updateUI(0);

        const initTimer = setTimeout(() => {
            lastFrontRef.current = 0;
            triggerSlideIn(cardRefsRef.current[0]);
        }, 400);

        return () => {
            cancelAnimationFrame(outerRaf);
            if (state.current.rafId) cancelAnimationFrame(state.current.rafId);
            clearTimeout(initTimer);
            scene?.removeEventListener("wheel", onWheel);
            scene?.removeEventListener("touchstart", onTouchStart);
            scene?.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("keydown", onKey);
        };
    }, [certs]);

    /* ── click handler for dots / cards (needs access to step) ── */
    function handleJumpTo(i) {
        const ref = cleanupRef.current;
        if (!ref) return;
        const { step, N } = ref;
        const s = state.current;
        const cur = ((Math.round(s.displayProgress) % N) + N) % N;
        let d = i - cur;
        if (d > N / 2) d -= N;
        if (d < -N / 2) d += N;
        if (d !== 0) step(d);
    }

    const N = certs.length;

    /* ── render ── */
    return (
        <>
            <style>{`
                @keyframes certDotPulse {
                    0%,100% { opacity: 1; }
                    50%      { opacity: 0.5; }
                }
                @keyframes certSlideIn {
                    0%   { opacity: 0; transform: var(--cert-base-transform) translateY(28px) scale(0.96); }
                    60%  { opacity: 1; }
                    100% { opacity: 1; transform: var(--cert-base-transform) translateY(0px)  scale(1); }
                }
                @keyframes certSlideOut {
                    0%   { opacity: 1; transform: var(--cert-base-transform) translateY(0px)  scale(1); }
                    100% { opacity: 0; transform: var(--cert-base-transform) translateY(28px) scale(0.96); }
                }
                .cert-slide-in {
                    animation: certSlideIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
                }
                .cert-slide-out {
                    animation: certSlideOut 0.38s cubic-bezier(0.4, 0, 1, 1) forwards !important;
                }
            `}</style>
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PdfModal pdfUrl={pdfUrl} onClose={handleClosePdf} header={header} />
                </div>
            )}
            <div
                ref={wrapperRef}
                style={{
                    position: "absolute",
                    top: "385vh",
                    left: "50%",
                    transform: "translateX(-50%)",
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
                    gap: 20,
                }}
            >
                {/* header */}
                <div ref={headerRef} style={{ textAlign: "center", visibility: "hidden" }}>
                    <p style={{
                        fontFamily: "monospace", fontSize: "0.62rem",
                        color: "#00ffcc", letterSpacing: "0.28em",
                        textTransform: "uppercase", margin: "0 0 4px",
                    }}>— CERTIFICATIONS —</p>
                    <h2 style={{
                        margin: 0, fontFamily: "monospace",
                        fontSize: "clamp(1rem, 2vw, 1.5rem)", fontWeight: 800,
                        background: "linear-gradient(90deg,#fff 40%,#00d2ff)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>Achievements &amp; Credentials</h2>
                </div>

                {/* loading / error states */}
                {loading && (
                    <p style={{ fontFamily: "monospace", color: "rgba(148,163,184,0.5)", fontSize: "0.75rem", letterSpacing: "0.2em" }}>
                        LOADING CERTIFICATES...
                    </p>
                )}
                {error && (
                    <p style={{ fontFamily: "monospace", color: "#f87171", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
                        {error}
                    </p>
                )}

                {/* 3-D scene — only rendered once data is ready */}
                {!loading && !error && N > 0 && (
                    <>
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>

                            {/* counter */}
                            <div style={{
                                fontFamily: "monospace", display: "flex",
                                flexDirection: "column", alignItems: "center", gap: 2, minWidth: 32,
                            }}>
                                <span ref={ctrRef} style={{
                                    fontSize: "1.4rem", fontWeight: 800,
                                    color: "rgba(255,255,255,0.6)", lineHeight: 1,
                                }}>01</span>
                                <span style={{ fontSize: "0.58rem", color: "rgba(100,116,139,0.55)", letterSpacing: "0.1em" }}>
                                    / {N}
                                </span>
                            </div>

                            {/* cylinder scene */}
                            <div
                                ref={sceneRef}
                                style={{
                                    position: "relative",
                                    width: "min(88vw, 560px)",
                                    height: 340,
                                    perspective: "1100px",
                                    perspectiveOrigin: "50% 50%",
                                }}
                            >
                                {certs.map((cert, i) => (
                                    <div
                                        key={cert._id}
                                        style={{ position: "absolute", inset: 0 }}
                                        onClick={() => handleJumpTo(i)}
                                    >
                                        <CertCard
                                            ref={el => cardRefsRef.current[i] = el}
                                            cert={cert}
                                            onOpenPdf={() => {
                                                setPdfUrl(cert.path);
                                                setHeader(`${cert.org} - ${cert.title}`);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* dot nav */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }} className="relative -left-[55vw]">
                                {certs.map((cert, i) => (
                                    <div
                                        key={cert._id}
                                        ref={el => dotRefsRef.current[i] = el}
                                        onClick={() => handleJumpTo(i)}
                                        style={{
                                            width: 6, height: 6, borderRadius: "50%",
                                            background: `${cert.accent}28`,
                                            cursor: "pointer",
                                            transition: "transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* progress bar */}
                        <div style={{
                            width: "70%", height: 1.5,
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: 2, marginTop: 4,
                        }}>
                            <div
                                ref={progRef}
                                style={{
                                    height: "100%", width: "0%", borderRadius: 2,
                                    background: "linear-gradient(90deg,#00ffcc,#00b8ff,#a78bfa)",
                                    transition: "width 0.05s linear",
                                }}
                            />
                        </div>

                        {/* hint */}
                        <p style={{
                            fontFamily: "monospace", fontSize: "0.58rem",
                            letterSpacing: "0.22em", textTransform: "uppercase",
                            color: "rgba(148,163,184,0.35)", margin: 0,
                        }}>↑ ↓ scroll · click card to jump · click title to view</p>
                    </>
                )}
            </div>
        </>
    );
}