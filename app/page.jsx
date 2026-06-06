"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HomeHTML from "./sections/home/HomeHTML";
import CompassRing from "../components/ImmersiveView/CompassRing";
import BootOverlay from "../components/ImmersiveView/BootOverlay";
import StarField from "../components/StarField.jsx";

// ── Lazy-load below-fold sections ─────────────────────────────────────────────
// These chunks only download when React renders them, splitting the initial
// bundle from ~200KB+ down to ~80KB (Home + StarField + BootOverlay + CompassRing).
const AboutHTML = dynamic(() => import("./sections/about/AboutHTML"), { ssr: false });
const SkillsHTML = dynamic(() => import("./sections/skill/skillHTML"), { ssr: false });
const ProjectsHTML = dynamic(() => import("./sections/project/projectHTML"), { ssr: false });
const EducationHTML = dynamic(() => import("./sections/education/educationHTML"), { ssr: false });
const CertHTML = dynamic(() => import("./sections/certifications/certHTML"), { ssr: false });
const ContactHTML = dynamic(() => import("./sections/contact/contactHTML"), { ssr: false });

export default function Page() {
  const [bootDone, setBootDone] = useState(false);
  const handleBootDone = useCallback(() => setBootDone(true), []);

  return (
    <main style={{ height: "1000vh", position: "relative", overflow: "visible", width: "100%" }}>
      <StarField />
      <CompassRing />
      {!bootDone && <BootOverlay onDone={handleBootDone} />}
      <HomeHTML bootDone={bootDone} />
      <AboutHTML />
      <SkillsHTML />
      <ProjectsHTML />
      <EducationHTML />
      <CertHTML />
      <ContactHTML />
    </main>
  );
}