'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProjectsHero from './ProjectsHero';
import ProjectsGrid from './ProjectsGrid';

export default function Projects() {
  return (
    <div className="min-h-screen">
      <Header />
      <ProjectsHero />
      <ProjectsGrid />
      <Footer />
    </div>
  );
}