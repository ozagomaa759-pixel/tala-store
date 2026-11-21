
"use client";

import Link from "next/link";
import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const collections = [
  {
    number: "01",
    name: "Sets",
    description:
      "A considered selection of coordinated pieces, designed to feel effortlessly complete.",
    href: "/collections/sets",
    eyebrow: "THE COORDINATED EDIT",
  },
  {
    number: "02",
    name: "Jackets",
    description:
      "Distinctive outer layers that bring quiet character to every look.",
    href: "/collections/jackets",
    eyebrow: "THE OUTERWEAR EDIT",
  },
  {
    number: "03",
    name: "All Pieces",
    description:
      "Explore every piece currently available in the TALA collection.",
    href: "/collections/all-pieces",
    eyebrow: "THE COMPLETE COLLECTION",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mb-14 text-center sm:mb-20"
        >
          <Sparkles
            size={22}
            className="mx-auto mb-6 text-[#A58B68]"
            strokeWidth={1.2}
          />

          <p className="mb-4 text-[10px] uppercase tracking-[0.42em] text-[#A58B68]">
            TALA — A curated wardrobe
          </p>

          <h1 className="font-serif text-4xl font-light tracking-[0.04em] sm:text-6xl">
            The Collections
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#81766B]">
            Discover the pieces that define TALA.
            Thoughtfully selected, beautifully considered,
            and made to become part of your story.
          </p>

          <div className="mx-auto mt-8 h-px w-16 bg-[#B9A58D]" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 md:grid-cols-3 md:gap-6"
        >
          {collections.map((collection) => (
            <motion.article
              key={collection.name}
              variants={cardVariants}
              whileHover={{ y: -7 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="group relative flex min-h-[330px] flex-col justify-between overflow-hidden border border-[#E5DDD2] bg-white/55 p-8 transition-colors duration-500 hover:bg-white sm:min-h-[390px] sm:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#E9E0D5] transition-transform duration-700 group-hover:scale-125" />

              <div className="relative flex items-center justify-between">
                <span className="font-serif text-3xl font-light text-[#B7A58E]">
                  {collection.number}
                </span>

                <Layers3
                  size={18}
                  strokeWidth={1.2}
                  className="text-[#A58B68] transition-transform duration-500 group-hover:rotate-6"
                />
              </div>

              <div className="relative mt-16">
                <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.3em] text-[#A58B68]">
                  {collection.eyebrow}
                </p>

                <h2 className="font-serif text-3xl font-light tracking-wide text-[#40372F] sm:text-4xl">
                  {collection.name}
                </h2>

                <p className="mt-5 max-w-xs text-sm leading-7 text-[#81766B]">
                  {collection.description}
                </p>

                <Link
                  href={collection.href}
                  className="mt-9 inline-flex items-center gap-3 border-b border-[#B9A58D] pb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#5E5044] transition-all duration-300 hover:gap-5 hover:border-[#40372F]"
                  aria-label={`Explore ${collection.name}`}
                >
                  Explore collection

                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </section>
    </main>
  );
}
