"use client";
import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Award } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function CertCardMobile({ cert }) {
  return (
    <a
      href={cert.path}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-4 rounded-lg border border-slate-800 bg-slate-900/40 active:scale-[0.98] transition-transform"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-slate-800 overflow-hidden flex items-center justify-center">
        {cert.icon ? (
          <img src={cert.icon} alt={cert.issuer} className="w-full h-full object-contain p-1" />
        ) : (
          <Award size={16} className="text-indigo-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-semibold leading-snug mb-0.5 line-clamp-2">{cert.name}</h3>
        <p className="text-[11px] text-slate-500">{cert.issuer}</p>
      </div>

      <ExternalLink size={14} className="flex-shrink-0 text-slate-600 mt-0.5" />
    </a>
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
    <section id="certifications" className="relative py-16 px-5 bg-slate-950 text-white">
      <span className="text-xs font-mono tracking-widest text-indigo-400">05 · CERTIFICATIONS</span>
      <h2 className="mt-2 text-2xl font-bold mb-8">Credentials & training.</h2>

      <div className="space-y-8">
        {grouped.map(([year, items]) => (
          <div key={year}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-bold text-indigo-400">{year}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="flex flex-col gap-2.5">
              {items.map((cert) => (
                <CertCardMobile key={cert._id} cert={cert} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
