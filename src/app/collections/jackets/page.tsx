
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
  name?: string;
  slug?: string;
  image_url?: string | null;
  headline?: string | null;
  subtitle?: string | null;
  overlay_opacity?: number | null;
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
        className="flex h-full w-full items-center justify-center"
        style={{ backgroundColor: THEME.surface }}
      >
        <span className="font-serif text-5xl tracking-[0.2em] text-[#292923]/35">
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

export default function JacketsCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");

  useEffect(() => {
    let active = true;

    async function loadCollection() {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesResponse] = await Promise.all([
          getTalaProducts(),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        const categoriesData = categoriesResponse.ok
          ? await categoriesResponse.json()
          : null;

        if (!active) return;

        setProducts(productsData);

        const jacketsCategory = (
          categoriesData?.categories ?? []
        ).find(
          (item: CollectionData) =>
            item.slug?.trim().toLowerCase() === "jackets" ||
            item.name?.trim().toLowerCase() === "jackets"
        );

        setCollection(jacketsCategory ?? null);
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

  const jackets = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const isJacket =
        product.category?.trim().toLowerCase() === "jackets";

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.subtitle?.toLowerCase().includes(query);

      return isJacket && matchesSearch;
    });

    if (sort === "featured") {
      result = [...result].sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured)
      );
    }

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, sort]);

  const heroImage =
    (isRealImage(collection?.image_url) && collection?.image_url) ||
    products
      .filter(
        (product) =>
          product.category?.trim().toLowerCase() === "jackets"
      )
      .flatMap((product) => [product.image, ...(product.images ?? [])])
      .find((image) => isRealImage(image)) ||
    null;

  const title =
    collection?.headline?.trim() || "THE JACKET EDIT";

  const subtitle =
    collection?.subtitle?.trim() ||
    "The finishing layer. Strong silhouettes, effortless energy, and pieces made to change the whole look.";

  return (
    <main
      className="min-h-screen overflow-hidden text-[#292923]"
      style={{ backgroundColor: THEME.page }}
    >
      <Header />

      {/* Announcement */}
      <div className="relative z-30 overflow-hidden bg-[#D8ED83] py-2.5 text-[#292923]">
        <div className="flex w-max animate-[tala-marquee_28s_linear_infinite] items-center gap-8 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="flex items-center gap-8 text-[9px] font-semibold uppercase tracking-[0.2em]"
            >
              THE JACKET EDIT
              <span className="text-base">✳</span>
              YOUR LOOK, YOUR RULES
              <span className="text-base">✳</span>
              TALA LUXURY FASHION
              <span className="text-base">✳</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative isolate flex min-h-[570px] items-end overflow-hidden sm:min-h-[690px]"
        style={{ backgroundColor: THEME.stone }}
      >
        {heroImage ? (
          <img
            src={heroImage}
            alt="TALA Jackets Collection"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className="absolute inset-0 -z-20 overflow-hidden"
            style={{ backgroundColor: THEME.stone }}
          >
            <div className="absolute -right-20 -top-32 h-[500px] w-[500px] rounded-full border border-[#292923]/15" />
            <div className="absolute -right-4 -top-16 h-[370px] w-[370px] rounded-full border border-[#292923]/15" />
            <div className="absolute -bottom-48 left-[25%] h-[550px] w-[550px] rounded-full border border-[#292923]/15" />
            <span className="absolute right-[8%] top-[18%] font-serif text-[180px] font-light tracking-[-0.1em] text-[#292923]/10 sm:text-[280px]">
              T.
            </span>
          </div>
        )}

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
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/75">
                TALA / COLLECTION 02 / JACKETS
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
                href="#jackets-products"
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
              TALA LUXURY FASHION
            </p>
            <p className="mt-2 font-serif text-2xl italic text-white/85">
              Style is an attitude.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        id="jackets-products"
        className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16"
      >
        <div
          className="mb-10 flex flex-col justify-between gap-7 border-b pb-8 sm:flex-row sm:items-end"
          style={{ borderColor: THEME.line }}
        >
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#625B50]">
              NOT JUST ANOTHER LAYER
            </p>

            <h2 className="font-serif text-4xl font-light tracking-[-0.045em] sm:text-6xl">
              Jackets
              <span className="ml-2 text-[#D8ED83]">edit.</span>
            </h2>

            <p className="mt-3 text-xs text-[#625B50]">
              Find the piece that pulls it all together.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.17em] text-[#625B50]">
            {loading ? "Loading pieces..." : `${jackets.length} PIECES`}
          </p>
        </div>

        {/* Search and sorting */}
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
              placeholder="Find your next favourite..."
              aria-label="Search jackets"
              className="w-full border-b border-[#292923]/30 bg-transparent py-3 pl-7 pr-3 text-xs text-[#292923] outline-none placeholder:text-[#625B50]/70 focus:border-[#292923]"
            />
          </div>

          <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.16em] text-[#625B50]">
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            Sort by
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              className="min-w-[135px] border-b border-[#292923]/30 bg-[#A99A88] py-2 text-[10px] text-[#292923] outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div
                  className="aspect-[3/4]"
                  style={{ backgroundColor: THEME.surface }}
                />
                <div className="mt-4 h-3 w-2/3 bg-[#958675]" />
                <div className="mt-3 h-3 w-1/3 bg-[#958675]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[#7B4038]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 border-b border-[#292923] pb-2 text-[9px] uppercase tracking-[0.2em]"
            >
              Try again
            </button>
          </div>
        ) : jackets.length === 0 ? (
          <div className="py-24 text-center">
            <span className="text-3xl text-[#292923]">✳</span>
            <h3 className="mt-5 font-serif text-4xl font-light">
              {search ? "No matches found." : "The next layer is coming."}
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-xs leading-7 text-[#625B50]">
              {search
                ? "No jackets match your search. Try another name."
                : "New pieces are being prepared. In the meantime, explore the full TALA collection."}
            </p>

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-8 border-b border-[#292923] pb-2 text-[9px] uppercase tracking-[0.2em]"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/collections/all-pieces"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#292923] pb-2 text-[9px] uppercase tracking-[0.2em]"
              >
                Explore all pieces
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
            {jackets.map((product, index) => (
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
                  <div
                    className="relative aspect-[3/4] overflow-hidden"
                    style={{ backgroundColor: THEME.surface }}
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                    />

                    {!product.isAvailable && (
                      <span className="absolute left-3 top-3 bg-[#292923] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#D8ED83]">
                        Sold Out
                      </span>
                    )}

                    {product.isNew && (
                      <span className="absolute right-3 top-3 bg-[#D8ED83] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#292923]">
                        Just dropped
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#D8ED83] text-[#292923] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={17} strokeWidth={1.5} />
                    </span>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-[11px] font-semibold tracking-[0.025em] text-[#292923] sm:text-xs">
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

      {/* Closing CTA */}
      <section className="mx-5 mb-16 overflow-hidden bg-[#D8ED83] text-[#292923] sm:mx-10 lg:mx-16">
        <div className="flex flex-col justify-between gap-8 px-7 py-10 sm:flex-row sm:items-end sm:px-12 sm:py-14">
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#555D3D]">
              THE REST OF THE STORY
            </p>
            <h2 className="max-w-xl font-serif text-4xl font-light leading-[1.05] tracking-[-0.035em] sm:text-6xl">
              One more look?
            </h2>
          </div>

          <Link
            href="/collections/all-pieces"
            className="group inline-flex w-fit items-center gap-5 border-b border-[#292923] pb-3 text-[9px] font-semibold uppercase tracking-[0.18em]"
          >
            Shop all pieces
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#292923] px-6 py-12 text-center text-[#B8AA98]">
        <Link
          href="/"
          className="font-serif text-3xl font-light tracking-[0.32em] text-white"
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
            All collections
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
