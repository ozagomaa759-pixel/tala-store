
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

type SortOption = "featured" | "price-low" | "price-high";

const THEME = {
  page: "#B8AA98",
  surface: "#A99A88",
  stone: "#958675",
  ink: "#292923",
  muted: "#625B50",
  lime: "#D8ED83",
  line: "rgba(41,41,35,0.2)",
};

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

function ProductImage({
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
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{ backgroundColor: THEME.surface }}
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#292923]/15" />
        <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full border border-[#292923]/15" />
        <span className="font-serif text-6xl font-light tracking-[-0.1em] text-[#292923]/35">
          T.
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

function HeroImage({ src }: { src?: string | null }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!isRealImage(src) || failed) {
    return (
      <div
        className="absolute inset-0 -z-20 overflow-hidden"
        style={{ backgroundColor: THEME.surface }}
      >
        <div className="absolute -right-24 -top-32 h-[500px] w-[500px] rounded-full border border-white/15" />
        <div className="absolute -right-8 -top-16 h-[360px] w-[360px] rounded-full border border-white/15" />
        <div className="absolute -bottom-48 left-[20%] h-[550px] w-[550px] rounded-full border border-white/15" />
        <span className="absolute right-[8%] top-[15%] font-serif text-[190px] font-light tracking-[-0.1em] text-white/10 sm:text-[280px]">
          T.
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="TALA Sets Collection"
      fetchPriority="high"
      onError={() => setFailed(true)}
      className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
    />
  );
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

        const categoriesData = categoriesResponse.ok
          ? await categoriesResponse.json()
          : null;

        if (!active) return;

        setProducts(productsData);

        const setsCategory = (
          categoriesData?.categories ?? []
        ).find(
          (item: CollectionData) =>
            item.slug?.trim().toLowerCase() === "sets" ||
            item.name?.trim().toLowerCase() === "sets"
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

  const sets = useMemo(() => {
    return products.filter(
      (product) =>
        product.category?.trim().toLowerCase() === "sets"
    );
  }, [products]);

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

    if (sort === "featured") {
      result.sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured)
      );
    } else if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [sets, search, sort]);

  const heroImage =
    (isRealImage(collection?.image_url) && collection?.image_url) ||
    sets
      .flatMap((product) => [
        product.image,
        ...(product.images ?? []),
      ])
      .find((image) => isRealImage(image)) ||
    null;

  const title =
    collection?.headline?.trim() || "THE ART OF THE SET";

  const subtitle =
    collection?.subtitle?.trim() ||
    "The pieces that just work together. Made for your everyday, styled your way.";

  return (
    <main
      className="min-h-screen overflow-hidden text-[#292923]"
      style={{ backgroundColor: THEME.page }}
    >
      <Header />

      <div className="overflow-hidden border-y border-[#292923]/10 bg-[#D8ED83] py-2.5">
        <div className="flex w-max animate-[tala-marquee_28s_linear_infinite] items-center gap-9 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="text-[9px] font-bold uppercase tracking-[0.22em]"
            >
              THE CO-ORD EDIT
              <span className="mx-4">✳</span>
              YOUR LOOK, ALREADY FIGURED OUT
              <span className="mx-4">✳</span>
              TALA LUXURY FASHION
              <span className="mx-4">✳</span>
            </span>
          ))}
        </div>
      </div>

      <section
        className="relative isolate flex min-h-[570px] items-end overflow-hidden sm:min-h-[690px]"
        style={{ backgroundColor: THEME.stone }}
      >
        <HeroImage src={heroImage} />

        <div
          className="absolute inset-0 -z-10 bg-black"
          style={{
            opacity: (collection?.overlay_opacity ?? 38) / 100,
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-black/10 to-black/10" />

        <div className="mx-auto w-full max-w-[1600px] px-5 pb-14 pt-32 text-white sm:px-12 sm:pb-20 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#D8ED83]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/80">
                TALA / COLLECTION 01 / SETS
              </p>
            </div>

            <h1 className="font-serif text-[clamp(3.8rem,10vw,9rem)] font-normal leading-[0.86] tracking-[-0.06em]">
              {title}
              <span className="text-[#D8ED83]">.</span>
            </h1>

            <div className="mt-8 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <p className="max-w-md text-sm leading-7 text-white/85 sm:text-base">
                {subtitle}
              </p>

              <a
                href="#collection-products"
                className="group inline-flex w-fit items-center gap-5 border-b border-white/60 pb-3 text-[9px] font-semibold uppercase tracking-[0.22em] transition hover:border-[#D8ED83]"
              >
                Explore the edit
                <ArrowDownRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                />
              </a>
            </div>
          </motion.div>

          <div className="absolute right-7 top-10 hidden text-right sm:block">
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/60">
              THE CO-ORD EDIT
            </p>
            <p className="mt-2 font-serif text-2xl italic text-white/85">
              Made to go together.
            </p>
          </div>
        </div>
      </section>

      <section
        id="collection-products"
        className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16"
      >
        <div
          className="mb-10 flex flex-col justify-between gap-7 border-b pb-8 sm:flex-row sm:items-end"
          style={{ borderColor: THEME.line }}
        >
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#625B50]">
              THE TALA EDIT / 01
            </p>

            <h2 className="font-serif text-4xl font-light tracking-[-0.045em] sm:text-6xl">
              The Sets
              <span className="ml-2 text-[#292923]">edit.</span>
            </h2>

            <p className="mt-3 text-xs text-[#625B50]">
              Matching pieces. Different ways to make them yours.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.17em] text-[#625B50]">
            {loading ? "LOADING PIECES..." : `${sets.length} PIECES`}
          </p>
        </div>

        {!loading && !error && sets.length > 0 && (
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                strokeWidth={1.5}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#625B50]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find your set..."
                aria-label="Search sets"
                className="w-full border-b border-[#292923]/25 bg-transparent py-3 pl-7 pr-3 text-xs text-[#292923] outline-none placeholder:text-[#625B50]/70 focus:border-[#292923]"
              />
            </div>

            <label className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#625B50]">
              <SlidersHorizontal size={15} />
              Sort by

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                className="min-w-[135px] border-b border-[#292923]/25 bg-transparent py-2 text-[10px] text-[#292923] outline-none"
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
                <div
                  className="aspect-[3/4]"
                  style={{ backgroundColor: THEME.surface }}
                />
                <div
                  className="mt-4 h-3 w-2/3"
                  style={{ backgroundColor: THEME.surface }}
                />
                <div
                  className="mt-3 h-3 w-1/3"
                  style={{ backgroundColor: THEME.surface }}
                />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[#713F36]">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 border-b border-[#292923] pb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
            >
              Try again
            </button>
          </div>
        ) : visibleSets.length === 0 ? (
          <div className="py-24 text-center">
            <span className="text-3xl text-[#292923]">✳</span>

            <h3 className="mt-5 font-serif text-4xl">
              {search ? "No matches found." : "A new edit is coming."}
            </h3>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-7 text-[#625B50]">
              {search
                ? "We couldn't find a set matching your search."
                : "New pieces are being prepared. In the meantime, explore the full TALA collection."}
            </p>

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-7 border-b border-[#292923] pb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/collections/all-pieces"
                className="mt-7 inline-flex items-center gap-3 border-b border-[#292923] pb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
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
                  href={`/products/${encodeURIComponent(
                    product.slug || product.id
                  )}`}
                  className="block"
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden"
                    style={{ backgroundColor: THEME.surface }}
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                    />

                    {!product.isAvailable && (
                      <span className="absolute left-3 top-3 bg-[#292923] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#D8ED83]">
                        Sold Out
                      </span>
                    )}

                    {product.isNew && (
                      <span className="absolute right-3 top-3 bg-[#D8ED83] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#292923]">
                        New In
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#292923] text-[#D8ED83] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-[11px] font-semibold tracking-[0.02em] text-[#292923] sm:text-xs">
                      {product.name}
                    </h3>

                    {product.subtitle && (
                      <p className="mt-1.5 line-clamp-1 text-[10px] text-[#625B50]">
                        {product.subtitle}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#292923]">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice != null &&
                        product.oldPrice > product.price && (
                          <span className="text-[10px] text-[#625B50]/70 line-through">
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
                            className="h-3 w-3 rounded-full border border-[#292923]/20"
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

      <section className="bg-[#D8ED83] px-5 py-20 text-[#292923] sm:py-28">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.25em] text-[#555D3D]">
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
            className="inline-flex w-fit items-center gap-4 border-b border-[#292923] pb-3 text-[9px] font-bold uppercase tracking-[0.2em]"
          >
            Explore everything
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="bg-[#292923] px-5 py-10 text-center text-[#B8AA98]">
        <Link
          href="/"
          className="font-serif text-3xl tracking-[0.22em] text-[#B8AA98]"
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
