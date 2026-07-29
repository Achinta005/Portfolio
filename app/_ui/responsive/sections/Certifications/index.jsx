"use client";
import useIsMobile from "@/utils/useIsMobile";
import CertificationsMobile from "./mobile";
import CertificationsDesktop from "./desktop";

export default function CertificationsSection() {
  const isMobile = useIsMobile();
  return isMobile ? <CertificationsMobile /> : <CertificationsDesktop />;
}
