"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./index";
import useActiveSection from "./useActiveSection";

export default function NavbarMobile() {
  const ids = NAV_LINKS.map((l) => l.id);
  const { activeId, scrolled } = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClick = (e, id) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    // wait a tick so the closing menu doesn't fight the scroll
    setTimeout(() => {
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-5 py-4">
          <a
            href="#home"
            onClick={(e) => handleClick(e, "home")}
            className="text-lg font-bold tracking-tight text-white"
          >
            Portfolio
            <span className="text-cyan-400">.</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-700 text-white active:scale-95 transition-transform"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Slide-in overlay menu */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-md transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="h-full flex flex-col items-center justify-center gap-2 px-8">
          {NAV_LINKS.map((link, i) => {
            const isActive = activeId === link.id;
            return (
              <li
                key={link.id}
                className={`w-full text-center transition-all duration-300 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleClick(e, link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`block py-3 text-2xl font-semibold rounded-xl transition-colors ${
                    isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"
                      : "text-slate-300 active:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
