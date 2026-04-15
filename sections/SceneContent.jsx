"use client";
import HomeSection from "./home/HomeSection";
import AboutSection from "./about/AboutSection";
import SkillsSection from "./skill/skillSection";
import ProjectsSection from "./project/projectSection";
import EducationSection from "./education/educationSection";
import CertSection from "./certifications/certSection";
import ContactSection from "./contact/contactSection";

export default function SceneContent({ bootDone, onOpenPdf }) {
  return (
    <>
      <HomeSection bootDone={bootDone} onOpenPdf={onOpenPdf} />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <CertSection />
      <ContactSection />
    </>
  );
}