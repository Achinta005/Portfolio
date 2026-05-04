"use client";
import { useRef, useState, useEffect } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import { portfolioApi } from "../../lib/api/portfolioApi";
import DecodeTitle from "./DecodeTitle";
import HexProfile from "./HexProfile";
import HUDBrackets from "./HUDBrackets"


const ICON_MAP = { Github, Linkedin, Mail, Twitter };

const FALLBACK_SOCIAL = [
  // { icon: "Github", href: "https://github.com/Achinta005", label: "GitHub", color: "#ccc" },
  // { icon: "Linkedin", href: "https://www.linkedin.com/in/achinta-hazra/", label: "LinkedIn", color: "#60a5fa" },
  // { icon: "Twitter", href: "https://twitter.com/achinta005", label: "Twitter", color: "#38bdf8" },
  // { icon: "Mail", href: "mailto:achintahazra8515@gmail.com", label: "Email", color: "#34d399" },
];

// ── Framer Motion variants ──────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const iconVariant = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

// ── Component ───────────────────────────────────────────────────────────────
export default function HomeHTML({ bootDone, onOpenPdf }) {
  const [hero, setHero] = useState(null);
  const sectionRef = useRef(null);
  const canvasWrap = useRef(null);   // wrapper for HexProfile + HUDBrackets

  // ── API ──
  useEffect(() => {
    portfolioApi.getHero().then(setHero).catch(console.error);
  }, []);
  

  // ── GSAP: canvas wrapper slide-in from right on mount ──
  useEffect(() => {
    if (!bootDone || !canvasWrap.current) return;
    gsap.fromTo(
      canvasWrap.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.5 }
    );
  }, [bootDone]);

  // ── GSAP ScrollTrigger: fade + slide whole section out on scroll ──
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "80% top",
          end: "bottom top",
          scrub: true,
          // Lenis keeps native scroll in sync so ScrollTrigger works without extra config
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Framer Motion scroll-linked parallax (Lenis feeds native scroll) ──
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 20 });

  const greetY = useTransform(smooth, [0, 1], ["0%", "-22%"]);
  const nameY = useTransform(smooth, [0, 1], ["0%", "-14%"]);
  const badgeY = useTransform(smooth, [0, 1], ["0%", "-10%"]);
  const bioY = useTransform(smooth, [0, 1], ["0%", "-8%"]);
  const btnsY = useTransform(smooth, [0, 1], ["0%", "-11%"]);
  const canvasY = useTransform(smooth, [0, 1], ["0%", "-18%"]); // HexProfile drifts up faster

  // ── Data ──
  const socialLinks = (hero?.socialLinks ?? FALLBACK_SOCIAL).map((s) => ({
    ...s, Icon: ICON_MAP[s.icon] ?? Mail,
  }));
  const greeting = hero?.greeting;
  const available = hero?.availableText;
  const isAvailable = hero?.available;
  const bioHTML = hero?.bio;
  const imageUrl = hero?.imageUrl;

  return (
    <section
      ref={sectionRef}
      id="Home"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        paddingLeft: "clamp(1.5rem, 10vw, 14rem)",
        paddingRight: "clamp(1.5rem, 6vw,  8rem)",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      {/* ── LEFT: text content ─────────────────────────────────────────── */}
      <AnimatePresence>
        {bootDone && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ position: "relative", zIndex: 2, maxWidth: "520px" }}
          >
            {/* Greeting */}
            <motion.div
              variants={fadeUp}
              style={{
                y: greetY,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div style={{
                width: "3px",
                height: "38px",
                background: "linear-gradient(#00ffcc,#7c3aed)",
                flexShrink: 0,
              }} />
              <p style={{ color: "#ccc", fontSize: "1.25rem", margin: 0 }}>
                {greeting}
              </p>
            </motion.div>

            {/* Name / DecodeTitle */}
            <motion.div variants={fadeUp} style={{ y: nameY }}>
              <DecodeTitle name={hero?.name} />
            </motion.div>

            {/* Available badge */}
            {isAvailable && (
              <motion.div
                variants={fadeIn}
                style={{
                  y: badgeY,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(0,255,150,0.07)",
                  border: "1px solid rgba(0,255,150,0.28)",
                  borderRadius: "999px",
                  padding: "5px 14px",
                  marginBottom: "20px",
                }}
              >
                <div style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#00ff96",
                  boxShadow: "0 0 6px #00ff96",
                }} />
                <span style={{ color: "#00ff96", fontSize: "0.82rem", letterSpacing: "0.04em" }}>
                  {available}
                </span>
              </motion.div>
            )}

            {/* Bio */}
            <motion.p
              variants={fadeUp}
              style={{
                y: bioY,
                color: "#aaa",
                fontSize: "0.95rem",
                lineHeight: 1.75,
                marginBottom: "28px",
              }}
            >
              {bioHTML ?? (
                <>
                  I am a <strong style={{ color: "#fff" }}>developer</strong> with a passion for creating{" "}
                  <span style={{ color: "#00d2ff" }}>innovative solutions</span> by{" "}
                  <span style={{ color: "#00ff96" }}>optimizing</span> existing technology or building{" "}
                  <span style={{ color: "#a78bfa" }}>new innovations</span>.
                </>
              )}
            </motion.p>

            {/* Social icons */}
            <motion.div
              variants={containerVariants}
              style={{
                y: btnsY,
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  variants={iconVariant}
                  whileHover={{
                    y: -4,
                    boxShadow: `0 0 14px ${s.color}55`,
                    borderColor: `${s.color}88`,
                  }}
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
                    textDecoration: "none",
                  }}
                >
                  {s.iconUrl
                    ? <img
                      src={s.iconUrl}
                      alt={s.label}
                      style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 3, filter: "brightness(0) invert(1)", opacity: 0.85 }}
                      onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "block"; }}
                    />
                    : null
                  }
                  <s.Icon size={18} style={{ display: s.iconUrl ? "none" : "block" }} />
                </motion.a>
              ))}
            </motion.div>

            {/* Resume button */}
            {onOpenPdf && (
              <motion.button
                variants={fadeIn}
                whileHover={{ scale: 1.04, boxShadow: "0 0 18px rgba(0,255,204,0.25)" }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenPdf}
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  color: "#00ffcc",
                  background: "rgba(0,255,204,0.07)",
                  border: "1px solid rgba(0,255,204,0.3)",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                VIEW RESUME
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RIGHT: HexProfile (Three.js Canvas) + HUDBrackets ─────────── */}
      <motion.div
        ref={canvasWrap}
        style={{
          y: canvasY,
          position: "absolute",
          right: "clamp(2rem, 14vw, 18rem)",
          top: "50%",
          translateY: "-50%",
          width: "clamp(260px, 28vw, 420px)",
          aspectRatio: "1 / 1",
          opacity: 0,           // GSAP drives this to 1
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* HUDBrackets is purely DOM — sits behind the canvas */}
        <HUDBrackets />

        {/* Three.js canvas for HexProfile */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 42 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[4, 4, 4]} intensity={1.2} color="#00d2ff" />
          <HexProfile bootDone={bootDone} imageUrl={imageUrl} />
        </Canvas>
      </motion.div>
    </section>
  );
}