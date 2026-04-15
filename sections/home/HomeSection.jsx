"use client";
import { useFrame, memo } from "@react-three/fiber";
import { memo as reactMemo } from "react";
import { Stars, Scroll, useScroll } from "@react-three/drei";
import { scrollProgressRef } from "../../components/ImmersiveView/scrollState";
import HexProfile from "./HexProfile";
import HomeHTML from "./HomeHTML";
import AboutHTML from "../about/AboutHTML";
import SkillsHTML from "../skill/skillHTML";
import ProjectsHTML from "../project/projectHTML";
import EducationHTML from "../education/educationHTML";
import CertHTML from "../certifications/certHTML";
import ContactHTML from "../contact/contactHTML";


const ScrollContent = reactMemo(function ScrollContent({ bootDone, onOpenPdf }) {
  return (
    <Scroll html>
      <HomeHTML bootDone={bootDone} onOpenPdf={onOpenPdf} />
      <AboutHTML />
      <SkillsHTML />
      <ProjectsHTML />
      <EducationHTML />
      <CertHTML />
      <ContactHTML />
    </Scroll>
  );
});

export default function HomeSection({ bootDone, onOpenPdf}) {
  return (
    <>
      <Stars radius={100} depth={50} count={2500} factor={2.5} fade speed={0.4} />
      <HexProfile bootDone={bootDone} />
      <ScrollContent bootDone={bootDone} onOpenPdf={onOpenPdf}/>
    </>
  );
}