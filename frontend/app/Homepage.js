"use client";
import HeroSection from "../components/HeroSection";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import About from "./about/page";
import Projects from "./projects/page";
import BlogPage from "./blog/page";
import Contact from "./contact/page";

export default function Homepage() {
  return (
    <div>
      <HeroSection />
      <Header />
    </div>
  );
}
