
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import Header from "@/components/layout/Header";
import { getTalaProducts } from "@/lib/tala-products";
import type { Product } from "@/data/products";

type Category = {
  name: string;
  slug: string;
  image_url: string | null;
  mobile_image_url: string | null;
  headline: string | null;
  subtitle: string | null;
};

const FALLBACK_IMAGES = {
  sets: "https://placehold.co/1000x1300/E8E0D6/55483D?text=TALA+SETS",
  jackets: "https://placehold.co/1000x1300/D9D1C7/55483D?text=TALA+JACKETS",
  all: "https://placehold.co/1000x1300/E2DAD0/55483D?text=TALA",
};

const collections = [
  {
    number: "01",
    name: "Sets",
    eyebrow: "THE CO-ORD EDIT",
    description: "The art of looking put together, without trying too hard.",
    href: "/collections/sets",
    categorySlug: "sets",
    accent: "NEW SEASON",
    layout: "large",
  },
  {
    number: "02",
    name: "Jackets",
    eyebrow: "THE LAYERING EDIT",
    description: "The finishing touch. The statement piece. Your kind of layer.",
    href: "/collections/jackets",
    categorySlug: "jackets",
    accent: "THE OUTERWEAR EDIT",
    layout: "small",
  },
  {
    number: "03",
    name: "All Collection",
    eyebrow: "THE TALA UNIVERSE",
    description: "Every piece, every mood. Find what feels like you.",
    href: "/collections/all-pieces",
    categorySlug: "all",
    accent: "EXPLORE EVERYTHING",
    layout: "wide",
  },
];

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [productsData, response] = await Promise.all([
          getTalaProducts(),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        const result = await response.json();

        if (!active) return;

        setProducts(productsData);

        if (response.ok && result.success) {
          setCategories(result.categories ?? []);
        }
      } catch (error) {
        console.error("Collections loading error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  function getCategory(slug: string) {
    return categories.find(
      (category) =>
        category.slug?.toLowerCase() === slug ||
        category.name?.toLowerCase() === slug
    );
  }

  function getCollectionImage(slug: string) {
    if (slug === "all") {
      return products[0]?.image || FALLBACK_IMAGES.all;
    }

    const category = getCategory(slug);

    if (category?.image_url) return category.image_url;

    const product = products.find(
      (item) => item.category?.toLowerCase() === slug
    );

    if (product?.image) return product.image;

    return FALLBACK_IMAGES[slug as keyof typeof FALLBACK_IMAGES];
  }

  function getCollectionCount(slug: string) {
    if (slug === "all") return products.length;

    return products.filter(
      (product) => product.category?.toLowerCase() === slug
    ).length;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      <Header />

      {/* Moving announcement */}
      <div className="overflow-hidden border-b border-[#24221F]/10 bg-[#D8ED83] py-2.5">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
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
              YOUR STYLE. YOUR RULES. <span className="mx-3">✳</span>
              DISCOVER TALA <span className="mx-3">✳</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 pb-12 pt-14 sm:px-10 sm:pb-20 sm:pt-24 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="mb-7 flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#77716A]">
              TALA / THE COLLECTIONS
            </p>

            <p className="hidden text-[9px] uppercase tracking-[0.2em] text-[#77716A] sm:block">
              A LITTLE DIFFERENT. ALWAYS TALA.
            </p>
          </div>

          <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_0.5fr]">
            <div>
              <h1 className="max-w-5xl font-serif text-[clamp(3.5rem,10vw,9rem)] font-normal leading-[0.85] tracking-[-0.065em]">
                Find your
                <span className="ml-3 inline-block italic text-[#888078]">
                  kind.
                </span>
              </h1>

              <div className="mt-8 flex items-center gap-3 sm:mt-10">
                <span className="h-2 w-2 rounded-full bg-[#D8ED83]" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em]">
                  THE TALA COLLECTIONS
                </p>
              </div>
            </div>

            <div className="max-w-[280px] lg:justify-self-end lg:pb-2">
              <p className="text-sm leading-7 text-[#77716A]">
                Not just what you wear.
                <br />
                It&apos;s how you make it yours.
                <br />
                Explore the edits and find your next favourite.
              </p>

              <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em]">
                SCROLL TO EXPLORE
                <ArrowDownRight
                  className="ml-2 inline-block"
                  size={15}
                />
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Collection cards */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-10 sm:pb-28 lg:px-16">
        <div className="mb-6 flex items-center justify-between border-t border-[#24221F]/15 pt-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em]">
            THE EDITS
          </p>

          <p className="text-[9px] uppercase tracking-[0.16em] text-[#77716A]">
            {loading ? "LOADING..." : `${products.length} PIECES AVAILABLE`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">
          {collections.map((collection, index) => {
            const category = getCategory(collection.categorySlug);
            const image = getCollectionImage(collection.categorySlug);
            const count = getCollectionCount(collection.categorySlug);

            return (
              <motion.article
                key={collection.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                }}
                className={`group ${
                  collection.layout === "wide" ? "md:col-span-2" : ""
                }`}
              >
                <Link
                  href={collection.href}
                  className="block"
                  aria-label={`Explore ${collection.name}`}
                >
                  <div
                    className={`relative overflow-hidden bg-[#E6DED3] ${
                      collection.layout === "wide"
                        ? "aspect-[16/8] sm:aspect-[2.3/1]"
                        : "aspect-[4/5]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`TALA ${collection.name}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/10 transition-opacity duration-500 group-hover:from-black/70" />

                    {/* Top labels */}
                    <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
                      <span className="rounded-full border border-white/50 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                        {collection.accent}
                      </span>

                      <span className="text-[10px] font-medium tracking-[0.18em] text-white">
                        {collection.number}
                      </span>
                    </div>

                    {/* Collection information */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9 ${
                        collection.layout === "wide"
                          ? "sm:flex sm:items-end sm:justify-between"
                          : ""
                      }`}
                    >
                      <div className="max-w-xl">
                        <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.3em] text-white/75">
                          {category?.headline || collection.eyebrow}
                        </p>

                        <h2
                          className={`font-serif font-normal leading-none tracking-[-0.04em] ${
                            collection.layout === "wide"
                              ? "text-5xl sm:text-7xl lg:text-8xl"
                              : "text-5xl sm:text-6xl"
                          }`}
                        >
                          {collection.name}
                        </h2>

                        <p className="mt-4 max-w-sm text-xs leading-6 text-white/80 sm:text-sm">
                          {category?.subtitle || collection.description}
                        </p>
                      </div>

                      <div className="mt-7 flex items-center justify-between border-t border-white/40 pt-4 sm:mt-8 sm:pt-5 sm:group-hover:border-white/70">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.2em]">
                            EXPLORE THE EDIT
                          </p>

                          <p className="mt-1 text-[9px] text-white/65">
                            {loading
                              ? "Discover TALA"
                              : `${count} ${count === 1 ? "PIECE" : "PIECES"}`}
                          </p>
                        </div>

                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 transition-all duration-300 group-hover:border-[#D8ED83] group-hover:bg-[#D8ED83] group-hover:text-[#24221F]">
                          <ArrowUpRight size={19} strokeWidth={1.4} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Closing statement */}
      <section className="border-t border-[#24221F]/10 bg-[#EDE8DF] px-5 py-20 text-center sm:py-28">
        <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.3em] text-[#77716A]">
          MORE THAN A LOOK
        </p>

        <h2 className="font-serif text-4xl font-normal leading-tight tracking-[-0.04em] sm:text-6xl">
          Make it
          <span className="ml-2 italic text-[#81796E]">your</span>
          <br />
          own thing.
        </h2>

        <p className="mx-auto mt-6 max-w-sm text-xs leading-7 text-[#77716A]">
          Your wardrobe, your mood, your way.
          Find the pieces that feel like you.
        </p>

        <Link
          href="/collections/all-pieces"
          className="mt-8 inline-flex items-center gap-4 bg-[#24221F] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F5F1EB] transition-colors hover:bg-[#D8ED83] hover:text-[#24221F]"
        >
          SHOP ALL PIECES
          <ArrowUpRight size={15} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#24221F] px-5 py-9 text-center text-[#F5F1EB]">
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
