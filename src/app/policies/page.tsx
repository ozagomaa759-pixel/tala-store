
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
      "TALA currently accepts Cash on Delivery. You can place your order online and pay when your order is delivered.",
    icon: CreditCard,
    link: "/faq",
    linkLabel: "Payment information",
  },
  {
    number: "03",
    title: "Returns & Exchanges",
    description:
      "Customers may inspect their order before accepting delivery. Once an order has been accepted, TALA&apos;s store policy does not offer returns, refunds, or exchanges. Please review your items carefully before accepting.",
    icon: Package,
    link: "/returns",
    linkLabel: "Read the full policy",
  },
  {
    number: "04",
    title: "Privacy",
    description:
      "TALA offers guest checkout. Contact and delivery details are collected when needed to process and deliver an order, provide customer support, and maintain order records.",
    icon: LockKeyhole,
    link: "/privacy",
    linkLabel: "Privacy information",
  },
  {
    number: "05",
    title: "Terms & Conditions",
    description:
      "Orders are subject to product availability and confirmation by TALA. Product images, colours, and descriptions are provided as accurately as possible, although screen settings may affect how colours appear.",
    icon: ShieldCheck,
    link: "/terms",
    linkLabel: "Read the terms",
  },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-[#F5F1EB] text-[#24221F]">
      <section className="relative overflow-hidden bg-[#24221F] text-[#F5F1EB]">
        <div className="pointer-events-none absolute -right-32 -top-36 h-[480px] w-[480px] rounded-full border border-white/10 sm:h-[620px] sm:w-[620px]" />

        <div className="pointer-events-none absolute -right-12 -top-16 h-[320px] w-[320px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24 lg:px-20">
          <Link
            href="/"
            className="mb-16 inline-flex min-h-10 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 transition hover:text-[#D8ED83]"
          >
            <ArrowLeft size={15} />
            Back to TALA
          </Link>

          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#D8ED83]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D8ED83]">
              TALA CUSTOMER INFORMATION
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.9] tracking-[-0.06em]">
            THE DETAILS
            <br />
            <span className="italic text-[#D8ED83]">
              matter.
            </span>
          </h1>

          <p className="mt-9 max-w-xl text-sm leading-8 text-white/55 sm:text-base">
            Everything you need to know before shopping with
            TALA. Clear information, thoughtful service, and
            no unexpected details.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-[#DED7CC] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
              THE TALA STANDARD
            </p>

            <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.04em] sm:text-5xl">
              Store policies
            </h2>
          </div>

          <p className="max-w-sm text-xs leading-7 text-[#82796F]">
            Please take a moment to review these details
            before placing your order.
          </p>
        </div>

        <div className="divide-y divide-[#DED7CC] border-y border-[#DED7CC]">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <article
                key={policy.number}
                className="grid gap-6 py-9 sm:grid-cols-[70px_1fr_auto] sm:items-start sm:gap-8 sm:py-11"
              >
                <div className="flex items-center gap-4 sm:block">
                  <span className="font-serif text-xl italic text-[#A5B76B]">
                    {policy.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE6DD] text-[#59633D] sm:mt-5">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-light tracking-[-0.025em] sm:text-3xl">
                    {policy.title}
                  </h3>

                  <p className="mt-4 max-w-2xl text-sm leading-8 text-[#82796F]">
                    {policy.description}
                  </p>

                  <Link
                    href={policy.link}
                    className="mt-5 inline-flex min-h-10 items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#68764A] transition hover:text-[#24221F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#89965D]"
                  >
                    {policy.linkLabel}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#D8D0C5] text-[#89965D] sm:flex">
                  <Check size={15} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 bg-[#D8ED83] p-7 sm:p-10">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#59633D]">
            NEED MORE INFORMATION?
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-light tracking-[-0.04em] sm:text-4xl">
                We&apos;re here to help.
              </h2>

              <p className="mt-3 max-w-lg text-xs leading-7 text-[#59633D]">
                If you have a question about an order,
                delivery, or any TALA policy, get in touch
                with our team.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-12 w-fit items-center justify-center gap-3 bg-[#24221F] px-6 text-[9px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[#42483B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24221F]"
            >
              Contact TALA
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <p className="mt-8 text-[10px] leading-6 text-[#9A9186]">
          These pages describe TALA&apos;s current store policies
          and are not a substitute for applicable consumer
          protection laws. Where applicable law provides
          additional rights, those rights remain unaffected.
        </p>
      </section>

      <footer className="bg-[#24221F] px-6 py-10 text-center text-[#F5F1EB]">
        <Link
          href="/"
          className="font-serif text-3xl font-light tracking-[0.3em]"
        >
          TALA
        </Link>

        <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/40">
          PLAYFUL BY NATURE. LUXURY BY CHOICE.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[9px] uppercase tracking-[0.15em] text-white/55">
          <Link href="/returns" className="transition hover:text-[#D8ED83]">
            Returns
          </Link>
          <Link href="/privacy" className="transition hover:text-[#D8ED83]">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-[#D8ED83]">
            Terms
          </Link>
          <Link href="/faq" className="transition hover:text-[#D8ED83]">
            FAQ
          </Link>
        </div>

        <p className="mt-7 text-[8px] tracking-[0.18em] text-white/30">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
