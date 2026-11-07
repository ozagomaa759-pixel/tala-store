import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "1. Website Use",
    text: "By accessing the TALA website, you agree to use it responsibly and in accordance with these terms. You must not misuse the website or attempt to interfere with its operation.",
  },
  {
    title: "2. Products & Availability",
    text: "We aim to display accurate product descriptions, images, prices, and availability. Product colors may appear differently depending on your screen. All products are subject to availability.",
  },
  {
    title: "3. Orders & Payment",
    text: "An order request is subject to confirmation by TALA. Prices, payment methods, delivery fees, and order details should be confirmed before an order is finalized.",
  },
  {
    title: "4. Returns & Exchanges",
    text: "Returns and exchanges are subject to the store's published return policy and applicable consumer protection laws. Please contact our team before sending an item back.",
  },
  {
    title: "5. Intellectual Property",
    text: "Website content, branding, logos, images, and designs may not be copied or used commercially without permission from their respective owners.",
  },
  {
    title: "6. Contact",
    text: "For questions about these terms, please contact the TALA team through the Contact page.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8B7867] hover:text-[#332A23] mb-12"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <header className="mb-14">
          <p className="text-xs tracking-[0.4em] uppercase text-[#A58A6D] mb-5">
            TALA Boutique
          </p>
          <h1 className="text-4xl md:text-6xl font-light mb-5">
            Terms & Conditions
          </h1>
          <p className="text-[#81766D] leading-8">
            Please read these terms before using our website.
          </p>
        </header>

        <div className="space-y-10">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border-b border-[#E5DDD2] pb-8"
            >
              <h2 className="text-xl mb-4">{section.title}</h2>
              <p className="text-[#81766D] leading-8">{section.text}</p>
            </section>
          ))}
        </div>

        <p className="text-xs text-[#9A8E82] mt-12 leading-6">
          This is a general website terms template, not legal advice. TALA
          should review and adapt it to its actual business policies and
          applicable laws before publishing.
        </p>
      </section>
    </main>
  );
}
