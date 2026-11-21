
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import type { Product } from "@/data/products";
import { getTalaProducts } from "@/lib/tala-products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setHasError(false);

        const allProducts = await getTalaProducts();

        if (!active) return;

        const newProducts = allProducts
          .filter((product) => product.isNew)
          .sort((a, b) => Number(b.isAvailable) - Number(a.isAvailable));

        setProducts(newProducts);
      } catch (error) {
        console.error("TALA New Arrivals:", error);

        if (active) {
          setHasError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F1EB] text-[#24221F]">
      <header className="border-b border-[#DED7CC] bg-[#F5F1EB]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="font-serif text-3xl font-light tracking-[0.28em]"
          >
            TALA
          </Link>

          <Link
            href="/collections"
            className="inline-flex min-h-10 items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6F675E] transition hover:text-[#89965D]"
          >
            All collections
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#24221F] text-[#F5F1EB]">
        <div className="pointer-events-none absolute -right-32 -top-36 h-[480px] w-[480px] rounded-full border border-white/10 sm:h-[620px] sm:w-[620px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-[#D8ED83]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D8ED83]">
              Fresh from TALA
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-[clamp(3.5rem,10vw,9rem)] font-light leading-[0.88] tracking-[-0.065em]">
            JUST
            <br />
            <span className="italic text-[#D8ED83]">arrived.</span>
          </h1>

          <div className="mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <p className="max-w-lg text-sm leading-8 text-white/55 sm:text-base">
              A fresh perspective on everyday dressing.
              Discover the latest pieces selected for the
              TALA collection.
            </p>

            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
              THE LATEST TALA EDIT
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-[#DED7CC] pb-6">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
              DISCOVER THE LATEST
            </p>

            <h2 className="mt-3 font-serif text-3xl font-light sm:text-4xl">
              New arrivals
            </h2>
          </div>

          {!isLoading && !hasError && (
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#82796F]">
              {products.length}{" "}
              {products.length === 1 ? "PIECE" : "PIECES"}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#E8E2D9]" />
                <div className="mt-4 h-3 w-2/3 bg-[#E8E2D9]" />
                <div className="mt-3 h-3 w-1/3 bg-[#E8E2D9]" />
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="border border-[#DED7CC] bg-white/50 px-6 py-16 text-center">
            <h3 className="font-serif text-2xl font-light">
              We couldn&apos;t load the collection.
            </h3>

            <p className="mt-4 text-sm text-[#82796F]">
              Please try again in a moment.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 bg-[#24221F] px-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#42483B]"
            >
              Try again
              <ArrowRight size={15} />
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="border border-[#DED7CC] bg-white/50 px-6 py-20 text-center">
            <Sparkles
              size={25}
              strokeWidth={1.3}
              className="mx-auto text-[#89965D]"
            />

            <h3 className="mt-6 font-serif text-3xl font-light">
              Something new is on its way.
            </h3>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#82796F]">
              There are no new arrivals at the moment.
              Check back soon for the latest TALA pieces.
            </p>

            <Link
              href="/collections"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 bg-[#24221F] px-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#42483B]"
            >
              Explore collections
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="group min-w-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE5DC]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-[0.2em] text-[#918779]">
                        TALA
                      </div>
                    )}

                    <span className="absolute left-3 top-3 bg-[#D8ED83] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#24221F]">
                      Just arrived
                    </span>

                    {!product.isAvailable && (
                      <span className="absolute bottom-3 left-3 bg-[#24221F]/90 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.15em] text-white">
                        Sold out
                      </span>
                    )}
                  </div>

                  <div className="pt-4">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#89965D]">
                      {product.category}
                    </p>

                    <h3 className="mt-2 line-clamp-2 text-sm font-medium text-[#302A24] transition-colors group-hover:text-[#89965D] sm:text-base">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[#302A24] sm:text-sm">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice &&
                        product.oldPrice > product.price && (
                          <span className="text-[10px] text-[#9A9186] line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#24221F] px-6 py-12 text-center text-[#F5F1EB]">
        <Link
          href="/"
          className="font-serif text-3xl font-light tracking-[0.3em]"
        >
          TALA
        </Link>

        <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/40">
          PLAYFUL BY NATURE. LUXURY BY CHOICE.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[9px] uppercase tracking-[0.15em] text-white/55">
          <Link href="/collections" className="transition hover:text-[#D8ED83]">
            Collections
          </Link>
          <Link href="/sale" className="transition hover:text-[#D8ED83]">
            Sale
          </Link>
          <Link href="/contact" className="transition hover:text-[#D8ED83]">
            Contact
          </Link>
        </div>

        <p className="mt-8 text-[8px] tracking-[0.18em] text-white/30">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
