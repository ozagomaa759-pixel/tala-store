"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartCount } from "@/lib/tala-cart";

export function TALAHeader() {
  const count = useCartCount();
  return <header className="tala-header">
    <Link href="/" className="tala-wordmark">TALA</Link>
    <nav><Link href="/">Home</Link><Link href="/products">Shop</Link><Link href="/about">About</Link></nav>
    <Link href="/cart" className="tala-bag" aria-label="Shopping bag"><ShoppingBag size={22}/>{count > 0 && <span>{count}</span>}</Link>
  </header>;
}
export function TALAFooter() {
  return <footer className="tala-footer">
    <div><div className="tala-footer-logo">TALA</div><p>The art of everyday elegance.</p></div>
    <div className="tala-footer-links"><Link href="/products">Shop collection</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link></div>
    <small>© {new Date().getFullYear()} TALA. All rights reserved.</small>
  </footer>;
}

