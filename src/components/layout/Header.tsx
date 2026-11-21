
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useCartCount } from "@/lib/tala-cart";

const navigation = [
  { label: "All Pieces", href: "/products" },
  { label: "Sets", href: "/products?category=Sets" },
  { label: "Jackets", href: "/products?category=Jackets" },
];

export default function Header() {
  const pathname = usePathname();
  const cartCount = useCartCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/products") {
      return pathname === "/products";
    }

    return false;
  };

  return (
    <header className="relative z-50 w-full bg-[#25231f] text-white">
      {/* Main Header */}
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:h-[88px] md:px-10 lg:px-16">

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-start text-white transition-opacity hover:opacity-60 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X size={23} strokeWidth={1.4} />
          ) : (
            <Menu size={23} strokeWidth={1.4} />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center gap-9 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative py-3 text-[10px] font-medium uppercase tracking-[0.19em] transition-colors ${
                isActive(item.href)
                  ? "text-white"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="TALA Home"
          className="absolute left-1/2 -translate-x-1/2 text-center"
        >
          <span className="block font-serif text-[30px] font-medium leading-none tracking-[0.22em] md:text-[36px]">
            TALA
          </span>
          <span className="mt-2 block text-[7px] font-light tracking-[0.42em] text-white/65 md:text-[8px]">
            LUXURY FASHION
          </span>
        </Link>

        {/* Header Actions */}
        <div className="flex flex-1 items-center justify-end gap-5 md:gap-7">

          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Search products"
            aria-expanded={searchOpen}
            className="flex h-10 w-7 items-center justify-center text-white transition-opacity hover:opacity-60"
          >
            {searchOpen ? (
              <X size={20} strokeWidth={1.4} />
            ) : (
              <Search size={20} strokeWidth={1.4} />
            )}
          </button>

          {/* Shopping Bag */}
          <Link
            href="/cart"
            aria-label={`Shopping bag, ${cartCount} items`}
            className="relative flex h-10 items-center justify-center text-white transition-opacity hover:opacity-60"
          >
            <ShoppingBag size={21} strokeWidth={1.4} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-[#25231f]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-t border-white/10 bg-[#25231f] px-5 py-6 shadow-xl md:px-10">
          <form
            action="/products"
            method="GET"
            className="mx-auto flex max-w-[900px] items-center gap-4 border-b border-white/35 pb-3"
          >
            <Search
              size={19}
              strokeWidth={1.4}
              className="shrink-0 text-white/60"
            />

            <input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search the collection..."
              autoFocus
              className="w-full bg-transparent py-2 text-sm tracking-wide text-white outline-none placeholder:text-white/40"
            />

            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-60 disabled:opacity-30"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 min-h-[calc(100vh-76px)] w-full border-t border-white/10 bg-[#25231f] px-6 pb-12 pt-10 lg:hidden">

          <div className="flex flex-col">
            <p className="mb-7 text-[9px] uppercase tracking-[0.3em] text-white/40">
              Explore TALA
            </p>

            {navigation.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center justify-between border-b border-white/15 py-6"
              >
                <span className="font-serif text-[28px] font-light tracking-wide text-white transition-transform duration-300 group-hover:translate-x-2">
                  {item.label}
                </span>

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.2}
                  className="text-white/50 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border border-white/25 px-5 py-5 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-[#25231f]"
            >
              <span>View Shopping Bag</span>
              <span>{cartCount} Items</span>
            </Link>
          </div>

          <p className="mt-12 text-center text-[8px] tracking-[0.35em] text-white/35">
            TALA LUXURY FASHION
          </p>
        </div>
      )}
    </header>
  );
}

