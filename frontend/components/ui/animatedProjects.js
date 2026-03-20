"use client";
import React, { useState, useEffect, useRef } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────────────────────────
   MEDIA SLIDE
───────────────────────────────────────────────────────────────────────────── */
const MediaSlide = ({ item }) => {
  if (item.type === "video") {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden">
        <video
          src={item.src}
          poster={item.poster}
          controls
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-red-400 text-[10px] font-mono tracking-widest px-2 py-1 rounded-full pointer-events-none uppercase">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
          Live Recording
        </span>
      </div>
    );
  }
  return (
    <img
      src={item.src}
      alt={item.label || "project"}
      draggable={false}
      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
    />
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SINGLE PROJECT CARD
   layout: "image-left" | "image-right"
───────────────────────────────────────────────────────────────────────────── */
const ProjectCard = ({ project, layout, animKey, index }) => {
  const [mediaIdx, setMediaIdx] = useState(0);
  const [mediaPaused, setMediaPaused] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const timerRef = useRef(null);
  const isLeft = layout === "image-left";

  useEffect(() => {
    setMediaIdx(0);
    setShowFull(false);
    setMediaPaused(false);
  }, [animKey]);

  useEffect(() => {
    if (mediaPaused || project.media.length <= 1) return;
    timerRef.current = setInterval(
      () => setMediaIdx((p) => (p + 1) % project.media.length),
      3200,
    );
    return () => clearInterval(timerRef.current);
  }, [mediaPaused, animKey, project.media.length]);

  const currentMedia = project.media[mediaIdx];
  const words = (project.quote || "").split(/\s+/);
  const LIMIT = 38;
  const isLong = words.length > LIMIT;
  const shown = showFull ? words : words.slice(0, LIMIT);

  const accentColor =
    project.category === "Machine Learning"
      ? {
          ring: "ring-violet-500/30",
          glow: "shadow-violet-500/20",
          badge: "bg-violet-500/10 border-violet-400/30 text-violet-300",
          dot: "bg-violet-400",
        }
      : {
          ring: "ring-cyan-500/30",
          glow: "shadow-cyan-500/20",
          badge: "bg-cyan-500/10 border-cyan-400/30 text-cyan-300",
          dot: "bg-cyan-400",
        };

  /* ── IMAGE PANEL ── */
  const ImagePanel = (
    <div
      className={`group relative flex-shrink-0 overflow-hidden rounded-xl ${accentColor.ring} ring-1`}
      style={{ width: "44%", aspectRatio: "16/10" }}
      onMouseEnter={() => setMediaPaused(true)}
      onMouseLeave={() => setMediaPaused(false)}
    >
      {/* Glow edge */}
      <div
        className={`absolute inset-0 rounded-xl shadow-2xl ${accentColor.glow} pointer-events-none z-10`}
      />

      {/* Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${animKey}-${mediaIdx}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <MediaSlide item={currentMedia} />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Media label */}
      <div className="absolute bottom-2 left-3 z-20 text-white/70 text-[10px] font-mono tracking-wider">
        {currentMedia.label}
      </div>

      {/* Arrow nav — visible on hover */}
      {project.media.length > 1 && (
        <>
          <button
            onClick={() =>
              setMediaIdx(
                (p) => (p - 1 + project.media.length) % project.media.length,
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ‹
          </button>
          <button
            onClick={() => setMediaIdx((p) => (p + 1) % project.media.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {project.media.length > 1 && (
        <div className="absolute bottom-2 right-3 z-20 flex gap-1">
          {project.media.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setMediaIdx(i);
                setMediaPaused(true);
              }}
              className={`rounded-full transition-all duration-300 ${i === mediaIdx ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}

      {/* Index number watermark */}
      <div className="absolute top-2 right-3 z-20 text-white/20 text-3xl font-black font-mono leading-none select-none">
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );

  /* ── INFO PANEL ── */
  const InfoPanel = (
    <motion.div
      key={animKey + "-info"}
      initial={{ opacity: 0, x: isLeft ? 16 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="flex-1 flex flex-col justify-center gap-2.5 min-w-0 px-1"
    >
      {/* Top: badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border ${accentColor.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${accentColor.dot}`} />
          {project.category}
        </span>
        {project.isLocal && (
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border bg-amber-500/10 border-amber-400/30 text-amber-300">
            ⬡ Local Model
          </span>
        )}
      </div>

      {/* Title with accent bar */}
      <div className="flex items-start gap-2.5">
        <div
          className={`mt-1 flex-shrink-0 w-0.5 h-8 rounded-full ${accentColor.dot} opacity-70`}
        />
        <h3 className="text-sm sm:text-base font-bold text-white leading-snug tracking-tight">
          {project.name}
        </h3>
      </div>

      {/* Tech chips */}
      <div className="flex flex-wrap gap-1.5">
        {project.designation
          .split(", ")
          .slice(0, 4)
          .map((tech, i) => (
            <span
              key={i}
              className="text-[9px] font-mono bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-md"
            >
              {tech}
            </span>
          ))}
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-400 leading-relaxed">
        {shown.map((word, i) => (
          <motion.span
            key={`${animKey}-w${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.08, delay: 0.004 * i }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        ))}
        {isLong && !showFull && <span className="text-gray-600">…</span>}
        {isLong && (
          <button
            onClick={() => setShowFull((v) => !v)}
            className="ml-1 text-[10px] text-blue-400/80 hover:text-blue-300 underline decoration-dotted cursor-pointer transition-colors"
          >
            {showFull ? "show less" : "read more"}
          </button>
        )}
      </p>

      {/* ML stats */}
      {project.showAllButtons &&
        (project.accuracy != null || project.features != null) && (
          <div className="flex gap-3 flex-wrap">
            {project.accuracy != null && (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                <span className="text-amber-400 text-[10px]">◈</span>
                <span className="text-amber-300 text-[10px] font-mono font-semibold">
                  {project.accuracy}%
                </span>
                <span className="text-amber-500/70 text-[9px]">accuracy</span>
              </div>
            )}
            {project.features != null && (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                <span className="text-amber-400 text-[10px]">◈</span>
                <span className="text-amber-300 text-[10px] font-mono font-semibold">
                  {project.features}
                </span>
                <span className="text-amber-500/70 text-[9px]">features</span>
              </div>
            )}
          </div>
        )}

      {/* Divider */}
      <div className="h-px bg-white/5 w-full" />

      {/* Links */}
      <div className="flex items-center gap-4">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 group-hover/link:bg-emerald-500/25 transition-colors">
              <span className="text-[10px]">↗</span>
            </span>
            <span className="text-[11px] font-semibold tracking-wide">
              Live Demo
            </span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10">
              <span className="text-[10px]">—</span>
            </span>
            <span className="text-[11px]">
              {project.isLocal ? "Local Only" : "No Demo"}
            </span>
          </div>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover/link:bg-white/10 transition-colors">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </span>
            <span className="text-[11px] font-semibold tracking-wide">
              Source Code
            </span>
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div
      className={`flex items-stretch gap-4 sm:gap-5 ${isLeft ? "" : "flex-row-reverse"}`}
    >
      {ImagePanel}
      {InfoPanel}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORTED COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const AnimatedTestimonials = ({
  testimonials,
  activeIndex,
  onNext,
  onPrev,
  onGoTo,
}) => {
  const PAGE_SIZE = 2;
  const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);
  const page = activeIndex;
  const proj0 = testimonials[page * PAGE_SIZE] || null;
  const proj1 = testimonials[page * PAGE_SIZE + 1] || null;

  return (
    <div className="w-full select-none">
      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col gap-3"
        >
          {/* Card 1 — image LEFT */}
          {proj0 && (
            <div
              className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm p-4 sm:p-5
              hover:border-white/[0.14] transition-all duration-500 group"
              style={{
                boxShadow:
                  "0 8px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Subtle noise texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                }}
              />
              <ProjectCard
                project={proj0}
                layout="image-left"
                animKey={`${page}-0`}
                index={page * PAGE_SIZE}
              />
            </div>
          )}

          {/* Separator with page marker */}
          {proj0 && proj1 && (
            <div className="flex items-center gap-3 px-1">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">
                next
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          )}

          {/* Card 2 — image RIGHT */}
          {proj1 && (
            <div
              className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-bl from-white/[0.04] to-transparent backdrop-blur-sm p-4 sm:p-5
              hover:border-white/[0.14] transition-all duration-500 group"
              style={{
                boxShadow:
                  "0 8px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                }}
              />
              <ProjectCard
                project={proj1}
                layout="image-right"
                animKey={`${page}-1`}
                index={page * PAGE_SIZE + 1}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            className="group/btn flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/12 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <IconArrowLeft className="h-3.5 w-3.5 text-white/60 group-hover/btn:text-white group-hover/btn:-translate-x-0.5 transition-all" />
          </button>
          <button
            onClick={onNext}
            className="group/btn flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/12 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <IconArrowRight className="h-3.5 w-3.5 text-white/60 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Dot nav */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onGoTo(i)}
              className={`rounded-full transition-all duration-400 ${
                i === page
                  ? "w-5 h-2 bg-gradient-to-r from-violet-400 to-cyan-400"
                  : "w-2 h-2 bg-white/15 hover:bg-white/35"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          <span className="text-[11px] font-mono text-white/80 font-semibold">
            {page + 1}
          </span>
          <span className="text-white/20 text-[10px]">/</span>
          <span className="text-[11px] font-mono text-white/40">
            {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};
