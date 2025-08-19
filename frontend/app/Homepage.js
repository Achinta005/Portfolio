"use client";
import HeroSection from "../components/HeroSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import About from "./about/page";
import Projects from "./projects/page";
import BlogPage from "./blog/page";
import Contact from "./contact/page";

export default function Homepage() {
  return (
    <div style={{ transform: "scale(0.9)", transformOrigin: "top center" }}>
      <Header />
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="blogs">
        <BlogPage />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
  );
}
