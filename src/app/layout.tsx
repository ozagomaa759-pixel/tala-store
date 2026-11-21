
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./globals.css";
import "./tala-pages.css";

import AnimationProvider from "@/animations/AnimationProvider";
import TalaOpening from "@/animations/TalaOpening";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const talaDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-tala-display",
  display: "swap",
});

const talaSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tala-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tala-fashion.vercel.app"),
  title: {
    default: "TALA — Contemporary Luxury Fashion",
    template: "%s | TALA",
  },
  description:
    "Discover TALA. Contemporary fashion, expressive style, and effortless confidence.",
  applicationName: "TALA",
  keywords: [
    "TALA",
    "TALA Fashion",
    "Women's Fashion",
    "Contemporary Fashion",
    "Luxury Fashion",
    "Sets",
    "Jackets",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "TALA",
    title: "TALA — Contemporary Luxury Fashion",
    description:
      "Contemporary fashion, expressive style, and effortless confidence.",
    url: "https://tala-fashion.vercel.app",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F1EB",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${talaDisplay.variable} ${talaSans.variable}`}
      >
        <TalaOpening />

        <AnimationProvider>
          <AnnouncementBar />
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
