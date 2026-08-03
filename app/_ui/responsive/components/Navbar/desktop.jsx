"use client";
import { NAV_LINKS } from "./index";
import useActiveSection from "./useActiveSection";

export default function NavbarDesktop() {
  const ids = NAV_LINKS.map((l) => l.id);
  const { activeId, scrolled } = useActiveSection(ids);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <ul className="flex items-center gap-1">
          {NAV_LINKS.filter((l) => l.id !== "home").map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleClick(e, link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30" />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#contact"
          onClick={(e) => handleClick(e, "contact")}
          className="hidden lg:inline-flex px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-medium hover:shadow-lg hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5"
        >
          Let&apos;s talk
        </a>
      </nav>
    </header>
  );
}
