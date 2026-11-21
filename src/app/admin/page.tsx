
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Images,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  ShoppingBag,
  Sparkles,
  Tags,
} from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Products",
    description: "Create products, manage details, images, prices and variations.",
    href: "/admin/products",
    icon: Package,
    tag: "Store catalogue",
    accent: "bg-[#E9EDDF] text-[#687A50]",
  },
  {
    number: "02",
    title: "Categories",
    description: "Organize your collections and control how they appear in TALA.",
    href: "/admin/categories",
    icon: Tags,
    tag: "Store structure",
    accent: "bg-[#F4E9E4] text-[#A36F61]",
  },
  {
    number: "03",
    title: "Orders",
    description: "Follow customer orders, payments, delivery and sales activity.",
    href: "/admin/orders",
    icon: ShoppingBag,
    tag: "Customer activity",
    accent: "bg-[#E8EDF1] text-[#627B8C]",
  },
  {
    number: "04",
    title: "Inventory",
    description: "Keep track of sizes, colors, available stock and sold-out options.",
    href: "/admin/inventory",
    icon: Boxes,
    tag: "Stock control",
    accent: "bg-[#F2EEDF] text-[#8C8051]",
  },
  {
    number: "05",
    title: "Hero Management",
    description: "Manage homepage campaigns, visuals and featured slides.",
    href: "/admin/hero",
    icon: Images,
    tag: "Homepage experience",
    accent: "bg-[#EEE8F2] text-[#806B91]",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
      setLogoutError("Unable to log out. Please try again.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F3ED] text-[#292D25]">
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-[#E2E1D8] pb-5">
          <Link href="/admin" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#292D25] text-[#D8ED83]">
              <Sparkles size={19} />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-[0.2em]">
                TALA
              </span>
              <span className="block text-[8px] uppercase tracking-[0.24em] text-[#929187]">
                Administration
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#DEDDD4] bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777B70] transition hover:border-[#292D25] hover:text-[#292D25] disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <LogOut size={14} />
            )}
            {loggingOut ? "Logging out" : "Logout"}
          </button>
        </header>

        {logoutError && (
          <div className="mt-4 rounded-xl border border-[#EBCFCB] bg-[#FBF0EE] p-3 text-xs text-[#A05249]">
            {logoutError}
          </div>
        )}

        <section className="relative mt-8 overflow-hidden rounded-[28px] bg-[#292D25] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-[-100px] right-[25%] h-48 w-48 rounded-full bg-[#D8ED83]/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/65">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8ED83]" />
              Control center / 2026
            </div>

            <div className="mt-8 flex items-center gap-3 text-[#D8ED83]">
              <LayoutDashboard size={18} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">
                Your workspace
              </span>
            </div>

            <h1 className="mt-4 text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
              Your store.
              <br />
              <span className="font-light text-[#D8ED83]">
                Your vision.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/60">
              Everything behind TALA, in one place. Manage your collections,
              products, customers and the experience your store delivers.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/products"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-[#D8ED83] px-6 text-xs font-semibold text-[#292D25] transition hover:bg-[#E5F5A7]"
              >
                Manage products
                <ArrowUpRight size={16} />
              </Link>

              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                View storefront
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-12 flex items-center justify-between border-t border-white/10 pt-5 sm:absolute sm:bottom-10 sm:right-10 sm:mt-0 sm:w-56 sm:border-0 sm:pt-0 lg:right-14">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                Brand direction
              </p>
              <p className="mt-2 text-sm font-medium tracking-wide">
                Playful Luxury
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#D8ED83]">
              <Sparkles size={20} />
            </span>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8B9278]">
                Manage your business
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                Your workspace<span className="text-[#A7B68C]">.</span>
              </h2>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#89877D]">
              <CheckCircle2 size={14} className="text-[#879B6D]" />
              <span>Administration portal</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  key={section.number}
                  href={section.href}
                  className="group relative flex min-h-[245px] flex-col overflow-hidden rounded-[22px] border border-[#E7E5DC] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C9CFB8] hover:shadow-[0_16px_45px_rgba(41,45,37,0.06)] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${section.accent}`}
                    >
                      <Icon size={21} strokeWidth={1.7} />
                    </span>

                    <span className="text-[10px] font-medium tracking-[0.15em] text-[#B0AFA4]">
                      {section.number}
                    </span>
                  </div>

                  <div className="mt-7">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9A9A8E]">
                      {section.tag}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      {section.title}
                    </h3>

                    <p className="mt-3 max-w-sm text-xs leading-6 text-[#89877D]">
                      {section.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[#F0EFE9] pt-5">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#777B70]">
                      Open section
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F3ED] transition group-hover:bg-[#D8ED83]">
                      <ChevronRight
                        size={16}
                        className="transition group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E1D8] py-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#929187]">
            TALA / Luxury Fashion
          </p>
          <p className="text-[9px] tracking-[0.12em] text-[#AAA99F]">
            YOUR IDEAS, AMPLIFIED.
          </p>
        </footer>
      </div>
    </main>
  );
}
