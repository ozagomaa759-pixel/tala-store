
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";

import { useCartCount } from "@/lib/tala-cart";
import { getTalaProducts } from "@/lib/tala-products";
import type { Product } from "@/data/products";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  mobile_image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  mobile_image_url: string | null;
  subtitle: string;
  headline: string;
  sort_order: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const collections = [
  {
    name: "SETS",
    subtitle: "THE ART OF PUTTING IT TOGETHER",
    href: "/collections/sets",
    number: "01",
    background: "from-[#A99B8B] to-[#51483F]",
  },
  {
    name: "JACKETS",
    subtitle: "A LAYER ABOVE THE ORDINARY",
    href: "/collections/jackets",
    number: "02",
    background: "from-[#77766B] to-[#30332F]",
  },
];

export default function HomePage() {
  const cartCount = useCartCount();
  const reducedMotion = useReducedMotion();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeHero = heroSlides[heroIndex];

  const heroImage =
    activeHero?.image_url ||
    products.find((product) => product.image)?.image ||
    "";

  const heroTitle =
    activeHero?.title?.trim() || "NOT HERE TO BLEND IN.";

  const heroSubtitle =
    activeHero?.subtitle?.trim() || "A DIFFERENT KIND OF EVERYDAY.";

  const heroDescription =
    activeHero?.description?.trim() ||
    "Clothes with character. Details with intention. A style that speaks before you do.";

  const heroButton =
    activeHero?.button_text?.trim() || "DISCOVER THE COLLECTION";

  const heroLink =
    activeHero?.button_link || "/collections/all-pieces";

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const [productData, categoryResponse, heroResponse] =
          await Promise.all([
            getTalaProducts(),
            fetch("/api/categories", { cache: "no-store" }),
            fetch("/api/hero", { cache: "no-store" }),
          ]);

        if (!mounted) return;

        setProducts(Array.isArray(productData) ? productData : []);

        if (categoryResponse.ok) {
          const result = await categoryResponse.json();

          if (result.success && Array.isArray(result.categories)) {
            const validCategories = result.categories
              .filter(
                (item: Category) =>
                  item &&
                  typeof item.id === "string" &&
                  typeof item.name === "string"
              )
              .sort(
                (a: Category, b: Category) =>
                  (a.sort_order || 0) - (b.sort_order || 0)
              );

            setCategories(validCategories);
          }
        }

        if (heroResponse.ok) {
          const result = await heroResponse.json();

          if (result.success && Array.isArray(result.slides)) {
            const validSlides = result.slides
              .filter(
                (slide: HeroSlide) =>
                  slide &&
                  typeof slide.id === "string" &&
                  typeof slide.image_url === "string" &&
                  slide.image_url.trim().length > 0
              )
              .sort(
                (a: HeroSlide, b: HeroSlide) =>
                  a.sort_order - b.sort_order
              );

            setHeroSlides(validSlides);
          }
        }
      } catch (error) {
        console.error("TALA homepage error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (heroSlides.length < 2) return;

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  const featuredProducts = [...products]
    .sort(
      (a, b) => Number(b.isFeatured) - Number(a.isFeatured)
    )
    .slice(0, 4);

  const categoryMap = new Map(
    categories.map((category) => [
      category.slug?.toLowerCase() || category.name.toLowerCase(),
      category,
    ])
  );

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Sets", href: "/collections/sets" },
    { label: "Jackets", href: "/collections/jackets" },
    { label: "All Collection", href: "/collections/all-pieces" },
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <main className="overflow-hidden bg-[#F5F1EB] text-[#24221F]">

      {/* HERO */}
      <section className="relative min-h-[680px] h-[calc(100svh-34px)] max-h-[1000px] overflow-hidden bg-[#24221F] text-white">

        <AnimatePresence mode="sync" initial={false}>
          {heroImage && (
            <motion.div
              key={heroImage}
              initial={reducedMotion ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 1.2,
                ease: EASE,
              }}
              className="absolute inset-0"
            >
              <picture>
                {activeHero?.mobile_image_url && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={activeHero.mobile_image_url}
                  />
                )}
                <img
                  src={heroImage}
                  alt="TALA fashion campaign"
                  className="h-full w-full object-cover object-center"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </motion.div>
          )}
        </AnimatePresence>

        {!heroImage && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,#777064_0%,#403B35_48%,#24221F_100%)]" />
        )}

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        {/* TOP NAVIGATION */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 pt-7 sm:px-10 md:px-16">

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            className="flex h-11 w-11 items-center justify-center border border-white/50 transition hover:bg-white hover:text-[#24221F]"
          >
            <Menu size={21} strokeWidth={1.4} />
          </button>

          <Link
            href="/"
            aria-label="TALA home"
            className="text-[30px] font-light tracking-[0.34em] sm:text-4xl"
          >
            TALA
          </Link>

          <Link
            href="/cart"
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative flex h-11 w-11 items-center justify-center border border-white/50 transition hover:bg-white hover:text-[#24221F]"
          >
            <ShoppingBag size={20} strokeWidth={1.4} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D8ED83] px-1 text-[10px] font-semibold text-[#24221F]">
                {cartCount}
              </span>
            )}
          </Link>
        </header>

        {/* HERO TEXT */}
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 sm:px-10 sm:pb-28 md:px-16 lg:px-24">

          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-9 bg-[#D8ED83]" />
            <p className="text-[9px] tracking-[0.3em] text-white/90 sm:text-[10px]">
              {heroSubtitle}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero?.id || "default"}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: reducedMotion ? 0 : 0.6,
                ease: EASE,
              }}
              className="max-w-[1050px]"
            >
              <h1 className="max-w-[1000px] font-serif text-[clamp(3.5rem,10vw,9.2rem)] font-normal uppercase leading-[0.83] tracking-[-0.055em]">
                {heroTitle}
              </h1>

              <div className="mt-8 flex max-w-3xl flex-col gap-7 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">

                <p className="max-w-[340px] text-xs leading-7 text-white/80 sm:text-sm">
                  {heroDescription}
                </p>

                <Link
                  href={heroLink}
                  className="group inline-flex min-h-12 w-fit items-center gap-8 border border-white/75 px-6 text-[9px] font-medium tracking-[0.2em] transition duration-300 hover:border-[#D8ED83] hover:bg-[#D8ED83] hover:text-[#24221F]"
                >
                  {heroButton}
                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.3}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* HERO CONTROLS */}
          <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between sm:left-10 sm:right-10 md:left-16 md:right-16">

            <div className="flex items-center gap-3">
              <ArrowDown size={15} strokeWidth={1.2} />
              <span className="text-[8px] tracking-[0.22em]">
                SCROLL TO EXPLORE
              </span>
            </div>

            {heroSlides.length > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] tabular-nums">
                  {String(heroIndex + 1).padStart(2, "0")}
                </span>

                <div className="flex gap-1.5">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setHeroIndex(index)}
                      aria-label={`Show campaign ${index + 1}`}
                      className={`h-[2px] transition-all duration-300 ${
                        index === heroIndex
                          ? "w-8 bg-[#D8ED83]"
                          : "w-4 bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[10px] tabular-nums text-white/60">
                  {String(heroSlides.length).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* INTRO */}
      <section className="px-6 py-24 sm:px-10 sm:py-32 md:px-16">
        <div className="mx-auto grid max-w-[1450px] gap-10 md:grid-cols-2 md:items-end">

          <div>
            <p className="mb-6 text-[9px] font-semibold tracking-[0.3em] text-[#827D75]">
              THE TALA POINT OF VIEW
            </p>

            <h2 className="max-w-[750px] font-serif text-5xl leading-[0.95] tracking-[-0.045em] sm:text-7xl md:text-[6.2rem]">
              Style has
              <span className="block italic text-[#9B8C7C]">
                no rules.
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-7 md:items-end md:text-right">
            <p className="max-w-[390px] text-sm leading-8 text-[#77716A]">
              A fresh take on everyday dressing. Unexpected details,
              expressive pieces, and a little something that makes it yours.
            </p>

            <Link
              href="/collections/all-pieces"
              className="group inline-flex items-center gap-5 border-b border-[#24221F] pb-3 text-[9px] font-semibold tracking-[0.2em]"
            >
              GET INTO TALA
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="px-4 pb-24 sm:px-8 md:px-14 md:pb-32">

        <div className="mx-auto max-w-[1500px]">

          <div className="mb-9 flex items-end justify-between px-2 sm:mb-12">
            <div>
              <p className="mb-3 text-[9px] font-semibold tracking-[0.3em] text-[#827D75]">
                FIND YOUR OWN WAY
              </p>

              <h2 className="font-serif text-4xl tracking-[-0.03em] sm:text-6xl">
                The edits.
              </h2>
            </div>

            <Link
              href="/collections/all-pieces"
              className="hidden items-center gap-2 text-[9px] font-semibold tracking-[0.15em] sm:flex"
            >
              VIEW EVERYTHING
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5">

            {collections.map((collection) => {
              const category = categoryMap.get(collection.name.toLowerCase());

              const image = category?.image_url;

              return (
                <Link
                  href={collection.href}
                  key={collection.name}
                  className="group relative block aspect-[3/4] overflow-hidden bg-[#B9AEA1] sm:aspect-[4/5]"
                >

                  {image ? (
                    <img
                      src={image}
                      alt={category?.name || collection.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${collection.background}`}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-8 md:p-10">

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[8px] tracking-[0.25em] text-white/75">
                        TALA EDIT {collection.number}
                      </span>

                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>

                    <h3 className="font-serif text-3xl tracking-[-0.03em] sm:text-5xl md:text-7xl">
                      {category?.headline || collection.name}
                    </h3>

                    <p className="mt-3 text-[7px] tracking-[0.18em] text-white/75 sm:text-[9px]">
                      {category?.subtitle || collection.subtitle}
                    </p>

                    <span className="mt-6 inline-flex border-b border-white/70 pb-2 text-[8px] font-semibold tracking-[0.2em] sm:text-[9px]">
                      EXPLORE COLLECTION
                    </span>

                  </div>
                </Link>
              );
            })}

          </div>

          <Link
            href="/collections/all-pieces"
            className="mt-4 flex min-h-14 items-center justify-between bg-[#D8ED83] px-5 text-[9px] font-bold tracking-[0.18em] text-[#24221F] transition-colors hover:bg-[#C9E16D] sm:px-8"
          >
            ALL COLLECTION
            <ArrowUpRight size={18} />
          </Link>

        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-[#EEE9E1] px-5 py-20 sm:px-10 sm:py-28 md:px-16">

        <div className="mx-auto max-w-[1450px]">

          <div className="mb-10 flex items-end justify-between gap-4 sm:mb-14">

            <div>
              <p className="mb-3 text-[9px] font-semibold tracking-[0.3em] text-[#827D75]">
                THE LATEST OBSESSION
              </p>

              <h2 className="font-serif text-4xl tracking-[-0.04em] sm:text-6xl">
                New & Noted.
              </h2>
            </div>

            <Link
              href="/collections/all-pieces"
              className="group mb-1 inline-flex items-center gap-2 text-[8px] font-semibold tracking-[0.16em] sm:text-[9px]"
            >
              SHOP ALL
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <div className="aspect-[3/4] animate-pulse bg-[#D8D0C5]" />
                  <div className="mt-4 h-3 w-2/3 animate-pulse bg-[#D8D0C5]" />
                  <div className="mt-3 h-3 w-1/3 animate-pulse bg-[#D8D0C5]" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">

              {featuredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.55,
                    delay: reducedMotion ? 0 : index * 0.07,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={`/products/${encodeURIComponent(
                      String(product.slug || product.id)
                    )}`}
                    className="group block"
                  >

                    <div className="relative aspect-[3/4] overflow-hidden bg-[#D8D0C5]">

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                      />

                      {product.isNew && (
                        <span className="absolute left-3 top-3 bg-[#D8ED83] px-3 py-2 text-[8px] font-bold tracking-[0.13em] text-[#24221F]">
                          NEW
                        </span>
                      )}

                      {!product.isAvailable && (
                        <span className="absolute bottom-3 left-3 bg-[#24221F] px-3 py-2 text-[8px] tracking-[0.13em] text-white">
                          SOLD OUT
                        </span>
                      )}

                      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F1EB] text-[#24221F] opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight size={17} />
                      </span>

                    </div>

                    <div className="flex items-start justify-between gap-2 pt-4">
                      <div>
                        <h3 className="text-[11px] font-semibold tracking-wide sm:text-sm">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-[10px] text-[#77716A]">
                          {product.subtitle}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-[10px] sm:text-xs">
                        {product.price.toLocaleString("en-EG")} EGP
                      </p>
                    </div>

                    {product.colors?.length > 0 && (
                      <div className="mt-3 flex gap-1.5">
                        {product.colors.slice(0, 5).map((color, colorIndex) => (
                          <span
                            key={`${product.id}-${color.name}-${colorIndex}`}
                            title={color.name}
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: color.value }}
                          />
                        ))}
                      </div>
                    )}

                  </Link>
                </motion.article>
              ))}

            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="font-serif text-3xl">
                Something new is coming.
              </p>
              <p className="mt-3 text-xs text-[#77716A]">
                Our next collection is on its way.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="relative overflow-hidden bg-[#24221F] px-6 py-24 text-[#F5F1EB] sm:px-12 sm:py-36">

        <div className="pointer-events-none absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full border border-white/10 sm:h-[600px] sm:w-[600px]" />
        <div className="pointer-events-none absolute -right-8 -top-20 h-[300px] w-[300px] rounded-full border border-white/10 sm:h-[460px] sm:w-[460px]" />

        <div className="relative mx-auto max-w-[1200px]">

          <p className="mb-8 text-[9px] font-semibold tracking-[0.35em] text-[#D8ED83]">
            MORE THAN WHAT YOU WEAR
          </p>

          <h2 className="max-w-[1050px] font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-7xl md:text-[7rem]">
            Not made to fit in.
            <span className="block italic text-[#D8ED83]">
              Made to feel like you.
            </span>
          </h2>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <p className="max-w-[360px] text-xs leading-7 text-white/55">
              A little unexpected. Always considered.
              Never just another outfit.
            </p>

            <Link
              href="/about"
              className="group inline-flex w-fit items-center gap-5 border-b border-white/50 pb-3 text-[9px] font-semibold tracking-[0.2em] transition hover:border-[#D8ED83] hover:text-[#D8ED83]"
            >
              GET TO KNOW TALA
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#F5F1EB] px-6 pb-8 pt-16 sm:px-10 md:px-16">

        <div className="mx-auto max-w-[1450px]">

          <div className="grid gap-12 border-b border-[#D9D1C7] pb-14 sm:grid-cols-2 md:grid-cols-4">

            <div className="sm:col-span-2">
              <Link
                href="/"
                className="font-serif text-5xl tracking-[0.12em]"
              >
                TALA
              </Link>

              <p className="mt-5 max-w-[300px] text-[10px] leading-6 tracking-wide text-[#77716A]">
                Contemporary fashion. Distinctive energy.
                A signature of your own.
              </p>
            </div>

            <div>
              <p className="mb-5 text-[9px] font-bold tracking-[0.2em]">
                EXPLORE
              </p>

              <div className="flex flex-col gap-3 text-[10px] text-[#77716A]">
                <Link href="/collections/sets">Sets</Link>
                <Link href="/collections/jackets">Jackets</Link>
                <Link href="/collections/all-pieces">All Collection</Link>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[9px] font-bold tracking-[0.2em]">
                TALA
              </p>

              <div className="flex flex-col gap-3 text-[10px] text-[#77716A]">
                <Link href="/about">Our Story</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/policies">Policies</Link>
                <Link href="/faq">FAQ</Link>
              </div>
            </div>

          </div>

          <div className="flex flex-col justify-between gap-3 pt-6 text-[8px] tracking-[0.15em] text-[#8A8178] sm:flex-row">
            <p>© {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.</p>
            <p>MADE TO BE YOURS.</p>
          </div>

        </div>
      </footer>

      {/* SIDE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/55"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: reducedMotion ? 0 : 0.45,
                ease: EASE,
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(88%,460px)] flex-col bg-[#F5F1EB] px-7 pb-8 pt-7 text-[#24221F] shadow-2xl sm:px-10"
            >

              <div className="flex items-center justify-between border-b border-[#D9D1C7] pb-7">

                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl tracking-[0.2em]"
                >
                  TALA
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center border border-[#D9D1C7]"
                >
                  <X size={19} />
                </button>

              </div>

              <nav className="mt-10 flex flex-1 flex-col">

                {menuItems.map((item, index) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-[#D9D1C7] py-5 font-serif text-2xl transition-colors hover:text-[#827D75] sm:text-3xl"
                  >
                    <span>{item.label}</span>

                    <span className="text-[9px] font-sans tracking-widest text-[#A99A89]">
                      0{index + 1}
                    </span>
                  </Link>
                ))}

              </nav>

              <div className="flex items-center justify-between pt-8 text-[9px] tracking-[0.2em] text-[#77716A]">
                <span>TALA LUXURY FASHION</span>
                <span>EST. TALA</span>
              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </main>
  );
}
