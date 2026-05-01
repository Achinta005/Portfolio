"use client";
import "./globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          *::-webkit-scrollbar { display: none !important; width: 0px !important; height: 0px !important; }
          *::-webkit-scrollbar-track { display: none !important; }
          *::-webkit-scrollbar-thumb { display: none !important; }
          body { min-width: 1100px; }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}