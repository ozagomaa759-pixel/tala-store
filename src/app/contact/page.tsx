
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Instagram,
  MessageCircle,
  Sparkles,
  X,
  Menu,
  ShieldCheck,
  Headphones,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Replace this URL with TALA's official Instagram profile when ready.
const INSTAGRAM_URL = "https://www.instagram.com/";

const CONTACT_DETAILS = [
  {
    icon: Instagram,
    label: "Instagram",
    value: "Connect with TALA",
    description: "Our official social channel",
    href: INSTAGRAM_URL,
  },
];

const FAQS = [
  {
    question: "How can I track my order?",
    answer:
      "You can use our Track Order page to enter your order details. If you need additional help, contact our team through Instagram.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Contact us through Instagram as soon as possible and include your order number. Changes may depend on the order processing stage.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times depend on your location and order availability. Our team can help you with the latest information through Instagram.",
  },
  {
    question: "How can I request a return?",
    answer:
      "Visit our Returns page to review the return information. For additional assistance, you can reach our team through Instagram.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const TALA_PROMISES = [
  {
    number: "01",
    title: "Personal attention",
    description:
      "Every inquiry deserves a thoughtful and helpful response.",
  },
  {
    number: "02",
    title: "Clear communication",
    description:
      "We believe in making information simple and accessible.",
  },
  {
    number: "03",
    title: "Considered experience",
    description:
      "From browsing to after-sales support, details matter.",
  },
];

const EXPERIENCE_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Privacy first",
    description:
      "Only share the information needed to help with your inquiry.",
  },
  {
    icon: MessageCircle,
    title: "Easy communication",
    description:
      "Connect with TALA through our Instagram channel.",
  },
  {
    icon: Sparkles,
    title: "Thoughtful service",
    description:
      "A considered experience is at the heart of TALA.",
  },
  {
    icon: Clock,
    title: "Convenient access",
    description:
      "Explore our help information whenever you need it.",
  },
];

export default function ContactPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#f5f1eb] text-[#29251f]"
    >
      {/* NAVIGATION */}

      <nav className="relative z-40 border-b border-[#d8cec0] bg-[#f5f1eb]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-[0.28em] text-[#29251f]"
          >
            TALA
          </Link>

          <div className="hidden items-center gap-9 text-xs uppercase tracking-[0.18em] md:flex">
            <Link href="/" className="transition hover:text-[#9a8060]">
              Home
            </Link>

            <Link
              href="/products"
              className="transition hover:text-[#9a8060]"
            >
              Collection
            </Link>

            <Link href="/about" className="transition hover:text-[#9a8060]">
              About
            </Link>

            <Link
              href="/contact"
              className="border-b border-[#29251f] pb-1"
            >
              Contact
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-full border border-[#d8cec0] p-2 transition hover:border-[#a68b68] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-[#d8cec0] md:hidden"
            >
              <div className="flex flex-col gap-5 px-6 py-6 text-sm uppercase tracking-widest">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>

                <Link href="/products" onClick={() => setMenuOpen(false)}>
                  Collection
                </Link>

                <Link href="/about" onClick={() => setMenuOpen(false)}>
                  About
                </Link>

                <Link href="/contact" onClick={() => setMenuOpen(false)}>
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}

      <section className="relative border-b border-[#d8cec0]">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#c8b69e]/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.div
              variants={fadeUp}
              className="mb-7 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-[#a68b68]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#927b5e]">
                We are here for you
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-3xl text-5xl font-light leading-[1.12] tracking-[-0.055em] sm:text-6xl lg:text-8xl"
            >
              Let&apos;s start
              <br />
              a{" "}
              <span className="font-serif italic text-[#a68b68]">
                conversation.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-xl text-sm leading-8 text-[#777064] sm:text-base"
            >
              Whether you have a question about an order, need help finding
              the perfect fit, or simply want to say hello, we would love to
              hear from you. Connect with us directly through Instagram.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-4 bg-[#29251f] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#a68b68]"
              >
                Message us on Instagram

                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>

              <a
                href="#contact-details"
                className="inline-flex items-center gap-3 border border-[#cfc4b5] px-7 py-4 text-[10px] uppercase tracking-[0.2em] transition hover:border-[#29251f]"
              >
                Contact details
                <ArrowRight size={14} />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-14 flex items-center gap-5 border-t border-[#d8cec0] pt-7"
            >
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f5f1eb] bg-[#d8c9b5]">
                  <Headphones size={16} />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f5f1eb] bg-[#c7b69e]">
                  <MessageCircle size={16} />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f5f1eb] bg-[#b6a38a]">
                  <Sparkles size={16} />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium">
                  A little help goes a long way.
                </p>

                <p className="mt-1 text-[10px] tracking-wide text-[#8c8275]">
                  The TALA customer care experience
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute -inset-4 rotate-3 border border-[#cdbda8]" />

            <div className="relative aspect-[4/5] overflow-hidden bg-[#ded4c6]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#b8a58c] via-[#e4d9ca] to-[#c7b49c]" />

              <div className="absolute left-1/2 top-1/2 h-[75%] w-[58%] -translate-x-1/2 -translate-y-1/2 border border-white/40" />

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
                <span className="text-7xl font-light tracking-[0.2em] text-white/90 sm:text-8xl">
                  T
                </span>

                <span className="mt-5 text-[9px] uppercase tracking-[0.45em] text-white">
                  Thoughtfully yours
                </span>
              </div>

              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between border-t border-white/50 pt-5 text-white">
                <span className="text-[9px] uppercase tracking-[0.3em]">
                  TALA Studio
                </span>

                <span className="font-serif text-2xl italic">
                  01 / 01
                </span>
              </div>
            </div>

            <div className="absolute -bottom-7 -right-5 hidden bg-[#f5f1eb] px-6 py-5 shadow-xl sm:block">
              <Sparkles size={18} className="text-[#a68b68]" />

              <p className="mt-3 font-serif text-lg italic">
                Made with care.
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#8c8275]">
                Every detail matters
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT DETAILS */}

      <section
        id="contact-details"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-10"
      >
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#a68b68]">
              Get in touch
            </p>

            <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
              We&apos;re one message away.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#82796d]">
            A simple message can be the beginning of something wonderful.
            Connect with our team through Instagram.
          </p>
        </div>

        <div className="grid gap-px border border-[#d8cec0] bg-[#d8cec0] lg:grid-cols-3">
          {CONTACT_DETAILS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-[#f5f1eb] p-8 transition-colors hover:bg-[#eee7dc] sm:p-10 lg:col-span-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d5c8b7] transition group-hover:border-[#a68b68]">
                    <Icon size={19} strokeWidth={1.4} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-[#9a8b78] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>

                <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-[#a68b68]">
                  {item.label}
                </p>

                <p className="mt-3 text-lg font-light tracking-wide">
                  {item.value}
                </p>

                <p className="mt-2 text-xs text-[#8c8275]">
                  {item.description}
                </p>

                <span className="mt-7 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-[#927b5e]">
                  Visit our Instagram
                  <ArrowUpRight size={14} />
                </span>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* INSTAGRAM CONTACT EXPERIENCE */}

      <section
        id="contact-form"
        className="border-y border-[#d8cec0] bg-[#eee8df]"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-20 lg:self-start"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#a68b68]">
              A personal connection
            </p>

            <h2 className="mt-5 font-serif text-5xl font-light leading-tight sm:text-6xl">
              We&apos;d love
              <br />
              <span className="italic text-[#a68b68]">
                to hear from you.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-8 text-[#82796d]">
              At TALA, we believe that personal service is part of the
              experience. Whether you are exploring a collection or need
              assistance with an order, we are here to help.
            </p>

            <div className="mt-12 space-y-6 border-t border-[#d4c9bb] pt-8">
              <div className="flex items-start gap-4">
                <Clock size={18} className="mt-1 text-[#a68b68]" />

                <div>
                  <p className="text-xs font-medium">
                    Customer care
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[#82796d]">
                    Reach out whenever you have a question about your TALA
                    experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShieldCheck size={18} className="mt-1 text-[#a68b68]" />

                <div>
                  <p className="text-xs font-medium">
                    Your privacy
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[#82796d]">
                    Only share information relevant to your inquiry. Never
                    share passwords or payment details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageCircle size={18} className="mt-1 text-[#a68b68]" />

                <div>
                  <p className="text-xs font-medium">
                    Direct communication
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[#82796d]">
                    Our Instagram channel is the place to connect with TALA.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-3 border border-[#cdbda8]" />

            <div className="relative flex min-h-[500px] flex-col justify-between border border-[#d8cec0] bg-[#f8f5f0] p-7 sm:p-10 lg:p-12">
              <div>
                <div className="flex items-center justify-between border-b border-[#ded5c9] pb-7">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#a68b68]">
                      We would love to hear from you
                    </p>

                    <h3 className="mt-2 font-serif text-3xl font-light">
                      Connect with TALA
                    </h3>
                  </div>

                  <span className="font-serif text-2xl italic text-[#c1b19c]">
                    T.
                  </span>
                </div>

                <div className="mt-12 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex h-24 w-24 items-center justify-center rounded-full border border-[#cdbda8] bg-[#eee8df]"
                  >
                    <Instagram
                      size={38}
                      strokeWidth={1.2}
                      className="text-[#927b5e]"
                    />
                  </motion.div>

                  <p className="mt-9 text-[9px] uppercase tracking-[0.35em] text-[#a68b68]">
                    The TALA community
                  </p>

                  <h4 className="mt-4 max-w-md font-serif text-4xl font-light leading-tight sm:text-5xl">
                    A conversation
                    <br />
                    <span className="italic text-[#a68b68]">
                      starts here.
                    </span>
                  </h4>

                  <p className="mt-6 max-w-sm text-sm leading-8 text-[#82796d]">
                    For order inquiries, product questions, styling
                    assistance, or simply to say hello, send us a message
                    through Instagram.
                  </p>

                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-9 inline-flex w-full items-center justify-between bg-[#29251f] px-7 py-5 text-white transition hover:bg-[#927b5e] sm:max-w-sm"
                  >
                    <span className="text-[10px] uppercase tracking-[0.25em]">
                      Open Instagram
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-between border-t border-[#ded5c9] pt-6">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#a69a8a]">
                  Thoughtfully yours
                </span>

                <span className="font-serif text-2xl italic text-[#c1b19c]">
                  T.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#a68b68]">
              Need a quick answer?
            </p>

            <h2 className="mt-5 font-serif text-5xl font-light leading-tight sm:text-6xl">
              Frequently
              <br />
              <span className="italic text-[#a68b68]">
                asked questions.
              </span>
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-8 text-[#82796d]">
              Here are some answers to questions our customers commonly ask.
              If you need more help, connect with us through Instagram.
            </p>

            <Link
              href="/faq"
              className="mt-9 inline-flex items-center gap-3 border-b border-[#a68b68] pb-2 text-[10px] uppercase tracking-[0.2em] transition hover:text-[#a68b68]"
            >
              Explore help center
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="border-t border-[#d8cec0]">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div
                  key={faq.question}
                  className="border-b border-[#d8cec0]"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 py-7 text-left"
                  >
                    <span className="flex items-center gap-5">
                      <span className="font-serif text-sm italic text-[#a68b68]">
                        0{index + 1}
                      </span>

                      <span className="text-sm font-medium sm:text-base">
                        {faq.question}
                      </span>
                    </span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8cec0] transition">
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <X size={14} />
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 pl-12 text-sm leading-8 text-[#82796d]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DARK CTA SECTION */}

      <section className="relative overflow-hidden bg-[#29251f] px-6 py-20 text-[#f5f1eb] lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-40 h-96 w-96 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full border border-white/10" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Sparkles size={23} className="text-[#c5a982]" />

          <p className="mt-7 text-[9px] uppercase tracking-[0.4em] text-[#c5a982]">
            The TALA experience
          </p>

          <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight sm:text-6xl">
            Good style begins with
            <span className="italic text-[#c5a982]">
              {" "}good conversations.
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-sm leading-8 text-[#c5beb3]">
            Every question matters. Every detail counts. We are glad you are
            here and look forward to hearing from you.
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-4 border border-[#c5a982]/60 px-8 py-5 text-[10px] uppercase tracking-[0.25em] transition hover:bg-[#f5f1eb] hover:text-[#29251f]"
          >
            Start a conversation
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      {/* ADVANCED CONTACT EXPERIENCE */}

      <section className="relative overflow-hidden border-t border-[#d8cec0] bg-[#eee8df] px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#a68b68]">
                The TALA promise
              </span>

              <h2 className="mt-6 max-w-xl font-serif text-5xl font-light leading-tight sm:text-6xl">
                Every detail deserves
                <span className="italic text-[#a68b68]">
                  {" "}attention.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-8 text-[#82796d]">
                We believe that a great shopping experience goes beyond
                beautiful products. It is built through thoughtful service,
                clear communication, and attention to every detail.
              </p>

              <div className="mt-12 space-y-8">
                {TALA_PROMISES.map((item, index) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="flex gap-6 border-b border-[#d4c9bb] pb-7"
                  >
                    <span className="font-serif text-xl italic text-[#a68b68]">
                      {item.number}
                    </span>

                    <div>
                      <h3 className="text-sm font-medium">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-md text-xs leading-7 text-[#82796d]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-5 border border-[#cdbda8]" />

              <div className="relative bg-[#29251f] p-8 text-[#f5f1eb] sm:p-12">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#c5a982]">
                    TALA / Customer care
                  </span>

                  <MessageCircle size={20} className="text-[#c5a982]" />
                </div>

                <div className="mt-16">
                  <p className="font-serif text-4xl font-light leading-tight">
                    A better experience
                    <br />
                    starts with
                    <span className="italic text-[#c5a982]">
                      {" "}listening.
                    </span>
                  </p>

                  <div className="mt-12 border-t border-white/15 pt-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a982]/15">
                        <Headphones
                          size={20}
                          className="text-[#c5a982]"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-medium">
                          Customer experience
                        </p>

                        <p className="mt-1 text-[10px] text-[#c5beb3]">
                          Thoughtful support, always.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex items-center justify-between border-t border-white/15 pt-6">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#c5beb3]">
                    Thoughtfully yours
                  </span>

                  <span className="font-serif text-2xl italic text-[#c5a982]">
                    T.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT EXPERIENCE HIGHLIGHTS */}

      <section className="bg-[#f5f1eb] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#a68b68]">
              Beyond the ordinary
            </span>

            <h2 className="mt-5 font-serif text-4xl font-light sm:text-5xl">
              The details make the difference.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERIENCE_HIGHLIGHTS.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -7 }}
                  className="border border-[#d8cec0] bg-[#f8f5f0] p-8 transition-shadow hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8cec0]">
                    <Icon size={19} className="text-[#a68b68]" />
                  </div>

                  <h3 className="mt-7 text-sm font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs leading-7 text-[#82796d]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-[#f5f1eb]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-12 border-b border-[#d8cec0] pb-14 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="inline-block text-5xl font-semibold tracking-[0.3em]"
              >
                TALA
              </Link>

              <p className="mt-7 max-w-sm text-sm leading-8 text-[#82796d]">
                Thoughtfully selected pieces, timeless details, and a
                considered approach to everyday style. Welcome to TALA.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8cec0] transition hover:border-[#a68b68] hover:bg-[#eee8df]"
                >
                  <Instagram size={17} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Explore
              </h3>

              <div className="mt-7 flex flex-col gap-4 text-xs text-[#82796d]">
                <Link href="/" className="transition hover:text-[#a68b68]">
                  Home
                </Link>

                <Link
                  href="/products"
                  className="transition hover:text-[#a68b68]"
                >
                  Collection
                </Link>

                <Link
                  href="/about"
                  className="transition hover:text-[#a68b68]"
                >
                  About TALA
                </Link>

                <Link
                  href="/sale"
                  className="transition hover:text-[#a68b68]"
                >
                  Sale
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Customer care
              </h3>

              <div className="mt-7 flex flex-col gap-4 text-xs text-[#82796d]">
                <Link
                  href="/contact"
                  className="transition hover:text-[#a68b68]"
                >
                  Contact us
                </Link>

                <Link
                  href="/faq"
                  className="transition hover:text-[#a68b68]"
                >
                  FAQs
                </Link>

                <Link
                  href="/size-guide"
                  className="transition hover:text-[#a68b68]"
                >
                  Size guide
                </Link>

                <Link
                  href="/track-order"
                  className="transition hover:text-[#a68b68]"
                >
                  Track order
                </Link>

                <Link
                  href="/returns"
                  className="transition hover:text-[#a68b68]"
                >
                  Returns
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#968b7e]">
              © {new Date().getFullYear()} TALA. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[9px] uppercase tracking-[0.15em] text-[#968b7e]">
              <Link
                href="/privacy"
                className="transition hover:text-[#29251f]"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-[#29251f]"
              >
                Terms
              </Link>

              <Link
                href="/returns"
                className="transition hover:text-[#29251f]"
              >
                Returns
              </Link>
            </div>

            <a
              href="#top"
              className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] transition hover:text-[#a68b68]"
            >
              Back to top

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8cec0] transition group-hover:-translate-y-1 group-hover:border-[#a68b68]">
                <ArrowUpRight size={14} />
              </span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
