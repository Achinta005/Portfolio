"use client";
import { useRef, useState, useEffect } from "react";
import useIsMobile from "../../../utils/useIsMobile";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import { portfolioApi } from "../../lib/api/portfolioApi";
import DecodeTitle from "./DecodeTitle";
import HexProfile from "./HexProfile";
import HUDBrackets from "./HUDBrackets";

const ICON_MAP = { Github, Linkedin, Mail, Twitter };
const FALLBACK_SOCIAL = [];

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

export default function HomeHTML({ bootDone, onOpenPdf }) {
  const isMobile = useIsMobile();
  const [hydrated, setHydrated] = useState(false);
  const [hero, setHero] = useState(null);
  const sectionRef = useRef(null);

  // Separate refs for the outer positioning wrapper and the inner animated element
  // so GSAP only touches the inner element and never clobbers the centering transform.
  const canvasPositionerRef = useRef(null); // outer: holds top/right/translateY centering — never touched by GSAP
  const canvasAnimRef = useRef(null); // inner: GSAP drives opacity + x/y offset only

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    portfolioApi.getHero().then(setHero).catch(console.error);
  }, []);

  // GSAP entrance — only animates the INNER wrapper (canvasAnimRef)
  // so the outer positioner's `transform: translateY(-50%)` is never touched.
  useEffect(() => {
    if (!bootDone || !canvasAnimRef.current) return;
    gsap.fromTo(
      canvasAnimRef.current,
      { x: isMobile ? 0 : 50, y: isMobile ? 20 : 0, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.5 }
    );
  }, [bootDone, isMobile]);

  // Scroll-out for the whole section
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
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const { scrollYProgress } = useScroll({
    target: hydrated ? sectionRef : undefined,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const greetY = useTransform(smooth, [0, 1], ["0%", isMobile ? "-8%" : "-22%"]);
  const nameY = useTransform(smooth, [0, 1], ["0%", isMobile ? "-5%" : "-14%"]);
  const badgeY = useTransform(smooth, [0, 1], ["0%", isMobile ? "-4%" : "-10%"]);
  const bioY = useTransform(smooth, [0, 1], ["0%", isMobile ? "-3%" : "-8%"]);
  const btnsY = useTransform(smooth, [0, 1], ["0%", isMobile ? "-4%" : "-11%"]);
  const canvasY = useTransform(smooth, [0, 1], ["0%", isMobile ? "-10%" : "-18%"]);

  const socialLinks = (hero?.socialLinks ?? FALLBACK_SOCIAL).map((s) => ({
    ...s, Icon: ICON_MAP[s.icon] ?? Mail,
  }));
  const greeting = hero?.greeting;
  const available = hero?.availableText;
  const isAvailable = hero?.available;
  const bioHTML = hero?.bio;
  const imageUrl = hero?.imageUrl;

  // Don't render with wrong isMobile value during SSR
  if (!hydrated) return null;

  return (
    <section
      ref={sectionRef}
      id="Home"
      style={{
        position: "relative",
        minHeight: "100vh",
        height: isMobile ? "auto" : "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: "flex-start",
        paddingLeft: isMobile ? "1.25rem" : "clamp(1.5rem, 10vw, 14rem)",
        paddingRight: isMobile ? "1.25rem" : "clamp(1.5rem, 6vw,  8rem)",
        paddingTop: isMobile ? "1.5rem" : 0,
        paddingBottom: isMobile ? "2rem" : 0,
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      {/* ── MOBILE: HexProfile above text ────────────────────────────────── */}
      {isMobile && bootDone && (
        // On mobile we don't need the two-layer trick because there's no
        // CSS `translateY(-50%)` centering — just a normal flow element.
        <div
          style={{
            alignSelf: "center",
            width: "min(260px, 72vw)",
            aspectRatio: "1 / 1",
            flexShrink: 0,
            marginBottom: "1.5rem",
            position: "relative",
          }}
        >
          {/* Inner: GSAP animates this */}
          <div
            ref={canvasAnimRef}
            style={{ width: "100%", height: "100%", opacity: 0 }}
          >
            <HUDBrackets />
            <Canvas
              camera={{ position: [0, 0, 5], fov: 42 }}
              style={{ width: "100%", height: "100%" }}
              gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[4, 4, 4]} intensity={1.2} color="#00d2ff" />
              <HexProfile bootDone={bootDone} imageUrl={imageUrl} />
            </Canvas>
          </div>
        </div>
      )}

      {/* ── TEXT CONTENT ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {bootDone && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: isMobile ? "100%" : "520px",
              width: "100%",
              textAlign: isMobile ? "center" : "left",
              flex: isMobile ? "unset" : "0 0 auto",
            }}
          >
            {/* Greeting */}
            <motion.div
              variants={fadeUp}
              style={{
                y: greetY,
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div style={{
                width: "3px", height: "38px",
                background: "linear-gradient(#00ffcc,#7c3aed)",
                flexShrink: 0,
              }} />
              <p style={{ color: "#ccc", fontSize: isMobile ? "1rem" : "1.25rem", margin: 0 }}>
                {greeting}
              </p>
            </motion.div>

            {/* Name */}
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
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#00ff96", boxShadow: "0 0 6px #00ff96",
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
                fontSize: isMobile ? "0.88rem" : "0.95rem",
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
            {socialLinks.length > 0 && (
              <motion.div
                variants={containerVariants}
                style={{
                  y: btnsY,
                  display: "flex",
                  gap: "10px",
                  marginBottom: "20px",
                  justifyContent: isMobile ? "center" : "flex-start",
                  flexWrap: "wrap",
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
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: isMobile ? "38px" : "42px",
                      height: isMobile ? "38px" : "42px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: s.color,
                      backdropFilter: "blur(6px)",
                      textDecoration: "none",
                      flexShrink: 0,
                    }}
                  >
                    {s.iconUrl
                      ? <img
                        src={s.iconUrl}
                        alt={s.label}
                        style={{ width: 22, height: 22, objectFit: "contain", borderRadius: 3, filter: "brightness(0) invert(1)", opacity: 0.85 }}
                        onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "block"; }}
                      />
                      : null
                    }
                    <s.Icon size={isMobile ? 16 : 18} style={{ display: s.iconUrl ? "none" : "block" }} />
                  </motion.a>
                ))}
              </motion.div>
            )}

            {/* Resume button */}
            {onOpenPdf && (
              <motion.div
                variants={fadeIn}
                style={{ display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 18px rgba(0,255,204,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenPdf}
                  style={{
                    fontFamily: "monospace", fontSize: "0.8rem",
                    letterSpacing: "0.12em", color: "#00ffcc",
                    background: "rgba(0,255,204,0.07)",
                    border: "1px solid rgba(0,255,204,0.3)",
                    borderRadius: "8px", padding: "8px 20px",
                    cursor: "pointer", pointerEvents: "auto",
                  }}
                >
                  VIEW RESUME
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: HexProfile — two-layer approach ─────────────────────── */}
      {/*                                                                     */}
      {/* THE FIX: split into two divs:                                        */}
      {/*   canvasPositionerRef — outer, holds CSS centering (top:50% +        */}
      {/*                         transform:translateY(-50%)), NEVER touched   */}
      {/*                         by GSAP.                                     */}
      {/*   canvasAnimRef       — inner, GSAP only drives opacity + x offset.  */}
      {/*                         No translateY here so GSAP can't clobber it. */}
      {/*                                                                     */}
      {/* Previously a single div had both the Framer Motion `translateY`      */}
      {/* style prop AND was the GSAP target. GSAP's fromTo sets `transform`   */}
      {/* on the element directly, which on the very first frame overwrote the  */}
      {/* `translateY(-50%)` with just `translateX(50px)`, dropping the        */}
      {/* vertical centering until GSAP finished and the browser re-applied it. */}
      {!isMobile && (
        // Outer positioner — CSS centering only, never a GSAP target
        <div
          ref={canvasPositionerRef}
          style={{
            position: "absolute",
            right: "clamp(2rem, 14vw, 18rem)",
            top: "50%",
            transform: "translateY(-50%)",  // centering — GSAP must never touch this element
            width: "clamp(260px, 28vw, 420px)",
            aspectRatio: "1 / 1",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {/* Inner animated wrapper — GSAP only touches this */}
          <motion.div
            ref={canvasAnimRef}
            style={{
              y: canvasY,        // Framer Motion handles the parallax y
              width: "100%",
              height: "100%",
              opacity: 0,        // GSAP will animate this to 1
            }}
          >
            <HUDBrackets />
            <Canvas
              camera={{ position: [0, 0, 5], fov: 42 }}
              style={{ width: "100%", height: "100%" }}
              gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[4, 4, 4]} intensity={1.2} color="#00d2ff" />
              <HexProfile bootDone={bootDone} imageUrl={imageUrl} />
            </Canvas>
          </motion.div>
        </div>
      )}
    </section>
  );
}