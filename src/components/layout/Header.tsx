
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useCartCount } from "@/lib/tala-cart";

const navigation = [
  { label: "Collections", href: "/collections" },
  { label: "Sets", href: "/collections/sets" },
  { label: "Jackets", href: "/collections/jackets" },
  { label: "All Collection", href: "/collections/all-pieces" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen, searchOpen]);

  const isActive = (href: string) => {
    if (href === "/collections") {
      return pathname === "/collections";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    setSearchOpen(false);
    setMobileMenuOpen(false);

    router.push(
      `/collections/all-pieces?q=${encodeURIComponent(query)}`
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#24221F]/10 bg-[#F5F1EB]/95 text-[#24221F] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-[84px] lg:px-14">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-start transition-opacity hover:opacity-55 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X size={23} strokeWidth={1.5} />
          ) : (
            <Menu size={23} strokeWidth={1.5} />
          )}
        </button>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden flex-1 items-center gap-6 lg:flex xl:gap-9"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`group relative py-3 text-[9px] font-semibold uppercase tracking-[0.15em] transition-colors xl:text-[10px] ${
                isActive(item.href)
                  ? "text-[#24221F]"
                  : "text-[#77716A] hover:text-[#24221F]"
              }`}
            >
              {item.label}

              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-[#D8ED83] transition-all duration-300 ${
                  isActive(item.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Brand */}
        <Link
          href="/"
          aria-label="TALA Home"
          className="absolute left-1/2 -translate-x-1/2 text-center"
        >
          <span className="block font-serif text-[30px] font-medium leading-none tracking-[0.2em] sm:text-[35px]">
            TALA
          </span>

          <span className="mt-1.5 block text-[7px] font-medium tracking-[0.38em] text-[#77716A]">
            LUXURY FASHION
          </span>
        </Link>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMobileMenuOpen(false);
            }}
            aria-label={searchOpen ? "Close search" : "Search products"}
            aria-expanded={searchOpen}
            className="flex h-10 w-8 items-center justify-center transition-opacity hover:opacity-55"
          >
            {searchOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Search size={20} strokeWidth={1.5} />
            )}
          </button>

          <Link
            href="/cart"
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative flex h-10 items-center justify-center transition-opacity hover:opacity-55"
          >
            <ShoppingBag size={21} strokeWidth={1.5} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D8ED83] px-1 text-[9px] font-bold text-[#24221F]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search panel */}
      {searchOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-t border-[#24221F]/10 bg-[#F5F1EB] px-5 py-6 shadow-lg sm:px-10">
          <form
            onSubmit={handleSearch}
            role="search"
            className="mx-auto flex max-w-[850px] items-center gap-4 border-b border-[#24221F]/30 pb-3"
          >
            <Search
              size={19}
              strokeWidth={1.5}
              className="shrink-0 text-[#77716A]"
            />

            <input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Find your next favourite..."
              aria-label="Search TALA products"
              autoFocus
              className="w-full bg-transparent py-2 text-sm text-[#24221F] outline-none placeholder:text-[#999188]"
            />

            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="flex shrink-0 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60 disabled:opacity-30"
            >
              Search
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="mx-auto mt-4 max-w-[850px] text-[8px] uppercase tracking-[0.2em] text-[#999188]">
            SEARCH THE TALA COLLECTION
          </p>
        </div>
      )}

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 max-h-[calc(100dvh-72px)] w-full overflow-y-auto border-t border-[#24221F]/10 bg-[#F5F1EB] px-6 pb-10 pt-8 shadow-xl lg:hidden">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716A]">
              YOUR NEXT TALA FIND
            </p>

            <span className="rounded-full bg-[#D8ED83] px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider">
              Explore
            </span>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="group flex items-center justify-between border-b border-[#24221F]/10 py-5"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[9px] tabular-nums text-[#999188]">
                    0{index + 1}
                  </span>

                  <span className="font-serif text-[27px] font-light tracking-wide text-[#24221F]">
                    {item.label}
                  </span>
                </div>

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.4}
                  className="text-[#77716A] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-8 flex items-center justify-between bg-[#24221F] px-5 py-5 text-[#F5F1EB] transition-colors hover:bg-[#3A3832]"
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
              View Shopping Bag
            </span>

            <span className="flex items-center gap-3 text-[10px]">
              {cartCount} Items
              <ArrowRight size={15} />
            </span>
          </Link>

          <p className="mt-9 text-center text-[8px] tracking-[0.35em] text-[#999188]">
            TALA — LUXURY FASHION
          </p>
        </div>
      )}
    </header>
  );
}
