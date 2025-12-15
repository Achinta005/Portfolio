"use client";

import { useEffect, useState } from "react";

const SECRET_KEY = "8513800195";

export default function ExcludeAnalyticsPage() {
  const [status, setStatus] = useState("Checking access...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("key") !== SECRET_KEY) {
      setStatus("Access denied");
      return;
    }

    document.cookie =
      "exclude_analytics=true; path=/; max-age=31536000; SameSite=Lax";
    setStatus("This device is now excluded from analytics.");
  }, []);

  return <div style={{ padding: 40 }}>{status}</div>;
}
