"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Sparkles, ChevronDown, FileText, X, Download, ExternalLink } from "lucide-react";

const iconMap = { Github, Linkedin, Twitter, Mail };

const SOCIAL_STYLES = {
  Github: { bg: "from-[#2b3137] to-[#1a1e22]", glow: "#6e5494" },
  Linkedin: { bg: "from-[#0a66c2] to-[#004182]", glow: "#0a66c2" },
  Twitter: { bg: "from-[#1d9bf0] to-[#0c7abf]", glow: "#1d9bf0" },
  Mail: { bg: "from-[#ea4335] to-[#c5221f]", glow: "#ea4335" },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── PDF Viewer Modal ──────────────────────────────────────────── */
function PdfModal({ open, onClose, pdfUrl = "/resume.pdf" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/90 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5">
          <FileText size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold tracking-tight text-white">Resume</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
          >
            <Download size={12} strokeWidth={2.5} /> Save
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide border border-slate-700/60 text-slate-300"
          >
            <ExternalLink size={12} strokeWidth={2.5} />
          </a>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* PDF iframe / viewer fallback */}
      <div
        className="flex-1 overflow-hidden relative bg-slate-900 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full flex-1"
        >
          <div className="flex flex-col items-center justify-center p-6 text-center h-full gap-4">
            <FileText size={48} className="text-cyan-400 opacity-60" />
            <p className="text-sm text-slate-300">
              Your browser does not support inline PDF viewing on mobile.
            </p>
            <div className="flex gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <ExternalLink size={14} /> Open Directly
              </a>
              <a
                href={pdfUrl}
                download
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5"
              >
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        </object>
      </div>
    </div>
  );
}

/* ── Hero Section ──────────────────────────────────────────────── */
export default function HeroMobile({ hero }) {
  const [pdfOpen, setPdfOpen] = useState(false);

  if (!hero) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-32 h-32 rounded-full bg-slate-800" />
      </section>
    );
  }

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent text-white py-20"
      >
        {/* ── Animated background ── */}
        <div className="absolute inset-0 -z-10">
          {/* Floating orbs */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[25%] -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-violet-600/15 rounded-full blur-[80px]"
          />
          {/* Extra accent orb */}
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -10, 0], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[10%] right-[20%] w-40 h-40 bg-rose-500/12 rounded-full blur-[60px]"
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_80%)]" />

          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
        </div>

        {/* Floating sparkle accents */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-8 text-cyan-400/30"
        >
          <Sparkles size={16} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-40 left-6 text-blue-400/25"
        >
          <Sparkles size={12} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, 10, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[35%] right-6 text-violet-400/25"
        >
          <Sparkles size={10} />
        </motion.div>

        {/* Profile image */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-7">
          <div className="relative w-32 h-32">
            <motion.div
              animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 blur-xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,#3b82f6,#22d3ee,#a855f7,#3b82f6)] opacity-60"
            />
            <div className="relative w-full h-full rounded-full p-[3px] bg-slate-950">
              <img
                src={hero.imageUrl}
                alt={hero.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Available badge */}
        {hero.available && (
          <motion.div
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-emerald-400 uppercase">{hero.availableText}</span>
          </motion.div>
        )}

        <motion.p {...fadeUp(0.15)} className="text-sm font-medium tracking-widest uppercase text-slate-500 mb-2">
          {hero.greeting}
        </motion.p>

        <motion.h1
          {...fadeUp(0.2)}
          className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent px-4 text-center leading-[1.1]"
        >
          {hero.name}
        </motion.h1>

        <motion.p
          {...fadeUp(0.25)}
          className="text-[13px] text-slate-400 leading-relaxed px-8 text-center mb-7 max-w-sm font-light"
        >
          {hero.bio}
        </motion.p>

        {/* ── CTA Buttons ── */}
        <motion.div {...fadeUp(0.3)} className="flex items-center gap-3 mb-8">
          {hero.contactLabel && (
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="relative px-6 py-2.5 text-sm rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold overflow-hidden shadow-lg shadow-blue-500/20"
            >
              {hero.contactLabel}
            </motion.a>
          )}
          {hero.resumeLabel && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPdfOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 text-sm rounded-xl border border-slate-700/80 bg-white/[0.03] font-semibold text-slate-300"
            >
              <FileText size={14} strokeWidth={2.2} />
              {hero.resumeLabel}
            </motion.button>
          )}
        </motion.div>

        {/* ── Enhanced Social Links ── */}
        <motion.div {...fadeUp(0.35)} className="flex items-center gap-3">
          {hero.socialLinks?.map((link, i) => {
            const Icon = iconMap[link.icon];
            const style = SOCIAL_STYLES[link.icon] || { bg: "from-slate-800 to-slate-900", glow: "#64748b" };
            return (
              <motion.a
                key={link.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.05 }}
                whileTap={{ scale: 0.9 }}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={link.label}
                className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-b ${style.bg} border border-white/10 shadow-md shadow-black/20 overflow-hidden transition-all`}
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 active:opacity-100"
                  style={{ background: `radial-gradient(circle at center, ${style.glow}50, transparent 70%)` }}
                />
                {Icon ? (
                  <Icon size={18} strokeWidth={2} className="relative z-10 text-white" />
                ) : (
                  <img src={link.iconUrl} alt={link.label} className="relative z-10 w-4 h-4" />
                )}
              </motion.a>
            );
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500"
          aria-label="Scroll down"
        >
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown size={16} strokeWidth={2.5} />
        </motion.a>
      </section>

      {/* PDF Viewer Modal */}
      <PdfModal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        pdfUrl={hero?.resumeUrl || hero?.resumePdf || hero?.resumeLink || "/resume.pdf"}
      />
    </>
  );
}
