
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { getTalaProducts } from "@/lib/tala-products";
import type { Product } from "@/data/products";
import { useCartCount } from "@/lib/tala-cart";

type Category = {
  name: string;
  slug: string;
  image_url: string | null;
  mobile_image_url: string | null;
  headline: string | null;
  subtitle: string | null;
};

const FALLBACK_IMAGES = {
  sets: "https://placehold.co/900x1200/E8E0D6/55483D?text=TALA+SETS",
  jackets: "https://placehold.co/900x1200/D9D1C7/55483D?text=TALA+JACKETS",
  all: "https://placehold.co/900x1200/E2DAD0/55483D?text=TALA",
};

export default function CollectionsPage() {
  const cartCount = useCartCount();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const collections = [
    {
      number: "01",
      name: "Sets",
      eyebrow: "THE COORDINATED EDIT",
      description:
        "A considered selection of coordinated pieces, designed to feel effortlessly complete.",
      href: "/collections/sets",
      categorySlug: "sets",
      fallback: FALLBACK_IMAGES.sets,
    },
    {
      number: "02",
      name: "Jackets",
      eyebrow: "THE OUTERWEAR EDIT",
      description:
        "Distinctive outer layers that bring quiet character to every look.",
      href: "/collections/jackets",
      categorySlug: "jackets",
      fallback: FALLBACK_IMAGES.jackets,
    },
    {
      number: "03",
      name: "All Collection",
      eyebrow: "THE COMPLETE EDIT",
      description:
        "Explore every piece currently available in the TALA collection.",
      href: "/collections/all-pieces",
      categorySlug: "all",
      fallback: FALLBACK_IMAGES.all,
    },
  ];

  function getCollectionImage(slug: string, fallback: string) {
    if (slug === "all") {
      return products[0]?.image || fallback;
    }

    const category = categories.find(
      (item) =>
        item.slug?.toLowerCase() === slug ||
        item.name?.toLowerCase() === slug
    );

    if (category?.image_url) return category.image_url;

    const product = products.find(
      (item) => item.category.toLowerCase() === slug
    );

    return product?.image || fallback;
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <div className="bg-[#292521] px-4 py-2.5 text-center text-[9px] tracking-[0.25em] text-white">
        DISCOVER THE WORLD OF TALA
      </div>

      <header className="relative z-20 flex h-[76px] items-center justify-between border-b border-[#E8E0D6] px-5 sm:px-10">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.18em] text-[#776B60]"
        >
          Home
        </Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-2xl font-light tracking-[0.38em]"
        >
          TALA
        </Link>

        <Link
          href="/cart"
          aria-label={`Shopping bag, ${cartCount} items`}
          className="relative"
        >
          <ShoppingBag size={21} strokeWidth={1.3} />
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#292521] px-1 text-[9px] text-white">
            {cartCount}
          </span>
        </Link>
      </header>

      <section className="mx-auto max-w-[1600px] px-5 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="mb-4 text-[9px] uppercase tracking-[0.42em] text-[#A58B68]">
            TALA LUXURY FASHION
          </p>

          <h1 className="font-serif text-4xl font-light tracking-wide sm:text-6xl">
            The Collections
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#81766B]">
            Discover the pieces that define TALA.
            Thoughtfully selected and beautifully considered.
          </p>

          <div className="mx-auto mt-8 h-px w-16 bg-[#B9A58D]" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection, index) => (
            <motion.article
              key={collection.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
              }}
              className="group"
            >
              <Link href={collection.href} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE3D9]">
                  <img
                    src={getCollectionImage(
                      collection.categorySlug,
                      collection.fallback
                    )}
                    alt={`TALA ${collection.name}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.045]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

                  <div className="absolute left-6 top-6 text-[10px] tracking-[0.25em] text-white/80">
                    {collection.number}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                    <p className="mb-4 text-[8px] uppercase tracking-[0.3em] text-white/75">
                      {collection.eyebrow}
                    </p>

                    <h2 className="font-serif text-3xl font-light sm:text-4xl">
                      {collection.name}
                    </h2>

                    <p className="mt-4 max-w-xs text-xs leading-6 text-white/80">
                      {collection.description}
                    </p>

                    <div className="mt-8 flex items-center justify-between border-t border-white/40 pt-5">
                      <span className="text-[9px] uppercase tracking-[0.22em]">
                        Explore collection
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 transition-all duration-300 group-hover:bg-white group-hover:text-[#292521]">
                        <ArrowRight size={16} strokeWidth={1.3} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#E5DDD2] px-5 py-9 text-center">
        <p className="text-[9px] tracking-[0.3em] text-[#A69A8D]">
          TALA LUXURY FASHION
        </p>
      </footer>
    </main>
  );
}
