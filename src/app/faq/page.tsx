
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Plus,
  Sparkles,
} from "lucide-react";

const faqs = [
  {
    category: "ORDERS",
    question: "How can I place an order?",
    answer:
      "Explore the TALA collections, choose your favourite piece, select your size and colour, then add it to your bag. Continue to checkout, enter your delivery details and confirm your order.",
  },
  {
    category: "ORDERS",
    question: "Do I need an account to shop?",
    answer:
      "No account is needed. You can shop with TALA as a guest and enter your contact and delivery details directly at checkout.",
  },
  {
    category: "PAYMENT",
    question: "What payment methods are available?",
    answer:
      "TALA currently offers Cash on Delivery. You can place your order online and pay when your order is delivered.",
  },
  {
    category: "DELIVERY",
    question: "How much is delivery?",
    answer:
      "Standard delivery costs EGP 120. Orders of EGP 3,000 or more qualify for free delivery.",
  },
  {
    category: "DELIVERY",
    question: "How long does delivery take?",
    answer:
      "Delivery timing can vary depending on your location and order. Please contact TALA if you need an update about a specific order.",
  },
  {
    category: "PRODUCTS",
    question: "How do I know if a product is available?",
    answer:
      "Product availability is displayed on the product page. Available sizes and colours can be selected before adding an item to your bag. Sold-out pieces are clearly marked.",
  },
  {
    category: "PRODUCTS",
    question: "Can I choose a different size or colour?",
    answer:
      "Yes. Where available, you can select your preferred size and colour on the product page before adding the item to your bag.",
  },
  {
    category: "ORDERS",
    question: "Can I change or cancel my order?",
    answer:
      "Please contact TALA as soon as possible with your order details. Whether a change or cancellation can be made depends on the order's processing stage.",
  },
  {
    category: "RETURNS",
    question: "What is your return or exchange policy?",
    answer:
      "Please review our Returns page for the latest information and contact TALA if you need help with a specific order.",
  },
  {
    category: "SUPPORT",
    question: "How can I contact TALA?",
    answer:
      "Visit our Contact page to find the available support channel and get in touch with the TALA team.",
  },
];

const categories = [
  "ALL QUESTIONS",
  "ORDERS",
  "PAYMENT",
  "DELIVERY",
  "PRODUCTS",
  "RETURNS",
  "SUPPORT",
];

export default function FAQPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      {/* Top navigation */}
      <nav className="border-b border-[#DED7CC]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="font-serif text-3xl font-light tracking-[0.3em]"
          >
            TALA
          </Link>

          <Link
            href="/collections"
            className="group inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] transition hover:text-[#8A9B55]"
          >
            Explore collections
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#24221F] px-6 py-24 text-[#F5F1EB] sm:px-10 sm:py-32 lg:px-16">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-12 -top-20 h-[320px] w-[320px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-[1500px]">
          <Link
            href="/"
            className="mb-14 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/55 transition hover:text-[#D8ED83]"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          <div className="flex items-center gap-3">
            <Sparkles size={15} className="text-[#D8ED83]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D8ED83]">
              THE TALA HELP DESK
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-[clamp(3.8rem,10vw,9rem)] font-light leading-[0.88] tracking-[-0.065em]">
            GOOD TO
            <br />
            <span className="text-[#D8ED83]">KNOW.</span>
          </h1>

          <div className="mt-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <p className="max-w-lg text-sm leading-8 text-white/60 sm:text-base">
              A few answers to make your TALA experience
              feel effortless. From finding your favourite
              piece to receiving your order.
            </p>

            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
              QUESTIONS, ANSWERED / 01—10
            </p>
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-12 lg:self-start">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
              FIND YOUR ANSWER
            </p>

            <h2 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-5xl">
              The little
              <br />
              things matter.
            </h2>

            <p className="mt-6 max-w-xs text-xs leading-7 text-[#82796F]">
              Browse the topics and find the information
              you need before or after placing an order.
            </p>

            <div className="mt-10 border-t border-[#DED7CC] pt-7">
              <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A0978B]">
                QUICK LINKS
              </p>

              <div className="flex flex-col gap-4">
                {[
                  { label: "All collections", href: "/collections" },
                  { label: "Shopping bag", href: "/cart" },
                  { label: "Track an order", href: "/track-order" },
                  { label: "Returns", href: "/returns" },
                  { label: "Contact TALA", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between text-xs text-[#6F675E] transition hover:text-[#24221F]"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Questions */}
          <div>
            <div className="mb-9 flex items-end justify-between border-b border-[#DED7CC] pb-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#89965D]">
                  YOUR QUESTIONS
                </p>

                <h2 className="mt-3 font-serif text-3xl font-light sm:text-4xl">
                  Frequently asked.
                </h2>
              </div>

              <span className="font-serif text-2xl italic text-[#A5B76B]">
                10
              </span>
            </div>

            <div className="divide-y divide-[#DED7CC]">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-5 py-7">
                    <span className="w-7 shrink-0 font-serif text-sm italic text-[#A5B76B]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9B9083]">
                        {faq.category}
                      </span>

                      <span className="block text-sm font-medium leading-6 sm:text-base">
                        {faq.question}
                      </span>
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D8D0C5] transition group-open:rotate-45 group-open:border-[#24221F] group-open:bg-[#24221F] group-open:text-white">
                      <Plus size={16} />
                    </span>
                  </summary>

                  <div className="pb-8 pl-12 pr-8">
                    <p className="max-w-xl text-xs leading-8 text-[#82796F]">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-5 mb-16 bg-[#D8ED83] sm:mx-10 lg:mx-16">
        <div className="mx-auto flex max-w-[1300px] flex-col justify-between gap-8 px-7 py-12 sm:flex-row sm:items-end sm:px-12 sm:py-16">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#59633D]">
              STILL NEED A HAND?
            </p>

            <h2 className="mt-5 max-w-xl font-serif text-4xl font-light leading-tight tracking-[-0.04em] sm:text-6xl">
              We&apos;re happy to help.
            </h2>

            <p className="mt-4 max-w-md text-xs leading-7 text-[#59633D]">
              Sometimes a conversation is all you need.
              Get in touch with the TALA team.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-5 border-b border-[#24221F] pb-3 text-[9px] font-semibold uppercase tracking-[0.2em]"
          >
            Contact TALA
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#24221F] px-6 py-12 text-center text-[#F5F1EB]">
        <Link
          href="/"
          className="font-serif text-3xl font-light tracking-[0.32em]"
        >
          TALA
        </Link>

        <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/40">
          PLAYFUL BY NATURE. LUXURY BY CHOICE.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[9px] uppercase tracking-[0.15em] text-white/55">
          <Link href="/collections" className="transition hover:text-[#D8ED83]">
            Collections
          </Link>
          <Link href="/contact" className="transition hover:text-[#D8ED83]">
            Contact
          </Link>
          <Link href="/returns" className="transition hover:text-[#D8ED83]">
            Returns
          </Link>
          <Link href="/privacy" className="transition hover:text-[#D8ED83]">
            Privacy
          </Link>
        </div>

        <p className="mt-8 text-[8px] tracking-[0.18em] text-white/30">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
