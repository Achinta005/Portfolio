import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Achinta Hazra | Full Stack Web Developer',
  description: 'Official portfolio of Achinta Hazra, a full stack developer skilled in React, Next.js, Tailwind CSS, Node.js, Express, and MongoDB. Explore projects and contact for collaboration.',
  keywords: ['Achinta Hazra', 'Full Stack Developer', 'React Developer', 'Next.js Portfolio', 'JavaScript Developer', 'Node.js Developer'],
  authors: [{ name: 'Achinta Hazra' }],
  openGraph: {
    title: 'Achinta Hazra | Full Stack Developer',
    description: 'Explore the portfolio of Achinta Hazra built using modern full-stack technologies.',
    url: 'https://achintahazra.shop',
    siteName: 'Achinta Hazra Portfolio',
    images: [
      {
        url: '/og-image.png', // Add an image in public folder//create og image first
        width: 1200,
        height: 630,
        alt: 'Achinta Hazra Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
