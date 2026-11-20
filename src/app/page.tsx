"use client";

import { useEffect, useState } from "react";
import {
AnimatePresence,
motion,
useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import {
ArrowDown,
ArrowRight,
Instagram,
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

type HeroContent = {
id: string;
title: string;
subtitle: string;
description: string;
image: string;
mobileImage: string | null;
buttonText: string;
buttonLink: string;
};

type Category = {
id: string;
name: string;
slug: string;
description: string;
image_url: string | null;
mobile_image_url: string | null;
subtitle: string;
headline: string;
button_text: string;
button_link: string;
overlay_opacity: number;
sort_order: number;
};

type ApiCategory = {
id?: string;
name?: string;
slug?: string;
description?: string | null;
image_url?: string | null;
mobile_image_url?: string | null;
subtitle?: string | null;
headline?: string | null;
button_text?: string | null;
button_link?: string | null;
overlay_opacity?: number | null;
sort_order?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const HERO_TRANSITION = {
duration: 0.65,
ease: EASE,
};

const TEXT_TRANSITION = {
duration: 0.5,
ease: EASE,
};

const MENU_TRANSITION = {
duration: 0.35,
ease: EASE,
};

const FALLBACK_HERO: HeroContent = {
id: "tala-default-hero",
title: "TALA",
subtitle: "THE ART OF EVERYDAY ELEGANCE",
description: "",
image: "",
mobileImage: null,
buttonText: "EXPLORE COLLECTION",
buttonLink: "/products",
};

export default function HomePage() {
const cartCount = useCartCount();
const reducedMotion = useReducedMotion();

const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [loadError, setLoadError] = useState(false);

const [categories, setCategories] = useState<Category[]>([]);
const [menuOpen, setMenuOpen] = useState(false);

const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
const [heroLoaded, setHeroLoaded] = useState(false);
const [heroIndex, setHeroIndex] = useState(0);

const activeHero = heroSlides[heroIndex];

const hero: HeroContent | null = activeHero
? {
id: activeHero.id,
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
: heroLoaded
? FALLBACK_HERO
: null;

// Load categories
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
    const updatedCategories: Category[] = (
      result.categories as ApiCategory[]
    )
      .filter(
        (category) =>
          typeof category.id === "string" &&
          typeof category.name === "string" &&
          typeof category.slug === "string"
      )
      .map((category) => ({
        id: category.id!,
        name: category.name!,
        slug: category.slug!,
        description: category.description?.trim() || "",
        image_url: category.image_url?.trim() || null,
        mobile_image_url:
          category.mobile_image_url?.trim() || null,
        subtitle: category.subtitle?.trim() || "",
        headline: category.headline?.trim() || "",
        button_text:
          category.button_text?.trim() || "EXPLORE",
        button_link:
          category.button_link?.trim() ||
          `/products?category=${encodeURIComponent(category.slug!)}`,
        overlay_opacity:
          typeof category.overlay_opacity === "number"
            ? Math.min(
                100,
                Math.max(0, category.overlay_opacity)
              )
            : 20,
        sort_order: category.sort_order ?? 0,
      }))
      .sort((a, b) => a.sort_order - b.sort_order);
    if (active) {
      setCategories(updatedCategories);
    }
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

const pageMotion = reducedMotion
? {
initial: { opacity: 1, y: 0 },
animate: { opacity: 1, y: 0 },
exit: { opacity: 1, y: 0 },
transition: { duration: 0 },
}
: {
initial: { opacity: 0, y: 14 },
animate: { opacity: 1, y: 0 },
exit: { opacity: 0, y: -8 },
transition: TEXT_TRANSITION,
};

return (
  <>
    {/* ANNOUNCEMENT */}
    <div className="announcement-bar">
      DISCOVER THE NEW TALA COLLECTION
    </div>
      </>
);
  {/* HEADER */}
  <header className="absolute left-0 top-[34px] z-40 flex w-full items-center justify-between px-5 py-7 text-white sm:px-8 md:px-14 md:py-9">
    <button
      type="button"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen((current) => !current)}
      className="transition-opacity duration-300 hover:opacity-60"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={menuOpen ? "close" : "menu"}
          initial={
            reducedMotion
              ? false
              : { opacity: 0, rotate: -35, scale: 0.85 }
          }
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={
            reducedMotion
              ? undefined
              : { opacity: 0, rotate: 35, scale: 0.85 }
          }
          transition={{ duration: 0.2 }}
          className="block"
        >
          {menuOpen ? (
            <X size={23} strokeWidth={1.2} />
          ) : (
            <Menu size={23} strokeWidth={1.2} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
    <Link
      href="/"
      aria-label="TALA homepage"
      className="text-3xl font-light tracking-[10px] transition-opacity duration-300 hover:opacity-75 sm:text-4xl sm:tracking-[13px]"
    >
      TALA
    </Link>
    <Link
      href="/cart"
      aria-label={`Shopping bag, ${cartCount} items`}
      className="relative inline-flex items-center justify-center transition-opacity duration-300 hover:opacity-60"
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
  {/* NAVIGATION MENU */}
  <AnimatePresence>
    {menuOpen && (
      <>
        <motion.button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          className="fixed inset-0 z-20 cursor-default bg-black/25"
        />
        <motion.div
          initial={
            reducedMotion
              ? { opacity: 1 }
              : { opacity: 0, y: -18 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -12 }
          }
          transition={reducedMotion ? { duration: 0 } : MENU_TRANSITION}
          className="fixed inset-x-0 top-0 z-30 bg-[#f4f0e9] px-8 pb-12 pt-28 text-[#292521] shadow-xl"
        >
          <nav className="mx-auto flex max-w-5xl flex-col">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reducedMotion ? 0 : 0.055,
                  },
                },
              }}
            >
              {[
                {
                  label: "ALL COLLECTIONS",
                  href: "/products",
                },
                ...categories.map((category) => ({
                  label: category.name,
                  href: category.button_link,
                })),
                {
                  label: "OUR STORY",
                  href: "/about",
                },
                {
                  label: "CONTACT",
                  href: "/contact",
                },
              ].map((item) => (
                <motion.div
                  key={`${item.label}-${item.href}`}
                  variants={{
                    hidden: reducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.3,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-[#d9d0c5] py-5 text-2xl font-light tracking-[3px] transition-all duration-300 hover:pl-2 hover:text-[#8d7962]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </nav>
        </motion.div>
      </>
    )}
  </AnimatePresence>
  {/* EDITORIAL HERO */}
  <section className="relative h-[calc(100svh-34px)] min-h-[650px] max-h-[1100px] overflow-hidden bg-[#75695e] text-white md:min-h-[720px]">
    {hero?.image ? (
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={hero.image}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: "easeInOut" }
          }
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
              loading="eager"
              decoding="async"
              onError={(event) => {
                event.currentTarget.style.opacity = "0";
              }}
            />
          </picture>
        </motion.div>
      </AnimatePresence>
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-[#817568] via-[#65594f] to-[#292521]" />
    )}
    <div className="absolute inset-0 bg-black/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
    {hero && (
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`${hero.id}-editorial`}
          initial={pageMotion.initial}
          animate={pageMotion.animate}
          exit={pageMotion.exit}
          transition={pageMotion.transition}
          className="absolute inset-x-0 bottom-28 z-10 mx-auto w-full max-w-[1500px] px-7 sm:bottom-32 sm:px-12 md:bottom-[19%] md:px-20 lg:px-28"
        >
          <div className="max-w-3xl text-center md:text-left">
            <motion.p
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.4,
                delay: reducedMotion ? 0 : 0.04,
                ease: EASE,
              }}
              className="mb-6 text-[9px] uppercase tracking-[5px] text-white/85 sm:text-[10px] sm:tracking-[7px]"
            >
              {hero.subtitle}
            </motion.p>
            <motion.h1
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 18, letterSpacing: "0.2em" }
              }
              animate={{
                opacity: 1,
                y: 0,
                letterSpacing: "0.1em",
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.55,
                delay: reducedMotion ? 0 : 0.08,
                ease: EASE,
              }}
              className="text-5xl font-light leading-[1.08] tracking-[7px] sm:text-7xl sm:tracking-[10px] md:text-8xl lg:text-[112px]"
            >
              {hero.title}
            </motion.h1>
            {hero.description && (
              <motion.p
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.4,
                  delay: reducedMotion ? 0 : 0.16,
                  ease: EASE,
                }}
                className="mx-auto mt-6 max-w-md text-xs font-light leading-7 tracking-[1.5px] text-white/90 sm:text-sm md:mx-0 md:mt-7"
              >
                {hero.description}
              </motion.p>
            )}
            <motion.div
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.4,
                delay: reducedMotion ? 0 : 0.22,
                ease: EASE,
              }}
            >
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
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    )}
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
              className={`h-[2px] transition-all duration-500 ${
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
    <div className="absolute bottom-9 left-6 z-20 flex items-center gap-3 text-white/80 sm:bottom-12 sm:left-12 md:left-16">
      <motion.span
        animate={
          reducedMotion
            ? undefined
            : { y: [0, 5, 0], opacity: [0.7, 1, 0.7] }
        }
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ArrowDown size={16} strokeWidth={1} />
      </motion.span>
      <span className="hidden text-[9px] uppercase tracking-[3px] sm:inline">
        Discover
      </span>
    </div>
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
  {/* COLLECTION STUDIO */}
  {categories.length > 0 && (
    <section className="px-5 py-24 md:px-14 md:py-32">
      <motion.div
        initial={
          reducedMotion
            ? false
            : { opacity: 0, y: 18 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: reducedMotion ? 0 : 0.55,
          ease: EASE,
        }}
        className="mb-14 text-center"
      >
        <p className="mb-4 text-[10px] tracking-[5px] text-[#a18b70]">
          CURATED FOR YOU
        </p>
        <h2 className="text-4xl font-light tracking-[5px] md:text-6xl">
          Discover TALA
        </h2>
        <p className="mt-5 text-sm text-[#77716a]">
          Explore our world of timeless fashion.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 22 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              delay: reducedMotion ? 0 : index * 0.08,
              duration: reducedMotion ? 0 : 0.55,
              ease: EASE,
            }}
            className="group relative h-[470px] overflow-hidden bg-[#ded5c9] md:h-[560px]"
          >
            {category.image_url && (
              <picture>
                {category.mobile_image_url && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={category.mobile_image_url}
                  />
                )}
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            )}
            <div
              className="absolute inset-0 transition duration-700 group-hover:bg-black/10"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${
                  category.overlay_opacity / 100
                })`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-12 pt-20 text-center text-white">
              {category.subtitle && (
                <p className="mb-4 text-[9px] uppercase tracking-[4px] text-white/85">
                  {category.subtitle}
                </p>
              )}
              <h3 className="text-3xl font-light tracking-[4px] sm:text-4xl">
                {category.headline || category.name}
              </h3>
              {category.description && (
                <p className="mx-auto mt-4 max-w-sm text-xs leading-6 tracking-wide text-white/90">
                  {category.description}
                </p>
              )}
              <Link
                href={category.button_link}
                className="group/button mt-7 inline-flex items-center gap-4 border-b border-white/80 pb-2 text-[10px] tracking-[3px] transition-opacity hover:opacity-70"
              >
                {category.button_text}
                <ArrowRight
                  size={14}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover/button:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )}
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
        className="flex items-center gap-3 text-xs tracking-widest transition-opacity hover:opacity-60"
      >
        VIEW ALL <ArrowRight size={16} />
      </Link>
    </div>
    {loading ? (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-4">
            <div className="aspect-[3/4] animate-pulse bg-[#d7cec2]" />
            <div className="h-3 w-3/4 animate-pulse bg-[#d7cec2]" />
            <div className="h-3 w-1/3 animate-pulse bg-[#d7cec2]" />
          </div>
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
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 16 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              delay: reducedMotion ? 0 : index * 0.07,
              duration: reducedMotion ? 0 : 0.5,
              ease: EASE,
            }}
          >
            <Link
              href={`/products/${encodeURIComponent(String(product.id))}`}
              className="group block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#d7cec2]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="mt-5 text-sm tracking-wide transition-colors duration-300 group-hover:text-[#8d7962]">
                {product.name}
              </h3>
              <p className="mt-2 text-xs text-[#77716a]">
                {product.price.toLocaleString("en-EG")} EGP
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    )}
  </section>
  {/* TALA PHILOSOPHY */}
  <section className="relative overflow-hidden bg-[#292521] px-6 py-28 text-center text-white">
    <motion.div
      initial={
        reducedMotion
          ? false
          : { opacity: 0, y: 20 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: reducedMotion ? 0 : 0.6,
        ease: EASE,
      }}
    >
      <p className="text-[10px] tracking-[6px] text-[#c9bba8]">
        THE TALA PHILOSOPHY
      </p>
      <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-light leading-relaxed tracking-[3px] md:text-6xl">
        Style is not about being noticed.
        It is about being remembered.
      </h2>
      <Link
        href="/about"
        className="mt-12 inline-flex items-center gap-4 border border-white px-8 py-4 text-[10px] tracking-[3px] transition-all duration-500 hover:bg-white hover:text-[#292521]"
      >
        OUR STORY <ArrowRight size={15} />
      </Link>
    </motion.div>
  </section>
  {/* FOOTER */}
  <footer className="bg-[#f4f0e9] px-6 py-16 text-center">
    <h2 className="text-4xl font-light tracking-[12px]">TALA</h2>
    <p className="mt-5 text-xs tracking-widest text-[#77716a]">
      TIMELESS FASHION. YOUR SIGNATURE.
    </p>
    <div className="mt-8 flex justify-center gap-7 text-xs">
      <Link
        href="/about"
        className="transition-opacity hover:opacity-50"
      >
        ABOUT
      </Link>
      <Link
        href="/contact"
        className="transition-opacity hover:opacity-50"
      >
        CONTACT
      </Link>
      <Link
        href="/policies"
        className="transition-opacity hover:opacity-50"
      >
        POLICIES
      </Link>
    </div>
    <a
      href="https://www.instagram.com/"
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram"
      className="mt-8 inline-block transition-transform duration-300 hover:scale-110"
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
