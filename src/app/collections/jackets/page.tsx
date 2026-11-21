
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  mobile_image_url?: string | null;
  headline?: string | null;
  subtitle?: string | null;
  overlay_opacity?: number | null;
};

type SortOption = "featured" | "price-low" | "price-high";

const FALLBACK_IMAGE =
  "https://placehold.co/1600x1100/E8E2D9/332A23?text=TALA+JACKETS";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
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

        if (!categoriesResponse.ok) {
          throw new Error("Unable to load collection details.");
        }

        const categoriesData = await categoriesResponse.json();

        if (!active) return;

        setProducts(productsData);

        const jacketsCategory = (
          categoriesData.categories ?? []
        ).find(
          (item: CollectionData) =>
            item.slug?.toLowerCase() === "jackets" ||
            item.name?.toLowerCase() === "jackets"
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
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const isJacket =
        product.category?.trim().toLowerCase() === "jackets";

      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.subtitle?.toLowerCase().includes(normalizedSearch);

      return isJacket && matchesSearch;
    });

    if (sort === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, sort]);

  const heroImage =
    collection?.image_url ||
    products.find(
      (product) =>
        product.category?.trim().toLowerCase() === "jackets"
    )?.image ||
    FALLBACK_IMAGE;

  const title =
    collection?.headline?.trim() || "THE JACKET EDIT";

  const subtitle =
    collection?.subtitle?.trim() ||
    "The finishing layer. Strong silhouettes, effortless energy, and pieces made to change the whole look.";

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      <div className="relative z-40 overflow-hidden bg-[#D8ED83] py-2.5">
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

      <Header />

      <section className="relative min-h-[570px] overflow-hidden bg-[#777168] sm:min-h-[690px]">
        <Image
          src={heroImage}
          alt="TALA Jackets Collection"
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10" />

        <div className="relative z-10 mx-auto flex min-h-[570px] max-w-[1600px] flex-col justify-end px-6 pb-14 pt-28 text-white sm:min-h-[690px] sm:px-12 sm:pb-20 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#D8ED83]" />
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/80">
                TALA / COLLECTION 02
              </p>
            </div>

            <h1 className="max-w-4xl font-serif text-6xl font-light leading-[0.98] tracking-[-0.045em] sm:text-8xl lg:text-[112px]">
              {title}
              <span className="text-[#D8ED83]">.</span>
            </h1>

            <div className="mt-7 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <p className="max-w-md text-sm leading-7 text-white/80 sm:text-base">
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
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/60">
              STYLE IS
            </p>
            <p className="mt-1 font-serif text-2xl italic text-white">
              an attitude.
            </p>
          </div>
        </div>
      </section>

      <section
        id="jackets-products"
        className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16"
      >
        <div className="mb-10 flex flex-col justify-between gap-7 border-b border-[#DCD5CB] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8C806F]">
              NOT JUST ANOTHER LAYER
            </p>

            <h2 className="font-serif text-4xl font-light tracking-[-0.035em] sm:text-6xl">
              Jackets
              <span className="ml-2 text-[#A7BD62]">edit.</span>
            </h2>

            <p className="mt-3 text-xs text-[#82796F]">
              Find the piece that pulls it all together.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.17em] text-[#82796F]">
            {loading ? "Loading pieces..." : `${jackets.length} PIECES`}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#82796F]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find your next favourite..."
              className="w-full border-b border-[#CFC6BA] bg-transparent py-3 pl-7 pr-3 text-xs outline-none placeholder:text-[#A49A8F] focus:border-[#24221F]"
            />
          </div>

          <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.16em] text-[#82796F]">
            <SlidersHorizontal size={15} strokeWidth={1.5} />
            Sort by
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              className="min-w-[125px] border-b border-[#CFC6BA] bg-transparent py-2 text-[10px] text-[#24221F] outline-none"
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
              onClick={() => window.location.reload()}
              className="mt-6 border-b border-[#24221F] pb-2 text-[9px] uppercase tracking-[0.2em]"
            >
              Try again
            </button>
          </div>
        ) : jackets.length === 0 ? (
          <div className="py-24 text-center">
            <span className="text-3xl text-[#A7BD62]">✳</span>
            <h3 className="mt-5 font-serif text-4xl font-light">
              Nothing here. Yet.
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-[#82796F]">
              {search
                ? "No jackets match your search. Try another name."
                : "New pieces are on their way. Keep an eye on this space."}
            </p>

            {search ? (
              <button
                onClick={() => setSearch("")}
                className="mt-8 border-b border-[#24221F] pb-2 text-[9px] uppercase tracking-[0.2em]"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/collections/all-pieces"
                className="mt-8 inline-flex items-center gap-3 border-b border-[#24221F] pb-2 text-[9px] uppercase tracking-[0.2em]"
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
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE4DB]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
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

                      {product.oldPrice &&
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

      <section className="mx-5 mb-16 overflow-hidden bg-[#D8ED83] sm:mx-10 lg:mx-16">
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
            className="group inline-flex w-fit items-center gap-5 border-b border-[#24221F] pb-3 text-[9px] font-semibold uppercase tracking-[0.18em]"
          >
            Shop all pieces
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>

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
