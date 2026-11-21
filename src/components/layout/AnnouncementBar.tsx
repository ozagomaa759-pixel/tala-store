"use client";

import { usePathname } from "next/navigation";

const messages = [
  "A LITTLE UNEXPECTED. ALWAYS TALA.",
  "YOUR STYLE. YOUR RULES.",
  "PLAYFUL BY NATURE. LUXURY BY CHOICE.",
  "FIND YOUR NEXT FAVORITE PIECE.",
  "NOT HERE TO BLEND IN.",
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
            ✳
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
