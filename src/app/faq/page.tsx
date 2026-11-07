import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const faqs = [
  {
    question: "How can I place an order?",
    answer:
      "You can explore our collections and add your favorite products to your shopping cart. Online ordering will be activated once checkout is configured.",
  },
  {
    question: "Do you offer delivery?",
    answer:
      "Delivery options and shipping details will be announced when the store's order system is ready.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Our return and exchange policy will be published before online orders become available.",
  },
  {
    question: "How can I contact TALA?",
    answer:
      "Visit our Contact page to find the available ways to reach our team.",
  },
  {
    question: "Are online payments available?",
    answer:
      "Secure online payments are not active yet. We will announce payment options when they are ready.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-20 text-[#332A23]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-[#81766B] hover:text-black"
        >
          <ArrowLeft size={16} />
          Back Home
        </Link>

        <div className="mb-14">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#A58B68]">
            Need some help?
          </p>

          <h1 className="text-4xl font-light md:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#81766B]">
            Everything you need to know about shopping with TALA.
          </p>
        </div>

        <div className="divide-y divide-[#E5DDD2] border-y border-[#E5DDD2]">
          {faqs.map((faq, index) => (
            <details key={index} className="group py-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5">
                <span className="text-base font-medium md:text-lg">
                  {faq.question}
                </span>

                <Plus
                  size={20}
                  className="shrink-0 text-[#A58B68] transition-transform group-open:rotate-45"
                />
              </summary>

              <p className="mt-5 max-w-3xl text-sm leading-8 text-[#81766B]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-14 border border-[#E5DDD2] bg-white/50 p-8 text-center">
          <h2 className="text-2xl font-light">
            Still have questions?
          </h2>

          <p className="mt-3 text-sm text-[#81766B]">
            Our contact page is here to help.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex bg-[#332A23] px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#5A493B]"
          >
            Contact TALA
          </Link>
        </div>
      </div>
    </main>
  );
}
