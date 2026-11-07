import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

const categories = [
  {
    name: "New Arrivals",
    description: "Discover our latest collection.",
    href: "/products?category=new-arrivals",
  },
  {
    name: "Clothing",
    description: "Explore everyday fashion.",
    href: "/products?category=clothing",
  },
  {
    name: "Dresses",
    description: "Find your perfect dress.",
    href: "/products?category=dresses",
  },
  {
    name: "Accessories",
    description: "Complete your look.",
    href: "/products?category=accessories",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#A58B68]">
            Explore TALA
          </p>

          <h1 className="text-4xl font-light md:text-6xl">
            Our Categories
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#81766B]">
            Explore our collections and discover pieces
            that match your personal style.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex min-h-64 flex-col justify-between border border-[#E5DDD2] bg-white/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <ShoppingBag
                size={25}
                className="text-[#A58B68]"
              />

              <div>
                <h2 className="text-xl font-medium">
                  {category.name}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#81766B]">
                  {category.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest">
                  Explore
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
