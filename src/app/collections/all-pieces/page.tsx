
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

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "newest";

const FALLBACK_IMAGE =
  "https://placehold.co/1600x1100/E8E2D9/332A23?text=TALA+COLLECTION";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AllPiecesCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("featured");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getTalaProducts();

        if (active) {
          setProducts(data);
        }
      } catch {
        if (active) {
          setError("Unable to load the collection. Please try again.");
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

  const allProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let filtered = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category?.toLowerCase().includes(normalizedSearch) ||
        product.subtitle?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      filtered = [...filtered].sort(
        (a, b) => Number(b.isNew) - Number(a.isNew)
      );
    }

    return filtered;
  }, [products, category, search, sort]);

  const heroImage = products[0]?.image || FALLBACK_IMAGE;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
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

      <section className="relative min-h-[540px] overflow-hidden bg-[#777168] sm:min-h-[680px]">
        <Image
          src={heroImage}
          alt="TALA complete collection"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/10" />

        <div className="relative z-10 mx-auto flex min-h-[540px] max-w-[1600px] flex-col justify-end px-6 pb-14 pt-28 text-white sm:min-h-[680px] sm:px-12 sm:pb-20 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#D8ED83]" />
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/80">
                TALA / THE FULL STORY
              </p>
            </div>

            <h1 className="max-w-4xl font-serif text-6xl font-light leading-[0.98] tracking-[-0.045em] sm:text-8xl lg:text-[112px]">
              ALL THE
              <br />
              GOOD
              <span className="text-[#D8ED83]"> STUFF.</span>
            </h1>

            <div className="mt-7 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <p className="max-w-md text-sm leading-7 text-white/80 sm:text-base">
                Every piece, every mood, every little detail. Explore the
                complete TALA collection and find the ones that feel like you.
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
        </div>
      </section>

      <section
        id="all-products"
        className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-24 lg:px-16"
      >
        <div className="mb-10 flex flex-col justify-between gap-7 border-b border-[#DCD5CB] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8C806F]">
              THE WORLD OF TALA
            </p>

            <h2 className="font-serif text-4xl font-light tracking-[-0.035em] sm:text-6xl">
              The complete
              <span className="ml-2 text-[#A7BD62]">edit.</span>
            </h2>

            <p className="mt-3 text-xs text-[#82796F]">
              All the pieces. One place.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.17em] text-[#82796F]">
            {loading ? "Loading pieces..." : `${allProducts.length} PIECES`}
          </p>
        </div>

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
              className="w-full border-b border-[#CFC6BA] bg-transparent py-3 pl-7 pr-3 text-xs outline-none placeholder:text-[#A49A8F] focus:border-[#24221F]"
            />
          </div>

          <div className="flex flex-col justify-between gap-4 border-b border-[#DCD5CB] pb-5 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#82796F]">
                <SlidersHorizontal size={14} />
                Filter
              </span>

              {categories.map((item) => (
                <button
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
        ) : allProducts.length === 0 ? (
          <div className="py-24 text-center">
            <span className="text-3xl text-[#A7BD62]">✳</span>
            <h3 className="mt-5 font-serif text-4xl font-light">
              No pieces found.
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-[#82796F]">
              Try changing your search or selecting another category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-8 border-b border-[#24221F] pb-2 text-[9px] uppercase tracking-[0.2em]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
            {allProducts.map((product, index) => (
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
              YOUR STYLE DOESN'T STAND STILL
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
