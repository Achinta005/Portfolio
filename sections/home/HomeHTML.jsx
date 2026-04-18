"use client";
import { useRef } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useParallax } from "./hooks/useParallax";
import DecodeTitle from "./DecodeTitle";
import { scrollToSection } from "../../components/ImmersiveView/scrollState";

const socialLinks = [
  { icon: Github, href: "https://github.com/Achinta005", label: "GitHub", color: "#ccc" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/achinta-hazra/", label: "LinkedIn", color: "#60a5fa" },
  { icon: Twitter, href: "https://twitter.com/achinta005", label: "Twitter", color: "#38bdf8" },
  { icon: Mail, href: "mailto:achintahazra8515@gmail.com", label: "Email", color: "#34d399" },
];

export default function HomeHTML({ bootDone, onOpenPdf }) {
  const greetRef = useRef();
  const nameWrap = useRef();
  const badgeRef = useRef();
  const bioRef = useRef();
  const btnsRef = useRef();

  useParallax(greetRef, 1.8, 0.125);
  useParallax(nameWrap, 1.2, 0.125);
  useParallax(badgeRef, 0.9, 0.125);
  useParallax(bioRef, 0.6, 0.125);
  useParallax(btnsRef, 0.85, 0.125);

  return (
    <section
      id="Home"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "25vw",
        paddingRight: "20vw",
      }}
    >
      <div>
        {/* Greeting */}
        <div
          ref={greetRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
            willChange: "transform,opacity",
          }}
        >
          <div style={{ width: "3px", height: "38px", background: "linear-gradient(#00ffcc,#7c3aed)" }} />
          <p
            style={{
              color: "#ccc",
              fontSize: "1.25rem",
              margin: 0,
              opacity: bootDone ? 1 : 0,
              transform: bootDone ? "none" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            }}
          >
            Hi, I'm (test)
          </p>
        </div>

        {/* Name */}
        <div ref={nameWrap} style={{ willChange: "transform,opacity", maxWidth: "100%" }}>
          {bootDone && <DecodeTitle />}
        </div>

        {/* Available badge */}
        <div
          ref={badgeRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0,255,150,0.07)",
            border: "1px solid rgba(0,255,150,0.28)",
            borderRadius: "999px",
            padding: "5px 14px",
            marginBottom: "20px",
            willChange: "transform,opacity",
            opacity: bootDone ? 1 : 0,
            transform: bootDone ? "none" : "translateY(12px)",
            transition: "opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s",
          }}
        >
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00ff96", boxShadow: "0 0 6px #00ff96" }} />
          <span style={{ color: "#00ff96", fontSize: "0.82rem", letterSpacing: "0.04em" }}>Available for work</span>
        </div>

        {/* Bio */}
        <p
          ref={bioRef}
          style={{
            color: "#aaa",
            fontSize: "0.95rem",
            lineHeight: 1.75,
            marginBottom: "28px",
            willChange: "transform,opacity",
            opacity: bootDone ? 1 : 0,
            transform: bootDone ? "none" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s",
          }}
        >
          I am a <strong style={{ color: "#fff" }}>developer</strong> with a passion for creating{" "}
          <span style={{ color: "#00d2ff" }}>innovative solutions</span> by{" "}
          <span style={{ color: "#00ff96" }}>optimizing</span> existing technology or building{" "}
          <span style={{ color: "#a78bfa" }}>new innovations</span>.
        </p>

        {/* Social links */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            opacity: bootDone ? 1 : 0,
            transform: bootDone ? "none" : "translateY(16px)",
            transition: "opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s",
          }}
        >
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: s.color,
                backdropFilter: "blur(6px)",
                transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 14px ${s.color}55`;
                e.currentTarget.style.borderColor = `${s.color}88`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <s.icon size={18} />
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div
          ref={btnsRef}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            willChange: "transform,opacity",
            opacity: bootDone ? 1 : 0,
            transform: bootDone ? "none" : "translateY(20px)",
            transition: "opacity 0.9s ease 0.9s, transform 0.9s ease 0.9s",
          }}
        >
          <button
            onClick={onOpenPdf}
            style={{
              padding: "11px 26px",
              borderRadius: "8px",
              background: "linear-gradient(135deg,#00d2ff,#00ff96)",
              border: "none",
              color: "#000",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.92rem",
              boxShadow: "0 0 18px rgba(0,210,255,0.28)",
              transition: "box-shadow 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(0,210,255,0.6)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 18px rgba(0,210,255,0.28)";
              e.currentTarget.style.transform = "none";
            }}
          >
            View My Resume
          </button>

          <button
            style={{
              padding: "11px 26px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.92rem",
              backdropFilter: "blur(4px)",
              transition: "border-color 0.2s, background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,210,255,0.45)";
              e.currentTarget.style.background = "rgba(0,210,255,0.07)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.transform = "none";
            }}
            onClick={() => scrollToSection("contact")}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  );
}