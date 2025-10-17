"use client";
import { useEffect } from "react";
import Homepage from "./Homepage/page";
import Header from "../components/Navbar";

export default function Page() {
  useEffect(() => {
    // Maintain proper viewport height on mobile
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  useEffect(() => {
    // Check backend health
    const aliveBackend = async () => {
      try {
        const res = await fetch(`/api/health_check`);
        const data = await res.json();
        console.log(data.message);
      } catch (err) {
        console.warn("Backend check failed");
      }
    };
    aliveBackend();
  }, []);

  return (
    <>
      {/* Global CSS reset */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
        }

        #__next {
          overflow-x: hidden;
        }
      `}</style>

      {/* Foreground content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "calc(var(--vh, 1vh) * 100)",
          overflow: "hidden",
          backgroundColor: "black", // optional background
        }}
      >
        <Header />
        <Homepage />
      </div>
    </>
  );
}
