"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import useIsMobile from "@/utils/useIsMobile";

export default function UiRouter({ envUi }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [Page, setPage] = useState(null);

  useEffect(() => {
    const ui = envUi?.replace(/["'\s]/g, "").toLowerCase();
 
    // Route-based override: /1 → immersive, /2 → responsive
    if (isMobile) {
      import("./_ui/responsive/page").then(m => setPage(() => m.default));
    } else if (pathname === "/1") {
      import("./_ui/immersive/page").then(m => setPage(() => m.default));
    } else if (pathname === "/2") {
      import("./_ui/responsive/page").then(m => setPage(() => m.default));
    } else if (ui === "immersive") {
      import("./_ui/immersive/page").then(m => setPage(() => m.default));
    } else {
      import("./_ui/responsive/page").then(m => setPage(() => m.default));
    }
  }, [isMobile, envUi, pathname]);

  if (!Page) return <div style={{ background: "#08060f", minHeight: "100vh" }} />;

  return <Page />;
}
