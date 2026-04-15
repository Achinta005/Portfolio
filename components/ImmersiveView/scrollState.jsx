import { createRef } from "react";
export const scrollProgressRef = createRef();
scrollProgressRef.current = { offset: 0 };

export const SECTION_OFFSETS = {
  home: 0,
  about: 0.23897221954790285,
  skills: 0.2760979039388065,
  projects: 0.368912140408254,
  education: 0.5174149119614531,
  cert:0.7587318859945152,
  contact: 0.9629232266210503,
}

export const scrollToSection = (sectionName) => {
  const target = SECTION_OFFSETS[sectionName.toLowerCase()];
  if (target === undefined) return;

  const el = window.__scrollEl;
  if (!el) {
    console.warn("[scrollToSection] no el found");
    return;
  }

  console.log("[scrollToSection]", sectionName, target, el.scrollHeight, el.clientHeight);
  el.scrollTop = target * (el.scrollHeight - el.clientHeight);
};