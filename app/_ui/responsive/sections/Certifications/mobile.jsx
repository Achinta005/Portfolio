"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Award, ShieldCheck } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function CertCardMobile({ cert, index }) {
  return (
    <motion.a
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      href={cert.path}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-800/50 bg-gradient-to-r from-slate-900/40 to-slate-900/20 active:scale-[0.98] transition-transform"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden flex items-center justify-center">
        {cert.icon ? (
          <img src={cert.icon} alt={cert.issuer} className="w-full h-full object-contain p-1.5" />
        ) : (
          <ShieldCheck size={16} className="text-cyan-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[12px] font-bold leading-snug mb-1 line-clamp-2 tracking-tight">{cert.name}</h3>
        <p className="text-[10px] text-slate-500 font-medium tracking-wide">{cert.issuer}</p>
      </div>

      <ExternalLink size={13} className="flex-shrink-0 text-slate-600 mt-0.5" strokeWidth={2.5} />
    </motion.a>
  );
}

export default function CertificationsMobile() {
  const [certs, setCerts] = useState(null);

  useEffect(() => {
    portfolioApi.getCertifications().then(setCerts).catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    if (!certs) return [];
    const map = {};
    certs.forEach((c) => {
      if (!map[c.year]) map[c.year] = [];
      map[c.year].push(c);
    });
    return Object.entries(map).sort((a, b) => b[0] - a[0]);
  }, [certs]);

  if (!certs) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="certifications" className="relative py-20 px-5 bg-transparent text-white">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-[10px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[0.25em] uppercase text-cyan-400"
      >
        05 · CERTIFICATIONS
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mt-3 text-[26px] font-extrabold tracking-tight mb-8"
      >
        Credentials &amp; training.
      </motion.h2>

      <div className="space-y-8">
        {grouped.map(([year, items]) => (
          <div key={year}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {year}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent" />
              <span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">
                {items.length} cert{items.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {items.map((cert, i) => (
                <CertCardMobile key={cert._id} cert={cert} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
