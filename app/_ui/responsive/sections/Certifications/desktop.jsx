"use client";
import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Award } from "lucide-react";
import { portfolioApi } from "@/app/lib/api/portfolioApi";

function CertCard({ cert }) {
  return (
    <a
      href={cert.path}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70 transition-all hover:-translate-y-0.5"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 border border-slate-800 overflow-hidden flex items-center justify-center">
        {cert.icon ? (
          <img src={cert.icon} alt={cert.issuer} className="w-full h-full object-contain p-1.5" />
        ) : (
          <Award size={20} className="text-indigo-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold leading-snug mb-1 group-hover:text-indigo-300 transition-colors line-clamp-2">
          {cert.name}
        </h3>
        <p className="text-xs text-slate-500">{cert.issuer}</p>
      </div>

      <ExternalLink
        size={16}
        className="flex-shrink-0 text-slate-600 group-hover:text-indigo-400 transition-colors mt-1"
      />
    </a>
  );
}

export default function CertificationsDesktop() {
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
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-slate-700 border-t-blue-500" />
      </section>
    );
  }

  return (
    <section id="certifications" className="relative py-28 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <span className="text-sm font-mono tracking-widest text-indigo-400">05 · CERTIFICATIONS</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Credentials & training.</h2>
        </div>

        <div className="space-y-12">
          {grouped.map(([year, items]) => (
            <div key={year}>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-2xl font-bold text-indigo-400">{year}</span>
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-xs text-slate-500">
                  {items.length} {items.length === 1 ? "credential" : "credentials"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((cert) => (
                  <CertCard key={cert._id} cert={cert} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
