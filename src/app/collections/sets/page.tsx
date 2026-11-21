
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";

import Header from "@/components/layout/Header";
import { getTalaProducts } from "@/lib/tala-products";
import type { Product } from "@/data/products";

type CollectionData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  subtitle: string | null;
  headline: string | null;
  button_text: string | null;
  overlay_opacity: number | null;
};

const FALLBACK_IMAGE =
  "https://placehold.co/1600x1000/E8E0D6/55483D?text=TALA+SETS";

type SortOption = "featured" | "price-low" | "price-high";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SetsCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] =
    useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCollection() {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesResponse] =
          await Promise.all([
            getTalaProducts(),
            fetch("/api/categories", { cache: "no-store" }),
          ]);

        const categoriesData = await categoriesResponse.json();

        if (!categoriesResponse.ok || !categoriesData.success) {
          throw new Error("Unable to load collection details.");
        }

        if (!active) return;

        setProducts(productsData);

        const setsCategory = (
          categoriesData.categories ?? []
        ).find(
          (item: CollectionData) =>
            item.slug?.toLowerCase() === "sets" ||
            item.name?.toLowerCase() === "sets"
        );

        setCollection(setsCategory ?? null);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCollection();

    return () => {
      active = false;
    };
  }, []);

  const sets = useMemo(
    () =>
      products.filter(
        (product) =>
          product.category?.trim().toLowerCase() === "sets"
      ),
    [products]
  );

  const visibleSets = useMemo(() => {
    let result = [...sets];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) =>
        `${product.name} ${product.subtitle ?? ""}`
          .toLowerCase()
          .includes(query)
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [sets, search, sort]);

  const heroImage =
    collection?.image_url || sets[0]?.image || FALLBACK_IMAGE;

  const title =
    collection?.headline?.trim() || "THE ART OF THE SET";

  const subtitle =
    collection?.subtitle?.trim() ||
    "The pieces that just work together. Made for your everyday, styled your way.";

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      <Header />

      {/* Announcement strip */}
      <div className="overflow-hidden bg-[#D8ED83] py-2.5">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max items-center gap-10 whitespace-nowrap"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="text-[9px] font-bold uppercase tracking-[0.22em]"
            >
              THE CO-ORD EDIT <span className="mx-3">✳</span>
              YOUR LOOK, ALREADY FIGURED OUT <span className="mx-3">✳</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[570px] overflow-hidden bg-[#8B8175] sm:min-h-[690px]">
        <Image
          src={heroImage}
          alt="TALA Sets Collection"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />

        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: (collection?.overlay_opacity ?? 38) / 100,
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-[570px] max-w-[1600px] flex-col justify-end px-5 pb-12 pt-24 text-white sm:min-h-[690px] sm:px-12 sm:pb-20 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#D8ED83]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/80">
                TALA / COLLECTION 01 / SETS
              </p>
            </div>

            <h1 className="max-w-5xl font-serif text-[clamp(3.5rem,10vw,8.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
              {title}
            </h1>

            <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-sm leading-7 text-white/85">
                {subtitle}
              </p>

              <a
                href="#collection-products"
                className="inline-flex w-fit items-center gap-4 border-b border-white/60 pb-3 text-[9px] font-semibold uppercase tracking-[0.22em] transition-all hover:gap-7"
              >
                Explore the edit
                <ArrowDownRight size={17} />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute right-5 top-7 hidden text-right text-[8px] uppercase tracking-[0.25em] text-white/75 sm:block sm:right-12">
          <p>THE CO-ORD EDIT</p>
          <p className="mt-2">MADE TO GO TOGETHER</p>
        </div>
      </section>

      {/* Product collection */}
      <section
        id="collection-products"
        className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16"
      >
        <div className="mb-8 flex flex-col gap-6 border-b border-[#24221F]/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#81796E]">
              THE TALA EDIT / 01
            </p>

            <h2 className="font-serif text-4xl font-normal tracking-[-0.04em] sm:text-5xl">
              The Sets
            </h2>

            <p className="mt-3 max-w-md text-xs leading-6 text-[#77716A]">
              Matching pieces. Different ways to make them yours.
            </p>
          </div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#77716A]">
            {loading ? "LOADING PIECES..." : `${sets.length} PIECES`}
          </p>
        </div>

        {/* Search and sorting */}
        {!loading && !error && sets.length > 0 && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 border-b border-[#24221F]/25 pb-3 sm:w-72">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find your set..."
                aria-label="Search sets"
                className="w-full bg-transparent text-xs outline-none placeholder:text-[#999188]"
              />
              <SlidersHorizontal
                size={16}
                className="shrink-0 text-[#77716A]"
              />
            </div>

            <label className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#77716A]">
              Sort by
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                className="border-b border-[#24221F]/25 bg-transparent py-2 text-[10px] text-[#24221F] outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#E7E0D6]" />
                <div className="mt-4 h-3 w-2/3 bg-[#E7E0D6]" />
                <div className="mt-3 h-3 w-1/3 bg-[#E7E0D6]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[#8B5148]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 border-b border-[#24221F] pb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
            >
              Try again
            </button>
          </div>
        ) : visibleSets.length === 0 ? (
          <div className="py-24 text-center">
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.25em] text-[#81796E]">
              {search ? "NO MATCHES FOUND" : "A NEW EDIT IS COMING"}
            </p>

            <h3 className="font-serif text-4xl">
              {search ? "Try another search." : "Coming Soon."}
            </h3>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-7 text-[#77716A]">
              {search
                ? "We couldn't find a set matching your search."
                : "New pieces are being prepared. In the meantime, explore the full TALA collection."}
            </p>

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-7 border-b border-[#24221F] pb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/collections/all-pieces"
                className="mt-7 inline-flex items-center gap-3 border-b border-[#24221F] pb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
              >
                Explore all pieces
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
            {visibleSets.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.55,
                  delay: (index % 4) * 0.06,
                }}
                className="group min-w-0"
              >
                <Link
                  href={`/products/${encodeURIComponent(product.slug || product.id)}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#E7E0D6]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                    />

                    {!product.isAvailable && (
                      <span className="absolute left-3 top-3 bg-[#F5F1EB] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#24221F]">
                        Sold Out
                      </span>
                    )}

                    {product.isNew && (
                      <span className="absolute right-3 top-3 bg-[#D8ED83] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#24221F]">
                        New In
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F1EB] text-[#24221F] opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-[11px] font-semibold tracking-[0.02em] text-[#24221F] sm:text-xs">
                      {product.name}
                    </h3>

                    {product.subtitle && (
                      <p className="mt-1.5 line-clamp-1 text-[10px] text-[#81796E]">
                        {product.subtitle}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#24221F]">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice &&
                        product.oldPrice > product.price && (
                          <span className="text-[10px] text-[#999188] line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                    </div>

                    {product.colors.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5">
                        {product.colors.slice(0, 5).map((color) => (
                          <span
                            key={color.name}
                            title={color.name}
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: color.value }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Closing section */}
      <section className="bg-[#D8ED83] px-5 py-20 sm:py-28">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.25em]">
              ONE SET. SO MANY MOODS.
            </p>

            <h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">
              Put it together.
              <br />
              <span className="italic">Your way.</span>
            </h2>
          </div>

          <Link
            href="/collections/all-pieces"
            className="inline-flex w-fit items-center gap-4 border-b border-[#24221F] pb-3 text-[9px] font-bold uppercase tracking-[0.2em]"
          >
            Explore everything
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#24221F] px-5 py-10 text-center text-[#F5F1EB]">
        <Link
          href="/"
          className="font-serif text-3xl tracking-[0.22em]"
        >
          TALA
        </Link>

        <p className="mt-2 text-[8px] tracking-[0.4em] text-white/55">
          LUXURY FASHION
        </p>

        <div className="mx-auto mt-7 h-px max-w-5xl bg-white/15" />

        <p className="mt-6 text-[8px] tracking-[0.2em] text-white/45">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
