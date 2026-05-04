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
        if (!customElements.get("lottie-player")) {
            const s = document.createElement("script");
            s.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
            document.head.appendChild(s);
        }
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
            .c-field { display: flex; flex-direction: column; gap: 5px; }
            .c-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(148,163,184,0.7); }
            .c-input {
                width: 100%; background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
                padding: 9px 13px; font-family: inherit; font-size: 13.5px;
                color: #e2e8f0; outline: none; box-sizing: border-box;
                transition: border-color 0.2s, background 0.2s; -webkit-appearance: none;
            }
            .c-input::placeholder { color: rgba(148,163,184,0.35); }
            .c-input:hover  { border-color: rgba(255,255,255,0.15); }
            .c-input:focus  { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.06); }
            .c-send-btn {
                display: flex; align-items: center; justify-content: center; gap: 8px;
                width: 100%; padding: 10px 0; font-family: inherit; font-size: 13px;
                font-weight: 600; letter-spacing: 0.04em; color: #0f172a;
                background: #e2e8f0; border: none; border-radius: 6px;
                cursor: pointer; transition: background 0.18s, transform 0.1s;
            }
            .c-send-btn:hover:not(:disabled)  { background: #f8fafc; transform: translateY(-1px); }
            .c-send-btn:active:not(:disabled)  { transform: translateY(0); }
            .c-send-btn:disabled               { opacity: 0.45; cursor: not-allowed; }
            .c-status { font-size: 12px; text-align: center; min-height: 16px; color: transparent; font-weight: 400; letter-spacing: 0.01em; }
            .c-status[data-type="success"] { color: #34d399; }
            .c-status[data-type="error"]   { color: #f87171; }
            .c-social-btn {
                width: 34px; height: 34px; border-radius: 6px;
                background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                display: flex; align-items: center; justify-content: center;
                color: rgba(148,163,184,0.75); text-decoration: none;
                transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s; flex-shrink: 0;
            }
            .c-social-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.22); color: #e2e8f0; transform: translateY(-2px); }
            .c-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.07); margin: 14px 0; }
            .c-tag { font-size: 10.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(148,163,184,0.4); display: block; margin-bottom: 10px; }
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
                <div ref={headerRef} style={{ textAlign: "center", marginBottom: 24, visibility: "hidden", flexShrink: 0 }}>
                    <span style={{ display: "inline-block", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(148,163,184,0.5)", marginBottom: 8 }}>
                        Get in touch
                    </span>
                    <h2 style={{ margin: "0 0 6px", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
                        Let&apos;s work together
                    </h2>
                    <p style={{ fontSize: 13.5, color: "rgba(148,163,184,0.55)", margin: 0, fontWeight: 400 }}>
                        Open to opportunities, projects &amp; collaborations.
                    </p>
                </div>

                {/* Card */}
                <div
                    ref={formColRef}
                    style={{
                        position: "relative",
                        visibility: "hidden",
                        background: "rgba(10,14,30,0.88)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14,
                        padding: "24px 24px 22px",
                        backdropFilter: "blur(24px)",
                        width: "100%",
                        maxWidth: 580,
                        boxSizing: "border-box",
                        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                    }}
                >
                    {/* Name + Email row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div className="c-field">
                            <label className="c-label">Full Name *</label>
                            <input ref={nameRef} className="c-input" type="text" placeholder="Your name" />
                        </div>
                        <div className="c-field">
                            <label className="c-label">Email *</label>
                            <input ref={emailRef} className="c-input" type="email" placeholder="you@example.com" />
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="c-field" style={{ marginBottom: 12 }}>
                        <label className="c-label">Subject</label>
                        <input ref={subjectRef} className="c-input" type="text" placeholder="What's this about?" />
                    </div>

                    {/* Message */}
                    <div className="c-field" style={{ marginBottom: 14 }}>
                        <label className="c-label">Message *</label>
                        <textarea ref={msgRef} className="c-input" placeholder="Write your message here…" style={{ resize: "none", lineHeight: 1.6, minHeight: 88 }} />
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
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={14} strokeWidth={2.2} />
                                Send Message
                            </>
                        )}
                    </button>

                    <p ref={statusRef} className="c-status" style={{ marginTop: 8, marginBottom: 0 }} />

                    <div className="c-divider" />

                    {/* Footer row */}
                    {/* Footer row */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

                        {/* Socials */}
                        <div>
                            <span className="c-tag">Follow</span>
                            <div style={{ display: "flex", gap: 8 }}>
                                {socialLinks.map(({ icon: Icon, href, label, color, iconUrl }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="c-social-btn"
                                        title={label}
                                        style={{ color: color ?? "rgba(148,163,184,0.75)" }}
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
                                        <Icon size={15} strokeWidth={1.8} style={{ display: iconUrl ? "none" : "block" }} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact info — paddingRight keeps it clear of the lottie (250px wide, abs positioned) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingRight: "260px" }}>
                            <a
                                href={`mailto:${email}`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    textDecoration: "none",
                                    color: "rgba(148,163,184,0.75)",
                                    fontSize: 12.5,
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = "#e2e8f0"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "rgba(148,163,184,0.75)"; }}
                            >
                                <Mail size={13} strokeWidth={1.8} />
                                {email}
                                <ArrowUpRight size={11} strokeWidth={2} style={{ opacity: 0.5 }} />
                            </a>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(148,163,184,0.55)", fontSize: 12.5 }}>
                                <MapPin size={13} strokeWidth={1.8} />
                                <span>{location}</span>
                                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(52,211,153,0.12)", color: "#34d399", padding: "2px 7px", borderRadius: 4 }}>
                                    Remote OK
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lottie */}
                    <div style={{ position: "absolute", bottom: -35, right: 0, width: 250, height: 250, pointerEvents: "none" }}>
                        <lottie-player
                            src="/Lottifiles/contact_us.json"
                            background="transparent"
                            speed="1"
                            style={{ width: "250px", height: "250px" }}
                            loop autoplay
                        />
                    </div>
                </div >
            </div >
        </>
    );
}