
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

import { getTalaProducts } from "@/lib/tala-products";
import type { Product } from "@/data/products";
import { useCartCount } from "@/lib/tala-cart";

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
  "https://placehold.co/1600x1000/F0EAE1/55483D?text=TALA+JACKETS";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function JacketsCollectionPage() {
  const cartCount = useCartCount();

  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] =
    useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCollection() {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesResponse] =
          await Promise.all([
            getTalaProducts(),
            fetch("/api/categories", {
              cache: "no-store",
            }),
          ]);

        const categoriesData = await categoriesResponse.json();

        if (!categoriesResponse.ok || !categoriesData.success) {
          throw new Error("Unable to load collection details.");
        }

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

  const jackets = useMemo(
    () => products.filter((product) => product.category === "Jackets"),
    [products]
  );

  const heroImage =
    collection?.image_url || jackets[0]?.image || FALLBACK_IMAGE;

  const title =
    collection?.headline?.trim() || "THE JACKET EDIT";

  const subtitle =
    collection?.subtitle?.trim() ||
    "Distinctive outer layers, thoughtfully selected to bring quiet character to every look.";

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <header className="relative z-20 flex h-[76px] items-center justify-between border-b border-[#E8E0D6] px-5 sm:px-10">
        <Link
          href="/collections"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#776B60]"
        >
          <ArrowLeft size={15} strokeWidth={1.3} />
          Collections
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

      <section className="relative flex min-h-[510px] items-end overflow-hidden bg-[#817568] sm:min-h-[620px]">
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
            opacity:
              (collection?.overlay_opacity ?? 35) / 100,
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 text-white sm:px-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-5 text-[9px] uppercase tracking-[0.38em] text-white/75">
              TALA LUXURY FASHION — COLLECTION 02
            </p>

            <h1 className="max-w-3xl font-serif text-5xl font-light leading-[1.1] tracking-wide sm:text-7xl">
              {title}
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/85">
              {subtitle}
            </p>

            <a
              href="#collection-products"
              className="mt-9 inline-flex items-center gap-4 border-b border-white/70 pb-3 text-[9px] font-medium uppercase tracking-[0.24em] transition-all hover:gap-6"
            >
              Discover the collection
              <ArrowRight size={15} strokeWidth={1.3} />
            </a>
          </motion.div>
        </div>
      </section>

      <section
        id="collection-products"
        className="mx-auto max-w-[1500px] px-5 py-16 sm:px-10 sm:py-24"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-[#DED5C9] pb-7">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-[#A58B68]">
              THE TALA EDIT
            </p>
            <h2 className="font-serif text-3xl font-light sm:text-4xl">
              Jackets Collection
            </h2>
          </div>

          <p className="text-[10px] uppercase tracking-[0.16em] text-[#81766B]">
            {loading ? "Loading pieces..." : `${jackets.length} PIECES`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#EAE3D9]" />
                <div className="mt-4 h-3 w-2/3 bg-[#EAE3D9]" />
                <div className="mt-3 h-3 w-1/3 bg-[#EAE3D9]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#8B5148]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 border-b border-[#8B7865] pb-1 text-[10px] uppercase tracking-widest"
            >
              Try again
            </button>
          </div>
        ) : jackets.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-serif text-3xl font-light">
              Coming Soon
            </h3>
            <p className="mt-4 text-sm text-[#81766B]">
              New pieces are being prepared for this collection.
            </p>
            <Link
              href="/collections/all-pieces"
              className="mt-8 inline-flex items-center gap-3 border-b border-[#A58B68] pb-2 text-[10px] uppercase tracking-widest"
            >
              Explore all pieces
              <ArrowRight size={14} />
            </Link>
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
                  duration: 0.55,
                  delay: (index % 4) * 0.07,
                }}
                className="group min-w-0"
              >
                <Link
                  href={`/products/${encodeURIComponent(product.slug || product.id)}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EEE8DF]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                    />

                    {!product.isAvailable && (
                      <span className="absolute left-3 top-3 bg-white/90 px-3 py-2 text-[8px] uppercase tracking-[0.16em] text-[#5F554B]">
                        Sold Out
                      </span>
                    )}

                    {product.isNew && (
                      <span className="absolute right-3 top-3 bg-[#292521] px-3 py-2 text-[8px] uppercase tracking-[0.16em] text-white">
                        New
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowRight size={17} strokeWidth={1.3} />
                    </span>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-[11px] font-medium tracking-[0.04em] text-[#40372F] sm:text-xs">
                      {product.name}
                    </h3>

                    {product.subtitle && (
                      <p className="mt-1.5 line-clamp-1 text-[10px] text-[#8B8075]">
                        {product.subtitle}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium text-[#40372F]">
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

      <footer className="border-t border-[#E5DDD2] px-5 py-9 text-center">
        <Link
          href="/collections"
          className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-[#776B60] transition hover:text-[#292521]"
        >
          View all collections
          <ArrowRight size={14} />
        </Link>
        <p className="mt-5 text-[9px] tracking-[0.25em] text-[#A69A8D]">
          TALA LUXURY FASHION
        </p>
      </footer>
    </main>
  );
}
