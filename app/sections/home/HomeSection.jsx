"use client";
import { useEffect, useState, useRef, memo } from "react";
import { Stars, Scroll } from "@react-three/drei";
import HexProfile from "./HexProfile";
import HomeHTML from "./HomeHTML";
import AboutHTML from "../about/AboutHTML";
import SkillsHTML from "../skill/skillHTML";
import ProjectsHTML from "../project/projectHTML";
import EducationHTML from "../education/educationHTML";
import CertHTML from "../certifications/certHTML";
import ContactHTML from "../contact/contactHTML";
import { portfolioApi } from "../../lib/api/portfolioApi";

// ✅ Defined at module level, never remounts
const ScrollContent = memo(function ScrollContent() {
  return (
    <Scroll html>
      <HomeHTML />
      <AboutHTML />
      <SkillsHTML />
      <ProjectsHTML />
      <EducationHTML />
      <CertHTML />
      <ContactHTML />
    </Scroll>
  );
});

export default function HomeSection() {
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  useEffect(() => {
    portfolioApi.getHero().then((data) => {
      setHeroImageUrl(data?.imageUrl ?? null);
    }).catch(console.error);
  }, []);

  return (
    <>
      <Stars radius={100} depth={50} count={2500} factor={2.5} fade speed={0.4} />
      <HexProfile imageUrl={heroImageUrl} />
      <ScrollContent />
    </>
  );
}