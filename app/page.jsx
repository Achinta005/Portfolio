"use client";
import { useState, useCallback } from "react";
import HomeHTML from "./sections/home/HomeHTML";
import AboutHTML from "./sections/about/AboutHTML";
import SkillsHTML from "./sections/skill/skillHTML";
import ProjectsHTML from "./sections/project/projectHTML";
import EducationHTML from "./sections/education/educationHTML";
import ContactHTML from "./sections/contact/contactHTML";
import CertHTML from "./sections/certifications/certHTML";
import CompassRing from "../components/ImmersiveView/CompassRing";
import BootOverlay from "../components/ImmersiveView/BootOverlay";
import StarField from "../components/StarField.jsx";

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