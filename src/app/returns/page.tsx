import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto max-w-4xl px-6 py-24">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-8">
          <RotateCcw size={34} strokeWidth={1.3} />
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#9A8065]">
          TALA Customer Care
        </p>

        <h1 className="mb-8 text-5xl font-light">
          Returns & Exchanges
        </h1>

        <p className="mb-12 max-w-2xl leading-8 text-[#76685D]">
          We want you to feel confident with every TALA purchase.
          If you need help with an order, our customer care team
          is here to assist you.
        </p>

        <div className="space-y-8 border-t border-[#DED5CA] pt-8">
          <section>
            <h2 className="mb-3 text-xl">Return Requests</h2>
            <p className="leading-8 text-[#76685D]">
              Contact our customer care team with your order number
              and details about your request. We will guide you
              through the next steps.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Exchanges</h2>
            <p className="leading-8 text-[#76685D]">
              Need a different size or item? Contact us to ask
              about available exchange options.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl">Need Help?</h2>
            <p className="leading-8 text-[#76685D]">
              Please reach out through our Contact page for
              assistance with returns or exchanges.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-block border-b border-[#332A23] pb-1 text-sm"
            >
              Contact TALA
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
