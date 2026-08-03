import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-[family-name:var(--font-inter)]">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}