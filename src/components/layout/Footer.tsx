
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowUp,
  Instagram,
  Sparkles,
} from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/tala__luxury/";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "All Collection", href: "/collections/all-pieces" },
      { label: "Sets", href: "/collections/sets" },
      { label: "Jackets", href: "/collections/jackets" },
      { label: "Discover TALA", href: "/collections" },
    ],
  },
  {
    title: "Your Experience",
    links: [
      { label: "Shopping Bag", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Contact Us", href: "/contact" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "FAQs", href: "/faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#24221F] text-[#F5F1EB]">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-16 -top-24 h-[290px] w-[290px] rounded-full border border-white/[0.06]" />

      <div className="relative mx-auto max-w-[1600px] px-6 pb-7 pt-16 sm:px-10 md:px-14 md:pt-24 lg:px-20">
        <div className="grid gap-14 border-b border-white/10 pb-14 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.4fr_0.8fr_0.9fr]">
          {/* BRAND */}
          <div>
            <Link
              href="/"
              aria-label="TALA Home"
              className="group inline-block"
            >
              <span className="block font-serif text-[52px] font-medium leading-none tracking-[0.2em] transition duration-500 group-hover:tracking-[0.25em]">
                TALA
              </span>

              <span className="mt-3 block text-[8px] font-medium uppercase tracking-[0.48em] text-white/45">
                Luxury Fashion
              </span>
            </Link>

            <p className="mt-8 max-w-[340px] text-[13px] font-light leading-8 tracking-wide text-white/60">
              Style has no single definition.
              <br />
              It is personal, expressive, and always evolving.
              <br />
              Find the pieces that feel like you.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#D8ED83]">
                <Sparkles size={15} />
              </span>

              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/50">
                Playful by nature. Luxury by choice.
              </span>
            </div>

            {/* INSTAGRAM */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit TALA official Instagram"
              className="mt-9 inline-flex min-h-12 items-center gap-4 border border-white/20 px-5 py-3 transition-colors hover:border-[#D8ED83] hover:bg-[#D8ED83] hover:text-[#24221F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8ED83]"
            >
              <Instagram size={19} />

              <span className="text-[10px] font-semibold uppercase tracking-[0.17em]">
                @tala__luxury
              </span>

              <ArrowUpRight size={15} />
            </a>
          </div>

          {/* LINK GROUPS */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D8ED83]">
                {group.title}
              </h3>

              <ul className="flex flex-col gap-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex min-h-11 items-center justify-between gap-4 border-b border-white/[0.07] py-3 text-[12px] font-light tracking-wide text-white/65 transition-colors hover:text-[#D8ED83] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D8ED83]"
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-white/45 transition-colors group-hover:text-[#D8ED83]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-7 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/50">
              © {new Date().getFullYear()} TALA
            </p>

            <p className="text-[9px] tracking-[0.12em] text-white/35">
              All rights reserved.
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-3 self-start text-[9px] font-semibold uppercase tracking-[0.17em] text-white/65 transition-colors hover:text-[#D8ED83] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D8ED83] sm:self-auto"
          >
            <Instagram size={15} />
            Follow TALA
            <ArrowUpRight size={13} />
          </a>

          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-3 self-start text-[9px] font-medium uppercase tracking-[0.2em] text-white/60 transition hover:text-[#D8ED83] sm:self-auto"
          >
            Back to top

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition group-hover:border-[#D8ED83] group-hover:bg-[#D8ED83] group-hover:text-[#24221F]">
              <ArrowUp size={14} />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
