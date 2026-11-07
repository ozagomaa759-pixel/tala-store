import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";

export default function SalePage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <Link
          href="/"
          className="mb-16 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-8">
          <Tag size={34} strokeWidth={1.3} />
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#9A8065]">
          Special Selection
        </p>

        <h1 className="mb-6 text-6xl font-light tracking-tight">
          The Sale
        </h1>

        <p className="max-w-xl text-base leading-8 text-[#76685D]">
          Discover special pieces from TALA.
          Explore our latest collections and check back
          for exclusive offers.
        </p>

        <Link
          href="/products"
          className="mt-10 inline-flex border border-[#332A23] px-8 py-4 text-xs uppercase tracking-[0.2em] transition hover:bg-[#332A23] hover:text-white"
        >
          Explore Collection
        </Link>
      </section>
    </main>
  );
}
