import Navbar from "./components/Navbar";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/About";
import SkillsSection from "./sections/Skills";
import ProjectsSection from "./sections/Projects";
import EducationSection from "./sections/Education";
import CertificationsSection from "./sections/Certifications";
import ContactSection from "./sections/Contact";

export default function ResponsivePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <CertificationsSection />
      <ContactSection />
    </>
  );
}
