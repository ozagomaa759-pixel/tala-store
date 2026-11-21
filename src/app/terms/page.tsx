
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Using the TALA Website",
    icon: ShieldCheck,
    paragraphs: [
      "By visiting or using the TALA website, you agree to use it responsibly and not interfere with its operation, security, or availability.",
      "All website content, branding, product photography, and designs are protected by applicable intellectual property laws. They may not be copied or commercially used without permission from the relevant rights holder.",
    ],
  },
  {
    number: "02",
    title: "Products & Availability",
    icon: ShoppingBag,
    paragraphs: [
      "We aim to present product descriptions, photographs, colours, prices, sizes, and availability as accurately as possible.",
      "Colours may appear slightly different depending on your device and screen settings. Products and selected variants are subject to availability and stock levels.",
      "A product being displayed on the website does not guarantee that every size or colour is available.",
    ],
  },
  {
    number: "03",
    title: "Orders & Confirmation",
    icon: CheckCircle2,
    paragraphs: [
      "When you submit an order, you are sending an order request to TALA. The order may require confirmation by our team before it is processed.",
      "Please provide accurate contact and delivery information. TALA may contact you using the details provided to confirm your order or clarify delivery information.",
      "If an item becomes unavailable or an order cannot be processed, our team may contact you to discuss the next steps.",
    ],
  },
  {
    number: "04",
    title: "Payment",
    icon: CreditCard,
    paragraphs: [
      "TALA currently offers Cash on Delivery. Payment is collected when your order is delivered.",
      "Please make sure you are available to receive your order and complete the payment at delivery.",
    ],
  },
  {
    number: "05",
    title: "Shipping & Delivery",
    icon: Truck,
    paragraphs: [
      "Standard delivery costs EGP 120. Orders with a total value of EGP 3,000 or more qualify for free delivery.",
      "Delivery timing may vary depending on your location, courier availability, and other circumstances outside our control.",
      "Please ensure that your delivery address and phone number are correct when placing your order.",
    ],
  },
  {
    number: "06",
    title: "Inspection, Returns & Exchanges",
    icon: Package,
    paragraphs: [
      "Customers are given the opportunity to inspect their order before accepting delivery. Please check your items carefully before confirming receipt.",
      "Under TALA's stated store policy, once an order has been accepted, returns, refunds, and exchanges are not offered.",
      "This store policy does not remove or limit any rights that may apply under mandatory consumer protection laws.",
    ],
  },
  {
    number: "07",
    title: "Order Changes & Cancellations",
    icon: CheckCircle2,
    paragraphs: [
      "If you need to change or cancel an order, contact TALA as soon as possible and provide your order details.",
      "Whether a change or cancellation can be made depends on the order's processing and delivery stage. A request is not considered confirmed until TALA responds.",
    ],
  },
  {
    number: "08",
    title: "Privacy & Customer Information",
    icon: ShieldCheck,
    paragraphs: [
      "TALA offers guest checkout. You do not need to create an account or password to place an order.",
      "Information submitted during checkout is used to process orders, arrange delivery, contact customers, and provide customer support. Please review our Privacy Policy for further details.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F5F1EB] text-[#24221F]">
      <section className="relative isolate overflow-hidden bg-[#24221F] text-[#F5F1EB]">
        <div className="pointer-events-none absolute -right-32 -top-36 -z-10 h-[480px] w-[480px] rounded-full border border-white/10 sm:h-[620px] sm:w-[620px]" />

        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-[320px] w-[320px] rounded-full border border-white/10" />

        <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24 lg:px-20">
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
              THE TALA AGREEMENT
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.9] tracking-[-0.06em]">
            TERMS
            <br />
            <span className="italic text-[#D8ED83]">
              & conditions.
            </span>
          </h1>

          <p className="mt-9 max-w-xl text-sm leading-8 text-white/55 sm:text-base">
            A clear understanding makes every experience
            better. Please read the following information
            before placing an order with TALA.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 border-b border-[#DED7CC] pb-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
            PLEASE READ CAREFULLY
          </p>

          <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.04em] sm:text-5xl">
            Shopping with TALA
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#82796F]">
            These terms explain how orders, payments,
            delivery, and customer requests are handled
            through our online store.
          </p>
        </div>

        <div className="divide-y divide-[#DED7CC] border-y border-[#DED7CC]">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.number}
                className="grid gap-6 py-9 sm:grid-cols-[70px_1fr] sm:gap-8 sm:py-11"
              >
                <div className="flex items-center gap-4 sm:block">
                  <span className="font-serif text-xl italic text-[#A5B76B]">
                    {section.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE6DD] text-[#59633D] sm:mt-5">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-light tracking-[-0.025em] sm:text-3xl">
                    {section.title}
                  </h3>

                  <div className="mt-4 max-w-3xl space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-8 text-[#82796F]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 bg-[#D8ED83] p-7 sm:p-10">
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#59633D]">
            QUESTIONS ABOUT YOUR ORDER?
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-light tracking-[-0.04em] sm:text-4xl">
                We're here to help.
              </h2>

              <p className="mt-3 max-w-lg text-xs leading-7 text-[#59633D]">
                Contact our team if you need clarification
                about an order or any of these terms.
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

        <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 border-t border-[#DED7CC] pt-7 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#82796F]">
          <Link
            href="/policies"
            className="transition hover:text-[#68764A]"
          >
            Store policies
          </Link>

          <Link
            href="/returns"
            className="transition hover:text-[#68764A]"
          >
            Returns & exchanges
          </Link>

          <Link
            href="/privacy"
            className="transition hover:text-[#68764A]"
          >
            Privacy policy
          </Link>
        </div>

        <p className="mt-8 text-[10px] leading-6 text-[#9A9186]">
          These terms should be reviewed against TALA's
          actual business practices and applicable laws.
          Nothing in these terms is intended to exclude
          rights that cannot legally be excluded.
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
          <Link href="/collections" className="transition hover:text-[#D8ED83]">
            Collections
          </Link>
          <Link href="/faq" className="transition hover:text-[#D8ED83]">
            FAQ
          </Link>
          <Link href="/contact" className="transition hover:text-[#D8ED83]">
            Contact
          </Link>
          <Link href="/privacy" className="transition hover:text-[#D8ED83]">
            Privacy
          </Link>
        </div>

        <p className="mt-7 text-[8px] tracking-[0.18em] text-white/30">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
