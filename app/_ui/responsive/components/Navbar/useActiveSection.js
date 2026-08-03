"use client";
import { useEffect, useState, useMemo, useRef } from "react";

// Tracks which section is currently in view using scroll position
// (more reliable than IntersectionObserver on mobile) and whether
// the page has scrolled past the top.
export default function useActiveSection(ids) {
  // Stabilise the ids array so effects don't re-run on every render
  const stableIds = useMemo(() => ids, [ids.join(",")]);

  const [activeId, setActiveId] = useState(stableIds[0]);
  const [scrolled, setScrolled] = useState(false);
  const rafId = useRef(0);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 40);

      const scrollY = window.scrollY;
      const trigger = scrollY + window.innerHeight * 0.35;

      let currentId = stableIds[0];
      for (const id of stableIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        // getBoundingClientRect gives accurate page position regardless of nesting
        const top = el.getBoundingClientRect().top + scrollY;
        if (top <= trigger) {
          currentId = id;
        }
      }

      // If near bottom of page, pick the last section
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50) {
        const lastId = [...stableIds].reverse().find((id) => document.getElementById(id));
        if (lastId) currentId = lastId;
      }

      setActiveId(currentId);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    // Run once immediately
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [stableIds]);

  return { activeId, scrolled };
}
