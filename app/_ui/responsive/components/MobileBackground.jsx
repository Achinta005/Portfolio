"use client";
import { motion } from "framer-motion";

// Persistent animated background for the responsive mobile portfolio.
// Renders behind all sections so the whole page feels cohesive.
export default function MobileBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-slate-950">
      {/* Slow-drifting ambient orbs that persist across scroll */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] -left-20 w-[280px] h-[280px] bg-blue-600/[0.06] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -35, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-[45%] -right-20 w-[260px] h-[260px] bg-violet-600/[0.05] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute bottom-[15%] left-[10%] w-[240px] h-[240px] bg-cyan-600/[0.04] rounded-full blur-[100px]"
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#020617_75%)]" />
    </div>
  );
}
