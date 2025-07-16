'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactHero from './ContactHero';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

export default function Contact() {
  return (
    <div className="min-h-screen">
      
      <ContactHero />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
      
    </div>
  );
}