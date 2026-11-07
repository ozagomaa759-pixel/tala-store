"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto max-w-4xl px-6 py-24">
        <Link
          href="/"
          className="mb-16 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#9A8065]">
          Find Your Style
        </p>

        <h1 className="mb-12 text-5xl font-light">
          Search TALA
        </h1>

        <form
          action="/products"
          method="GET"
          className="flex items-center gap-4 border-b border-[#BFB3A5] pb-5"
        >
          <Search size={22} strokeWidth={1.4} />

          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for products..."
            className="w-full bg-transparent text-lg outline-none placeholder:text-[#A99D91]"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={19} />
            </button>
          )}

          <button
            type="submit"
            className="text-xs uppercase tracking-[0.2em]"
          >
            Search
          </button>
        </form>

        <p className="mt-8 text-sm text-[#918477]">
          Discover pieces that match your style.
        </p>
      </section>
    </main>
  );
}
