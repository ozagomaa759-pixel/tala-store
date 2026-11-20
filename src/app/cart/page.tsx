
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  ShoppingCart,
  Sparkles,
  PackageCheck,
} from "lucide-react";

import {
  getCart,
  saveCart,
  updateCartQuantity,
  removeFromCart,
  clearCart as clearStoredCart,
  type CartItem,
} from "@/lib/cart";

const FREE_DELIVERY_LIMIT = 3000;
const DELIVERY_FEE = 120;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [notice, setNotice] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const syncCart = () => {
      setItems(getCart());
      setLoaded(true);
    };

    syncCart();

    const savedCoupon = window.localStorage.getItem("tala-coupon-code") || "";
    if (savedCoupon === "TALA10") {
      setCoupon(savedCoupon);
      setCouponApplied(true);
    }

    window.addEventListener("tala-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("tala-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [items]
  );

  const discount = couponApplied ? subtotal * 0.1 : 0;

  const shipping =
    subtotal === 0 || subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : DELIVERY_FEE;

  const total = Math.max(0, subtotal - discount + shipping);

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const updateQuantity = (id: string, change: number) => {
    const item = items.find((current) => current.id === id);
    if (!item) return;

    const nextQuantity = Math.max(
      1,
      Math.min(10, item.quantity + change)
    );

    const updatedCart = updateCartQuantity(id, nextQuantity);
    setItems(updatedCart);
  };

  const removeItem = (id: string) => {
    const updatedCart = removeFromCart(id);
    setItems(updatedCart);

    setNotice("Product removed from your bag.");

    window.setTimeout(() => setNotice(""), 2500);
  };

  const clearCart = () => {
    clearStoredCart();
    setItems([]);
    setCouponApplied(false);
    window.localStorage.removeItem("tala-coupon-code");
    setCoupon("");
    setCouponError("");
    setShowClearConfirm(false);
    setNotice("Your shopping bag has been cleared.");

    window.setTimeout(() => setNotice(""), 2500);
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (coupon.trim().toUpperCase() === "TALA10") {
      window.localStorage.setItem("tala-coupon-code", "TALA10");
      setCouponApplied(true);
      setCouponError("");
      setNotice("Coupon applied successfully!");
    } else {
      window.localStorage.removeItem("tala-coupon-code");
      setCouponApplied(false);
      setCouponError("This coupon code is not valid.");
    }

    window.setTimeout(() => setNotice(""), 2500);
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f4f0e9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-serif tracking-[0.3em] text-[#292521]">
            TALA
          </div>
          <p className="mt-4 text-xs tracking-[0.3em] text-[#8b8175] uppercase">
            Preparing your bag
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#292521]">
      <div className="bg-[#292521] text-white text-center py-3 px-4">
        <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase">
          Complimentary delivery on orders over EGP 3,000
        </p>
      </div>

      <header className="border-b border-[#dcd4c9]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl sm:text-4xl font-serif tracking-[0.25em] text-white [text-shadow:0_1px_3px_#777]"
          >
            TALA
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-2 text-xs tracking-widest uppercase hover:opacity-60 transition"
          >
            <ArrowLeft size={15} />
            Continue shopping
          </Link>
        </div>
      </header>

      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#998a78] mb-4">
            Your shopping experience
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-6xl font-serif">
                Shopping Bag
              </h1>
              <p className="text-sm text-[#81786f] mt-3">
                Review your selected pieces before checkout.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs tracking-wider text-[#81786f]">
              <ShoppingBag size={16} />
              {totalQuantity} {totalQuantity === 1 ? "ITEM" : "ITEMS"}
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-5 right-5 z-50 bg-[#292521] text-white px-6 py-4 shadow-xl text-sm"
            role="status"
            aria-live="polite"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {items.length === 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-24"
        >
          <div className="min-h-[430px] border border-[#ded6cb] flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full border border-[#cfc4b6] flex items-center justify-center mb-7">
              <ShoppingBag size={30} strokeWidth={1} />
            </div>

            <p className="text-[10px] tracking-[0.35em] uppercase text-[#a08d78] mb-4">
              A little space for something beautiful
            </p>

            <h2 className="text-3xl sm:text-4xl font-serif mb-4">
              Your bag is empty
            </h2>

            <p className="text-sm text-[#827970] max-w-md leading-7 mb-8">
              Discover timeless pieces and find something that feels
              uniquely yours.
            </p>

            <Link
              href="/products"
              className="bg-[#292521] text-white px-9 py-4 text-[10px] tracking-[0.25em] uppercase hover:bg-[#51473d] transition flex items-center gap-3"
            >
              Explore collection
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.section>
      ) : (
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-10 xl:gap-16">
            <div>
              <div className="hidden sm:grid grid-cols-[1fr_120px_120px] gap-4 pb-5 border-b border-[#d8cfc3] text-[10px] tracking-[0.2em] uppercase text-[#928679]">
                <span>Product details</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-[#ded6cb]">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                      className="py-7 grid grid-cols-1 sm:grid-cols-[1fr_120px_120px] gap-5 sm:gap-4"
                    >
                      <div className="flex gap-5 min-w-0">
                        <div className="w-28 h-36 sm:w-32 sm:h-40 bg-[#e8e1d7] shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag
                                size={25}
                                className="text-[#a99a89]"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-between py-1 min-w-0">
                          <div>
                            <p className="text-[9px] tracking-[0.2em] uppercase text-[#a08d78] mb-2">
                              TALA COLLECTION
                            </p>

                            <h3 className="font-serif text-lg sm:text-xl leading-snug">
                              {item.name}
                            </h3>

                            <p className="text-xs text-[#81786f] mt-3">
                              Size: {item.size || "Not selected"}
                            </p>

                            <p className="text-xs text-[#81786f] mt-1">
                              Color: {item.color || "Not selected"}
                            </p>

                            <p className="text-sm mt-3 font-medium">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#918477] hover:text-red-700 transition w-fit"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex sm:justify-center items-center">
                        <div className="flex items-center border border-[#d3c9bd] h-10">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="px-3 h-full hover:bg-[#e9e2d8] disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>

                          <span className="w-8 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= 10}
                            className="px-3 h-full hover:bg-[#e9e2d8] disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex sm:justify-end items-center justify-between">
                        <span className="sm:hidden text-[10px] uppercase tracking-wider text-[#928679]">
                          Item total
                        </span>
                        <span className="font-medium text-sm tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-end pt-5">
                {!showClearConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-[10px] uppercase tracking-widest text-[#918477] hover:text-red-700 transition"
                  >
                    Clear shopping bag
                  </button>
                ) : (
                  <div className="flex items-center gap-3 text-xs">
                    <span>Remove all items?</span>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-red-700 font-medium"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="text-[#827970]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 pt-8 border-t border-[#d8cfc3]">
                <div className="flex gap-3">
                  <Truck size={20} strokeWidth={1.3} />
                  <div>
                    <p className="text-xs font-medium">Delivery</p>
                    <p className="text-[10px] text-[#928679] mt-1">
                      EGP 120 on orders below EGP 3,000
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <RotateCcw size={20} strokeWidth={1.3} />
                  <div>
                    <p className="text-xs font-medium">Easy returns</p>
                    <p className="text-[10px] text-[#928679] mt-1">
                      Return policy information
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ShieldCheck size={20} strokeWidth={1.3} />
                  <div>
                    <p className="text-xs font-medium">Secure shopping</p>
                    <p className="text-[10px] text-[#928679] mt-1">
                      Secure shopping with TALA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-8 h-fit">
              <div className="bg-[#ebe5dc] p-6 sm:p-8">
                <div className="flex items-center justify-between mb-7">
                  <h2 className="font-serif text-2xl">
                    Order Summary
                  </h2>
                  <ShoppingCart size={19} strokeWidth={1.3} />
                </div>

                <div className="space-y-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#81786f]">Subtotal</span>
                    <span className="tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#81786f]">Delivery</span>
                    <span>
                      {shipping === 0
                        ? "Complimentary"
                        : formatPrice(shipping)}
                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-green-800">
                      <span>Discount (10%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#d2c8bc] my-7" />

                <div>
                  <label
                    htmlFor="tala-coupon"
                    className="text-[10px] tracking-[0.2em] uppercase text-[#827970] flex items-center gap-2 mb-3"
                  >
                    <Tag size={14} />
                    Discount code
                  </label>

                  <div className="flex border border-[#cfc4b7]">
                    <input
                      id="tala-coupon"
                      value={coupon}
                      onChange={(event) => {
                        setCoupon(event.target.value);
                        setCouponError("");
                      }}
                      placeholder="Enter code"
                      className="w-full min-w-0 bg-transparent px-4 py-3 text-xs outline-none"
                    />

                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="bg-[#292521] text-white px-5 text-[10px] uppercase tracking-wider hover:bg-[#51473d] transition"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-red-700 text-xs mt-2">
                      {couponError}
                    </p>
                  )}

                  {couponApplied && (
                    <p className="text-green-800 text-xs mt-2 flex items-center gap-2">
                      <PackageCheck size={14} />
                      TALA10 applied successfully
                    </p>
                  )}
                </div>

                <div className="border-t border-[#d2c8bc] my-7" />

                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl">Total</span>
                  <span className="text-xl font-medium tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="text-[10px] text-[#928679] mt-3">
                  Delivery is free on orders of EGP 3,000 or more.
                </p>

                <Link
                  href="/checkout"
                  className="group relative w-full mt-7 min-h-[60px] bg-[#292521] text-[#ffffff] py-5 px-4 text-center text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#51473d] flex items-center justify-center gap-3"
                  style={{
                    backgroundColor: "#292521",
                    color: "#ffffff",
                    WebkitTextFillColor: "#ffffff",
                  }}
                >
                  <span className="relative z-10">
                    Proceed to Checkout
                  </span>
                  <ArrowRight size={16} className="relative z-10" />
                </Link>

                <div className="flex items-center justify-center gap-2 mt-5 text-[10px] text-[#928679]">
                  <ShieldCheck size={14} />
                  Cash on Delivery Available
                </div>
              </div>

              <div className="mt-6 text-center px-5">
                <Sparkles
                  size={18}
                  className="mx-auto text-[#a08d78] mb-3"
                />
                <p className="font-serif italic text-lg">
                  Elegance is in every detail.
                </p>
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#a08d78] mt-3">
                  TALA — Timeless by design
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}

      <footer className="bg-[#292521] text-white px-5 sm:px-8 py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-7">
            <Link
              href="/"
              className="text-3xl font-serif tracking-[0.3em]"
            >
              TALA
            </Link>

            <div className="flex flex-wrap justify-center gap-7 text-[9px] tracking-[0.2em] uppercase text-white/60">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <Link href="/products" className="hover:text-white transition">
                Collection
              </Link>
              <Link href="/cart" className="hover:text-white transition">
                Shopping Bag
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 mt-9 pt-6 text-center">
            <p className="text-[9px] tracking-[0.2em] text-white/40 uppercase">
              © {new Date().getFullYear()} TALA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
