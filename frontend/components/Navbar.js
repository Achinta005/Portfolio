"use client";
import { useState, useEffect, useRef } from "react";
import { FloatingDock } from "./ui/floatingdock";
import {
  IconAddressBook,
  IconArticle,
  IconHome,
  IconCertificate,
  IconUser,
} from "@tabler/icons-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mounted) return;
  }, [mounted]);

  const baseLinks = [
    { title: "HOME", icon: <IconHome className="h-full w-full text-gray-300" />, href: "/" },
    { title: "ABOUT", icon: <IconUser className="h-full w-full text-gray-300" />, href: "/about" },
    { title: "PROJECTS", icon: <IconCertificate className="h-full w-full text-gray-300" />, href: "/projects" },
    { title: "BLOGS", icon: <IconArticle className="h-full w-full text-gray-300" />, href: "/blog" },
    { title: "CONTACTS", icon: <IconAddressBook className="h-full w-full text-gray-300" />, href: "/contact" },
  ];

  const links = [...baseLinks];

  if (!mounted) return null;

  return (
    <header className="bg-transparent">
      <div className="lg:hidden">
        <FloatingDock mobileClassName="fixed bottom-6 right-6 z-50" items={links} />
      </div>
      <div className="hidden lg:block">
        <FloatingDock desktopClassName="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50" items={links} />
      </div>
    </header>
  );
}