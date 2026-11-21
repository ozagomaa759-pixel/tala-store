
"use client";

import { usePathname } from "next/navigation";

const messages = [
  "THE ART OF EVERYDAY ELEGANCE",
  "A QUIETER KIND OF ELEGANCE",
  "TALA LUXURY FASHION",
  "DISCOVER THE COLLECTION",
];

function MessageGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="tala-marquee-group"
      aria-hidden={duplicate || undefined}
    >
      {messages.map((message) => (
        <span className="tala-marquee-item" key={message}>
          {message}
          <span className="tala-marquee-star" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className="tala-announcement"
      role="region"
      aria-label="TALA announcements"
    >
      <div className="tala-marquee-track">
        <MessageGroup />
        <MessageGroup duplicate />
      </div>
    </div>
  );
}
