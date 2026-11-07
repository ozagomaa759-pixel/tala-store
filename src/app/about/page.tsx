import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto flex min-h-[75vh] max-w-7xl flex-col justify-center px-6 py-24">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[#A28A72]">
          Discover TALA
        </p>

        <h1 className="max-w-4xl text-6xl font-light leading-tight sm:text-8xl">
          Style is a story.
          <span className="block italic text-[#A28A72]">
            Make it yours.
          </span>
        </h1>

        <p className="mt-10 max-w-xl text-base leading-8 text-[#77695D]">
          TALA is a contemporary fashion destination built around
          timeless style, thoughtful details, and effortless
          everyday elegance.
        </p>

        <Link
          href="/products"
          className="mt-10 inline-flex w-fit items-center gap-4 border-b border-[#A28A72] pb-3 text-xs uppercase tracking-[0.2em] transition hover:text-[#A28A72]"
        >
          Explore Collection
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
