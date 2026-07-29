"use client";
import { Github, Linkedin, Twitter, Mail, ArrowDown } from "lucide-react";

const iconMap = { Github, Linkedin, Twitter, Mail };

export default function HeroDesktop({ hero }) {
  if (!hero) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse w-40 h-40 rounded-full bg-slate-800" />
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 text-white">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center w-full py-24">
        {/* Text content */}
        <div className="order-2 md:order-1 text-center md:text-left">
          {hero.available && (
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-emerald-400">
                {hero.availableText}
              </span>
            </div>
          )}

          <p className="text-lg text-slate-400 mb-2">{hero.greeting}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {hero.name}
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 mb-8">
            {hero.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:shadow-lg hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5"
            >
              {hero.contactLabel}
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-slate-700 font-medium hover:border-slate-500 hover:bg-slate-800/50 transition-all"
            >
              {hero.resumeLabel}
            </a>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            {hero.socialLinks?.map((link) => {
              const Icon = iconMap[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-slate-700 hover:border-transparent transition-all hover:-translate-y-1"
                  style={{ ["--hover-color"]: link.color }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = link.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {Icon ? (
                    <Icon size={18} />
                  ) : (
                    <img src={link.iconUrl} alt={link.label} className="w-5 h-5" />
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Profile image */}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-br from-blue-500 via-cyan-400 to-transparent">
              <img
                src={hero.imageUrl}
                alt={hero.name}
                className="w-full h-full rounded-full object-cover border-4 border-slate-950"
              />
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={22} />
      </a>
    </section>
  );
}
