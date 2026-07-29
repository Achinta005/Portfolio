"use client";
import useIsMobile from "@/utils/useIsMobile";
import EducationMobile from "./mobile";
import EducationDesktop from "./desktop";

export default function EducationSection() {
  const isMobile = useIsMobile();
  return isMobile ? <EducationMobile /> : <EducationDesktop />;
}
