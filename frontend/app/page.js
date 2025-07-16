import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import SkillsSection from "../components/SkillsSection";

export default function Index() {
  return (
    <div>
     <Header/>
     <HeroSection/>
     <SkillsSection/>
     <Footer/>
    </div>
  );
}
