"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag, X } from "lucide-react";
import type { Product } from "@/data/products";
import { getTalaProducts } from "@/lib/tala-products";

const FAVORITES_STORAGE_KEY = "tala-favorites";

type LoadState = "loading" | "ready" | "error";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed.filter(
          (value): value is string => typeof value === "string"
        )
      )
    );
  } catch (error) {
    console.error("TALA: Unable to read wishlist.", error);
    return [];
  }
}

function writeFavorites(favorites: string[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.error("TALA: Unable to save wishlist.", error);
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    setFavorites(readFavorites());

    const syncFavorites = () => setFavorites(readFavorites());
    window.addEventListener("storage", syncFavorites);

    return () => window.removeEventListener("storage", syncFavorites);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const result = await getTalaProducts();
        if (isMounted) {
          setProducts(result);
          setLoadState("ready");
        }
      } catch (error) {
        console.error("TALA: Unable to load wishlist products.", error);
        if (isMounted) setLoadState("error");
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.includes(product.id)),
    [products, favorites]
  );

  const removeFavorite = useCallback((productId: string) => {
    setRemovingId(productId);
    setFavorites((current) => {
      const updated = current.filter((id) => id !== productId);
      writeFavorites(updated);
      return updated;
    });
    window.setTimeout(() => setRemovingId(null), 220);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-10 text-[#332A23] sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8B7867] transition-colors hover:text-[#332A23]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <header className="mx-auto mb-12 mt-14 max-w-2xl text-center sm:mb-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Heart size={30} strokeWidth={1.2} className="mx-auto mb-6 text-[#A58A6D]" />
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] text-[#A58A6D]">
              TALA LUXURY FASHION
            </p>
            <h1 className="mb-5 text-4xl font-light tracking-wide sm:text-6xl">
              Your Wishlist
            </h1>
            <p className="text-sm leading-7 text-[#81766D] sm:text-base">
              The pieces you love, gathered in one place.
            </p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-[#9A8E82]">
              {favorites.length} {favorites.length === 1 ? "saved piece" : "saved pieces"}
            </p>
          </motion.div>
        </header>

        {loadState === "loading" ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#EAE3DA]" />
                <div className="mt-4 h-3 w-2/3 bg-[#EAE3DA]" />
                <div className="mt-3 h-3 w-1/3 bg-[#EAE3DA]" />
              </div>
            ))}
          </div>
        ) : loadState === "error" ? (
          <section className="mx-auto max-w-xl border border-[#E8E0D6] bg-white px-7 py-14 text-center">
            <Heart size={28} className="mx-auto mb-5 text-[#A58A6D]" />
            <h2 className="mb-3 text-2xl font-light">We couldn’t load your saved pieces</h2>
            <p className="text-sm leading-7 text-[#81766D]">
              Please refresh the page and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-7 bg-[#332A23] px-8 py-4 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#514237]"
            >
              Try again
            </button>
          </section>
        ) : favoriteProducts.length === 0 ? (
          <section className="mx-auto max-w-xl border border-[#E8E0D6] bg-white px-7 py-14 text-center sm:py-16">
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#F3EEE7]">
              <Heart size={29} strokeWidth={1.2} className="text-[#A58A6D]" />
            </div>
            <h2 className="mb-4 text-2xl font-light">Your wishlist is waiting</h2>
            <p className="mx-auto mb-9 max-w-sm text-sm leading-7 text-[#81766D]">
              Save the pieces that speak to you and they’ll be waiting here whenever you return.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-3 bg-[#332A23] px-8 py-4 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#514237]"
            >
              <ShoppingBag size={16} />
              Explore Collection
            </Link>
          </section>
        ) : (
          <>
            <div className="mb-7 flex items-center justify-between border-b border-[#E2D9CF] pb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#81766D]">
                Your selected pieces
              </p>
              <Link
                href="/products"
                className="text-xs uppercase tracking-[0.16em] text-[#8B6F50] underline underline-offset-4 transition-colors hover:text-[#332A23]"
              >
                Continue exploring
              </Link>
            </div>

            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-7 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {favoriteProducts.map((product) => (
                  <motion.article
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.28 }}
                    className="group min-w-0"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE3DA]">
                      <Link
                        href={`/products/${encodeURIComponent(product.slug || product.id)}`}
                        aria-label={`View ${product.name}`}
                        className="absolute inset-0 z-0"
                      >
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs tracking-widest text-[#9A8E82]">
                            TALA
                          </div>
                        )}
                      </Link>
                      {product.isNew && (
                        <span className="pointer-events-none absolute left-3 top-3 z-10 bg-white/90 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[#514237]">
                          New
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFavorite(product.id)}
                        disabled={removingId === product.id}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#332A23] shadow-sm transition-all hover:scale-105 hover:bg-[#332A23] hover:text-white disabled:opacity-50"
                      >
                        <X size={16} strokeWidth={1.6} />
                      </button>
                    </div>

                    <div className="pt-4">
                      <Link
                        href={`/products/${encodeURIComponent(product.slug || product.id)}`}
                        className="block truncate text-sm tracking-wide text-[#332A23] transition-colors hover:text-[#8B6F50] sm:text-base"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-2 text-xs text-[#8B7867]">
                        {formatPrice(product.price)}
                      </p>
                      <Link
                        href={`/products/${encodeURIComponent(product.slug || product.id)}`}
                        className="mt-4 inline-flex items-center gap-2 border-b border-[#B8A999] pb-1 text-[10px] uppercase tracking-[0.18em] text-[#514237] transition-colors hover:border-[#332A23] hover:text-[#332A23]"
                      >
                        View piece
                        <ArrowLeft size={12} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        <footer className="mt-20 border-t border-[#E2D9CF] pt-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#9A8E82]">
            TALA — Thoughtfully selected, timelessly worn
          </p>
        </footer>
      </div>
    </main>
  );
}
