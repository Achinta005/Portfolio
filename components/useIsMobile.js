'use client'
import { useEffect, useState } from "react";

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update isMobile state based on window width
    const check = () => setIsMobile(window.innerWidth < breakpoint);

    // Initial check
    check();

    // Set event listener on resize
    window.addEventListener("resize", check);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
