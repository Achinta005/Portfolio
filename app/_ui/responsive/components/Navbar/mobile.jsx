"use client";
import { motion } from "framer-motion";
import { Home, User, Code2, FolderKanban, GraduationCap, Award, Mail } from "lucide-react";
import { NAV_LINKS } from "./index";
import useActiveSection from "./useActiveSection";

const ICONS = {
  home: Home,
  about: User,
  skills: Code2,
  projects: FolderKanban,
  education: GraduationCap,
  certifications: Award,
  contact: Mail,
};

export default function NavbarMobile() {
  const ids = NAV_LINKS.map((l) => l.id);
  const { activeId } = useActiveSection(ids);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    /* Floating bottom dock (quick nav, always visible) */
    <nav className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/30">
        {NAV_LINKS.map((link) => {
          const isActive = activeId === link.id;
          const Icon = ICONS[link.id] ?? Home;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleClick(e, link.id)}
              aria-current={isActive ? "true" : undefined}
              className="relative w-10 h-10 flex items-center justify-center rounded-full"
            >
              {isActive && (
                <motion.span
                  layoutId="dock-active"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400"
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 ${isActive ? "text-white" : "text-slate-400"}`}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
