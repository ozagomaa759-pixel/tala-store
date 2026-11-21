
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  MessageCircle,
  Package,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const INSTAGRAM_URL = "https://www.instagram.com/tala__luxury/";

const topics = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Before you order",
    description:
      "Need help choosing a piece, finding a size, or checking product availability?",
    link: "/collections/all-pieces",
    linkLabel: "Explore the collection",
  },
  {
    number: "02",
    icon: Package,
    title: "After you order",
    description:
      "Have a question about an existing order? Keep your order details handy when contacting our team.",
    link: "/faq",
    linkLabel: "Order information",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Something else?",
    description:
      "For anything you need, reach out to TALA through our official Instagram account.",
    link: INSTAGRAM_URL,
    linkLabel: "Talk to TALA",
    external: true,
  },
];

const quickLinks = [
  { label: "Frequently asked questions", href: "/faq" },
  { label: "All collections", href: "/collections" },
  { label: "Your shopping bag", href: "/cart" },
  { label: "About TALA", href: "/about" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      <Header />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#24221F] text-[#F5F1EB]">
        <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[650px] w-[650px] rounded-full border border-white/[0.08]" />

        <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-[430px] w-[430px] rounded-full border border-white/[0.08]" />

        <div className="absolute -bottom-20 left-[38%] -z-10 select-none font-serif text-[260px] font-light tracking-[-0.12em] text-white/[0.035] sm:text-[400px]">
          T.
        </div>

        <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-24 sm:px-10 sm:pb-28 sm:pt-32 lg:px-20">
          <div className="mb-9 flex items-center gap-3">
            <span className="h-px w-9 bg-[#D8ED83]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D8ED83]">
              THE TALA HELP DESK
            </p>
          </div>

          <h1 className="max-w-6xl font-serif text-[clamp(4rem,11vw,10rem)] font-light leading-[0.85] tracking-[-0.065em]">
            LET&apos;S TALK
            <br />
            <span className="italic text-[#D8ED83]">TALA.</span>
          </h1>

          <div className="mt-12 flex flex-col justify-between gap-9 sm:flex-row sm:items-end">
            <p className="max-w-lg text-sm leading-8 text-white/60 sm:text-base">
              Questions, thoughts, or a little help with your
              shopping experience. We believe every detail
              deserves attention.
            </p>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-5 border-b border-white/40 pb-3 text-[9px] font-semibold uppercase tracking-[0.2em] transition hover:border-[#D8ED83]"
            >
              Contact us on Instagram
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto grid max-w-[1500px] gap-12 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-28 lg:px-20">
        <div>
          <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
            <Sparkles size={14} />
            WE&apos;RE HERE TO HELP
          </p>

          <h2 className="mt-7 font-serif text-5xl font-light leading-[1.05] tracking-[-0.05em] sm:text-7xl">
            Good things
            <br />
            start with
            <span className="italic text-[#9BAA6A]">
              {" "}a hello.
            </span>
          </h2>
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-serif text-2xl font-light leading-relaxed sm:text-3xl">
            Shopping should feel effortless. Finding
            information should too.
          </p>

          <p className="mt-7 max-w-2xl text-sm leading-8 text-[#81786E]">
            Whether you are discovering your next favourite
            piece or looking for information about an order,
            this page is here to help you find the right place.
            Explore the topics below or visit our FAQ for
            answers to common questions.
          </p>

          <Link
            href="/faq"
            className="group mt-8 inline-flex w-fit items-center gap-4 border-b border-[#24221F]/40 pb-3 text-[9px] font-semibold uppercase tracking-[0.2em]"
          >
            Explore all answers
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* CONTACT TOPICS */}
      <section className="bg-[#EAE4DA] px-6 py-20 sm:px-10 sm:py-28 lg:px-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
                HOW CAN WE HELP?
              </p>

              <h2 className="mt-5 font-serif text-5xl font-light tracking-[-0.05em] sm:text-7xl">
                Start right here.
              </h2>
            </div>

            <p className="max-w-sm text-xs leading-7 text-[#81786E]">
              Choose the topic closest to your question.
              We&apos;ve gathered the useful information in
              one place.
            </p>
          </div>

          <div className="grid gap-px border border-[#D5CCC0] bg-[#D5CCC0] md:grid-cols-3">
            {topics.map((topic) => {
              const Icon = topic.icon;

              const content = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg italic text-[#9BAA6A]">
                      {topic.number}
                    </span>

                    <Icon
                      size={21}
                      strokeWidth={1.3}
                      className="text-[#82796F]"
                    />
                  </div>

                  <h3 className="mt-12 font-serif text-3xl font-light tracking-[-0.035em]">
                    {topic.title}
                  </h3>

                  <p className="mt-4 text-xs leading-7 text-[#81786E]">
                    {topic.description}
                  </p>

                  <div className="mt-auto flex items-center gap-3 pt-9 text-[9px] font-semibold uppercase tracking-[0.17em]">
                    {topic.linkLabel}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </div>
                </>
              );

              return topic.external ? (
                <a
                  key={topic.number}
                  href={topic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[330px] flex-col bg-[#F5F1EB] p-7 transition-colors hover:bg-[#F9F7F2] sm:p-10"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={topic.number}
                  href={topic.link}
                  className="group flex min-h-[330px] flex-col bg-[#F5F1EB] p-7 transition-colors hover:bg-[#F9F7F2] sm:p-10"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSTAGRAM FEATURE */}
      <section className="px-6 py-20 sm:px-10 sm:py-28 lg:px-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="relative overflow-hidden bg-[#D8ED83] px-7 py-14 sm:px-14 sm:py-20 lg:px-20">
            <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-[#24221F]/10" />
            <div className="pointer-events-none absolute -right-4 -top-12 h-56 w-56 rounded-full border border-[#24221F]/10" />

            <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <Instagram size={18} strokeWidth={1.6} />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em]">
                    FIND US ON INSTAGRAM
                  </p>
                </div>

                <h2 className="mt-8 max-w-3xl font-serif text-5xl font-light leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                  A little more
                  <br />
                  <span className="italic">TALA in your day.</span>
                </h2>

                <p className="mt-7 max-w-md text-sm leading-7 text-[#24221F]/65">
                  Discover the latest pieces, explore our
                  world, and stay connected with TALA.
                </p>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-5 bg-[#24221F] px-7 py-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#39362F]"
              >
                <Instagram size={17} />
                @tala__luxury
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="border-t border-[#24221F]/10 px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
              NEED A QUICK ANSWER?
            </p>

            <h2 className="mt-5 font-serif text-4xl font-light tracking-[-0.04em] sm:text-5xl">
              We&apos;ve got you.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {quickLinks.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between border-b border-[#24221F]/10 py-5 text-xs transition-colors hover:text-[#89965D]"
              >
                <span>{item.label}</span>
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
