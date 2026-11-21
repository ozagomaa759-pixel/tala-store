
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

const THEME = {
  page: "#B8AA98",
  surface: "#A99A88",
  ink: "#292923",
  muted: "#625B50",
  lime: "#D8ED83",
  line: "rgba(41,41,35,0.18)",
};

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
      if (event.key === "Escape") closePanels();
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
    <header
      className="sticky top-0 z-[80] w-full border-b text-[#292923] backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(184,170,152,0.96)",
        borderColor: THEME.line,
      }}
    >
      <div className="mx-auto grid h-[72px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 lg:h-[84px] lg:px-10 xl:px-14">
        {/* Mobile menu */}
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
            className="flex h-11 w-11 shrink-0 items-center justify-center transition-colors hover:bg-[#292923]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59633D]"
          >
            {mobileMenuOpen ? (
              <X size={23} strokeWidth={1.5} />
            ) : (
              <Menu size={23} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-7"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`group relative whitespace-nowrap py-3 text-[9px] font-bold uppercase tracking-[0.12em] transition-colors xl:text-[10px] ${
                isActive(item.href)
                  ? "text-[#292923]"
                  : "text-[#625B50] hover:text-[#292923]"
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
          className="relative z-10 text-center"
        >
          <span className="block font-serif text-[28px] font-medium leading-none tracking-[0.2em] text-[#292923] sm:text-[35px]">
            TALA
          </span>

          <span className="mt-1.5 block text-[7px] font-semibold tracking-[0.32em] text-[#625B50] sm:tracking-[0.38em]">
            LUXURY FASHION
          </span>
        </Link>

        {/* Header actions */}
        <div className="flex items-center justify-end gap-1 sm:gap-3">
          <button
            type="button"
            onClick={toggleSearch}
            aria-label={searchOpen ? "Close search" : "Search products"}
            aria-expanded={searchOpen}
            aria-controls="tala-search-panel"
            className="flex h-11 w-11 shrink-0 items-center justify-center transition-colors hover:bg-[#292923]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59633D]"
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
            className="relative flex h-11 w-11 shrink-0 items-center justify-center transition-colors hover:bg-[#292923]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59633D]"
          >
            <ShoppingBag size={21} strokeWidth={1.5} />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D8ED83] px-1 text-[9px] font-bold text-[#292923]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {(searchOpen || mobileMenuOpen) && (
        <button
          type="button"
          aria-label="Close open menu"
          onClick={closePanels}
          className="fixed inset-x-0 bottom-0 top-[72px] z-[60] bg-black/25 backdrop-blur-[2px] lg:top-[84px]"
        />
      )}

      {/* Search panel */}
      {searchOpen && (
        <div
          id="tala-search-panel"
          className="absolute left-0 top-full z-[70] w-full border-t px-5 py-6 shadow-xl sm:px-10"
          style={{
            backgroundColor: THEME.page,
            borderColor: THEME.line,
          }}
        >
          <form
            onSubmit={handleSearch}
            role="search"
            className="mx-auto flex max-w-[850px] items-center gap-3 border-b border-[#292923]/35 pb-3"
          >
            <Search
              size={19}
              strokeWidth={1.5}
              className="shrink-0 text-[#625B50]"
            />

            <input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Find your next favourite..."
              aria-label="Search TALA products"
              autoFocus
              className="min-w-0 w-full bg-transparent py-2 text-sm text-[#292923] outline-none placeholder:text-[#625B50]"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#625B50] transition-colors hover:text-[#292923]"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#D8ED83] px-4 text-[9px] font-bold uppercase tracking-[0.15em] text-[#292923] transition-colors hover:bg-[#C9DE72] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Search
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="mx-auto mt-4 max-w-[850px] text-[8px] uppercase tracking-[0.2em] text-[#625B50]">
            SEARCH THE TALA COLLECTION
          </p>
        </div>
      )}

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="tala-mobile-menu"
          className="absolute left-0 top-full z-[70] max-h-[calc(100dvh-72px)] w-full overflow-y-auto border-t px-6 pb-10 pt-8 shadow-xl lg:hidden"
          style={{
            backgroundColor: THEME.page,
            borderColor: THEME.line,
          }}
        >
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#625B50]">
              YOUR NEXT TALA FIND
            </p>

            <span className="rounded-full bg-[#D8ED83] px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[#292923]">
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
                className="group flex min-h-[65px] items-center justify-between border-b border-[#292923]/15 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#59633D]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[9px] tabular-nums text-[#625B50]">
                    0{index + 1}
                  </span>

                  <span
                    className={`font-serif text-[27px] font-light tracking-wide ${
                      isActive(item.href)
                        ? "text-[#59633D]"
                        : "text-[#292923]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.4}
                  className="text-[#625B50] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </nav>

          {/* Shopping bag */}
          <Link
            href="/cart"
            onClick={closePanels}
            className="mt-8 flex min-h-14 items-center justify-between bg-[#292923] px-5 py-4 text-[#F0E7D9] transition-colors hover:bg-[#3A3A32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#59633D]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
              View Shopping Bag
            </span>

            <span className="flex items-center gap-3 text-[10px]">
              {cartCount} Items
              <ArrowRight size={15} />
            </span>
          </Link>

          {/* Instagram */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-14 items-center justify-between border border-[#292923]/20 px-5 py-4 transition-colors hover:border-[#59633D] hover:bg-[#D8ED83]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#59633D]"
          >
            <span className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.16em]">
              <Instagram size={17} />
              @tala__luxury
            </span>

            <ArrowUpRight size={16} />
          </a>

          <p className="mt-9 text-center text-[8px] tracking-[0.35em] text-[#625B50]">
            TALA — LUXURY FASHION
          </p>
        </div>
      )}
    </header>
  );
}
