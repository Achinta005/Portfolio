"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { projAnimRef } from "./projectSection";

const SHUFFLE_INTERVAL = 3500; // ms between auto project-slides
const MEDIA_INTERVAL = 2200; // ms between auto media-slides inside a card

// ── helpers ───────────────────────────────────────────────────────────────────

function dedupeAndPick(rawList) {
    const seen = new Map();
    for (const p of rawList) {
        const key = p.githubUrl || p._id;
        if (!seen.has(key)) {
            seen.set(key, p);
        } else {
            if (p.category === "Web Development") seen.set(key, p);
        }
    }
    return [...seen.values()].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
}

function toDisplay(p, idx) {
    const CATEGORY_COLORS = {
        "Web Development": "#00b8ff",
        "Machine Learning": "#a78bfa",
        "Other": "#34d399",
    };
    const categoryColor = CATEGORY_COLORS[p.category] ?? "#00b8ff";

    const links = [];
    if (p.liveUrl) links.push({ label: "Live Demo", icon: "↗", isLive: true, href: p.liveUrl });
    else links.push({ label: "Local Only", icon: "○", isLive: false, href: null });
    if (p.githubUrl) links.push({ label: "Source Code", icon: "⊙", isLive: false, href: p.githubUrl });

    // normalise media: prefer p.media[], fall back to p.image
    const media = Array.isArray(p.media) && p.media.length
        ? p.media.filter(m => !m.type || m.type === "image").map(m => ({ src: m.src, label: m.label ?? "" }))
        : p.image ? [{ src: p.image, label: "" }] : [];

    return {
        id: p._id,
        num: String(idx + 1).padStart(2, "0"),
        title: (p.title ?? "").replace(/^#+\s*/, ""),
        tags: p.technologies ?? [],
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
// Auto-cycles through project.media[]. Pauses when hovered prop is true.

function MediaGallery({ media, accent, num, hovered }) {
    const [mediaIdx, setMediaIdx] = useState(0);
    const [mediaFade, setMediaFade] = useState(0);
    const mediaTimerRef = useRef(null);

    // reset to first slide whenever the project changes
    useEffect(() => {
        setMediaIdx(0);
        setMediaFade(f => f + 1);
    }, [media]);

    // auto-cycle — stops when hovered
    useEffect(() => {
        if (mediaTimerRef.current) clearInterval(mediaTimerRef.current);
        if (media.length <= 1 || hovered) return;

        mediaTimerRef.current = setInterval(() => {
            setMediaIdx(prev => {
                setMediaFade(f => f + 1);
                return (prev + 1) % media.length;
            });
        }, MEDIA_INTERVAL);

        return () => clearInterval(mediaTimerRef.current);
    }, [media.length, hovered]);

    const goMedia = (i) => { setMediaIdx(i); setMediaFade(f => f + 1); };

    const current = media[mediaIdx];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", height: "100%" }}>
            {/* image frame */}
            <div style={{
                borderRadius: "10px", overflow: "hidden",
                border: `1px solid ${accent}30`,
                background: "rgba(0,6,16,0.95)",
                position: "relative", flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "200px",
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

                {/* project number watermark */}
                <div style={{ position: "absolute", top: "6px", right: "8px", fontSize: "18px", fontWeight: 800, fontFamily: "monospace", color: `${accent}35`, pointerEvents: "none" }}>
                    {num}
                </div>

                {/* accent line */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,transparent,${accent}80,transparent)`, pointerEvents: "none" }} />

                {/* image caption */}
                {current?.label && (
                    <div style={{ position: "absolute", bottom: "6px", left: "8px", fontSize: "9px", fontFamily: "monospace", color: "rgba(200,230,255,0.35)", letterSpacing: "1px", pointerEvents: "none" }}>
                        {current.label}
                    </div>
                )}

                {/* arrow nav — only when multiple images */}
                {media.length > 1 && (
                    <>
                        <button
                            onClick={e => { e.stopPropagation(); goMedia((mediaIdx - 1 + media.length) % media.length); }}
                            style={{
                                position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)",
                                background: "rgba(0,0,0,0.5)", border: `1px solid ${accent}44`,
                                color: accent, borderRadius: "50%", width: "22px", height: "22px",
                                fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", fontFamily: "monospace", opacity: 0.7,
                                transition: "opacity 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
                        >‹</button>
                        <button
                            onClick={e => { e.stopPropagation(); goMedia((mediaIdx + 1) % media.length); }}
                            style={{
                                position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)",
                                background: "rgba(0,0,0,0.5)", border: `1px solid ${accent}44`,
                                color: accent, borderRadius: "50%", width: "22px", height: "22px",
                                fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", fontFamily: "monospace", opacity: 0.7,
                                transition: "opacity 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
                        >›</button>
                    </>
                )}
            </div>

            {/* pill-style dot indicators */}
            {media.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "5px", alignItems: "center" }}>
                    {media.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => goMedia(i)}
                            style={{
                                height: "5px",
                                width: i === mediaIdx ? "16px" : "5px",
                                borderRadius: "100px",
                                background: i === mediaIdx ? accent : `${accent}35`,
                                border: `1px solid ${accent}45`,
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* media counter */}
            {media.length > 1 && (
                <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: "8px", color: `${accent}45`, letterSpacing: "1.5px" }}>
                    {String(mediaIdx + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
                </div>
            )}
        </div>
    );
}

// ── ProjectCard ───────────────────────────────────────────────────────────────

function ProjectCard({ project, fadeKey, onHoverChange }) {
    const [hovered, setHovered] = useState(false);

    const enter = () => { setHovered(true); onHoverChange(true); };
    const leave = () => { setHovered(false); onHoverChange(false); };

    return (
        <div
            key={fadeKey}
            onMouseEnter={enter}
            onMouseLeave={leave}
            style={{ animation: "projFadeSlide 0.45s cubic-bezier(0.22,1,0.36,1) both" }}
        >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "16px", alignItems: "stretch", marginBottom: "10px" }}>

                {/* ── TEXT COLUMN ── */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {/* category badge */}
                    <div style={{ marginBottom: "8px" }}>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "5px",
                            padding: "2px 10px", borderRadius: "100px",
                            background: `${project.categoryColor}18`,
                            border: `1px solid ${project.categoryColor}55`,
                            fontSize: "10px", fontFamily: "monospace", color: project.categoryColor,
                        }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: project.categoryColor, display: "inline-block" }} />
                            {project.category}
                        </span>
                    </div>

                    {/* title */}
                    <div style={{ borderLeft: `2px solid ${project.accent}`, paddingLeft: "10px", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, fontSize: "12px", fontWeight: 700, fontFamily: "monospace", color: "rgba(220,240,255,0.95)", lineHeight: 1.35 }}>
                            # {project.title}
                        </h3>
                    </div>

                    {/* tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                        {project.tags.map(t => <Tag key={t} label={t} />)}
                    </div>

                    {/* description */}
                    <p style={{ margin: "0 0 8px", fontSize: "10px", lineHeight: 1.5, color: "rgba(180,210,235,0.65)", fontFamily: "monospace" }}>
                        {project.desc}
                    </p>

                    {/* ML accuracy */}
                    {project.modelAccuracy != null && (
                        <div style={{ marginBottom: "8px" }}>
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: "5px",
                                padding: "2px 10px", borderRadius: "100px",
                                background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
                                fontSize: "10px", fontFamily: "monospace", color: "#34d399",
                            }}>✦ {project.modelAccuracy}% accuracy</span>
                        </div>
                    )}

                    {/* CTA buttons */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {project.links.map(link => (
                            <button
                                key={link.label}
                                onClick={() => link.href && window.open(link.href, "_blank")}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "5px",
                                    padding: "5px 12px", borderRadius: "100px",
                                    background: link.isLive ? `${project.accent}22` : "rgba(255,255,255,0.04)",
                                    border: `1px solid ${link.isLive ? project.accent + "66" : "rgba(255,255,255,0.1)"}`,
                                    fontSize: "10px", fontFamily: "monospace",
                                    color: link.isLive ? project.accent : "rgba(200,220,240,0.6)",
                                    cursor: link.href ? "pointer" : "default",
                                }}
                            >{link.icon} {link.label}</button>
                        ))}
                    </div>
                </div>

                {/* ── MEDIA COLUMN ── */}
                <div>
                    <MediaGallery
                        media={project.media}
                        accent={project.accent}
                        num={project.num}
                        hovered={hovered}
                    />
                </div>
            </div>
        </div>
    );
}

// ── loading / error ───────────────────────────────────────────────────────────

function LoadingState() {
    return (
        <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "monospace", color: "rgba(0,210,255,0.45)", fontSize: "11px" }}>
            <div style={{ fontSize: "22px", marginBottom: "8px", animation: "spin 1.2s linear infinite", display: "inline-block" }}>◌</div>
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

// ── main ──────────────────────────────────────────────────────────────────────

export default function ProjectsHTML() {
    const overlayRef = useRef();
    const intervalRef = useRef(null);
    const isActiveRef = useRef(false);
    const hoveredRef = useRef(false); // ref so interval always gets latest value

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeKey, setFadeKey] = useState(0);

    // ── fetch ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
        if (!baseUrl) { setError("NEXT_PUBLIC_SERVER_API_URL is not configured."); setLoading(false); return; }

        fetch(`${baseUrl}/project/projects_data`)
            .then(res => { if (!res.ok) throw new Error(`Server returned ${res.status}`); return res.json(); })
            .then(json => {
                const raw = Array.isArray(json) ? json : (json.data ?? []);
                const display = dedupeAndPick(raw).map(toDisplay);
                setProjects(display);
                setLoading(false);
            })
            .catch(err => { setError(err.message ?? "Failed to load projects."); setLoading(false); });
    }, []);

    // ── hover pause callback ─────────────────────────────────────────────────
    const handleHoverChange = useCallback((isHovered) => {
        hoveredRef.current = isHovered;
    }, []);

    // ── navigation ───────────────────────────────────────────────────────────
    const goTo = useCallback((idx) => {
        if (!projects.length) return;
        setCurrentIndex(((idx % projects.length) + projects.length) % projects.length);
        setFadeKey(k => k + 1);
    }, [projects.length]);

    const startAutoShuffle = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!projects.length) return;
        intervalRef.current = setInterval(() => {
            if (!isActiveRef.current || hoveredRef.current) return; // paused
            setCurrentIndex(prev => { setFadeKey(k => k + 1); return (prev + 1) % projects.length; });
        }, SHUFFLE_INTERVAL);
    }, [projects.length]);

    const goNext = useCallback(() => { goTo(currentIndex + 1); startAutoShuffle(); }, [currentIndex, goTo, startAutoShuffle]);
    const goPrev = useCallback(() => { goTo(currentIndex - 1); startAutoShuffle(); }, [currentIndex, goTo, startAutoShuffle]);

    useEffect(() => { startAutoShuffle(); return () => clearInterval(intervalRef.current); }, [startAutoShuffle]);

    // ── RAF sync with projAnimRef ────────────────────────────────────────────
    useEffect(() => {
        let raf;
        const tick = () => {
            const el = overlayRef.current;
            if (el) {
                const opacity = projAnimRef.opacity ?? 0;
                const scale = Math.max(0.01, projAnimRef.scale ?? 0);
                isActiveRef.current = projAnimRef.active ?? false;
                el.style.transform = `translate(-50%, -50%) scale(${scale})`;
                el.style.opacity = String(opacity);
                el.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const project = projects[currentIndex];

    return (
        <>
            <style>{`
                @keyframes projFadeSlide {
                    from { opacity: 0; transform: translateY(12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes mediaFadeIn {
                    from { opacity: 0; transform: scale(1.025); }
                    to   { opacity: 1; transform: scale(1);     }
                }
                @keyframes spin {
                    from { transform: rotate(0deg);   }
                    to   { transform: rotate(360deg); }
                }
                .proj-nav-btn {
                    background: rgba(0,210,255,0.07);
                    border: 1px solid rgba(0,210,255,0.25);
                    color: rgba(0,210,255,0.8);
                    border-radius: 50%; width: 34px; height: 34px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 15px; cursor: pointer;
                    transition: background 0.2s, border-color 0.2s, color 0.2s;
                    font-family: monospace; flex-shrink: 0; user-select: none;
                }
                .proj-nav-btn:hover { background: rgba(0,210,255,0.18); border-color: rgba(0,210,255,0.6); color: #00d2ff; }
                .proj-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(0,210,255,0.2); border: 1px solid rgba(0,210,255,0.3); transition: background 0.25s, transform 0.25s; cursor: pointer; }
                .proj-dot.active { background: #00d2ff; transform: scale(1.3); }
            `}</style>

            <div ref={overlayRef} style={{
                position: "absolute", top: "230vh", left: "50%",
                transform: "translate(-50%, -50%) scale(0.01)",
                transformOrigin: "center center",
                width: "min(88vw, 860px)",
                opacity: 0, pointerEvents: "none", zIndex: 100,
                padding: "20px 28px", boxSizing: "border-box",
                color: "rgba(220,240,255,0.95)",
                background: "rgba(0,4,12,0.55)",
                backdropFilter: "blur(12px)",
                borderRadius: "16px",
                border: "1px solid rgba(0,210,255,0.1)",
            }}>
                {/* header */}
                <div style={{ marginBottom: "14px", textAlign: "center" }}>
                    <p style={{ fontSize: "9px", fontFamily: "monospace", color: "rgba(0,255,204,0.5)", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 2px" }}>— SELECTED WORK —</p>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: "rgba(220,240,255,0.95)", letterSpacing: "-0.5px", margin: 0 }}>Projects</h2>
                </div>

                {loading && <LoadingState />}
                {!loading && error && <ErrorState message={error} />}
                {!loading && !error && project && (
                    <>
                        <ProjectCard project={project} fadeKey={fadeKey} onHoverChange={handleHoverChange} />

                        {/* project nav */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginTop: "12px" }}>
                            <button className="proj-nav-btn" onClick={goPrev} aria-label="Previous">‹</button>
                            <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                                {projects.map((_, i) => (
                                    <div key={i} className={`proj-dot${i === currentIndex ? " active" : ""}`} onClick={() => goTo(i)} />
                                ))}
                            </div>
                            <button className="proj-nav-btn" onClick={goNext} aria-label="Next">›</button>
                        </div>

                        {/* project counter */}
                        <div style={{ textAlign: "center", marginTop: "8px", fontFamily: "monospace", fontSize: "9px", color: "rgba(0,210,255,0.35)", letterSpacing: "2px" }}>
                            {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}