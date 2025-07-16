'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WorkHero from './WorkHero';
import ServicesSection from './ServicesSection';
import ProcessSection from './ProcessSection';
import PricingSection from './PricingSection';

export default function WorkWithMe() {
  return (
    <div className="min-h-screen">
      
      <WorkHero />
      <ServicesSection />
      <ProcessSection />
      <PricingSection />
      
    </div>
  );
}