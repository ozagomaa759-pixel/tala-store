import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const collections = [
  {
    name: "The New Edit",
    description: "Discover the latest pieces from TALA.",
    category: "new-arrivals",
  },
  {
    name: "Everyday Essentials",
    description: "Timeless styles for everyday moments.",
    category: "essentials",
  },
  {
    name: "Elegant Moments",
    description: "Pieces made for your special occasions.",
    category: "elegant",
  },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <Sparkles
            size={25}
            className="mx-auto mb-5 text-[#A58B68]"
          />

          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#A58B68]">
            Curated for you
          </p>

          <h1 className="text-4xl font-light md:text-6xl">
            TALA Collections
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#81766B]">
            Explore thoughtfully curated collections
            designed to bring elegance to every moment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection, index) => (
            <article
              key={collection.category}
              className="group flex min-h-80 flex-col justify-between border border-[#E5DDD2] bg-white/60 p-8 transition duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-xl"
            >
              <span className="text-sm tracking-[0.3em] text-[#B7A58E]">
                0{index + 1}
              </span>

              <div>
                <h2 className="text-2xl font-light">
                  {collection.name}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#81766B]">
                  {collection.description}
                </p>

                <Link
                  href={`/products?collection=${collection.category}`}
                  className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em]"
                >
                  Explore Collection
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-2"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
