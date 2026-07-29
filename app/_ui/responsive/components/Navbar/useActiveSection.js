"use client";
import { useEffect, useState } from "react";

// Tracks which section is currently in view (for highlighting the active
// nav link) and whether the page has scrolled past the top (for the
// nav bar's solid/blurred background state).
export default function useActiveSection(ids, { threshold = 0.4 } = {}) {
  const [activeId, setActiveId] = useState(ids[0]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { threshold: [threshold], rootMargin: "-15% 0px -55% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return { activeId, scrolled };
}
