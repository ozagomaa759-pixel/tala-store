"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
  Menu,
  Upload,
  FileText,
  Paperclip,
  ShieldCheck,
  Headphones,
  ChevronDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  orderNumber: string;
  message: string;
};

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  orderNumber: "",
  message: "",
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@tala.com",
    href: "mailto:hello@tala.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+20 100 000 0000",
    href: "tel:+201000000000",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@tala",
    href: "https://instagram.com/",
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Order Support",
  "Shipping & Delivery",
  "Returns & Exchanges",
  "Product Information",
  "Sizing & Fit",
  "Partnership",
  "Other",
];

const FAQS = [
  {
    question: "How can I track my order?",
    answer:
      "You can use our Track Order page to enter your order details. If you need additional help, contact our support team.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Contact us as soon as possible with your order number. Changes may depend on the order processing stage.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times depend on your location and order availability. Our team can help you with the latest information.",
  },
  {
    question: "How can I request a return?",
    answer:
      "Visit our Returns page to review the return information and contact our team for assistance.",
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

function validateForm(form: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!form.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.subject) {
    errors.subject = "Please select a subject.";
  }

  if (!form.message.trim()) {
    errors.message = "Please enter your message.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Your message must be at least 10 characters.";
  }

  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [showOrderField, setShowOrderField] = useState(false);

  const updateField = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAttachment(null);
      setAttachmentError("");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setAttachmentError("Please upload a JPG, PNG, WEBP or PDF file.");
      setAttachment(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAttachmentError("File size must be less than 5 MB.");
      setAttachment(null);
      return;
    }

    setAttachment(file);
    setAttachmentError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // The form is validated locally.
    // Connect an API or email service before enabling real message delivery.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setAttachment(null);
    setAttachmentError("");
    setSubmitted(false);
    setShowOrderField(false);
  };

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#f5f1eb] text-[#29251f]">
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
            <Link href="/products" className="transition hover:text-[#9a8060]">
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
            className="rounded-full border border-[#d8cec0] p-2 md:hidden"
            aria-label="Toggle navigation menu"
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
              className="overflow-hidden border-t border-[#d8cec0] md:hidden"
            >
              <div className="flex flex-col gap-5 px-6 py-6 text-sm uppercase tracking-widest">
                <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link href="/products" onClick={() => setMenuOpen(false)}>Collection</Link>
                <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
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
              a <span className="font-serif italic text-[#a68b68]">conversation.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-xl text-sm leading-8 text-[#777064] sm:text-base"
            >
              Whether you have a question about an order, need help finding
              the perfect fit, or simply want to say hello, we would love to
              hear from you.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact-form"
                className="group inline-flex items-center gap-4 bg-[#29251f] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#a68b68]"
              >
                Send us a message
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
                <p className="text-xs font-medium">A little help goes a long way.</p>
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
                <span className="font-serif text-2xl italic">01 / 01</span>
              </div>
            </div>
            <div className="absolute -bottom-7 -right-5 hidden bg-[#f5f1eb] px-6 py-5 shadow-xl sm:block">
              <Sparkles size={18} className="text-[#a68b68]" />
              <p className="mt-3 font-serif text-lg italic">Made with care.</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#8c8275]">
                Every detail matters
              </p>
            </div>
          </motion.div>
        </div>
      </section>

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
            Choose the way that works best for you. We&apos;ll be happy to
            help with your questions.
          </p>
        </div>

        <div className="grid gap-px border border-[#d8cec0] bg-[#d8cec0] sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_DETAILS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-[#f5f1eb] p-8 transition-colors hover:bg-[#eee7dc] sm:p-10"
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
                <p className="mt-3 break-all text-lg font-light tracking-wide">
                  {item.value}
                </p>
              </motion.a>
            );
          })}
        </div>
      </section>

      <section
        id="contact-form"
        className="border-y border-[#d8cec0] bg-[#eee8df]"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#a68b68]">
              Contact form
            </p>
            <h2 className="mt-5 font-serif text-5xl font-light leading-tight sm:text-6xl">
              Tell us
              <br />
              <span className="italic text-[#a68b68]">what you need.</span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-8 text-[#82796d]">
              Fill in the details below and share your question with us.
              Please include your order number if your message is about an
              existing purchase.
            </p>

            <div className="mt-12 space-y-6 border-t border-[#d4c9bb] pt-8">
              <div className="flex items-start gap-4">
                <Clock size={18} className="mt-1 text-[#a68b68]" />
                <div>
                  <p className="text-xs font-medium">Customer care</p>
                  <p className="mt-2 text-xs leading-6 text-[#82796d]">
                    Send us your question anytime through this form.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck size={18} className="mt-1 text-[#a68b68]" />
                <div>
                  <p className="text-xs font-medium">Your information</p>
                  <p className="mt-2 text-xs leading-6 text-[#82796d]">
                    Only share information relevant to your inquiry. Avoid
                    including passwords or payment details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#d8cec0] bg-[#f8f5f0] p-6 sm:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[500px] flex-col items-center justify-center text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#b9a78f]">
                    <CheckCircle2 size={34} className="text-[#927b5e]" />
                  </div>
                  <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#a68b68]">
                    Form completed
                  </p>
                  <h3 className="mt-4 font-serif text-4xl font-light">
                    Thank you.
                  </h3>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#82796d]">
                    Your information passed the local form validation. This
                    demo does not send your message to TALA yet.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-9 inline-flex items-center gap-3 bg-[#29251f] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-[#a68b68]"
                  >
                    <RefreshCw size={14} />
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-10 flex items-center justify-between border-b border-[#ded5c9] pb-6">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.3em] text-[#a68b68]">
                        We would love to hear from you
                      </p>
                      <h3 className="mt-2 font-serif text-3xl font-light">
                        Write to us
                      </h3>
                    </div>
                    <span className="font-serif text-2xl italic text-[#c1b19c]">
                      T.
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-7">
                    <div className="grid gap-7 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="mb-3 block text-[9px] uppercase tracking-[0.2em]">
                          Full name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={(event) => updateField("name", event.target.value)}
                          placeholder="Your full name"
                          maxLength={100}
                          className="w-full border-b border-[#cfc4b5] bg-transparent px-0 py-4 text-sm outline-none transition placeholder:text-[#b2a99d] focus:border-[#8f7657]"
                        />
                        {errors.name && (
                          <p className="mt-2 flex items-center gap-2 text-xs text-red-700">
                            <AlertCircle size={13} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="mb-3 block text-[9px] uppercase tracking-[0.2em]">
                          Email address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(event) => updateField("email", event.target.value)}
                          placeholder="you@example.com"
                          maxLength={150}
                          className="w-full border-b border-[#cfc4b5] bg-transparent px-0 py-4 text-sm outline-none transition placeholder:text-[#b2a99d] focus:border-[#8f7657]"
                        />
                        {errors.email && (
                          <p className="mt-2 flex items-center gap-2 text-xs text-red-700">
                            <AlertCircle size={13} />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-7 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-phone" className="mb-3 block text-[9px] uppercase tracking-[0.2em]">
                          Phone number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(event) => updateField("phone", event.target.value)}
                          placeholder="+20"
                          maxLength={25}
                          className="w-full border-b border-[#cfc4b5] bg-transparent px-0 py-4 text-sm outline-none transition placeholder:text-[#b2a99d] focus:border-[#8f7657]"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-subject" className="mb-3 block text-[9px] uppercase tracking-[0.2em]">
                          Subject *
                        </label>
                        <div className="relative">
                          <select
                            id="contact-subject"
                            value={form.subject}
                            onChange={(event) => {
                              updateField("subject", event.target.value);
                              setShowOrderField(event.target.value === "Order Support");
                            }}
                            className="w-full appearance-none border-b border-[#cfc4b5] bg-transparent px-0 py-4 pr-8 text-sm outline-none focus:border-[#8f7657]"
                          >
                            <option value="">Select a subject</option>
                            {SUBJECTS.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#8c8275]"
                          />
                        </div>
                        {errors.subject && (
                          <p className="mt-2 text-xs text-red-700">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {showOrderField && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <label htmlFor="contact-order" className="mb-3 block text-[9px] uppercase tracking-[0.2em]">
                            Order number
                          </label>
                          <input
                            id="contact-order"
                            type="text"
                            value={form.orderNumber}
                            onChange={(event) => updateField("orderNumber", event.target.value)}
                            placeholder="Enter your order number"
                            maxLength={60}
                            className="w-full border-b border-[#cfc4b5] bg-transparent px-0 py-4 text-sm outline-none focus:border-[#8f7657]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label htmlFor="contact-message" className="block text-[9px] uppercase tracking-[0.2em]">
                          Your message *
                        </label>
                        <span className="text-[10px] tabular-nums text-[#a69a8a]">
                          {form.message.length}/2000
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(event) => updateField("message", event.target.value)}
                        placeholder="Tell us how we can help..."
                        rows={6}
                        maxLength={2000}
                        className="w-full resize-y border-b border-[#cfc4b5] bg-transparent px-0 py-4 text-sm leading-7 outline-none transition placeholder:text-[#b2a99d] focus:border-[#8f7657]"
                      />
                      {errors.message && (
                        <p className="mt-2 flex items-center gap-2 text-xs text-red-700">
                          <AlertCircle size={13} />
                          {errors.message}
                        </p>
                      )}
                    </div>
                                        <div className="border border-dashed border-[#cfc4b5] p-6 transition hover:border-[#9a8060]">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eee8df]">
                            <Paperclip size={18} className="text-[#927b5e]" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">Attach a file</p>
                            <p className="mt-2 text-[10px] leading-5 text-[#8c8275]">
                              JPG, PNG, WEBP or PDF · Maximum 5 MB
                            </p>
                          </div>
                        </div>

                        <label className="inline-flex cursor-pointer items-center justify-center gap-3 border border-[#cfc4b5] px-5 py-3 text-[9px] uppercase tracking-[0.2em] transition hover:border-[#29251f]">
                          <Upload size={14} />
                          Choose file
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={handleAttachment}
                            className="sr-only"
                          />
                        </label>
                      </div>

                      {attachment && (
                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#ded5c9] pt-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <FileText size={17} className="shrink-0 text-[#a68b68]" />
                            <div className="min-w-0">
                              <p className="truncate text-xs">{attachment.name}</p>
                              <p className="mt-1 text-[9px] text-[#8c8275]">
                                {(attachment.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setAttachment(null)}
                            className="rounded-full p-2 transition hover:bg-[#e8ded1]"
                            aria-label="Remove attachment"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      )}

                      {attachmentError && (
                        <p className="mt-4 flex items-center gap-2 text-xs text-red-700">
                          <AlertCircle size={14} />
                          {attachmentError}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-5 border-t border-[#ded5c9] pt-7">
                      <label className="flex items-start gap-3 text-[10px] leading-6 text-[#82796d]">
                        <input
                          type="checkbox"
                          required
                          className="mt-1 accent-[#927b5e]"
                        />
                        <span>
                          I confirm that the information provided is accurate
                          and does not contain sensitive payment information.
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex w-full items-center justify-between bg-[#29251f] px-7 py-5 text-white transition hover:bg-[#927b5e] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="text-[10px] uppercase tracking-[0.25em]">
                          {isSubmitting ? "Processing..." : "Submit your message"}
                        </span>

                        {isSubmitting ? (
                          <RefreshCw size={17} className="animate-spin" />
                        ) : (
                          <Send
                            size={17}
                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        )}
                      </button>

                      <p className="text-center text-[9px] leading-5 text-[#a69a8a]">
                        Demo form: information is validated locally and is not
                        transmitted or stored.
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#a68b68]">
              Need a quick answer?
            </p>
            <h2 className="mt-5 font-serif text-5xl font-light leading-tight sm:text-6xl">
              Frequently
              <br />
              <span className="italic text-[#a68b68]">asked questions.</span>
            </h2>
            <p className="mt-7 max-w-sm text-sm leading-8 text-[#82796d]">
              Here are some answers to questions our customers commonly ask.
              If you need more help, send us a message.
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
            <span className="italic text-[#c5a982]"> good conversations.</span>
          </h2>
          <p className="mt-7 max-w-lg text-sm leading-8 text-[#c5beb3]">
            Every question matters. Every detail counts. We are glad you are
            here and look forward to hearing from you.
          </p>
          <a
            href="#contact-form"
            className="mt-10 inline-flex items-center gap-4 border border-[#c5a982]/60 px-8 py-5 text-[10px] uppercase tracking-[0.25em] transition hover:bg-[#f5f1eb] hover:text-[#29251f]"
          >
            Start a conversation
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
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
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8cec0] transition hover:border-[#a68b68] hover:bg-[#eee8df]"
                >
                  <Instagram size={17} />
                </a>

                <a
                  href="mailto:hello@tala.com"
                  aria-label="Email TALA"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8cec0] transition hover:border-[#a68b68] hover:bg-[#eee8df]"
                >
                  <Mail size={17} />
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
                <Link href="/products" className="transition hover:text-[#a68b68]">
                  Collection
                </Link>
                <Link href="/about" className="transition hover:text-[#a68b68]">
                  About TALA
                </Link>
                <Link href="/sale" className="transition hover:text-[#a68b68]">
                  Sale
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                Customer care
              </h3>

              <div className="mt-7 flex flex-col gap-4 text-xs text-[#82796d]">
                <Link href="/contact" className="transition hover:text-[#a68b68]">
                  Contact us
                </Link>
                <Link href="/faq" className="transition hover:text-[#a68b68]">
                  FAQs
                </Link>
                <Link href="/size-guide" className="transition hover:text-[#a68b68]">
                  Size guide
                </Link>
                <Link href="/track-order" className="transition hover:text-[#a68b68]">
                  Track order
                </Link>
                <Link href="/returns" className="transition hover:text-[#a68b68]">
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
              <Link href="/privacy" className="transition hover:text-[#29251f]">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-[#29251f]">
                Terms
              </Link>
              <Link href="/returns" className="transition hover:text-[#29251f]">
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
