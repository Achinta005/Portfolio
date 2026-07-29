"use client";
import { Github, Linkedin, Twitter, Mail, ArrowDown } from "lucide-react";

const iconMap = { Github, Linkedin, Twitter, Mail };

export default function HeroMobile({ hero }) {
  if (!hero) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-32 h-32 rounded-full bg-slate-800" />
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center overflow-hidden bg-slate-950 text-white pt-16 pb-24">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Profile image */}
      <div className="flex justify-center mb-8 mt-8">
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 blur-xl opacity-30 animate-pulse" />
          <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-br from-blue-500 via-cyan-400 to-transparent">
            <img
              src={hero.imageUrl}
              alt={hero.name}
              className="w-full h-full rounded-full object-cover border-4 border-slate-950"
            />
          </div>
        </div>
      </div>

      {/* Available badge */}
      {hero.available && (
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-emerald-400">{hero.availableText}</span>
        </div>
      )}

      <p className="text-base text-slate-400 mb-1">{hero.greeting}</p>
      <h1 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent px-4 text-center">
        {hero.name}
      </h1>

      <p className="text-sm text-slate-400 leading-relaxed px-6 text-center mb-6 max-w-md">
        {hero.bio}
      </p>

      <div className="flex items-center gap-3 mb-6">
        {hero.contactLabel && (
          <a
            href="#contact"
            className="px-5 py-2.5 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-medium"
          >
            {hero.contactLabel}
          </a>
        )}
        {hero.resumeLabel && (
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm rounded-lg border border-slate-700 font-medium"
          >
            {hero.resumeLabel}
          </a>
        )}
      </div>

      <div className="flex items-center gap-4">
        {hero.socialLinks?.map((link) => {
          const Icon = iconMap[link.icon];
          return (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700"
              style={{ backgroundColor: link.color }}
            >
              {Icon ? <Icon size={16} /> : <img src={link.iconUrl} alt={link.label} className="w-4 h-4" />}
            </a>
          );
        })}
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={20} />
      </a>
    </section>
  );
}
