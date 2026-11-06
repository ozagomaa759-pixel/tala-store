"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Instagram,
  Menu,
  ShoppingBag,
} from "lucide-react";

const categories = [
  { name: "Dresses", subtitle: "Elegance in every detail", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900" },
  { name: "Tops", subtitle: "Everyday sophistication", image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900" },
  { name: "Outerwear", subtitle: "Designed to stand out", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900" },
];

const products = [
  { name: "The Signature Dress", price: "1,850 EGP", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800" },
  { name: "Classic Elegance", price: "1,250 EGP", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800" },
  { name: "Modern Essential", price: "1,450 EGP", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800" },
  { name: "The Timeless Set", price: "1,650 EGP", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800" },
];

export default function HomePage() {
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

        <Link href="/cart" aria-label="Shopping bag">
          <ShoppingBag size={22} strokeWidth={1.3} />
        </Link>
      </header>

      <section className="relative flex min-h-[780px] items-center overflow-hidden bg-[#82776c] md:min-h-[850px]">
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=2000"
          alt="TALA fashion collection"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="relative z-10 mx-auto w-full px-7 pt-20 text-center text-white"
        >
          <p className="mb-6 text-[10px] tracking-[7px]">
            THE ART OF EVERYDAY ELEGANCE
          </p>

          <h1 className="text-6xl font-light tracking-[9px] md:text-9xl">
            TALA
          </h1>

          <p className="mx-auto mt-7 max-w-md text-sm font-light leading-8 tracking-[2px]">
            Timeless pieces. Effortless confidence.
            A style that speaks without saying a word.
          </p>

          <Link
            href="/products"
            className="mt-10 inline-flex items-center gap-5 border border-white px-9 py-4 text-[10px] tracking-[3px] transition hover:bg-white hover:text-black"
          >
            EXPLORE COLLECTION <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white">
          <ArrowDown size={20} strokeWidth={1} />
        </div>
      </section>

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
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
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-9 left-0 w-full text-center text-white">
                <h3 className="text-3xl font-light tracking-[4px]">
                  {category.name}
                </h3>
                <p className="mt-3 text-xs tracking-widest">
                  {category.subtitle}
                </p>
                <Link href="/categories" className="mt-5 inline-block border-b border-white pb-2 text-[10px] tracking-[3px]">
                  EXPLORE
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
          <Link href="/new-arrivals" className="flex items-center gap-3 text-xs tracking-widest">
            VIEW ALL <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-7">
          {products.map((product) => (
            <Link href="/products" key={product.name} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-[#d7cec2]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-sm tracking-wide">
                {product.name}
              </h3>
              <p className="mt-2 text-xs text-[#77716a]">
                {product.price}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#292521] px-6 py-28 text-center text-white">
        <p className="text-[10px] tracking-[6px] text-[#c9bba8]">
          THE TALA PHILOSOPHY
        </p>
        <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-light leading-relaxed tracking-[3px] md:text-6xl">
          Style is not about being noticed.
          It is about being remembered.
        </h2>
        <Link href="/about" className="mt-12 inline-flex items-center gap-4 border border-white px-8 py-4 text-[10px] tracking-[3px]">
          OUR STORY <ArrowRight size={15} />
        </Link>
      </section>

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
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="mt-8 inline-block">
          <Instagram size={19} />
        </a>
        <p className="mt-8 text-[10px] text-[#888078]">
          © 2026 TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>

    </main>
  );
}
