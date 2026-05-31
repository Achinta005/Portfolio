"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { updateScrollProgress } from "../components/ImmersiveView/scrollState";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";

gsap.registerPlugin(ScrollTrigger);

export default function Layout({ children }) {
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";

    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: false,
      duration: 1.1,
      lerp: 0.08,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    const onRefresh = () => lenis.resize();

    lenis.on("scroll", (e) => {
      updateScrollProgress(e.scroll, e.limit);
      ScrollTrigger.update();
    });

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    window.__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body style={{ touchAction: "pan-y" }}><VisitTracker />{children}</body>
    </html>
  );
}