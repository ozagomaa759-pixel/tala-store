
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

        if (!active || !result.success || !Array.isArray(result.categories)) {
          return;
        }

        const apiCategories = result.categories as ApiCategory[];

        const updatedCategories = DEFAULT_CATEGORIES.map((defaultCategory) => {
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
        });

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
          const validSlides = result.slides.filter(
            (slide: HeroSlide) =>
              slide &&
              typeof slide.id === "string" &&
              typeof slide.image_url === "string" &&
              slide.image_url.trim() !== ""
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

  // Automatic hero slider
  useEffect(() => {
    if (!heroLoaded || heroSlides.length <= 1) return;

    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);

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
      <div className="bg-[#292521] px-4 py-2 text-center text-[10px] tracking-[3px] text-white">
        DISCOVER THE NEW TALA COLLECTION
      </div>

      <header className="absolute z-20 flex w-full items-center justify-between px-6 py-7 text-white md:px-14">
        <button aria-label="Open menu">
          <Menu size={23} strokeWidth={1.3} />
        </button>

        <Link href="/" className="text-4xl font-light tracking-[12px]">
          TALA
        </Link>

        <Link
          href="/cart"
          aria-label={`Shopping bag, ${cartCount} items`}
          className="relative inline-flex items-center justify-center"
        >
          <ShoppingBag size={22} strokeWidth={1.3} />

          <span
            className="absolute -right-3 -top-3 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-medium text-[#292521]"
            aria-live="polite"
          >
            {cartCount}
          </span>
        </Link>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[780px] items-center overflow-hidden bg-[#82776c] md:min-h-[850px]">
        {hero && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={hero.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
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
                  />
                </picture>

                <div className="absolute inset-0 bg-black/35" />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeHero?.id}-content`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 mx-auto w-full px-7 pt-20 text-center text-white"
              >
                <p className="mb-6 text-[10px] tracking-[7px]">
                  {hero.subtitle}
                </p>

                <h1 className="text-6xl font-light tracking-[9px] md:text-9xl">
                  {hero.title}
                </h1>

                {hero.description && (
                  <p className="mx-auto mt-7 max-w-md text-sm font-light leading-8 tracking-[2px]">
                    {hero.description}
                  </p>
                )}

                <Link
                  href={hero.buttonLink}
                  className="mt-10 inline-flex items-center gap-5 border border-white px-9 py-4 text-[10px] tracking-[3px] transition hover:bg-white hover:text-black"
                >
                  {hero.buttonText} <ArrowRight size={15} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {heroSlides.length > 1 && (
              <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setHeroIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={heroIndex === index}
                    className={`h-[3px] transition-all duration-500 ${
                      heroIndex === index
                        ? "w-9 bg-white"
                        : "w-5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white">
          <ArrowDown size={20} strokeWidth={1} />
        </div>
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

              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute bottom-9 left-0 w-full text-center text-white">
                <h3 className="text-3xl font-light tracking-[4px]">
                  {category.name}
                </h3>

                <p className="mt-3 text-xs tracking-widest">
                  {category.subtitle}
                </p>

                <Link
                  href={`/products?category=${encodeURIComponent(
                    category.slug
                  )}`}
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
