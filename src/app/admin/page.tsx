
import Link from "next/link";
import {
  ArrowRight,
  Package,
  ShoppingBag,
  Boxes,
  LayoutDashboard,
} from "lucide-react";

const sections = [
  {
    title: "Products",
    description: "Manage your store products and collections.",
    href: "/products",
    icon: Package,
  },
  {
    title: "Orders",
    description: "Review and organize customer orders.",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Inventory",
    description: "Monitor product stock and availability.",
    href: "/admin/inventory",
    icon: Boxes,
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-20 text-[#332A23]">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[#A28A72]">
          TALA Administration
        </p>

        <div className="mt-6 flex items-center gap-4">
          <LayoutDashboard size={38} strokeWidth={1} />
          <h1 className="text-5xl font-light sm:text-7xl">
            Dashboard
          </h1>
        </div>

        <p className="mt-6 max-w-xl text-sm leading-8 text-[#77695D]">
          Welcome to your TALA control center.
          Manage products, orders, and inventory
          from one organized workspace.
        </p>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.title}
                href={section.href}
                className="group border border-[#E5DACE] bg-white/60 p-8 transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <Icon size={30} strokeWidth={1} />

                <h2 className="mt-8 text-2xl font-light">
                  {section.title}
                </h2>

                <p className="mt-3 min-h-12 text-sm leading-7 text-[#77695D]">
                  {section.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-[#E5DACE] pt-5">
                  <span className="text-xs uppercase tracking-widest">
                    Open Section
                  </span>
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-2"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-16 border-t border-[#E5DACE] pt-6 text-xs tracking-widest text-[#A28A72]">
          TALA — YOUR STORE, YOUR VISION.
        </p>
      </div>
    </main>
  );
}
