
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CreditCard,
  LockKeyhole,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

const policies = [
  {
    number: "01",
    title: "Shipping & Delivery",
    description:
      "Standard delivery costs EGP 120. Orders with a total value of EGP 3,000 or more qualify for free delivery. Delivery timing may vary depending on your location.",
    icon: Truck,
    link: "/faq",
    linkLabel: "Delivery questions",
  },
  {
    number: "02",
    title: "Payment",
    description:
      "TALA currently accepts Cash on Delivery. Place your order online and pay when your order arrives.",
    icon: CreditCard,
    link: "/faq",
    linkLabel: "Payment information",
  },
  {
    number: "03",
    title: "Inspection, Returns & Exchanges",
    description:
      "You may inspect your order before accepting delivery. Once you accept the order, TALA does not offer returns, refunds, or exchanges. Please review your items carefully before acceptance.",
    icon: Package,
    link: "/returns",
    linkLabel: "Read the full policy",
  },
  {
    number: "04",
    title: "Privacy",
    description:
      "TALA offers guest checkout. Your contact and delivery details are collected when needed to process orders, arrange delivery, provide support, and maintain order records.",
    icon: LockKeyhole,
    link: "/privacy",
    linkLabel: "Privacy information",
  },
  {
    number: "05",
    title: "Terms & Conditions",
    description:
      "Orders are subject to product availability and confirmation. Product images, colours, and descriptions are presented as accurately as possible, although screen settings may affect how colours appear.",
    icon: ShieldCheck,
    link: "/terms",
    linkLabel: "Read the terms",
  },
];

const quickLinks = [
  { label: "Returns", href: "/returns" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "FAQ", href: "/faq" },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#B8AA98] text-[#292923]">
      <section className="relative overflow-hidden bg-[#292923] text-[#E9E0D5]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full border border-[#B8AA98]/20 sm:h-[680px] sm:w-[680px]" />
        <div className="pointer-events-none absolute -right-10 -top-20 h-[340px] w-[340px] rounded-full border border-[#B8AA98]/20" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-1/2 bg-gradient-to-tr from-[#B8AA98]/10 to-transparent" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-10 sm:px-10 sm:pb-28 sm:pt-14 lg:px-20">
          <Link
            href="/"
            className="mb-20 inline-flex min-h-10 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8AA98] transition hover:text-[#D8ED83]"
          >
            <ArrowLeft size={15} />
            Back to TALA
          </Link>

          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#D8ED83]" />
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#D8ED83]">
              THE TALA EXPERIENCE
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.88] tracking-[-0.065em]">
            GOOD TO
            <br />
            <span className="italic text-[#D8ED83]">
              know.
            </span>
          </h1>

          <div className="mt-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <p className="max-w-xl text-sm leading-8 text-[#B8AA98] sm:text-base">
              A little clarity goes a long way. Everything you
              need to know before making TALA part of your
              wardrobe.
            </p>

            <span className="w-fit border border-[#B8AA98]/30 px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D8ED83]">
              CUSTOMER INFORMATION / 2026
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-[#292923]/20 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#59633D]">
              TRANSPARENT BY DESIGN
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.045em] sm:text-5xl">
              The essentials.
            </h2>
          </div>

          <p className="max-w-sm text-xs leading-7 text-[#514B43]">
            Simple information. Clear expectations.
            A better shopping experience.
          </p>
        </div>

        <div className="divide-y divide-[#292923]/15 border-y border-[#292923]/15">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <article
                key={policy.number}
                className="grid gap-6 py-9 sm:grid-cols-[70px_1fr_auto] sm:items-start sm:gap-8 sm:py-11"
              >
                <div className="flex items-center gap-4 sm:block">
                  <span className="font-serif text-xl italic text-[#59633D]">
                    {policy.number}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#292923]/15 bg-[#A99A88] text-[#292923] sm:mt-5">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-light tracking-[-0.035em] sm:text-3xl">
                    {policy.title}
                  </h3>

                  <p className="mt-4 max-w-2xl text-sm leading-8 text-[#514B43]">
                    {policy.description}
                  </p>

                  <Link
                    href={policy.link}
                    className="mt-5 inline-flex min-h-10 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#59633D] transition hover:text-[#292923] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#59633D]"
                  >
                    {policy.linkLabel}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#292923]/20 text-[#59633D] sm:flex">
                  <Check size={15} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 overflow-hidden bg-[#292923] text-[#E9E0D5]">
          <div className="grid sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#D8ED83]">
                NEED A HAND?
              </p>

              <h2 className="mt-5 max-w-xl font-serif text-3xl font-light tracking-[-0.045em] sm:text-5xl">
                We&apos;re always happy to help.
              </h2>

              <p className="mt-5 max-w-lg text-xs leading-7 text-[#B8AA98]">
                Questions about your order, delivery, or
                anything else? Get in touch with the TALA team.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 bg-[#D8ED83] px-7 text-[9px] font-bold uppercase tracking-[0.17em] text-[#292923] transition hover:bg-[#E8F5B7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8ED83]"
              >
                Contact TALA
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="relative hidden min-h-[280px] w-[220px] items-center justify-center overflow-hidden border-l border-[#B8AA98]/15 bg-[#34342C] sm:flex">
              <div className="absolute h-52 w-52 rounded-full border border-[#D8ED83]/20" />
              <div className="absolute h-36 w-36 rounded-full border border-[#D8ED83]/30" />
              <span className="relative font-serif text-6xl italic text-[#D8ED83]">
                T.
              </span>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-[10px] leading-7 text-[#514B43]">
          These pages describe TALA&apos;s current store
          policies and do not limit any rights provided by
          applicable consumer protection laws.
        </p>
      </section>

      <footer className="bg-[#292923] px-6 py-10 text-center text-[#E9E0D5]">
        <Link
          href="/"
          className="font-serif text-3xl font-light tracking-[0.3em]"
        >
          TALA
        </Link>

        <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-[#B8AA98]">
          PLAYFUL BY NATURE. LUXURY BY CHOICE.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[9px] uppercase tracking-[0.15em] text-[#B8AA98]">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#D8ED83]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-7 text-[8px] tracking-[0.18em] text-[#B8AA98]/50">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
