"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Paperclip,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

/* =========================================
   TALA CONTACT PAGE
   VERSION 1.0
========================================= */

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactErrors = Partial<
  Record<keyof ContactFormData, string>
>;

type FAQItem = {
  question: string;
  answer: string;
  category: "Orders" | "Products" | "Shipping" | "General";
};

/* =========================================
   INITIAL FORM
========================================= */

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

/* =========================================
   CONTACT SUBJECTS
========================================= */

const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Order Assistance",
  "Product Information",
  "Sizing & Fit",
  "Shipping & Delivery",
  "Returns & Exchanges",
  "Other",
];

/* =========================================
   FAQ DATABASE
========================================= */

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How can I contact TALA?",
    answer:
      "You can prepare your inquiry using the contact form on this page. Our official support channels will be announced soon.",
    category: "General",
  },
  {
    question: "How can I find product details?",
    answer:
      "Visit our collection and open any product to explore its available images, description, and product information.",
    category: "Products",
  },
  {
    question: "Can I ask about sizing?",
    answer:
      "Of course. Select Sizing & Fit in the contact form and include the product name with your question.",
    category: "Products",
  },
  {
    question: "How can I get help with an order?",
    answer:
      "Choose Order Assistance and include your order reference if available. Never share passwords or complete payment details.",
    category: "Orders",
  },
  {
    question: "Where do you deliver?",
    answer:
      "Delivery locations and shipping information will be announced when our delivery service launches.",
    category: "Shipping",
  },
  {
    question: "Are returns and exchanges available?",
    answer:
      "Our official return and exchange policy will be published when the service becomes available.",
    category: "Orders",
  },
  {
    question: "Will products be restocked?",
    answer:
      "Restock announcements will be shared through TALA's official channels.",
    category: "Products",
  },
  {
    question: "Can I send feedback?",
    answer:
      "Yes. Choose General Inquiry and share your ideas or suggestions with us.",
    category: "General",
  },
  {
    question: "How do I know if my message was sent?",
    answer:
      "The current contact page can validate your information locally. Actual message delivery will require a connected support service.",
    category: "General",
  },
  {
    question: "Can I attach a file?",
    answer:
      "The form supports selecting certain image and PDF files for preview. Uploading files to a server is not connected yet.",
    category: "General",
  },
];

/* =========================================
   FAQ CATEGORIES
========================================= */

const FAQ_CATEGORIES = [
  "All",
  "Orders",
  "Products",
  "Shipping",
  "General",
];

/* =========================================
   FORM VALIDATION
========================================= */

function validateForm(
  values: ContactFormData
): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  } else if (values.name.trim().length < 2) {
    errors.name =
      "Your name must contain at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      values.email.trim()
    )
  ) {
    errors.email =
      "Please enter a valid email address.";
  }

  if (!values.subject) {
    errors.subject = "Please choose a subject.";
  }

  if (!values.message.trim()) {
    errors.message = "Please write a message.";
  } else if (values.message.trim().length < 10) {
    errors.message =
      "Your message must contain at least 10 characters.";
  }

  return errors;
}

/* =========================================
   SECTION EYEBROW COMPONENT
========================================= */

function SectionEyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <span className="h-px w-9 bg-[#a18a65]" />

      <span className="text-[10px] uppercase tracking-[0.3em] text-[#8d806b]">
        {children}
      </span>
    </div>
  );
}

/* =========================================
   MAIN CONTACT PAGE
========================================= */

export default function ContactPage() {
  const [form, setForm] =
    useState<ContactFormData>(INITIAL_FORM);

  const [errors, setErrors] =
    useState<ContactErrors>({});

  const [submitted, setSubmitted] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [attachment, setAttachment] =
    useState<File | null>(null);

  const [attachmentError, setAttachmentError] =
    useState("");

  const [faqSearch, setFaqSearch] =
    useState("");

  const [faqCategory, setFaqCategory] =
    useState("All");

  const [openFaq, setOpenFaq] =
    useState<string | null>(null);

  /* =====================================
     FILTER FAQ
  ===================================== */

  const filteredFaqs = useMemo(() => {
    const query = faqSearch.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        faqCategory === "All" ||
        item.category === faqCategory;

      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [faqSearch, faqCategory]);

  /* =====================================
     UPDATE FORM FIELD
  ===================================== */

  const updateField = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitted(false);
  };

  /* =====================================
     ATTACHMENT HANDLER
  ===================================== */

  const handleAttachment = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(selected.type)) {
      setAttachmentError(
        "Choose a JPG, PNG, WEBP, or PDF file."
      );

      event.target.value = "";
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setAttachmentError(
        "The file must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setAttachment(selected);
    setAttachmentError("");
    setSubmitted(false);
  };

  /* =====================================
     SUBMIT HANDLER
  ===================================== */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const nextErrors = validateForm(form);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    // Local validation only.
    // No message is transmitted yet.
    setSubmitted(true);
  };

  /* =====================================
     CLEAR FORM
  ===================================== */

  const clearForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setAttachment(null);
    setAttachmentError("");
    setSubmitted(false);
  };

  /* =====================================
     PREVIEW STATE
  ===================================== */

  const hasPreviewContent =
    Boolean(
      form.name.trim() ||
      form.email.trim() ||
      form.subject ||
      form.message.trim() ||
      attachment
    );

  /* =====================================
     PAGE JSX STARTS IN PART 2
  ===================================== */
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5f0] text-[#292720]">

      {/* =====================================
          ANNOUNCEMENT BAR
      ===================================== */}

      <div className="relative overflow-hidden bg-[#292720] px-4 py-3 text-center text-[9px] tracking-[0.25em] text-white sm:text-[10px]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          TALA LUXURY FASHION

          <span className="mx-3 text-[#c6b18e]">
            •
          </span>

          A NEW WAY TO EXPRESS YOURSELF
        </motion.div>
      </div>

      {/* =====================================
          MAIN HEADER
      ===================================== */}

      <header className="relative z-40 border-b border-[#ded9cf] bg-[#f7f5f0]">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-10 lg:px-16">

          {/* MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded9cf] transition-all duration-300 hover:bg-[#292720] hover:text-white"
          >
            {menuOpen ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>

          {/* LOGO */}

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-3xl font-semibold tracking-[0.24em] transition-opacity hover:opacity-60 sm:text-4xl"
          >
            TALA
          </Link>

          {/* SHOPPING LINK */}

          <Link
            href="/cart"
            className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] transition hover:text-[#9b8664] sm:text-[10px]"
          >
            Shopping

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

        </div>

        {/* =====================================
            MOBILE / DESKTOP NAVIGATION
        ===================================== */}

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="overflow-hidden border-t border-[#ded9cf]"
            >
              <div className="mx-auto grid max-w-[1500px] gap-1 px-6 py-6 sm:grid-cols-2 sm:px-12 lg:grid-cols-4">

                {[
                  ["Home", "/"],
                  ["Shop Collection", "/products"],
                  ["About Us", "/about"],
                  ["Contact", "/contact"],
                  ["My Account", "/account"],
                  ["Shopping Cart", "/cart"],
                ].map(([label, href], index) => (
                  <motion.div
                    key={href}
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                  >
                    <Link
                      href={href}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="group flex items-center justify-between border-b border-[#e4dfd5] py-4 text-xs tracking-[0.12em] transition-all duration-300 hover:pl-3 hover:text-[#a18a65]"
                    >
                      {label}

                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </motion.div>
                ))}

              </div>
            </motion.nav>
          )}
        </AnimatePresence>

      </header>

      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="relative px-5 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24 lg:px-16 lg:pt-32">

        {/* BACKGROUND DECORATION */}

        <div className="pointer-events-none absolute right-[-120px] top-10 h-[350px] w-[350px] rounded-full border border-[#e9e3d9]" />

        <div className="pointer-events-none absolute right-[-70px] top-24 h-[250px] w-[250px] rounded-full border border-[#e9e3d9]" />

        <div className="mx-auto max-w-[1500px]">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative z-10 max-w-4xl"
          >

            {/* EYEBROW */}

            <SectionEyebrow>
              WE ARE HERE FOR YOU
            </SectionEyebrow>

            {/* MAIN TITLE */}

            <h1 className="text-6xl font-light leading-[0.98] tracking-[-0.06em] sm:text-8xl lg:text-[112px]">

              Let&apos;s

              <br />

              <motion.span
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.25,
                  duration: 0.8,
                }}
                className="inline-block font-serif italic text-[#a18a65]"
              >
                Connect.
              </motion.span>

            </h1>

            {/* DESCRIPTION */}

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.7,
              }}
              className="mt-9 max-w-xl text-sm leading-8 text-[#777267] sm:text-base sm:leading-9"
            >
              Every great experience starts with a
              conversation. Whether you have a question,
              need assistance, or simply want to say hello,
              we&apos;d love to hear from you.
            </motion.p>

            {/* HERO BUTTONS */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.55,
                duration: 0.7,
              }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >

              <a
                href="#contact-form"
                className="group inline-flex items-center gap-5 bg-[#292720] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#a18a65]"
              >
                Send a Message

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <Link
                href="/products"
                className="group inline-flex items-center gap-2 border-b border-[#b5a88f] pb-2 text-[10px] uppercase tracking-[0.2em] transition hover:text-[#a18a65]"
              >
                Explore Collection

                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

            </motion.div>

          </motion.div>

          {/* =====================================
              CONTACT QUICK INFORMATION
          ===================================== */}

          <div className="mt-20 grid border-y border-[#ded9cf] sm:grid-cols-3">

            {[
              {
                title: "Email",
                subtitle: "Customer Support",
                value: "Coming Soon",
                icon: Mail,
              },
              {
                title: "Location",
                subtitle: "Our Home",
                value: "Egypt",
                icon: MapPin,
              },
              {
                title: "Availability",
                subtitle: "Customer Care",
                value: "Online Support",
                icon: Clock3,
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.12,
                    duration: 0.5,
                  }}
                  className={`group flex items-center gap-5 py-7 sm:px-6 lg:px-10 ${
                    index > 0
                      ? "border-t border-[#ded9cf] sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d9d0c1] text-[#9b8664] transition-all duration-300 group-hover:border-[#292720] group-hover:bg-[#292720] group-hover:text-white">
                    <Icon
                      size={19}
                      strokeWidth={1.3}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#8d806b]">
                      {item.subtitle}
                    </p>

                    <p className="mt-2 text-sm tracking-wide">
                      {item.value}
                    </p>
                  </div>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>

      {/* PART 3 CONTINUES BELOW */}
      
      {/* CONTACT INFORMATION */}
      <section
        id="contact-information"
        className="relative overflow-hidden bg-[#eeeae1] px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <SectionEyebrow>CONTACT INFORMATION</SectionEyebrow>

            <h2 className="mt-6 max-w-xl text-4xl font-light leading-tight tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              We’re always
              <span className="block font-medium">happy to help.</span>
            </h2>

            <p className="mt-7 max-w-lg text-sm leading-8 text-[#777166] sm:text-base">
              Whether you have a question about a product, need help with
              your shopping experience, or simply want to say hello,
              we would love to hear from you.
            </p>

            <div className="mt-12 space-y-8">
              <div className="flex items-start gap-5 border-b border-[#d7d1c6] pb-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9c1b4]">
                  <Mail size={19} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#958c7e]">
                    EMAIL SUPPORT
                  </p>
                  <h3 className="mt-2 text-lg font-medium">
                    Email address coming soon
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#777166]">
                    Our official customer support email will be announced
                    soon.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 border-b border-[#d7d1c6] pb-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9c1b4]">
                  <MessageCircle size={19} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#958c7e]">
                    CUSTOMER EXPERIENCE
                  </p>
                  <h3 className="mt-2 text-lg font-medium">
                    We value every message
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#777166]">
                    Your questions, ideas, and feedback help us make TALA
                    better every day.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9c1b4]">
                  <Clock3 size={19} strokeWidth={1.5} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#958c7e]">
                    SUPPORT HOURS
                  </p>
                  <h3 className="mt-2 text-lg font-medium">
                    Online support
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#777166]">
                    Send us your message whenever it is convenient for you.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.15em] transition-opacity hover:opacity-60"
            >
              <Instagram size={17} />
              FOLLOW US ON INSTAGRAM
              <ArrowUpRight size={15} />
            </a>
            <p className="mt-2 text-xs text-[#958c7e]">
              Replace this link with TALA’s official Instagram profile.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-[#292720] px-8 py-16 text-center text-[#f7f5f0] sm:min-h-[620px]"
          >
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
            <div className="absolute -bottom-36 -left-28 h-96 w-96 rounded-full border border-white/10" />
            <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full border border-white/10" />

            <div className="absolute left-8 top-8">
              <Sparkles size={22} className="text-[#c8b99e]" />
            </div>

            <div className="relative z-10 max-w-md">
              <span className="text-[10px] font-semibold tracking-[0.35em] text-[#c8b99e]">
                THE TALA EXPERIENCE
              </span>

              <div className="my-10 flex items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#c8b99e]/50">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#c8b99e]/30">
                    <Sparkles size={30} strokeWidth={1} className="text-[#c8b99e]" />
                  </div>
                </div>
              </div>

              <h3 className="text-4xl font-light leading-tight tracking-[-0.04em] sm:text-5xl">
                Your voice
                <span className="block font-medium">matters to us.</span>
              </h3>

              <p className="mx-auto mt-7 max-w-sm text-sm leading-8 text-white/55">
                Great experiences begin with great conversations.
                We believe every detail matters, and every customer
                deserves to be heard.
              </p>

              <div className="mx-auto mt-10 h-px w-16 bg-[#c8b99e]" />

              <p className="mt-8 text-2xl font-semibold tracking-[0.3em]">
                TALA
              </p>
              <p className="mt-3 text-[9px] tracking-[0.35em] text-white/40">
                STYLE IN EVERY DETAIL
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PART 4 CONTINUES BELOW */}

      {/* CONTACT FORM */}
      <section
        id="contact-form"
        className="relative bg-[#f7f5f0] px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionEyebrow>GET IN TOUCH</SectionEyebrow>

              <h2 className="mt-6 max-w-2xl text-4xl font-light leading-tight tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Let’s start a
                <span className="block font-medium">conversation.</span>
              </h2>
            </motion.div>

            <p className="max-w-md text-sm leading-8 text-[#777166] lg:pb-2">
              Complete the form below and tell us how we can help.
              Every detail you share helps us understand your needs.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65 }}
              className="border border-[#e3ded5] bg-white p-6 sm:p-10"
            >
              <div className="mb-9 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-[#a29480]">
                    CONTACT FORM
                  </p>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight">
                    Send us a message
                  </h3>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-[#f3f0e9] sm:flex">
                  <Send size={19} strokeWidth={1.5} />
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-3 block text-xs font-semibold tracking-wide"
                    >
                      Full name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Your full name"
                      className={`w-full border bg-[#fcfbf9] px-4 py-4 text-sm outline-none transition-colors placeholder:text-[#b4aea4] focus:border-[#8d806d] ${
                        errors.name ? "border-red-400" : "border-[#e5e0d8]"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-3 block text-xs font-semibold tracking-wide"
                    >
                      Email address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@example.com"
                      className={`w-full border bg-[#fcfbf9] px-4 py-4 text-sm outline-none transition-colors placeholder:text-[#b4aea4] focus:border-[#8d806d] ${
                        errors.email ? "border-red-400" : "border-[#e5e0d8]"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="mb-3 block text-xs font-semibold tracking-wide"
                    >
                      Phone number
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="Your phone number"
                      className="w-full border border-[#e5e0d8] bg-[#fcfbf9] px-4 py-4 text-sm outline-none transition-colors placeholder:text-[#b4aea4] focus:border-[#8d806d]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-3 block text-xs font-semibold tracking-wide"
                    >
                      Subject *
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={(event) => updateField("subject", event.target.value)}
                      className={`w-full border bg-[#fcfbf9] px-4 py-4 text-sm outline-none transition-colors focus:border-[#8d806d] ${
                        errors.subject ? "border-red-400" : "border-[#e5e0d8]"
                      }`}
                    >
                      <option value="">Choose a subject</option>
                      {CONTACT_SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-2 text-xs text-red-600">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-order"
                    className="mb-3 block text-xs font-semibold tracking-wide"
                  >
                    Order number
                    <span className="ml-2 font-normal text-[#a59d91]">
                      (Optional)
                    </span>
                  </label>
                  <input
                    id="contact-order"
                    name="orderNumber"
                    type="text"
                    value={form.orderNumber}
                    onChange={(event) =>
                      updateField("orderNumber", event.target.value)
                    }
                    placeholder="Enter your order number if available"
                    className="w-full border border-[#e5e0d8] bg-[#fcfbf9] px-4 py-4 text-sm outline-none transition-colors placeholder:text-[#b4aea4] focus:border-[#8d806d]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-3 block text-xs font-semibold tracking-wide"
                  >
                    Your message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={7}
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Tell us more about your question..."
                    className={`w-full resize-y border bg-[#fcfbf9] px-4 py-4 text-sm leading-7 outline-none transition-colors placeholder:text-[#b4aea4] focus:border-[#8d806d] ${
                      errors.message ? "border-red-400" : "border-[#e5e0d8]"
                    }`}
                  />
                  <div className="mt-2 flex items-center justify-between gap-3">
                    {errors.message ? (
                      <p className="text-xs text-red-600">{errors.message}</p>
                    ) : (
                      <p className="text-xs text-[#a59d91]">
                        Please provide as much detail as possible.
                      </p>
                    )}
                    <span className="shrink-0 text-xs text-[#a59d91]">
                      {form.message.length}/2000
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold tracking-wide">
                    Attachment
                    <span className="ml-2 font-normal text-[#a59d91]">
                      (Optional)
                    </span>
                  </p>

                  <label
                    htmlFor="contact-attachment"
                    className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#cfc7ba] bg-[#fcfbf9] px-5 py-8 text-center transition-colors hover:border-[#8d806d] hover:bg-[#f8f5ef]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0ece4]">
                      <Paperclip size={19} strokeWidth={1.5} />
                    </div>
                    <span className="mt-4 text-sm font-medium">
                      Click to choose a file
                    </span>
                    <span className="mt-2 text-xs text-[#a59d91]">
                      Maximum file size: 5 MB
                    </span>
                    <input
                      id="contact-attachment"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleAttachment}
                    />
                  </label>

                  {attachment && (
                    <div className="mt-3 flex items-center justify-between gap-3 border border-[#e5e0d8] bg-[#fcfbf9] p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText
                          size={18}
                          className="shrink-0 text-[#8d806d]"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {attachment.name}
                          </p>
                          <p className="mt-1 text-[10px] text-[#a59d91]">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAttachment(null);
                          setAttachmentError("");
                        }}
                        aria-label="Remove attachment"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#eeeae1]"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}

                  {attachmentError && (
                    <p className="mt-2 text-xs text-red-600">
                      {attachmentError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4 border-t border-[#eee9e1] pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-xs leading-6 text-[#a59d91]">
                    Fields marked with * are required. Please review your
                    details before submitting.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={clearForm}
                      className="border border-[#ded8ce] px-5 py-4 text-xs font-semibold tracking-wider transition-colors hover:bg-[#f3f0e9]"
                    >
                      CLEAR
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-3 bg-[#292720] px-7 py-4 text-xs font-semibold tracking-[0.15em] text-white transition-colors hover:bg-[#514a3e]"
                    >
                      VALIDATE MESSAGE
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </form>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-7 flex items-start gap-4 border border-[#d9e3d5] bg-[#f3f7f0] p-5"
                >
                  <CheckCircle2
                    size={22}
                    className="mt-0.5 shrink-0 text-[#54734e]"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-[#3d5938]">
                      Your form passed validation.
                    </h4>
                    <p className="mt-2 text-xs leading-6 text-[#65765f]">
                      This is a local preview only. Your message and attachment
                      have not been sent or uploaded. A backend service is
                      required to enable real submissions.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-[#292720] p-7 text-white sm:p-9">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#c8b99e]">
                  BEFORE YOU SEND
                </span>

                <h3 className="mt-5 text-3xl font-light leading-tight">
                  A little detail
                  <span className="block font-medium">goes a long way.</span>
                </h3>

                <p className="mt-5 text-sm leading-8 text-white/55">
                  To help us understand your request, choose the most relevant
                  subject and include any useful information in your message.
                </p>

                <div className="mt-9 space-y-5">
                  {[
                    "Use a valid email address.",
                    "Choose the closest subject.",
                    "Include your order number if relevant.",
                    "Keep your message clear and specific.",
                  ].map((item, index) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-[10px] text-[#c8b99e]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="pt-1 text-xs leading-5 text-white/70">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#e3ded5] bg-[#eeeae1] p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.22em] text-[#958c7e]">
                    YOUR MESSAGE
                  </span>
                  <Sparkles size={18} className="text-[#958c7e]" />
                </div>

                <h3 className="mt-5 text-2xl font-medium tracking-tight">
                  Live preview
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#8a8276]">
                  A quick overview of the information you entered.
                </p>

                <div className="mt-7 space-y-5 border-t border-[#d7d1c6] pt-6">
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.2em] text-[#a09687]">
                      NAME
                    </p>
                    <p className="mt-2 break-words text-sm">
                      {form.name.trim() || "Your name will appear here"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.2em] text-[#a09687]">
                      EMAIL
                    </p>
                    <p className="mt-2 break-words text-sm">
                      {form.email.trim() || "Your email will appear here"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.2em] text-[#a09687]">
                      SUBJECT
                    </p>
                    <p className="mt-2 break-words text-sm">
                      {form.subject || "No subject selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.2em] text-[#a09687]">
                      MESSAGE
                    </p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#777166]">
                      {form.message.trim() || "Your message will appear here"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.2em] text-[#a09687]">
                      ATTACHMENT
                    </p>
                    <p className="mt-2 break-words text-sm">
                      {attachment?.name || "No attachment selected"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 border-t border-[#d7d1c6] pt-5 text-[10px] tracking-wide text-[#8a8276]">
                  <CheckCircle2 size={14} />
                  <span>Preview updates as you type</span>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* PART 5 CONTINUES BELOW */}

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section
        id="faq"
        className="relative overflow-hidden bg-[#eeeae1] px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full border border-[#d7d1c6]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionEyebrow>HELP CENTER</SectionEyebrow>

              <h2 className="mt-6 text-4xl font-light leading-tight tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Frequently
                <span className="block font-medium">asked questions.</span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-8 text-[#777166]">
                Find quick answers to common questions about shopping,
                products, orders, and the TALA experience.
              </p>

              <div className="mt-10 border-l border-[#b9ad9b] pl-5">
                <p className="text-sm font-medium">
                  Still have a question?
                </p>
                <p className="mt-2 text-xs leading-6 text-[#82796d]">
                  Our contact form is ready for your questions and feedback.
                </p>

                <a
                  href="#contact-form"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-widest transition-opacity hover:opacity-60"
                >
                  CONTACT OUR TEAM
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="relative mb-8">
                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#999083]"
                />
                <input
                  type="search"
                  value={faqSearch}
                  onChange={(event) => {
                    setFaqSearch(event.target.value);
                    setOpenFaq(null);
                  }}
                  placeholder="Search for an answer..."
                  aria-label="Search frequently asked questions"
                  className="w-full border border-[#d9d3c9] bg-[#f8f6f1] py-5 pl-14 pr-5 text-sm outline-none transition-colors placeholder:text-[#aaa296] focus:border-[#8d806d]"
                />
              </div>

              <div className="mb-8 flex flex-wrap gap-2">
                {FAQ_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setFaqCategory(category);
                      setOpenFaq(null);
                    }}
                    className={`border px-4 py-2.5 text-[10px] font-semibold tracking-wider transition-all ${
                      faqCategory === category
                        ? "border-[#292720] bg-[#292720] text-white"
                        : "border-[#d5cec3] bg-transparent text-[#71695e] hover:border-[#8d806d]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#d5cec3]">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => {
                    const isOpen = openFaq === faq.question;

                    return (
                      <div
                        key={faq.question}
                        className="border-b border-[#d5cec3]"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() =>
                            setOpenFaq(isOpen ? null : faq.question)
                          }
                          className="flex w-full items-center justify-between gap-5 py-6 text-left"
                        >
                          <span className="flex items-start gap-4">
                            <span className="pt-1 text-[10px] tracking-widest text-[#a09687]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm font-medium leading-7 sm:text-base">
                              {faq.question}
                            </span>
                          </span>

                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d0c8bc]"
                          >
                            <ArrowDown size={15} />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="max-w-2xl pb-7 pl-9 text-sm leading-8 text-[#777166] sm:pl-10">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-16 text-center">
                    <Search
                      size={25}
                      className="mx-auto text-[#a09687]"
                    />
                    <h3 className="mt-5 text-lg font-medium">
                      No questions found
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-[#8a8276]">
                      Try another keyword or choose a different category.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFaqSearch("");
                        setFaqCategory("All");
                        setOpenFaq(null);
                      }}
                      className="mt-5 text-xs font-semibold tracking-widest underline underline-offset-4"
                    >
                      CLEAR SEARCH
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 text-[10px] tracking-wider text-[#918879]">
                <span>
                  {filteredFaqs.length} QUESTIONS AVAILABLE
                </span>
                <span>HERE TO MAKE THINGS SIMPLE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PART 6 CONTINUES BELOW */}

      {/* SOCIAL EXPERIENCE */}
      <section
        id="social-experience"
        className="relative overflow-hidden bg-[#f7f5f0] px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <SectionEyebrow>THE TALA COMMUNITY</SectionEyebrow>

            <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-light leading-tight tracking-[-0.05em] sm:text-5xl lg:text-7xl">
              Style is better
              <span className="block font-medium">when shared.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#777166]">
              Discover the world of TALA, explore new inspiration,
              and stay connected with everything we are creating.
            </p>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-3 border border-[#292720] px-8 py-4 text-xs font-semibold tracking-[0.18em] transition-all hover:bg-[#292720] hover:text-white"
            >
              <Instagram size={17} />
              EXPLORE INSTAGRAM
              <ArrowUpRight size={15} />
            </a>

            <p className="mt-3 text-[10px] text-[#a09687]">
              Replace with TALA’s official Instagram profile before launch.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-[#e8e2d7] p-8"
            >
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-[#c9bdac] transition-transform duration-700 group-hover:scale-125" />
              <div className="relative">
                <Instagram size={24} strokeWidth={1.4} />
              </div>
              <div className="relative">
                <p className="text-[9px] font-semibold tracking-[0.22em] text-[#8f8372]">
                  STAY INSPIRED
                </p>
                <h3 className="mt-3 text-2xl font-medium">
                  Follow the journey.
                </h3>
                <p className="mt-3 max-w-xs text-xs leading-6 text-[#777166]">
                  Get inspired by the latest looks and brand updates.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-[#d8d0c2] p-8"
            >
              <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border border-[#b9ad9b] transition-transform duration-700 group-hover:scale-110" />
              <div className="relative">
                <Sparkles size={24} strokeWidth={1.4} />
              </div>
              <div className="relative">
                <p className="text-[9px] font-semibold tracking-[0.22em] text-[#817462]">
                  EVERY LITTLE DETAIL
                </p>
                <h3 className="mt-3 text-2xl font-medium">
                  Made to feel special.
                </h3>
                <p className="mt-3 max-w-xs text-xs leading-6 text-[#6e665b]">
                  A thoughtful approach to style, quality, and everyday elegance.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-[#292720] p-8 text-white sm:col-span-2 lg:col-span-1"
            >
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-110" />
              <div className="relative">
                <MessageCircle size={24} strokeWidth={1.4} className="text-[#c8b99e]" />
              </div>
              <div className="relative">
                <p className="text-[9px] font-semibold tracking-[0.22em] text-[#c8b99e]">
                  WE WANT TO HEAR FROM YOU
                </p>
                <h3 className="mt-3 text-2xl font-medium">
                  Your thoughts matter.
                </h3>
                <p className="mt-3 max-w-xs text-xs leading-6 text-white/55">
                  Share your feedback and help shape the future of TALA.
                </p>
                <a
                  href="#contact-form"
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-[#d7c9b2] transition-opacity hover:opacity-60"
                >
                  SHARE YOUR THOUGHTS
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative overflow-hidden bg-[#e8e2d7] px-5 py-24 sm:px-8 lg:px-12">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full border border-[#d2c8b8]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full border border-[#d2c8b8]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="text-[10px] font-semibold tracking-[0.3em] text-[#8e806d]">
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h2 className="mt-7 text-4xl font-light leading-tight tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Find your style.
            <span className="block font-medium">Make it yours.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#777166]">
            Explore the TALA collection and discover pieces that
            express your individuality.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-3 bg-[#292720] px-9 py-5 text-xs font-semibold tracking-[0.17em] text-white transition-all hover:bg-[#514a3e]"
            >
              EXPLORE COLLECTION
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-3 border border-[#bdb3a4] px-9 py-5 text-xs font-semibold tracking-[0.17em] transition-all hover:bg-[#f7f5f0]"
            >
              DISCOVER TALA
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* PART 7 CONTINUES BELOW */}

      {/* PREMIUM FOOTER */}
      <footer className="relative overflow-hidden bg-[#292720] px-5 pb-8 pt-20 text-[#f7f5f0] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_0.6fr_0.7fr_0.8fr]">
            <div>
              <Link
                href="/"
                className="inline-block text-4xl font-semibold tracking-[0.3em] transition-opacity hover:opacity-70"
              >
                TALA
              </Link>

              <p className="mt-7 max-w-sm text-sm leading-8 text-white/50">
                Style in every detail. Discover a thoughtful approach
                to fashion, individuality, and everyday elegance.
              </p>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-all hover:border-[#c8b99e] hover:bg-white/10"
              >
                <Instagram size={18} />
              </a>

              <p className="mt-3 text-[10px] text-white/35">
                Replace with TALA’s official Instagram profile.
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.22em] text-[#c8b99e]">
                EXPLORE
              </h3>

              <ul className="mt-7 space-y-5">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    About TALA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.22em] text-[#c8b99e]">
                CUSTOMER CARE
              </h3>

              <ul className="mt-7 space-y-5">
                <li>
                  <Link
                    href="/account"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    Shopping Bag
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#contact-form"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    Get Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.22em] text-[#c8b99e]">
                GET IN TOUCH
              </h3>

              <p className="mt-7 text-sm leading-7 text-white/60">
                Have a question or an idea?
                We would love to hear from you.
              </p>

              <a
                href="#contact-form"
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#d7c9b2] transition-opacity hover:opacity-60"
              >
                SEND A MESSAGE
                <ArrowUpRight size={14} />
              </a>

              <div className="mt-8 flex items-center gap-3 text-xs text-white/40">
                <MapPin size={15} />
                <span>Egypt</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] tracking-wide text-white/40">
              © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/"
                className="text-[10px] tracking-wider text-white/40 transition-colors hover:text-white"
              >
                HOME
              </Link>

              <Link
                href="/about"
                className="text-[10px] tracking-wider text-white/40 transition-colors hover:text-white"
              >
                OUR STORY
              </Link>

              <Link
                href="/contact"
                className="text-[10px] tracking-wider text-white/40 transition-colors hover:text-white"
              >
                CONTACT
              </Link>
            </div>

            <a
              href="#top"
              className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-widest text-[#c8b99e] transition-opacity hover:opacity-60"
            >
              BACK TO TOP
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="border-t border-white/10 py-7 text-center">
            <p className="text-[9px] tracking-[0.4em] text-white/25">
              TALA — STYLE IN EVERY DETAIL
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
