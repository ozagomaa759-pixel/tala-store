
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
  Instagram,
} from "lucide-react";

import { useCartCount } from "@/lib/tala-cart";

const INSTAGRAM_URL = "https://www.instagram.com/tala__luxury/";

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

  const closePanels = () => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("q") || "");
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

  function toggleSearch() {
    if (!searchOpen) {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("q") || "");
    }

    setSearchOpen((open) => !open);
    setMobileMenuOpen(false);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    closePanels();

    router.push(
      `/collections/all-pieces?q=${encodeURIComponent(query)}`
    );
  }

  return (
    <header className="sticky top-0 z-[80] w-full border-b border-[#24221F]/10 bg-[#F5F1EB]/95 text-[#24221F] backdrop-blur-xl">
      <div className="mx-auto grid h-[72px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 lg:h-[84px] lg:px-10 xl:px-14">

        {/* MOBILE MENU BUTTON */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="tala-mobile-menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center transition-colors hover:bg-[#24221F]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89965D]"
          >
            {mobileMenuOpen ? (
              <X size={23} strokeWidth={1.5} />
            ) : (
              <Menu size={23} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-7"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`group relative whitespace-nowrap py-3 text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors xl:text-[10px] ${
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

        {/* BRAND */}
        <Link
          href="/"
          aria-label="TALA Home"
          className="relative z-10 text-center"
        >
          <span className="block font-serif text-[28px] font-medium leading-none tracking-[0.2em] sm:text-[35px]">
            TALA
          </span>

          <span className="mt-1.5 block text-[7px] font-medium tracking-[0.32em] text-[#77716A] sm:tracking-[0.38em]">
            LUXURY FASHION
          </span>
        </Link>

        {/* HEADER ACTIONS */}
        <div className="flex items-center justify-end gap-1 sm:gap-3">
          <button
            type="button"
            onClick={toggleSearch}
            aria-label={searchOpen ? "Close search" : "Search products"}
            aria-expanded={searchOpen}
            aria-controls="tala-search-panel"
            className="flex h-11 w-11 shrink-0 items-center justify-center transition-colors hover:bg-[#24221F]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89965D]"
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
            className="relative flex h-11 w-11 shrink-0 items-center justify-center transition-colors hover:bg-[#24221F]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89965D]"
          >
            <ShoppingBag size={21} strokeWidth={1.5} />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D8ED83] px-1 text-[9px] font-bold text-[#24221F]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* BACKDROP — BELOW HEADER */}
      {(searchOpen || mobileMenuOpen) && (
        <button
          type="button"
          aria-label="Close open menu"
          onClick={closePanels}
          className="fixed inset-x-0 bottom-0 top-[72px] z-[60] bg-black/25 backdrop-blur-[2px] lg:top-[84px]"
        />
      )}

      {/* SEARCH PANEL */}
      {searchOpen && (
        <div
          id="tala-search-panel"
          className="absolute left-0 top-full z-[70] w-full border-t border-[#24221F]/10 bg-[#F5F1EB] px-5 py-6 shadow-xl sm:px-10"
        >
          <form
            onSubmit={handleSearch}
            role="search"
            className="mx-auto flex max-w-[850px] items-center gap-3 border-b border-[#24221F]/30 pb-3"
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
              className="min-w-0 w-full bg-transparent py-2 text-sm text-[#24221F] outline-none placeholder:text-[#999188]"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#77716A] transition-colors hover:text-[#24221F]"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#D8ED83] px-4 text-[9px] font-bold uppercase tracking-[0.15em] text-[#24221F] transition-colors hover:bg-[#C9E16C] disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div
          id="tala-mobile-menu"
          className="absolute left-0 top-full z-[70] max-h-[calc(100dvh-72px)] w-full overflow-y-auto border-t border-[#24221F]/10 bg-[#F5F1EB] px-6 pb-10 pt-8 shadow-xl lg:hidden"
        >
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#77716A]">
              YOUR NEXT TALA FIND
            </p>

            <span className="rounded-full bg-[#D8ED83] px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[#24221F]">
              Explore
            </span>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closePanels}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="group flex min-h-[65px] items-center justify-between border-b border-[#24221F]/10 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#89965D]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[9px] tabular-nums text-[#999188]">
                    0{index + 1}
                  </span>

                  <span
                    className={`font-serif text-[27px] font-light tracking-wide ${
                      isActive(item.href)
                        ? "text-[#89965D]"
                        : "text-[#24221F]"
                    }`}
                  >
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

          {/* SHOPPING BAG */}
          <Link
            href="/cart"
            onClick={closePanels}
            className="mt-8 flex min-h-14 items-center justify-between bg-[#24221F] px-5 py-4 text-[#F5F1EB] transition-colors hover:bg-[#3A3832] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89965D]"
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
              View Shopping Bag
            </span>

            <span className="flex items-center gap-3 text-[10px]">
              {cartCount} Items
              <ArrowRight size={15} />
            </span>
          </Link>

          {/* OFFICIAL INSTAGRAM */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-14 items-center justify-between border border-[#24221F]/15 px-5 py-4 transition-colors hover:border-[#89965D] hover:bg-[#D8ED83]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#89965D]"
          >
            <span className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.16em]">
              <Instagram size={17} />
              @tala__luxury
            </span>

            <ArrowUpRight size={16} />
          </a>

          <p className="mt-9 text-center text-[8px] tracking-[0.35em] text-[#999188]">
            TALA — LUXURY FASHION
          </p>
        </div>
      )}
    </header>
  );
}
