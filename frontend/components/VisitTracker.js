"use client";

import { useEffect } from "react";
import { getVisitSessionId } from "@/app/utils/visitSession";

export default function VisitTracker() {
  useEffect(() => {
    const sessionId = getVisitSessionId();

    fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/track/visit`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        path: window.location.pathname,
      }),
    });
  }, []);

  return null;
}
