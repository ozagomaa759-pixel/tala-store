import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const products = [
  {
    name: "New Season Collection",
    description: "Discover the newest TALA styles.",
    tag: "JUST ARRIVED",
  },
  {
    name: "Modern Essentials",
    description: "Fresh pieces for your everyday wardrobe.",
    tag: "NEW EDIT",
  },
  {
    name: "The Elegant Edit",
    description: "A refined selection for every occasion.",
    tag: "LATEST STYLE",
  },
];

export default function NewArrivalsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16">
          <div className="mb-5 flex items-center gap-3 text-[#A58B68]">
            <Sparkles size={20} />
            <span className="text-xs uppercase tracking-[0.35em]">
              Fresh from TALA
            </span>
          </div>

          <h1 className="text-4xl font-light md:text-7xl">
            New Arrivals
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-8 text-[#81766B]">
            Explore the latest styles and discover what is
            new at TALA.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="flex min-h-72 flex-col justify-between border border-[#E5DDD2] bg-white/60 p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="w-fit border border-[#D8C8B3] px-3 py-2 text-[10px] tracking-[0.2em] text-[#A58B68]">
                {product.tag}
              </span>

              <div>
                <h2 className="text-2xl font-light">
                  {product.name}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#81766B]">
                  {product.description}
                </p>

                <Link
                  href="/products"
                  className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em]"
                >
                  Explore Products
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
