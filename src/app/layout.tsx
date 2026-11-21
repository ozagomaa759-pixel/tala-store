
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
  title: {
    default: "TALA | Luxury Fashion",
    template: "%s | TALA",
  },
  description:
    "Discover the TALA collection. Timeless fashion, elegant details, and effortless style.",
  applicationName: "TALA",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f0e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${talaDisplay.variable} ${talaSans.variable}`}>
        <TalaOpening />
        <AnimationProvider>
          <AnnouncementBar />
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
