
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./tala-pages.css";

import AnimationProvider from "@/animations/AnimationProvider";
import TalaOpening from "@/animations/TalaOpening";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

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
      <body>
        <TalaOpening />
        <AnimationProvider>
          <AnnouncementBar />
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
