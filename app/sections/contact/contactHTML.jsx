"use client";
import { useRef, useEffect, useState } from "react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";
import {
    Linkedin,
    Github,
    Twitter,
    Facebook,
    Mail,
    MapPin,
    Send,
    ArrowUpRight,
} from "lucide-react";
import { subscribeToScroll } from "../../../components/ImmersiveView/scrollState";
import useIsMobile from "../../../utils/useIsMobile";
import { loadLottiePlayer } from "../../../utils/loadLottie";

const SECTION_START_CONTACT = 6 / 7;
const SECTION_END = 1.0;

const ICON_MAP = {
    LinkedIn: Linkedin,
    Github: Github,
    GitHub: Github,
    Twitter: Twitter,
    Facebook: Facebook,
    Mail: Mail,
};

const DEFAULT_SOCIAL_LINKS = [
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t) { return t * t * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export default function ContactHTML() {
    const isMobile = useIsMobile();
    const [email, setEmail] = useState("achintahazra815@gmail.com");
    const [location, setLocation] = useState("Arambagh, West Bengal");
    const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Fetch contact info (email, location)
        portfolioApi.getContact()
            .then((data) => {
                if (data?.email) setEmail(data.email);
                if (data?.location) setLocation(data.location);
            })
            .catch(console.error);

        // Fetch social links from hero (same source as HomeHTML)
        portfolioApi.getHero()
            .then((data) => {
                if (Array.isArray(data?.socialLinks) && data.socialLinks.length > 0) {
                    setSocialLinks(
                        data.socialLinks.map(({ icon, href, label, color, iconUrl }) => ({
                            label,
                            href,
                            color,
                            iconUrl: iconUrl || null,
                            icon: ICON_MAP[icon] ?? ArrowUpRight,
                        }))
                    );
                }
            })
            .catch(console.error);
    }, []);

    const wrapperRef = useRef();
    const headerRef = useRef();
    const formColRef = useRef();
    const playerLoaded = useRef(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const subjectRef = useRef();
    const msgRef = useRef();
    const statusRef = useRef();
    const btnRef = useRef();

    /* lazy-load lottie */
    useEffect(() => {
        if (playerLoaded.current) return;
        playerLoaded.current = true;
        loadLottiePlayer();
    }, []);

    /* scroll ticker */
    useEffect(() => {
        return subscribeToScroll((offset) => {
            const secT = clamp(
                (offset - SECTION_START_CONTACT) / (SECTION_END - SECTION_START_CONTACT),
                0, 1
            );

            const wrap = wrapperRef.current;
            if (wrap) {
                const wIn = clamp(secT / 0.06, 0, 1);
                const wOut = secT > 0.96 ? clamp((secT - 0.96) / 0.04, 0, 1) : 0;
                const wOp = easeOut(wIn) * (1 - easeIn(wOut));
                wrap.style.opacity = wOp;
                wrap.style.pointerEvents = wOp > 0.05 ? "auto" : "none";
                wrap.style.visibility = wOp < 0.01 ? "hidden" : "visible";
            }

            const hdr = headerRef.current;
            if (hdr) {
                const hIn = clamp(secT / 0.08, 0, 1);
                const hOut = secT > 0.92 ? clamp((secT - 0.92) / 0.08, 0, 1) : 0;
                const hOp = easeOut(hIn) * (1 - easeIn(hOut));
                hdr.style.opacity = hOp;
                hdr.style.transform = `translateY(${((1 - easeOut(hIn)) * -20).toFixed(1)}px)`;
                hdr.style.visibility = hOp < 0.01 ? "hidden" : "visible";
            }

            const fCol = formColRef.current;
            if (fCol) {
                const fIn = clamp((secT - 0.04) / 0.10, 0, 1);
                const fOut = secT > 0.92 ? clamp((secT - 0.92) / 0.08, 0, 1) : 0;
                const fOp = easeOut(fIn) * (1 - easeIn(fOut));
                fCol.style.opacity = fOp;
                fCol.style.transform = `translateX(${((1 - easeOut(fIn)) * -36).toFixed(1)}px)`;
                fCol.style.visibility = fOp < 0.01 ? "hidden" : "visible";
            }
        });
    }, []);

    async function handleSubmit() {
        const name = nameRef.current?.value?.trim();
        const emailVal = emailRef.current?.value?.trim();
        const subject = subjectRef.current?.value?.trim();
        const message = msgRef.current?.value?.trim();
        const status = statusRef.current;

        if (!name || !emailVal || !message) {
            if (status) { status.textContent = "Please fill in all required fields."; status.dataset.type = "error"; }
            return;
        }

        setSubmitting(true);
        if (status) { status.textContent = ""; status.dataset.type = ""; }

        try {
            await portfolioApi.sendContact({ name, email: emailVal, subject, message });

            if (nameRef.current) nameRef.current.value = "";
            if (emailRef.current) emailRef.current.value = "";
            if (subjectRef.current) subjectRef.current.value = "";
            if (msgRef.current) msgRef.current.value = "";

            if (status) { status.textContent = "Message sent — I'll get back to you soon."; status.dataset.type = "success"; }
        } catch (err) {
            console.error("Contact submit error:", err);
            if (status) { status.textContent = err.message || "Something went wrong. Please try again."; status.dataset.type = "error"; }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <style>{`
            @keyframes c-spin { to { transform: rotate(360deg); } }
            @keyframes c-glow-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
            @keyframes c-gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

            .c-field { display: flex; flex-direction: column; gap: 7px; position: relative; }
            .c-label {
                font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
                font-family: monospace; color: #64748b;
                display: flex; align-items: center; gap: 6px;
            }
            .c-label-dot {
                width: 5px; height: 5px; border-radius: 50%;
                background: #00ffcc; box-shadow: 0 0 6px #00ffcc80;
                display: inline-block; flex-shrink: 0;
            }
            .c-label .c-req { color: #00ffcc; font-weight: 700; font-size: 12px; margin-left: 1px; }
            .c-input {
                width: 100%;
                background: rgba(0,8,24,0.6);
                border: 1px solid rgba(0,210,255,0.12);
                border-radius: 10px;
                padding: 12px 16px;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                font-size: 14px;
                color: #e2e8f0;
                outline: none;
                box-sizing: border-box;
                transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
                -webkit-appearance: none;
            }
            .c-input::placeholder { color: rgba(100,116,139,0.5); font-style: italic; }
            .c-input:hover  { border-color: rgba(0,210,255,0.25); background: rgba(0,12,32,0.7); }
            .c-input:focus  {
                border-color: #00ffcc55;
                background: rgba(0,12,32,0.8);
                box-shadow: 0 0 0 3px rgba(0,255,204,0.08), 0 0 20px rgba(0,255,204,0.05);
            }
            .c-send-btn {
                display: flex; align-items: center; justify-content: center; gap: 10px;
                width: 100%; padding: 13px 0;
                font-family: monospace; font-size: 13px;
                font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
                color: #0a0e1e;
                background: linear-gradient(135deg, #00ffcc, #00b8ff, #7c3aed, #00ffcc);
                background-size: 300% 300%;
                animation: c-gradient-shift 6s ease infinite;
                border: none; border-radius: 10px;
                cursor: pointer;
                transition: transform 0.15s ease, box-shadow 0.25s ease;
                box-shadow: 0 4px 20px rgba(0,255,204,0.2), 0 0 0 1px rgba(0,255,204,0.15);
                position: relative; overflow: hidden;
            }
            .c-send-btn::before {
                content: ''; position: absolute; inset: 0;
                background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
                background-size: 250% 100%; background-position: 100% 0;
                transition: background-position 0.5s ease;
            }
            .c-send-btn:hover:not(:disabled)::before { background-position: 0 0; }
            .c-send-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(0,255,204,0.3), 0 0 0 1px rgba(0,255,204,0.3);
            }
            .c-send-btn:active:not(:disabled) { transform: translateY(0); }
            .c-send-btn:disabled { opacity: 0.45; cursor: not-allowed; animation: none; }

            .c-status {
                font-size: 12px; text-align: center; min-height: 18px;
                color: transparent; font-weight: 500; letter-spacing: 0.02em;
                font-family: monospace;
            }
            .c-status[data-type="success"] { color: #34d399; }
            .c-status[data-type="error"]   { color: #f87171; }

            .c-social-btn {
                width: 38px; height: 38px; border-radius: 10px;
                background: rgba(0,8,24,0.6);
                border: 1px solid rgba(0,210,255,0.12);
                display: flex; align-items: center; justify-content: center;
                color: #64748b; text-decoration: none;
                transition: all 0.25s ease; flex-shrink: 0;
                position: relative;
            }
            .c-social-btn::after {
                content: ''; position: absolute; inset: -1px;
                border-radius: 10px; opacity: 0;
                background: linear-gradient(135deg, #00ffcc33, #00b8ff33, #7c3aed33);
                transition: opacity 0.25s ease; z-index: -1;
            }
            .c-social-btn:hover {
                background: rgba(0,210,255,0.08);
                border-color: rgba(0,255,204,0.3);
                color: #00ffcc;
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,255,204,0.12);
            }
            .c-social-btn:hover::after { opacity: 1; }

            .c-divider {
                width: 100%; height: 1px;
                background: linear-gradient(90deg, transparent, rgba(0,210,255,0.15), rgba(124,58,237,0.1), transparent);
                margin: 18px 0;
            }
            .c-tag {
                font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
                font-family: monospace; color: #475569;
                display: flex; align-items: center; gap: 6px; margin-bottom: 10px;
            }
            .c-tag-line {
                width: 16px; height: 1.5px;
                background: linear-gradient(90deg, #00ffcc, transparent);
                border-radius: 2px;
            }
        `}</style>

            <div
                ref={wrapperRef}
                style={{
                    position: "absolute",
                    top: `${SECTION_START_CONTACT * 1000}vh`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    visibility: "hidden",
                    pointerEvents: "none",
                    zIndex: 100,
                    padding: "0 24px",
                    boxSizing: "border-box",
                }}
            >
                {/* Header */}
                <div ref={headerRef} style={{ textAlign: "center", marginBottom: 28, visibility: "hidden", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 24, height: 1.5, background: "linear-gradient(90deg, transparent, #00ffcc)", borderRadius: 2 }} />
                        <span style={{
                            fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
                            fontFamily: "monospace", color: "#00ffcc",
                        }}>
                            Get in Touch
                        </span>
                        <div style={{ width: 24, height: 1.5, background: "linear-gradient(90deg, #00ffcc, transparent)", borderRadius: 2 }} />
                    </div>
                    <h2 style={{
                        margin: "0 0 8px",
                        fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                        fontWeight: 800,
                        background: "linear-gradient(90deg, #fff 30%, #00d2ff 70%, #7c3aed)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                    }}>
                        {"Let's Work Together"}
                    </h2>
                    <p style={{
                        fontSize: 14, color: "#64748b", margin: 0, fontWeight: 400,
                        letterSpacing: "0.01em",
                    }}>
                        Open to opportunities, projects &amp; collaborations.
                    </p>
                </div>

                {/* Card */}
                <div
                    ref={formColRef}
                    style={{
                        position: "relative",
                        visibility: "hidden",
                        background: "rgba(6,10,24,0.92)",
                        border: "1px solid rgba(0,210,255,0.1)",
                        borderRadius: 18,
                        padding: isMobile ? "24px 20px 22px" : "28px 30px 26px",
                        backdropFilter: "blur(28px)",
                        width: "100%",
                        maxWidth: 620,
                        boxSizing: "border-box",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,210,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                >
                    {/* Subtle top accent line */}
                    <div style={{
                        position: "absolute", top: 0, left: "15%", width: "70%", height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(0,255,204,0.3), rgba(0,184,255,0.2), transparent)",
                        borderRadius: 2,
                    }} />

                    {/* Corner accent */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, width: 28, height: 28,
                        borderTop: "1.5px solid #00ffcc", borderLeft: "1.5px solid #00ffcc",
                        borderRadius: "18px 0 0 0", opacity: 0.35, pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute", bottom: 0, right: 0, width: 28, height: 28,
                        borderBottom: "1.5px solid #7c3aed", borderRight: "1.5px solid #7c3aed",
                        borderRadius: "0 0 18px 0", opacity: 0.25, pointerEvents: "none",
                    }} />

                    {/* Name + Email row */}
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <div className="c-field">
                            <label className="c-label">
                                <span className="c-label-dot" />
                                Full Name <span className="c-req">*</span>
                            </label>
                            <input ref={nameRef} className="c-input" type="text" placeholder="Achinta Hazra" />
                        </div>
                        <div className="c-field">
                            <label className="c-label">
                                <span className="c-label-dot" style={{ background: "#00b8ff", boxShadow: "0 0 6px #00b8ff80" }} />
                                Email <span className="c-req">*</span>
                            </label>
                            <input ref={emailRef} className="c-input" type="email" placeholder="achintahazra8515@gmail.com" />
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="c-field" style={{ marginBottom: 14 }}>
                        <label className="c-label">
                            <span className="c-label-dot" style={{ background: "#a78bfa", boxShadow: "0 0 6px #a78bfa80" }} />
                            Subject
                        </label>
                        <input ref={subjectRef} className="c-input" type="text" placeholder="Project collaboration, freelance work, etc." />
                    </div>

                    {/* Message */}
                    <div className="c-field" style={{ marginBottom: 18 }}>
                        <label className="c-label">
                            <span className="c-label-dot" style={{ background: "#f472b6", boxShadow: "0 0 6px #f472b680" }} />
                            Message <span className="c-req">*</span>
                        </label>
                        <textarea ref={msgRef} className="c-input" placeholder="Tell me about your project or idea…" style={{ resize: "none", lineHeight: 1.7, minHeight: 100 }} />
                    </div>

                    {/* Submit */}
                    <button ref={btnRef} className="c-send-btn" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? (
                            <>
                                <svg
                                    width="14" height="14"
                                    viewBox="0 0 24 24"
                                    style={{ animation: "c-spin 0.75s linear infinite", flexShrink: 0 }}
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round" />
                                </svg>
                                Sending…
                            </>
                        ) : (
                            <>
                                <Send size={14} strokeWidth={2.2} />
                                Send Message
                            </>
                        )}
                    </button>

                    <p ref={statusRef} className="c-status" style={{ marginTop: 10, marginBottom: 0 }} />

                    <div className="c-divider" />

                    {/* Footer row */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

                        {/* Socials */}
                        <div>
                            <span className="c-tag">
                                <span className="c-tag-line" />
                                Follow
                            </span>
                            <div style={{ display: "flex", gap: 8 }}>
                                {socialLinks.map(({ icon: Icon, href, label, color, iconUrl }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="c-social-btn"
                                        title={label}
                                    >
                                        {iconUrl
                                            ? <img
                                                src={iconUrl}
                                                alt={label}
                                                style={{ width: 18, height: 18, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }}
                                                onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "block"; }}
                                            />
                                            : null
                                        }
                                        <Icon size={16} strokeWidth={1.8} style={{ display: iconUrl ? "none" : "block" }} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact info */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingRight: isMobile ? 0 : "260px" }}>
                            <a
                                href={`mailto:${email}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    textDecoration: "none",
                                    color: "#64748b",
                                    fontSize: 12.5,
                                    fontFamily: "monospace",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = "#00ffcc"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; }}
                            >
                                <Mail size={13} strokeWidth={1.8} />
                                {email}
                                <ArrowUpRight size={11} strokeWidth={2} style={{ opacity: 0.4 }} />
                            </a>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 12.5, fontFamily: "monospace" }}>
                                <MapPin size={13} strokeWidth={1.8} />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lottie — hidden on mobile */}
                    {!isMobile && (
                      <div style={{ position: "absolute", bottom: -35, right: 0, width: 250, height: 250, pointerEvents: "none" }}>
                        <lottie-player
                            src="/Lottifiles/contact_us.json"
                            background="transparent"
                            speed="1"
                            style={{ width: "250px", height: "250px" }}
                            loop autoplay
                        />
                      </div>
                    )}
                </div>
            </div>
        </>
    );
}