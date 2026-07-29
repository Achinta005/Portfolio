"use client";
import useIsMobile from "@/utils/useIsMobile";
import NavbarDesktop from "./desktop";
import NavbarMobile from "./mobile";

// Single source of truth for section order + labels.
// Add/remove/reorder entries here and both nav variants update.
export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const isMobile = useIsMobile();
  return isMobile ? <NavbarMobile /> : <NavbarDesktop />;
}
