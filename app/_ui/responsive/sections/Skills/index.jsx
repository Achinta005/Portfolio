"use client";
import useIsMobile from "@/utils/useIsMobile";
import SkillsMobile from "./mobile";
import SkillsDesktop from "./desktop";

export default function SkillsSection() {
  const isMobile = useIsMobile();
  return isMobile ? <SkillsMobile /> : <SkillsDesktop />;
}
