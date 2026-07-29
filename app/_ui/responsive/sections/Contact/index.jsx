"use client";
import { useEffect } from "react";
import useIsMobile from "@/utils/useIsMobile";
import { portfolioApi } from "@/app/lib/api/portfolioApi";
import ContactMobile from "./mobile";
import ContactDesktop from "./desktop";

export default function ContactSection() {
  const isMobile = useIsMobile();

  useEffect(() => {
    portfolioApi.getContact().catch(console.error);
  }, []);

  return isMobile ? <ContactMobile /> : <ContactDesktop />;
}
