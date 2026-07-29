"use client";
import { useEffect, useState } from "react";
import useIsMobile from "@/utils/useIsMobile";
import { portfolioApi } from "@/app/lib/api/portfolioApi";
import HeroDesktop from "./desktop";
import HeroMobile from "./mobile";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const [hero, setHero] = useState(null);

  useEffect(() => {
    portfolioApi.getHero().then(setHero).catch(console.error);
  }, []);

  if (isMobile) return <HeroMobile hero={hero} />;
  return <HeroDesktop hero={hero} />;
}
