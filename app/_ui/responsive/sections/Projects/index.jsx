"use client";
import useIsMobile from "@/utils/useIsMobile";
import ProjectsMobile from "./mobile";
import ProjectsDesktop from "./desktop";

export default function ProjectsSection() {
  const isMobile = useIsMobile();
  return isMobile ? <ProjectsMobile /> : <ProjectsDesktop />;
}
