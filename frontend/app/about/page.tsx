
'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AboutHero from './AboutHero';
import EducationSection from './EducationSection';
import CertificationSection from './CertificationSection';

export default function About() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <EducationSection />
      <CertificationSection />
    </div>
  );
}
