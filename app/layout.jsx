import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import VisitTracker from "@/components/VisitTracker";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata = {
  title: "Achinta Hazra — Portfolio",
  description:
    "Developer portfolio of Achinta Hazra — Full-Stack, AI/ML, and Systems Engineering.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Layout({ children }) {
  return (
    <html lang="en" className={jetbrains.variable}>
      <body style={{ touchAction: "pan-y" }}>
        <LenisProvider>
          <VisitTracker />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}