
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import Header from "@/components/layout/Header";
import { getTalaProducts } from "@/lib/tala-products";
import type { Product } from "@/data/products";

type SortOption = "featured" | "price-low" | "price-high" | "newest";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

function isRealImage(src?: string | null) {
  if (!src || typeof src !== "string") return false;

  const value = src.trim().toLowerCase();

  return (
    (value.startsWith("https://") || value.startsWith("/")) &&
    !value.includes("placehold.co") &&
    !value.includes("placeholder")
  );
}

function ProductPhoto({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!isRealImage(src) || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#E8E1D7]">
        <span className="font-serif text-3xl tracking-[0.25em] text-[#A69B8D]">
          TALA
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
    />
  );
}

export default function AllPiecesCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("featured");

  // Read the search query sent from the global header.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";

    setSearch(query);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getTalaProducts();

        if (active) setProducts(data);
      } catch {
        if (active) {
          setError("We couldn't load the collection. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const names = products
      .map((product) => product.category?.trim())
      .filter((name): name is string => Boolean(name));

    return ["All", ...Array.from(new Set(names))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const searchableText = [
        product.name,
        product.category,
        product.subtitle,
        product.description,
        ...(product.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sort === "featured") {
      result = [...result].sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured)
      );
    }

    if (sort === "newest") {
      result = [...result].sort(
        (a, b) => Number(b.isNew) - Number(a.isNew)
      );
    }

    if (sort === "price-low") {
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [products, category, search, sort]);

  const heroImage = products
    .flatMap((product) => [product.image, ...(product.images ?? [])])
    .find((image) => isRealImage(image));

  function resetFilters() {
    setSearch("");
    setCategory("All");

    window.history.replaceState(
      null,
      "",
      "/collections/all-pieces"
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      {/* Announcement */}
      <div className="relative z-40 overflow-hidden bg-[#D8ED83] py-2.5">
        <div className="flex w-max animate-[tala-marquee_28s_linear_infinite] items-center gap-8 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="flex items-center gap-8 text-[9px] font-semibold uppercase tracking-[0.2em]"
            >
              THE COMPLETE TALA EDIT
              <span className="text-base">✳</span>
              FIND YOUR NEXT FAVOURITE
              <span className="text-base">✳</span>
              MADE TO BE YOURS
              <span className="text-base">✳</span>
            </span>
          ))}
        </div>
      </div>

      <Header />

      {/* Hero */}
      <section className="relative isolate flex min-h-[570px] items-end overflow-hidden bg-[#777168] sm:min-h-[700px]">
        {heroImage ? (
          <img
            src={heroImage}
            alt="TALA collection editorial"
            fetchPriority="high"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 -z-20 overflow-hidden bg-[#82786C]">
            <div className="absolute -right-20 -top-32 h-[500px] w-[500px] rounded-full border border-white/10" />
            <div className="absolute -right-4 -top-16 h-[370px] w-[370px] rounded-full border border-white/10" />
            <div className="absolute -bottom-48 left-[30%] h-[550px] w-[550px] rounded-full border border-white/10" />
            <span className="absolute right-[8%] top-[18%] font-serif text-[180px] font-light tracking-[-0.1em] text-white/[0.07] sm:text-[280px]">
              T.
            </span>
          </div>
        )}

        <div className="absolute inset-0 -z-10 bg-black/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

        <div className="mx-auto w-full max-w-[1600px] px-6 pb-14 pt-32 text-white sm:px-12 sm:pb-20 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#D8ED83]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/75">
                TALA / THE FULL STORY
              </p>
            </div>

            <h1 className="font-serif text-[clamp(4rem,11vw,10rem)] font-light leading-[0.84] tracking-[-0.065em]">
              ALL THE
              <br />
              GOOD
              <span className="text-[#D8ED83]"> STUFF.</span>
            </h1>

            <div className="mt-9 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <p className="max-w-md text-sm leading-7 text-white/80 sm:text-base">
                Every piece, every mood, every little detail.
                Discover the complete TALA collection and find
                the pieces that feel like you.
              </p>

              <a
                href="#all-products"
                className="group inline-flex w-fit items-center gap-5 border-b border-white/60 pb-3 text-[9px] font-semibold uppercase tracking-[0.22em] transition hover:border-[#D8ED83]"
              >
                Shop the full edit
                <ArrowDownRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                />
              </a>
            </div>
          </motion.div>

          <div className="absolute right-7 top-10 hidden text-right sm:block sm:right-12">
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/60">
              TALA LUXURY FASHION
            </p>
            <p className="mt-2 font-serif text-xl italic text-white/80">
              Your style. Your story.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        id="all-products"
        className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16"
      >
        <div className="mb-10 flex flex-col justify-between gap-7 border-b border-[#DCD5CB] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8C806F]">
              <Sparkles size={13} />
              THE WORLD OF TALA
            </p>

            <h2 className="font-serif text-4xl font-light tracking-[-0.045em] sm:text-6xl">
              The complete
              <span className="ml-2 text-[#A7BD62]">edit.</span>
            </h2>

            <p className="mt-3 text-xs text-[#82796F]">
              All the pieces. One place.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.17em] text-[#82796F]">
            {loading
              ? "Loading pieces..."
              : `${visibleProducts.length} PIECES`}
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-7 flex flex-col gap-5">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#82796F]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the collection..."
              aria-label="Search the collection"
              className="w-full border-b border-[#CFC6BA] bg-transparent py-3 pl-7 pr-9 text-xs outline-none placeholder:text-[#A49A8F] focus:border-[#24221F]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-[#82796F] transition hover:text-[#24221F]"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-col justify-between gap-4 border-b border-[#DCD5CB] pb-5 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#82796F]">
                <SlidersHorizontal size={14} />
                Filter
              </span>

              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-[9px] uppercase tracking-[0.12em] transition ${
                    category === item
                      ? "border-[#24221F] bg-[#24221F] text-[#F5F1EB]"
                      : "border-[#D4CCC1] text-[#70675E] hover:border-[#24221F]"
                  }`}
                >
                  {item === "All" ? "All pieces" : item}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.16em] text-[#82796F]">
              Sort
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                className="min-w-[130px] border-b border-[#CFC6BA] bg-transparent py-2 text-[10px] text-[#24221F] outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">New arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          {search.trim() && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#82796F]">
              <p>
                SEARCH RESULTS FOR{" "}
                <span className="font-semibold text-[#24221F]">
                  “{search.trim()}”
                </span>
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="border-b border-[#24221F]/50 pb-1 font-semibold uppercase tracking-[0.12em] text-[#24221F] transition hover:border-[#D8ED83]"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#E7E1D8]" />
                <div className="mt-4 h-3 w-2/3 bg-[#E7E1D8]" />
                <div className="mt-3 h-3 w-1/3 bg-[#E7E1D8]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[#9A554B]">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 border-b border-[#24221F] pb-2 text-[9px] uppercase tracking-[0.2em]"
            >
              Try again
            </button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="py-24 text-center">
            <span className="text-3xl text-[#A7BD62]">✳</span>

            <h3 className="mt-5 font-serif text-4xl font-light">
              No pieces found.
            </h3>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-[#82796F]">
              Try another name, change your category, or explore
              the complete collection.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-8 border-b border-[#24221F] pb-2 text-[9px] uppercase tracking-[0.2em]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.5,
                  delay: (index % 4) * 0.06,
                }}
                className="group min-w-0"
              >
                <Link
                  href={`/products/${encodeURIComponent(
                    product.slug || product.id
                  )}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE4DB]">
                    <ProductPhoto
                      src={product.image}
                      alt={product.name}
                    />

                    {!product.isAvailable && (
                      <span className="absolute left-3 top-3 bg-[#F5F1EB] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#24221F]">
                        Sold Out
                      </span>
                    )}

                    {product.isNew && (
                      <span className="absolute right-3 top-3 bg-[#D8ED83] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#24221F]">
                        Just dropped
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#F5F1EB] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={17} strokeWidth={1.5} />
                    </span>
                  </div>

                  <div className="pt-4">
                    <p className="mb-2 text-[8px] uppercase tracking-[0.2em] text-[#8C806F]">
                      {product.category}
                    </p>

                    <h3 className="text-[11px] font-semibold tracking-[0.025em] text-[#302B26] sm:text-xs">
                      {product.name}
                    </h3>

                    {product.subtitle && (
                      <p className="mt-1.5 line-clamp-1 text-[10px] text-[#91877C]">
                        {product.subtitle}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#302B26]">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice != null &&
                        product.oldPrice > product.price && (
                          <span className="text-[10px] text-[#A49A90] line-through">
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

      {/* Closing CTA */}
      <section className="mx-5 mb-16 overflow-hidden bg-[#D8ED83] sm:mx-10 lg:mx-16">
        <div className="flex flex-col justify-between gap-8 px-7 py-10 sm:flex-row sm:items-end sm:px-12 sm:py-14">
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#555D3D]">
              YOUR STYLE DOESN&apos;T STAND STILL
            </p>

            <h2 className="max-w-xl font-serif text-4xl font-light leading-[1.05] tracking-[-0.035em] sm:text-6xl">
              Keep exploring.
            </h2>
          </div>

          <Link
            href="/collections"
            className="group inline-flex w-fit items-center gap-5 border-b border-[#24221F] pb-3 text-[9px] font-semibold uppercase tracking-[0.18em]"
          >
            Discover collections
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
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

        <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/45">
          LUXURY FASHION
        </p>

        <div className="mt-9 border-t border-white/10 pt-6">
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/65 transition hover:text-[#D8ED83]"
          >
            Back to collections
            <ArrowRight size={13} />
          </Link>

          <p className="mt-5 text-[8px] tracking-[0.18em] text-white/35">
            © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </main>
  );
}
