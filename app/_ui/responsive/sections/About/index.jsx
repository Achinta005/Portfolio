"use client";
import useIsMobile from "@/utils/useIsMobile";
import AboutMobile from "./mobile";
import AboutDesktop from "./desktop";

export default function AboutSection() {
  const isMobile = useIsMobile();
  return isMobile ? <AboutMobile /> : <AboutDesktop />;
}
