
'use client';

import AboutHero from './AboutHero';
import EducationSection from './EducationSection';
import CertificationSection from './CertificationSection';
import InteractiveSkillsDisplay from './InteractiveSkillsDisplay'

export default function About() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <InteractiveSkillsDisplay/>
      <EducationSection />
      <CertificationSection />
    </div>
  );
}
