
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  Instagram,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const INSTAGRAM_URL = "https://www.instagram.com/tala__luxury/";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      <Header />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#24221F] text-[#F5F1EB]">
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-[420px] w-[420px] rounded-full border border-white/10 sm:h-[600px] sm:w-[600px]" />

        <div className="pointer-events-none absolute -right-10 -top-14 -z-10 h-[300px] w-[300px] rounded-full border border-white/10 sm:h-[440px] sm:w-[440px]" />

        <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-20 sm:px-10 sm:pb-28 sm:pt-28 lg:px-20">
          <Link
            href="/"
            className="mb-14 inline-flex min-h-11 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65 transition hover:text-[#D8ED83] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D8ED83]"
          >
            <ArrowLeft size={15} />
            Back to TALA
          </Link>

          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#D8ED83]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D8ED83]">
              TALA CUSTOMER CARE
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-[clamp(3.5rem,10vw,9rem)] font-light leading-[0.88] tracking-[-0.065em]">
            RETURNS
            <br />
            <span className="italic text-[#D8ED83]">
              & EXCHANGES.
            </span>
          </h1>

          <p className="mt-10 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
            We want you to feel confident with your TALA
            purchase. That&apos;s why you have the opportunity
            to inspect your order before accepting delivery.
          </p>
        </div>
      </section>

      {/* MAIN POLICY */}
      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 sm:py-28 lg:px-20">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
              <ShieldCheck size={15} />
              OUR OFFICIAL POLICY
            </p>

            <h2 className="mt-7 font-serif text-5xl font-light leading-[1.02] tracking-[-0.055em] sm:text-7xl">
              Know before
              <br />
              you <span className="italic text-[#89965D]">accept.</span>
            </h2>

            <p className="mt-8 max-w-md text-sm leading-8 text-[#81786E]">
              Every TALA order comes with an inspection
              opportunity before delivery is accepted.
              Please review your order carefully before
              confirming receipt.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-[#D8D0C5] bg-[#EEE9E0] p-7 sm:p-10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D8ED83] text-[#24221F]">
                  <Eye size={22} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#89965D]">
                    BEFORE ACCEPTING
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-light">
                    Inspect your order
                  </h3>
                </div>
              </div>

              <p className="mt-6 text-sm leading-8 text-[#756D64]">
                You can inspect your order before accepting
                delivery. Take the opportunity to check
                your purchase before confirming receipt.
              </p>

              <div className="mt-6 flex items-center gap-3 text-xs font-medium text-[#59633D]">
                <Check size={17} />
                Inspection before acceptance is available.
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[#D8D0C5] bg-white/50 p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24221F] text-white">
                  <X size={19} />
                </div>

                <h3 className="mt-6 font-serif text-2xl font-light">
                  No exchanges
                </h3>

                <p className="mt-3 text-xs leading-7 text-[#81786E]">
                  TALA does not offer exchanges after the
                  order has been accepted.
                </p>
              </div>

              <div className="border border-[#D8D0C5] bg-white/50 p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24221F] text-white">
                  <X size={19} />
                </div>

                <h3 className="mt-6 font-serif text-2xl font-light">
                  No returns
                </h3>

                <p className="mt-3 text-xs leading-7 text-[#81786E]">
                  TALA does not accept returns or refunds
                  after the order has been accepted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTICE */}
      <section className="bg-[#D8ED83] px-6 py-16 sm:px-10 sm:py-20 lg:px-20">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em]">
              A LITTLE REMINDER
            </p>

            <h2 className="mt-5 font-serif text-4xl font-light leading-tight tracking-[-0.04em] sm:text-6xl">
              Please inspect before accepting.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#24221F]/70">
              Once you accept your order, it cannot be
              exchanged or returned. Please make sure you
              are happy with your purchase before confirming
              delivery.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#24221F]/20">
            <PackageCheck size={35} strokeWidth={1.1} />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 sm:py-28 lg:px-20">
        <div className="relative overflow-hidden bg-[#24221F] px-7 py-12 text-white sm:px-14 sm:py-16 lg:px-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10 flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D8ED83]">
                <ShoppingBag size={15} />
                NEED HELP?
              </p>

              <h2 className="mt-6 font-serif text-4xl font-light leading-tight tracking-[-0.04em] sm:text-6xl">
                We&apos;re one message away.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-8 text-white/55">
                Have a question about your order or our
                policy? Reach out to TALA through our
                official Instagram account.
              </p>
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-4 bg-[#D8ED83] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.17em] text-[#24221F] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8ED83]"
            >
              <Instagram size={17} />
              Contact TALA
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#24221F]/10 pt-8">
          <Link
            href="/faq"
            className="inline-flex min-h-10 items-center gap-2 text-xs text-[#81786E] transition hover:text-[#89965D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#89965D]"
          >
            Frequently asked questions
            <ArrowUpRight size={13} />
          </Link>

          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center gap-2 text-xs text-[#81786E] transition hover:text-[#89965D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#89965D]"
          >
            Contact page
            <ArrowUpRight size={13} />
          </Link>

          <Link
            href="/collections/all-pieces"
            className="inline-flex min-h-10 items-center gap-2 text-xs text-[#81786E] transition hover:text-[#89965D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#89965D]"
          >
            Explore the collection
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
