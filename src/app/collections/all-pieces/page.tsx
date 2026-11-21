
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Instagram,
} from "lucide-react";

import Header from "@/components/layout/Header";
import { getTalaProducts } from "@/lib/tala-products";
import type { Product } from "@/data/products";

type SortOption = "featured" | "newest" | "price-low" | "price-high";
type CategoryOption = "All" | "Sets" | "Jackets";

const FORMAT_PRICE = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

function formatPrice(price: number) {
  return FORMAT_PRICE.format(price);
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
  images,
}: {
  src?: string;
  alt: string;
  images?: string[];
}) {
  const [failed, setFailed] = useState(false);
  const [activeImage, setActiveImage] = useState(src || "");

  useEffect(() => {
    setFailed(false);
    setActiveImage(src || "");
  }, [src]);

  const availableImages = (images ?? []).filter(isRealImage);
  const secondaryImage = availableImages.find(
    (image) => image !== src
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EAE7DF]">
      {!isRealImage(activeImage) || failed ? (
        <div className="flex h-full w-full items-center justify-center bg-[#EAE7DF]">
          <div className="text-center">
            <span className="font-serif text-5xl tracking-[0.18em] text-[#242421]/20">
              TALA
            </span>
            <p className="mt-2 text-[8px] tracking-[0.3em] text-[#242421]/35">
              LUXURY FASHION
            </p>
          </div>
        </div>
      ) : (
        <>
          <img
            src={activeImage}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
          />

          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${alt} alternate view`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </>
      )}
    </div>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const isOnSale =
    product.oldPrice != null &&
    product.oldPrice > product.price;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.55,
        delay: (index % 4) * 0.055,
      }}
      className="group min-w-0"
    >
      <Link
        href={`/products/${encodeURIComponent(
          product.slug || product.id
        )}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE7DF]">
          <ProductImage
            src={product.image}
            images={product.images}
            alt={product.name}
          />

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2 sm:left-4 sm:top-4">
            {!product.isAvailable && (
              <span className="bg-[#242421] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white">
                Sold out
              </span>
            )}

            {product.isNew && (
              <span className="bg-[#D8ED83] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#242421]">
                New drop
              </span>
            )}

            {isOnSale && product.isAvailable && (
              <span className="bg-white px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#242421]">
                Special price
              </span>
            )}
          </div>

          {product.isBestSeller && (
            <span className="absolute bottom-3 left-3 bg-white/90 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[#242421] backdrop-blur-sm sm:bottom-4 sm:left-4">
              Best seller
            </span>
          )}

          <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-[#D8ED83] text-[#242421] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-4 sm:right-4">
            <ArrowUpRight size={18} strokeWidth={1.6} />
          </span>
        </div>

        <div className="px-0.5 pt-4 sm:pt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#858176]">
              TALA / {product.category}
            </p>

            <span className="text-[8px] uppercase tracking-[0.12em] text-[#A19C91]">
              {product.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <h3 className="line-clamp-1 text-[11px] font-semibold tracking-[0.015em] text-[#242421] sm:text-xs">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#242421] sm:text-xs">
              {formatPrice(product.price)}
            </span>

            {isOnSale && (
              <span className="text-[10px] text-[#9C978D] line-through">
                {formatPrice(product.oldPrice!)}
              </span>
            )}
          </div>

          {product.colors.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((color) => (
                <span
                  key={`${product.id}-${color.name}`}
                  title={color.name}
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{ backgroundColor: color.value }}
                />
              ))}

              {product.colors.length > 5 && (
                <span className="ml-1 text-[8px] text-[#858176]">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

export default function AllPiecesCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryOption>("All");
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("q") || "");
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getTalaProducts();

        if (active) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        console.error("TALA collection error:", loadError);

        if (active) {
          setError(
            "We couldn't load the collection. Please try again."
          );
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

  const heroImage = useMemo(() => {
    for (const product of products) {
      const image = [product.image, ...(product.images ?? [])].find(
        isRealImage
      );

      if (image) return image;
    }

    return null;
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
        ...product.colors.map((color) => color.name),
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
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) ||
          Number(b.isBestSeller) - Number(a.isBestSeller)
      );
    }

    if (sort === "newest") {
      result = [...result].sort(
        (a, b) => Number(b.isNew) - Number(a.isNew)
      );
    }

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, category, search, sort]);

  const setsCount = products.filter(
    (product) => product.category === "Sets"
  ).length;

  const jacketsCount = products.filter(
    (product) => product.category === "Jackets"
  ).length;

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setSort("featured");

    window.history.replaceState(
      null,
      "",
      "/collections/all-pieces"
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F1EA] text-[#242421]">
      <Header />

      {/* Gen Z ticker */}
      <div className="relative z-20 overflow-hidden bg-[#D8ED83] py-2.5">
        <div className="flex w-max animate-[tala-marquee_28s_linear_infinite] items-center gap-8 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="flex items-center gap-8 text-[9px] font-bold uppercase tracking-[0.2em]"
            >
              NOT HERE TO BLEND IN
              <span className="text-base">✳</span>
              YOUR STYLE YOUR RULES
              <span className="text-base">✳</span>
              THE TALA DROP
              <span className="text-base">✳</span>
            </span>
          ))}
        </div>
      </div>

      {/* Editorial hero */}
      <section className="relative isolate min-h-[590px] overflow-hidden bg-[#292923] sm:min-h-[690px]">
        {heroImage ? (
          <img
            src={heroImage}
            alt="TALA fashion collection"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 -z-20 bg-[#777467]">
            <span className="absolute -right-8 top-0 font-serif text-[280px] leading-none tracking-[-0.12em] text-white/[0.08] sm:text-[430px]">
              T.
            </span>
            <div className="absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full border border-white/15" />
            <div className="absolute -bottom-24 -left-4 h-[300px] w-[300px] rounded-full border border-white/15" />
          </div>
        )}

        <div className="absolute inset-0 -z-10 bg-black/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-black/15" />

        <div className="relative mx-auto flex min-h-[590px] max-w-[1600px] flex-col justify-end px-5 pb-14 pt-28 text-white sm:min-h-[690px] sm:px-10 sm:pb-20 lg:px-16">
          <div className="mb-auto flex items-center justify-between pt-4">
            <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/75 sm:text-[9px]">
              TALA / THE FULL COLLECTION
            </p>

            <p className="hidden text-[9px] uppercase tracking-[0.2em] text-white/70 sm:block">
              EST. FOR YOUR EVERYDAY
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-5xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#D8ED83]" />
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/80">
                THE NEW WAY TO DRESS
              </p>
            </div>

            <h1 className="font-serif text-[clamp(4.2rem,12vw,10.5rem)] font-normal leading-[0.78] tracking-[-0.075em]">
              ALL
              <br />
              YOUR
              <span className="text-[#D8ED83]"> VIBE.</span>
            </h1>

            <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-xs leading-7 text-white/80 sm:text-sm">
                A little bold. A little unexpected.
                Always unmistakably you.
                Discover every piece in the TALA universe.
              </p>

              <a
                href="#all-products"
                className="group inline-flex min-h-12 w-fit items-center gap-8 border border-white/70 px-5 text-[9px] font-bold uppercase tracking-[0.2em] transition duration-300 hover:border-[#D8ED83] hover:bg-[#D8ED83] hover:text-[#242421]"
              >
                Find your next look
                <ArrowDown size={16} />
              </a>
            </div>
          </motion.div>

          <div className="mt-12 flex items-center justify-between border-t border-white/30 pt-5">
            <p className="text-[8px] uppercase tracking-[0.22em] text-white/65">
              TALA LUXURY FASHION
            </p>

            <p className="text-[8px] uppercase tracking-[0.22em] text-white/65">
              {loading ? "DISCOVERING..." : `${products.length} PIECES`}
            </p>
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section className="mx-auto max-w-[1600px] px-5 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.28em] text-[#858176]">
              PICK YOUR MOOD
            </p>

            <h2 className="font-serif text-3xl tracking-[-0.05em] sm:text-5xl">
              The edits<span className="text-[#A7BD62]">.</span>
            </h2>
          </div>

          <span className="pb-1 text-[8px] uppercase tracking-[0.15em] text-[#858176]">
            02 COLLECTIONS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => {
              setCategory("Sets");
              document
                .getElementById("all-products")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex min-h-[125px] flex-col justify-between overflow-hidden bg-[#D8ED83] p-4 text-left transition duration-300 hover:bg-[#CDE477] sm:min-h-[175px] sm:p-7"
          >
            <span className="flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.2em] text-[#4C5435]">
              THE CO-ORD EDIT
              <ArrowUpRight size={17} />
            </span>

            <span>
              <span className="block font-serif text-3xl tracking-[-0.05em] text-[#242421] sm:text-5xl">
                Sets
              </span>
              <span className="mt-2 block text-[8px] uppercase tracking-[0.15em] text-[#4C5435]">
                {loading ? " " : `${setsCount} PIECES`}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCategory("Jackets");
              document
                .getElementById("all-products")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex min-h-[125px] flex-col justify-between overflow-hidden bg-[#292923] p-4 text-left transition duration-300 hover:bg-[#3B3B32] sm:min-h-[175px] sm:p-7"
          >
            <span className="flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.2em] text-white/65">
              THE LAYERING EDIT
              <ArrowUpRight size={17} />
            </span>

            <span>
              <span className="block font-serif text-3xl tracking-[-0.05em] text-white sm:text-5xl">
                Jackets
              </span>
              <span className="mt-2 block text-[8px] uppercase tracking-[0.15em] text-white/55">
                {loading ? " " : `${jacketsCount} PIECES`}
              </span>
            </span>
          </button>
        </div>
      </section>

      {/* Product collection */}
      <section
        id="all-products"
        className="scroll-mt-20 border-t border-[#242421]/10 bg-[#F4F1EA]"
      >
        <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-10 sm:py-20 lg:px-16">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.28em] text-[#858176]">
                <Sparkles size={13} />
                THE TALA LINEUP
              </p>

              <h2 className="font-serif text-4xl tracking-[-0.055em] sm:text-6xl">
                Good things
                <span className="ml-2 italic text-[#929A61]">live here.</span>
              </h2>
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#858176]">
              {loading
                ? "LOADING THE GOOD STUFF..."
                : `${visibleProducts.length} PIECES TO EXPLORE`}
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 flex flex-col gap-4 border-y border-[#242421]/15 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-[390px]">
              <Search
                size={17}
                strokeWidth={1.5}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#858176]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, category or color..."
                aria-label="Search TALA products"
                className="w-full border-b border-[#242421]/30 bg-transparent py-3 pl-8 pr-9 text-xs text-[#242421] outline-none placeholder:text-[#9B968B] focus:border-[#929A61]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[#858176] hover:text-[#242421]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              className="flex min-h-11 items-center justify-between gap-3 border border-[#242421]/20 px-4 text-[9px] font-bold uppercase tracking-[0.16em] transition hover:border-[#242421] sm:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={15} />
                Filters & sorting
              </span>
              <span>{mobileFiltersOpen ? "−" : "+"}</span>
            </button>
          </div>

          {/* Filters and sort */}
          <div
            className={`mb-9 flex-col justify-between gap-5 sm:flex sm:flex-row sm:items-center ${
              mobileFiltersOpen ? "flex" : "hidden"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  ["All", "All pieces"],
                  ["Sets", "Sets"],
                  ["Jackets", "Jackets"],
                ] as [CategoryOption, string][]
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setCategory(value)}
                  aria-pressed={category === value}
                  className={`min-h-10 border px-4 text-[9px] font-bold uppercase tracking-[0.13em] transition ${
                    category === value
                      ? "border-[#242421] bg-[#242421] text-white"
                      : "border-[#242421]/20 bg-transparent text-[#5E5C52] hover:border-[#242421]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#858176]">
              Sort by
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                className="min-h-10 min-w-[155px] border-b border-[#242421]/30 bg-transparent px-2 text-[10px] text-[#242421] outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">New arrivals</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          {search.trim() && (
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[0.14em] text-[#858176]">
              <p>
                RESULTS FOR{" "}
                <span className="font-bold text-[#242421]">
                  “{search.trim()}”
                </span>
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="border-b border-[#242421] pb-1 font-bold text-[#242421]"
              >
                Reset everything
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#E7E3DA]" />
                  <div className="mt-4 h-2.5 w-1/3 bg-[#E7E3DA]" />
                  <div className="mt-3 h-3 w-3/4 bg-[#E7E3DA]" />
                  <div className="mt-3 h-3 w-1/4 bg-[#E7E3DA]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-7 border-b border-[#242421] pb-2 text-[9px] font-bold uppercase tracking-[0.18em]"
              >
                Try again
              </button>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="py-24 text-center">
              <span className="text-3xl text-[#929A61]">✳</span>

              <h3 className="mt-5 font-serif text-4xl tracking-[-0.04em]">
                Nothing here. Yet.
              </h3>

              <p className="mx-auto mt-4 max-w-sm text-xs leading-7 text-[#858176]">
                No pieces match your current search or filters.
                Try a different mood.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-8 bg-[#D8ED83] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#242421] transition hover:bg-[#CDE477]"
              >
                Show me everything
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#858176]">
                  {category === "All" ? "THE COMPLETE EDIT" : `${category} EDIT`}
                </p>

                <p className="text-[8px] uppercase tracking-[0.15em] text-[#858176]">
                  {visibleProducts.length} RESULTS
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-14 lg:grid-cols-4">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Closing statement */}
      <section className="relative mx-5 mb-14 overflow-hidden bg-[#D8ED83] px-6 py-12 sm:mx-10 sm:px-12 sm:py-16 lg:mx-16">
        <span className="pointer-events-none absolute -right-5 -top-20 font-serif text-[210px] leading-none tracking-[-0.1em] text-[#242421]/[0.07] sm:text-[300px]">
          T.
        </span>

        <div className="relative flex flex-col justify-between gap-9 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[8px] font-bold uppercase tracking-[0.25em] text-[#555D3D]">
              THE LOOK IS YOURS
            </p>

            <h2 className="max-w-2xl font-serif text-4xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">
              Wear what
              <span className="ml-2 italic">feels like you.</span>
            </h2>
          </div>

          <Link
            href="/collections"
            className="group inline-flex min-h-12 w-fit items-center gap-7 border-b border-[#242421] pb-2 text-[9px] font-bold uppercase tracking-[0.18em]"
          >
            Explore the edits
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#242421] px-5 py-12 text-center text-[#F4F1EA]">
        <Link
          href="/"
          className="font-serif text-4xl tracking-[0.24em]"
        >
          TALA
        </Link>

        <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.4em] text-white/50">
          LUXURY FASHION
        </p>

        <div className="mx-auto mt-8 h-px max-w-5xl bg-white/15" />

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/60">
          <Link href="/collections/sets" className="transition hover:text-[#D8ED83]">
            Sets
          </Link>

          <Link href="/collections/jackets" className="transition hover:text-[#D8ED83]">
            Jackets
          </Link>

          <Link href="/collections" className="transition hover:text-[#D8ED83]">
            Collections
          </Link>

          <a
            href="https://www.instagram.com/tala__luxury/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-[#D8ED83]"
          >
            <Instagram size={13} />
            Instagram
          </a>
        </div>

        <p className="mt-8 text-[8px] tracking-[0.2em] text-white/35">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
