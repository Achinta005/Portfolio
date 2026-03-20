"use client";
import { motion, easeOut } from "framer-motion";

export default function ProjectsHero() {
  return (
    <section className="relative pt-10 pb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-5"
        >
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">
            Portfolio
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-none"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          <span className="text-white">My </span>
          <span
            style={{
              background:
                "linear-gradient(135deg, #a78bfa 0%, #38bdf8 50%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Projects
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
          className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed"
        >
          A showcase of work across web engineering and machine learning — each
          project a distinct problem, a deliberate solution.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
          className="mt-6 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
        />
      </div>
    </section>
  );
}
