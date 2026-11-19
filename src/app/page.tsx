
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Instagram,
  Menu,
  ShoppingBag,
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

type HeroContent = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage: string | null;
  buttonText: string;
  buttonLink: string;
};

type Category = {
  id?: string;
  name: string;
  slug: string;
  subtitle: string;
  image: string;
};

type ApiCategory = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number;
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    name: "Sets",
    slug: "sets",
    subtitle: "Effortless matching essentials",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
  },
  {
    name: "Jackets",
    slug: "jackets",
    subtitle: "The finishing touch",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85",
  },
];

export default function HomePage() {
  const cartCount = useCartCount();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [categories, setCategories] =
    useState<Category[]>(DEFAULT_CATEGORIES);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Load categories and their uploaded images
  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load categories");
        }

        const result = await response.json();

        if (
          !active ||
          !result.success ||
          !Array.isArray(result.categories)
        ) {
          return;
        }

        const apiCategories = result.categories as ApiCategory[];

        const updatedCategories = DEFAULT_CATEGORIES.map(
          (defaultCategory) => {
            const savedCategory = apiCategories.find(
              (category) =>
                category.name?.trim().toLowerCase() ===
                  defaultCategory.name.toLowerCase() ||
                category.slug?.trim().toLowerCase() ===
                  defaultCategory.slug.toLowerCase()
            );

            return {
              ...defaultCategory,
              id: savedCategory?.id,
              slug: savedCategory?.slug || defaultCategory.slug,
              subtitle:
                savedCategory?.description?.trim() ||
                defaultCategory.subtitle,
              image:
                savedCategory?.image_url?.trim() ||
                defaultCategory.image,
            };
          }
        );

        setCategories(updatedCategories);
      } catch (error) {
        console.error("TALA categories loading error:", error);
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  // Load hero slides
  useEffect(() => {
    let active = true;

    async function loadHeroSlides() {
      try {
        const response = await fetch("/api/hero", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load hero slides");
        }

        const result = await response.json();

        if (active && result.success && Array.isArray(result.slides)) {
          const validSlides = result.slides
            .filter(
              (slide: HeroSlide) =>
                slide &&
                typeof slide.id === "string" &&
                typeof slide.image_url === "string" &&
                slide.image_url.trim() !== ""
            )
            .sort(
              (a: HeroSlide, b: HeroSlide) =>
                a.sort_order - b.sort_order
            );

          setHeroSlides(validSlides);
          setHeroIndex(0);
        }
      } catch (error) {
        console.error("TALA hero loading error:", error);

        if (active) {
          setHeroSlides([]);
        }
      } finally {
        if (active) {
          setHeroLoaded(true);
        }
      }
    }

    loadHeroSlides();

    return () => {
      active = false;
    };
  }, []);

  // Preload the next hero image
  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const nextIndex = (heroIndex + 1) % heroSlides.length;
    const nextSlide = heroSlides[nextIndex];

    if (!nextSlide) return;

    const desktopImage = new window.Image();
    desktopImage.src = nextSlide.image_url;

    if (nextSlide.mobile_image_url) {
      const mobileImage = new window.Image();
      mobileImage.src = nextSlide.mobile_image_url;
    }
  }, [heroIndex, heroSlides]);

  // Automatic hero slider
  useEffect(() => {
    if (!heroLoaded || heroSlides.length <= 1) return;

    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [heroLoaded, heroSlides.length]);

  // Load products
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getTalaProducts();

        if (active) {
          setProducts(data);
        }
      } catch (error) {
        console.error("TALA homepage products error:", error);

        if (active) {
          setLoadError(true);
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const newArrivals = products
    .filter((product) => product.isNew)
    .slice(0, 4);

  const displayedProducts =
    newArrivals.length > 0 ? newArrivals : products.slice(0, 4);

  const activeHero = heroSlides[heroIndex];

  const hero: HeroContent | null = activeHero
    ? {
        title: activeHero.title?.trim() || "TALA",
        subtitle:
          activeHero.subtitle?.trim() ||
          "THE ART OF EVERYDAY ELEGANCE",
        description: activeHero.description?.trim() || "",
        image: activeHero.image_url,
        mobileImage: activeHero.mobile_image_url,
        buttonText:
          activeHero.button_text?.trim() || "EXPLORE COLLECTION",
        buttonLink: activeHero.button_link || "/products",
      }
    : null;

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#292521]">
      {/* ANNOUNCEMENT */}
      <div className="relative z-30 bg-[#292521] px-4 py-2.5 text-center text-[9px] tracking-[3px] text-white sm:text-[10px]">
        DISCOVER THE NEW TALA COLLECTION
      </div>

      {/* HEADER */}
      <header className="absolute left-0 top-[34px] z-30 flex w-full items-center justify-between px-5 py-7 text-white sm:px-8 md:px-14 md:py-9">
        <button
          type="button"
          aria-label="Open menu"
          className="transition-opacity hover:opacity-60"
        >
          <Menu size={23} strokeWidth={1.2} />
        </button>

        <Link
          href="/"
          className="text-3xl font-light tracking-[10px] sm:text-4xl sm:tracking-[13px]"
        >
          TALA
        </Link>

        <Link
          href="/cart"
          aria-label={`Shopping bag, ${cartCount} items`}
          className="relative inline-flex items-center justify-center transition-opacity hover:opacity-60"
        >
          <ShoppingBag size={22} strokeWidth={1.2} />

          <span
            className="absolute -right-3 -top-3 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-medium text-[#292521]"
            aria-live="polite"
          >
            {cartCount}
          </span>
        </Link>
      </header>

      {/* ULTRA LUXURY EDITORIAL HERO */}
      <section className="relative h-[calc(100svh-34px)] min-h-[650px] max-h-[1100px] overflow-hidden bg-[#75695e] text-white md:min-h-[720px]">
        {/* Background */}
        {hero ? (
          <AnimatePresence mode="sync">
            <motion.div
              key={hero.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <picture>
                {hero.mobileImage && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={hero.mobileImage}
                  />
                )}

                <img
                  src={hero.image}
                  alt={hero.title}
                  className="h-full w-full object-cover object-center"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#817568] via-[#65594f] to-[#292521]" />
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

        {/* Editorial content */}
        {hero && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeHero?.id}-editorial`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-x-0 bottom-28 z-10 mx-auto w-full max-w-[1500px] px-7 sm:bottom-32 sm:px-12 md:bottom-[19%] md:px-20 lg:px-28"
            >
              <div className="max-w-3xl text-center md:text-left">
                <p className="mb-6 text-[9px] uppercase tracking-[5px] text-white/85 sm:text-[10px] sm:tracking-[7px]">
                  {hero.subtitle}
                </p>

                <h1 className="text-5xl font-light leading-[1.08] tracking-[7px] sm:text-7xl sm:tracking-[10px] md:text-8xl lg:text-[112px]">
                  {hero.title}
                </h1>

                {hero.description && (
                  <p className="mx-auto mt-6 max-w-md text-xs font-light leading-7 tracking-[1.5px] text-white/90 sm:text-sm md:mx-0 md:mt-7">
                    {hero.description}
                  </p>
                )}

                <Link
                  href={hero.buttonLink}
                  className="group mt-9 inline-flex min-h-12 items-center gap-6 border border-white/80 px-7 py-4 text-[9px] uppercase tracking-[3px] transition duration-500 hover:bg-white hover:text-[#292521] sm:px-9 sm:text-[10px]"
                >
                  {hero.buttonText}

                  <ArrowRight
                    size={15}
                    strokeWidth={1.2}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Slide navigation */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-9 right-6 z-20 flex items-center gap-4 sm:bottom-12 sm:right-12 md:right-16">
            <span className="text-[10px] tracking-[3px] text-white">
              {String(heroIndex + 1).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setHeroIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={heroIndex === index}
                  className={`h-[2px] transition-all duration-700 ${
                    heroIndex === index
                      ? "w-9 bg-white"
                      : "w-4 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] tracking-[3px] text-white/65">
              {String(heroSlides.length).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-9 left-6 z-20 flex items-center gap-3 text-white/80 sm:bottom-12 sm:left-12 md:left-16">
          <ArrowDown size={16} strokeWidth={1} />

          <span className="hidden text-[9px] uppercase tracking-[3px] sm:inline">
            Discover
          </span>
        </div>

        {/* Loading indicator */}
        {!heroLoaded && (
          <div className="absolute inset-x-0 bottom-0 z-20 h-[2px] overflow-hidden bg-white/10">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-full w-1/3 bg-white/80"
            />
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="px-5 py-24 md:px-14 md:py-32">
        <div className="mb-14 text-center">
          <p className="mb-4 text-[10px] tracking-[5px] text-[#a18b70]">
            CURATED FOR YOU
          </p>

          <h2 className="text-4xl font-light tracking-[5px] md:text-6xl">
            Discover TALA
          </h2>

          <p className="mt-5 text-sm text-[#77716a]">
            Explore our world of timeless fashion.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative h-[470px] overflow-hidden bg-[#ded5c9]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/20 transition duration-500 group-hover:bg-black/30" />

              <div className="absolute bottom-9 left-0 w-full text-center text-white">
                <h3 className="text-3xl font-light tracking-[4px]">
                  {category.name}
                </h3>

                <p className="mt-3 text-xs tracking-widest">
                  {category.subtitle}
                </p>

                <Link
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="mt-5 inline-block border-b border-white pb-2 text-[10px] tracking-[3px]"
                >
                  EXPLORE
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#e9e2d8] px-5 py-24 md:px-14">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-4 text-[10px] tracking-[5px] text-[#a18b70]">
              SELECTED FOR YOU
            </p>

            <h2 className="text-4xl font-light tracking-[4px]">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-3 text-xs tracking-widest"
          >
            VIEW ALL <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[3/4] animate-pulse bg-[#d7cec2]"
              />
            ))}
          </div>
        ) : loadError ? (
          <p className="py-16 text-center text-sm text-[#77716a]">
            Products could not be loaded. Please try again later.
          </p>
        ) : displayedProducts.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#77716a]">
            Our collection is coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-7">
            {displayedProducts.map((product) => (
              <Link
                href="/products"
                key={product.id}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#d7cec2]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <h3 className="mt-5 text-sm tracking-wide">
                  {product.name}
                </h3>

                <p className="mt-2 text-xs text-[#77716a]">
                  {product.price.toLocaleString("en-EG")} EGP
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* TALA PHILOSOPHY */}
      <section className="relative overflow-hidden bg-[#292521] px-6 py-28 text-center text-white">
        <p className="text-[10px] tracking-[6px] text-[#c9bba8]">
          THE TALA PHILOSOPHY
        </p>

        <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-light leading-relaxed tracking-[3px] md:text-6xl">
          Style is not about being noticed.
          It is about being remembered.
        </h2>

        <Link
          href="/about"
          className="mt-12 inline-flex items-center gap-4 border border-white px-8 py-4 text-[10px] tracking-[3px]"
        >
          OUR STORY <ArrowRight size={15} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f4f0e9] px-6 py-16 text-center">
        <h2 className="text-4xl font-light tracking-[12px]">TALA</h2>

        <p className="mt-5 text-xs tracking-widest text-[#77716a]">
          TIMELESS FASHION. YOUR SIGNATURE.
        </p>

        <div className="mt-8 flex justify-center gap-7 text-xs">
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACT</Link>
          <Link href="/policies">POLICIES</Link>
        </div>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="mt-8 inline-block"
        >
          <Instagram size={19} />
        </a>

        <p className="mt-8 text-[10px] text-[#888078]">
          © 2026 TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
