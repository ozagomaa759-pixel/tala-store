import Link from "next/link";
import {
  ArrowUpRight,
  ArrowUp,
  Instagram,
  Sparkles,
} from "lucide-react";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "All Collection", href: "/collections/all-pieces" },
      { label: "Sets", href: "/collections/sets" },
      { label: "Jackets", href: "/collections/jackets" },
    ],
  },
  {
    title: "Your Experience",
    links: [
      { label: "Shopping Bag", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Discover TALA", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#24221F] text-[#F5F1EB]">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full border border-white/[0.06]" />
      <div className="pointer-events-none absolute -right-16 -top-24 h-[290px] w-[290px] rounded-full border border-white/[0.06]" />

      <div className="relative mx-auto max-w-[1600px] px-6 pb-7 pt-16 sm:px-10 md:px-14 md:pt-24 lg:px-20">
        <div className="grid gap-14 border-b border-white/10 pb-14 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.5fr_0.7fr_0.8fr]">
          <div>
            <Link href="/" className="group inline-block">
              <span className="block font-serif text-[52px] font-medium leading-none tracking-[0.2em] transition duration-500 group-hover:tracking-[0.25em]">
                TALA
              </span>

              <span className="mt-3 block text-[8px] font-medium uppercase tracking-[0.48em] text-white/45">
                Luxury Fashion
              </span>
            </Link>

            <p className="mt-8 max-w-[340px] text-[13px] font-light leading-8 tracking-wide text-white/55">
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

              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/45">
                Playful by nature. Luxury by choice.
              </span>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D8ED83]">
                {group.title}
              </h3>

              <ul className="flex flex-col gap-6">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[13px] font-light tracking-wide text-white/65 transition duration-300 hover:translate-x-1 hover:text-white"
                    >
                      {link.label}

                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition duration-300 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-7 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/45">
              © {new Date().getFullYear()} TALA
            </p>

            <p className="text-[9px] tracking-[0.12em] text-white/30">
              All rights reserved.
            </p>
          </div>

          <Link
            href="/"
            className="group inline-flex items-center gap-3 self-start text-[9px] font-medium uppercase tracking-[0.2em] text-white/50 transition hover:text-[#D8ED83] sm:self-auto"
          >
            Back to top

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition group-hover:border-[#D8ED83] group-hover:bg-[#D8ED83] group-hover:text-[#24221F]">
              <ArrowUp size={13} />
            </span>
          </Link>

          <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/35">
            Made with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
