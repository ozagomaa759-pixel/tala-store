
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

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

const THEME = {
  page: "#B8AA98",
  surface: "#A99A88",
  stone: "#958675",
  ink: "#292923",
  muted: "#625B50",
  lime: "#D8ED83",
};

const COLLECTIONS = [
  {
    number: "01",
    name: "Sets",
    eyebrow: "THE CO-ORD EDIT",
    description:
      "The art of looking put together, without trying too hard.",
    href: "/collections/sets",
    categorySlug: "sets",
    accent: "NEW SEASON",
    className: "md:col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    number: "02",
    name: "Jackets",
    eyebrow: "THE LAYERING EDIT",
    description:
      "The finishing touch. The statement piece. Your kind of layer.",
    href: "/collections/jackets",
    categorySlug: "jackets",
    accent: "THE OUTERWEAR EDIT",
    className: "md:col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    number: "03",
    name: "All Collection",
    eyebrow: "THE TALA UNIVERSE",
    description:
      "Every piece, every mood. Find what feels like you.",
    href: "/collections/all-pieces",
    categorySlug: "all",
    accent: "EXPLORE EVERYTHING",
    className: "md:col-span-2",
    aspect: "aspect-[16/9]",
  },
];

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function isValidImage(value?: string | null) {
  if (!value || typeof value !== "string") return false;

  const image = value.trim().toLowerCase();

  return (
    (image.startsWith("https://") || image.startsWith("/")) &&
    !image.includes("placehold.co") &&
    !image.includes("placeholder")
  );
}

function CollectionVisual({
  image,
  name,
  number,
  accent,
}: {
  image?: string | null;
  name: string;
  number: string;
  accent: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image]);

  const showImage = isValidImage(image) && !failed;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: THEME.surface }}
    >
      {showImage ? (
        <img
          src={image!}
          alt={`TALA ${name}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
        />
      ) : (
        <div
          className="relative flex h-full w-full items-center justify-center overflow-hidden"
          style={{ backgroundColor: THEME.surface }}
        >
          <div className="absolute -right-16 -top-20 h-[340px] w-[340px] rounded-full border border-[#292923]/15" />
          <div className="absolute -right-4 -top-8 h-[240px] w-[240px] rounded-full border border-[#292923]/15" />
          <div className="absolute -bottom-32 -left-20 h-[360px] w-[360px] rounded-full border border-[#292923]/15" />
          <span className="font-serif text-[clamp(6rem,18vw,15rem)] font-light tracking-[-0.12em] text-[#292923]/10">
            T.
          </span>
          <span className="absolute bottom-8 left-8 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#292923]/55">
            TALA / {name}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/10 transition-colors duration-500 group-hover:from-black/75" />

      <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
        <span className="rounded-full border border-white/50 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          {accent}
        </span>

        <span className="text-[10px] font-medium tracking-[0.18em] text-white">
          {number}
        </span>
      </div>
    </div>
  );
}

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

        const result = response.ok ? await response.json() : null;

        if (!active) return;

        setProducts(productsData);

        if (result?.success && Array.isArray(result.categories)) {
          setCategories(result.categories);
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

  const collectionData = useMemo(() => {
    return COLLECTIONS.map((collection) => {
      const category = categories.find(
        (item) =>
          normalize(item.slug) === collection.categorySlug ||
          normalize(item.name) === collection.categorySlug
      );

      const matchingProducts =
        collection.categorySlug === "all"
          ? products
          : products.filter(
              (product) =>
                normalize(product.category) === collection.categorySlug
            );

      const productImage = matchingProducts
        .flatMap((product) => [
          product.image,
          ...(product.images ?? []),
        ])
        .find((image) => isValidImage(image));

      const image =
        (isValidImage(category?.image_url) && category?.image_url) ||
        productImage ||
        null;

      return {
        ...collection,
        image,
        count: matchingProducts.length,
        headline: category?.headline?.trim() || collection.eyebrow,
        description:
          category?.subtitle?.trim() || collection.description,
      };
    });
  }, [categories, products]);

  return (
    <main
      className="min-h-screen overflow-hidden text-[#292923]"
      style={{ backgroundColor: THEME.page }}
    >
      <Header />

      {/* Announcement */}
      <div className="overflow-hidden border-b border-[#292923]/15 bg-[#D8ED83] py-2.5 text-[#292923]">
        <div className="flex w-max animate-[tala-marquee_28s_linear_infinite] items-center gap-9 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="text-[9px] font-bold uppercase tracking-[0.22em]"
            >
              YOUR STYLE. YOUR RULES.
              <span className="mx-4">✳</span>
              DISCOVER TALA
              <span className="mx-4">✳</span>
              MADE TO BE YOURS
              <span className="mx-4">✳</span>
            </span>
          ))}
        </div>
      </div>

      {/* Intro */}
      <section className="mx-auto max-w-[1600px] px-5 pb-12 pt-14 sm:px-10 sm:pb-20 sm:pt-24 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#625B50]">
              TALA / THE COLLECTIONS
            </p>

            <p className="hidden text-[9px] uppercase tracking-[0.2em] text-[#625B50] sm:block">
              A LITTLE DIFFERENT. ALWAYS TALA.
            </p>
          </div>

          <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_0.5fr]">
            <div>
              <p className="mb-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-[#625B50]">
                <Sparkles size={13} />
                THE WORLD OF TALA
              </p>

              <h1 className="max-w-5xl font-serif text-[clamp(3.8rem,10vw,9rem)] font-normal leading-[0.84] tracking-[-0.065em]">
                Find your
                <span className="ml-3 inline-block italic text-[#292923]/65">
                  kind.
                </span>
              </h1>

              <div className="mt-9 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#D8ED83]" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em]">
                  THREE EDITS. ONE TALA.
                </p>
              </div>
            </div>

            <div className="max-w-[280px] lg:justify-self-end lg:pb-2">
              <p className="text-sm leading-7 text-[#625B50]">
                Not just what you wear.
                <br />
                It&apos;s how you make it yours.
                <br />
                Explore the edits and find your next favourite.
              </p>

              <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em]">
                SCROLL TO EXPLORE
                <ArrowDownRight className="ml-2 inline-block" size={15} />
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Collection cards */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-10 sm:pb-28 lg:px-16">
        <div className="mb-6 flex items-center justify-between border-t border-[#292923]/20 pt-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em]">
            THE EDITS
          </p>

          <p className="text-[9px] uppercase tracking-[0.16em] text-[#625B50]">
            {loading
              ? "LOADING..."
              : `${products.length} PIECES AVAILABLE`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">
          {collectionData.map((collection, index) => (
            <motion.article
              key={collection.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
              }}
              className={`group ${collection.className}`}
            >
              <Link
                href={collection.href}
                className="block"
                aria-label={`Explore ${collection.name}`}
              >
                <div
                  className={`relative overflow-hidden ${collection.aspect}`}
                  style={{ backgroundColor: THEME.surface }}
                >
                  <CollectionVisual
                    image={collection.image}
                    name={collection.name}
                    number={collection.number}
                    accent={collection.accent}
                  />

                  <div
                    className={`absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9 ${
                      collection.categorySlug === "all"
                        ? "sm:flex sm:items-end sm:justify-between"
                        : ""
                    }`}
                  >
                    <div className="max-w-xl">
                      <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.3em] text-white/75">
                        {collection.headline}
                      </p>

                      <h2
                        className={`font-serif font-normal leading-none tracking-[-0.045em] ${
                          collection.categorySlug === "all"
                            ? "text-5xl sm:text-7xl lg:text-8xl"
                            : "text-5xl sm:text-6xl"
                        }`}
                      >
                        {collection.name}
                      </h2>

                      <p className="mt-4 max-w-sm text-xs leading-6 text-white/80 sm:text-sm">
                        {collection.description}
                      </p>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/40 pt-4 transition-colors group-hover:border-[#D8ED83] sm:mt-8 sm:pt-5">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em]">
                          EXPLORE THE EDIT
                        </p>

                        <p className="mt-1 text-[9px] text-white/65">
                          {loading
                            ? "Discover TALA"
                            : `${collection.count} ${
                                collection.count === 1 ? "PIECE" : "PIECES"
                              }`}
                        </p>
                      </div>

                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 transition-all duration-300 group-hover:border-[#D8ED83] group-hover:bg-[#D8ED83] group-hover:text-[#292923]">
                        <ArrowUpRight size={19} strokeWidth={1.4} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Closing statement */}
      <section className="border-t border-[#292923]/15 px-5 py-20 text-center sm:py-28" style={{ backgroundColor: THEME.surface }}>
        <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.3em] text-[#625B50]">
          MORE THAN A LOOK
        </p>

        <h2 className="font-serif text-4xl font-normal leading-tight tracking-[-0.04em] sm:text-6xl">
          Make it
          <span className="ml-2 italic text-[#292923]/60">your</span>
          <br />
          own thing.
        </h2>

        <p className="mx-auto mt-6 max-w-sm text-xs leading-7 text-[#625B50]">
          Your wardrobe, your mood, your way.
          Find the pieces that feel like you.
        </p>

        <Link
          href="/collections/all-pieces"
          className="mt-8 inline-flex items-center gap-4 bg-[#292923] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#B8AA98] transition-colors hover:bg-[#D8ED83] hover:text-[#292923]"
        >
          SHOP ALL PIECES
          <ArrowUpRight size={15} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#292923] px-5 py-10 text-center text-[#B8AA98]">
        <Link
          href="/"
          className="font-serif text-3xl tracking-[0.22em] text-white"
        >
          TALA
        </Link>

        <p className="mt-2 text-[8px] tracking-[0.4em] text-white/55">
          LUXURY FASHION
        </p>

        <div className="mx-auto mt-7 h-px max-w-5xl bg-white/15" />

        <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[8px] uppercase tracking-[0.18em] text-white/55">
          <Link href="/collections/sets" className="hover:text-[#D8ED83]">
            Sets
          </Link>
          <Link href="/collections/jackets" className="hover:text-[#D8ED83]">
            Jackets
          </Link>
          <Link href="/collections/all-pieces" className="hover:text-[#D8ED83]">
            All Collection
          </Link>
        </div>

        <p className="mt-6 text-[8px] tracking-[0.2em] text-white/35">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
