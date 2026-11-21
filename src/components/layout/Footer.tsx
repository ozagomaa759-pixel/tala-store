
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerGroups = [
  {
    title: "Discover",
    links: [
      { label: "All Pieces", href: "/products" },
      { label: "Sets", href: "/products?category=Sets" },
      { label: "Jackets", href: "/products?category=Jackets" },
    ],
  },
  {
    title: "Your TALA",
    links: [
      { label: "Shopping Bag", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#25231f] text-white">
      <div className="mx-auto max-w-[1600px] px-6 pb-8 pt-16 md:px-12 md:pt-20 lg:px-16">

        {/* Brand */}
        <div className="grid grid-cols-1 gap-14 border-b border-white/15 pb-14 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">

          <div>
            <Link href="/" className="inline-block">
              <span className="block font-serif text-[43px] font-medium leading-none tracking-[0.22em]">
                TALA
              </span>
              <span className="mt-3 block text-[8px] tracking-[0.42em] text-white/55">
                LUXURY FASHION
              </span>
            </Link>

            <p className="mt-7 max-w-[310px] text-[12px] font-light leading-7 tracking-wide text-white/55">
              A considered approach to modern fashion.
              Discover pieces designed to become part of your story.
            </p>
          </div>

          {/* Navigation Groups */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-7 text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
                {group.title}
              </h3>

              <ul className="flex flex-col gap-5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[12px] font-light tracking-wide text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 pt-7 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[9px] tracking-[0.12em] text-white/40">
            © {new Date().getFullYear()} TALA. All rights reserved.
          </p>

          <Link
            href="/"
            className="text-[9px] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-white"
          >
            Back to Home ↑
          </Link>

          <p className="text-[9px] tracking-[0.2em] text-white/40">
            MADE WITH INTENTION
          </p>
        </div>
      </div>
    </footer>
  );
}

