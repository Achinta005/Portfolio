import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://achintahazra.shop"),
  title: "Achinta Hazra | Full Stack Developer",
  description:
    "Official portfolio of Achinta Hazra, a full stack developer skilled in React, Next.js, Tailwind CSS, Node.js, Express, and MongoDB. Explore projects and contact for collaboration.",
  keywords: [
    "Achinta Hazra",
    "Full Stack Developer",
    "React Developer",
    "Next.js Portfolio",
    "JavaScript Developer",
    "Node.js Developer",
  ],
  authors: [{ name: "Achinta Hazra" }],
  openGraph: {
    title: "Achinta Hazra | Full Stack Developer",
    description:
      "Explore the portfolio of Achinta Hazra built using modern full-stack technologies.",
    url: "https://achintahazra.shop",
    siteName: "Achinta Hazra Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Achinta Hazra Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J5KVDY0HCF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J5KVDY0HCF');
          `}
        </Script>

        {/* Model Viewer */}
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />

        {/* Schema.org JSON-LD */}
        <Script id="schema-org" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Achinta Hazra",
            url: "https://achintahazra.shop",
            jobTitle: "Full Stack Web Developer",
            description:
              "Portfolio website of Achinta Hazra, showcasing projects in React, Next.js, Node.js, and MongoDB.",
            image: "/og-image.png",
            sameAs: [
              "https://github.com/Achinta005",
              "https://www.linkedin.com/in/achintahazra",
            ],
          })}
        </Script>
      </body>
    </html>
  );
}
