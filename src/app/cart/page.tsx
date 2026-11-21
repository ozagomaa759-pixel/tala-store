
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import {
  getCart,
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

    const savedCoupon =
      window.localStorage.getItem("tala-coupon-code") || "";

    if (savedCoupon.toUpperCase() === "TALA10") {
      setCoupon("TALA10");
      setCouponApplied(true);
    }

    window.addEventListener("tala-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("tala-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => {
      setNotice("");
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0
      ),
    [items]
  );

  const discount = couponApplied
    ? Math.round(subtotal * 0.1 * 100) / 100
    : 0;

  const shipping =
    subtotal === 0 || subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : DELIVERY_FEE;

  const total = Math.max(0, subtotal - discount + shipping);

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const deliveryProgress = Math.min(
    100,
    (subtotal / FREE_DELIVERY_LIMIT) * 100
  );

  const amountUntilFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_LIMIT - subtotal
  );

  function updateQuantity(id: string, change: number) {
    const item = items.find((current) => current.id === id);
    if (!item) return;

    const nextQuantity = Math.max(
      1,
      Math.min(10, item.quantity + change)
    );

    const updatedCart = updateCartQuantity(id, nextQuantity);
    setItems(updatedCart);
  }

  function removeItem(id: string) {
    const updatedCart = removeFromCart(id);
    setItems(updatedCart);
    setNotice("Product removed from your bag.");
  }

  function clearCart() {
    clearStoredCart();
    setItems([]);

    window.localStorage.removeItem("tala-coupon-code");

    setCoupon("");
    setCouponApplied(false);
    setCouponError("");
    setShowClearConfirm(false);

    setNotice("Your shopping bag has been cleared.");
  }

  function applyCoupon() {
    const normalizedCoupon = coupon.trim().toUpperCase();

    if (!normalizedCoupon) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (normalizedCoupon === "TALA10") {
      window.localStorage.setItem(
        "tala-coupon-code",
        "TALA10"
      );

      setCoupon("TALA10");
      setCouponApplied(true);
      setCouponError("");
      setNotice("TALA10 discount applied successfully.");
      return;
    }

    window.localStorage.removeItem("tala-coupon-code");
    setCouponApplied(false);
    setCouponError("This coupon code is not valid.");
  }

  function removeCoupon() {
    window.localStorage.removeItem("tala-coupon-code");
    setCoupon("");
    setCouponApplied(false);
    setCouponError("");
    setNotice("Discount code removed.");
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F1EB]">
        <div className="text-center">
          <p className="font-serif text-4xl tracking-[0.3em] text-[#24221F]">
            TALA
          </p>
          <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-[#9B9084]">
            Preparing your bag
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F1EB] text-[#24221F]">
      {/* Announcement */}
      <div className="bg-[#24221F] px-4 py-3 text-center text-[9px] uppercase tracking-[0.2em] text-white sm:text-[10px]">
        Complimentary delivery on orders over EGP 3,000
      </div>

      {/* Header */}
      <header className="border-b border-[#E5DED4]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-10">
          <Link
            href="/collections"
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#776E64] transition hover:text-[#24221F]"
          >
            <ArrowLeft size={15} strokeWidth={1.4} />
            Continue shopping
          </Link>

          <Link
            href="/"
            className="text-2xl font-light tracking-[0.38em] sm:text-3xl"
          >
            TALA
          </Link>

          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#8D8378]">
            <ShoppingBag size={17} strokeWidth={1.3} />
            <span className="hidden sm:inline">Your bag</span>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed right-4 top-4 z-50 flex max-w-[calc(100%-2rem)] items-center gap-3 border border-white/10 bg-[#24221F] px-5 py-4 text-xs text-white shadow-2xl sm:right-7 sm:top-7"
            role="status"
            aria-live="polite"
          >
            <Check size={15} className="shrink-0 text-[#D8ED83]" />
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="ml-2 text-white/50 transition hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Heading */}
      <section className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 sm:px-10 sm:pt-16">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[9px] uppercase tracking-[0.35em] text-[#9A8975]">
              Your TALA selection
            </p>

            <h1 className="font-serif text-4xl font-light tracking-tight sm:text-6xl">
              Shopping Bag<span className="text-[#B4C58A]">.</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#81786F]">
              The pieces you love, collected in one place.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[#81786F]">
            <ShoppingBag size={17} strokeWidth={1.3} />
            {totalQuantity} {totalQuantity === 1 ? "ITEM" : "ITEMS"}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {items.length === 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-[1440px] px-5 pb-28 sm:px-10"
        >
          <div className="flex min-h-[440px] flex-col items-center justify-center border border-[#E3DACE] px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D8CFC2]">
              <ShoppingBag
                size={29}
                strokeWidth={1.1}
                className="text-[#8D8174]"
              />
            </div>

            <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-[#9A8975]">
              A new favourite is waiting
            </p>

            <h2 className="mt-4 font-serif text-3xl font-light sm:text-4xl">
              Your bag is empty
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#81786F]">
              Explore the latest TALA pieces and discover something
              that feels like you.
            </p>

            <Link
              href="/collections"
              className="mt-9 inline-flex min-h-[54px] items-center justify-center gap-4 bg-[#24221F] px-9 text-[9px] uppercase tracking-[0.22em] text-white transition hover:bg-[#444039]"
            >
              Explore collections
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.section>
      ) : (
        <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10">
          {/* Free delivery progress */}
          <div className="mb-9 border border-[#E3DACE] bg-white/35 px-5 py-5 sm:px-7">
            <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              {shipping === 0 ? (
                <p className="flex items-center gap-2 text-xs text-[#657B62]">
                  <Check size={15} />
                  You unlocked complimentary delivery.
                </p>
              ) : (
                <p className="text-xs text-[#655D54]">
                  You are {formatPrice(amountUntilFreeDelivery)} away
                  from complimentary delivery.
                </p>
              )}

              <span className="text-[9px] uppercase tracking-[0.15em] text-[#968A7D]">
                {formatPrice(subtotal)} / {formatPrice(FREE_DELIVERY_LIMIT)}
              </span>
            </div>

            <div className="h-[3px] overflow-hidden bg-[#E6DED3]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${deliveryProgress}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full bg-[#AAB7A0]"
              />
            </div>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1fr_390px] xl:gap-16">
            {/* Items */}
            <div>
              <div className="hidden grid-cols-[1fr_130px_110px] gap-5 border-b border-[#DED5C9] pb-5 text-[9px] uppercase tracking-[0.2em] text-[#978A7C] sm:grid">
                <span>Selected pieces</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-[#E3DACE]">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -25 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 gap-5 py-7 sm:grid-cols-[1fr_130px_110px] sm:items-center sm:gap-5"
                    >
                      {/* Product details */}
                      <div className="flex min-w-0 gap-5">
                        <Link
                          href={
                            item.productId
                              ? `/products/${item.productId}`
                              : "/collections"
                          }
                          className="h-[142px] w-[108px] shrink-0 overflow-hidden bg-[#EAE4DA] sm:h-[165px] sm:w-[126px]"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition duration-700 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#A99A89]">
                              <ShoppingBag size={25} strokeWidth={1} />
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-col justify-between py-1">
                          <div>
                            <p className="mb-2 text-[8px] uppercase tracking-[0.2em] text-[#9A8975]">
                              TALA COLLECTION
                            </p>

                            <Link
                              href={
                                item.productId
                                  ? `/products/${item.productId}`
                                  : "/collections"
                              }
                              className="line-clamp-2 font-serif text-lg leading-snug transition hover:text-[#8B765F] sm:text-xl"
                            >
                              {item.name}
                            </Link>

                            <div className="mt-3 space-y-1 text-[11px] text-[#81786F]">
                              <p>Size: {item.size || "One Size"}</p>
                              <p>Color: {item.color || "Default"}</p>
                            </div>

                            <p className="mt-3 text-sm font-medium tabular-nums">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-4 flex w-fit items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[#948779] transition hover:text-[#A45E51]"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-[9px] uppercase tracking-[0.15em] text-[#978A7C] sm:hidden">
                          Quantity
                        </span>

                        <div className="flex h-10 items-center border border-[#D8CFC2] bg-white/35">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-full w-10 items-center justify-center text-[#746A60] transition hover:bg-[#EAE4DA] disabled:opacity-30"
                          >
                            <Minus size={13} />
                          </button>

                          <span className="w-8 text-center text-xs tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= 10}
                            aria-label="Increase quantity"
                            className="flex h-full w-10 items-center justify-center text-[#746A60] transition hover:bg-[#EAE4DA] disabled:opacity-30"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="flex items-center justify-between sm:justify-end">
                        <span className="text-[9px] uppercase tracking-[0.15em] text-[#978A7C] sm:hidden">
                          Item total
                        </span>

                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Clear bag */}
              <div className="flex justify-end border-t border-[#E3DACE] pt-5">
                {!showClearConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-[9px] uppercase tracking-[0.16em] text-[#948779] transition hover:text-[#A45E51]"
                  >
                    Clear shopping bag
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-[#756B61]">
                      Remove all items?
                    </span>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="font-medium text-[#A45E51]"
                    >
                      Confirm
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="text-[#81786F]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Service notes */}
              <div className="mt-12 grid gap-6 border-t border-[#DED5C9] pt-8 sm:grid-cols-3">
                <div className="flex gap-3">
                  <Truck
                    size={19}
                    strokeWidth={1.3}
                    className="shrink-0 text-[#8E806F]"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em]">
                      Delivery
                    </p>
                    <p className="mt-2 text-[10px] leading-5 text-[#918579]">
                      EGP 120 below EGP 3,000.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.3}
                    className="shrink-0 text-[#8E806F]"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em]">
                      Safe ordering
                    </p>
                    <p className="mt-2 text-[10px] leading-5 text-[#918579]">
                      Your order is handled securely.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ShoppingBag
                    size={19}
                    strokeWidth={1.3}
                    className="shrink-0 text-[#8E806F]"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em]">
                      Cash on delivery
                    </p>
                    <p className="mt-2 text-[10px] leading-5 text-[#918579]">
                      Pay when your order arrives.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="h-fit lg:sticky lg:top-8">
              <div className="border border-[#E2D9CE] bg-[#EEE9E1] p-6 sm:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.25em] text-[#9A8975]">
                      Almost yours
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-light">
                      Order Summary
                    </h2>
                  </div>

                  <ShoppingCart
                    size={20}
                    strokeWidth={1.2}
                    className="text-[#82776B]"
                  />
                </div>

                <div className="space-y-5 text-xs">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#81786F]">
                      Subtotal ({totalQuantity} items)
                    </span>
                    <span className="tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#81786F]">Delivery</span>
                    <span className="tabular-nums">
                      {shipping === 0
                        ? "Complimentary"
                        : formatPrice(shipping)}
                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between gap-4 text-[#657B62]">
                      <span>Discount (10%)</span>
                      <span className="tabular-nums">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Coupon */}
                <div className="my-7 border-t border-[#D8CFC2]" />

                <div>
                  <label
                    htmlFor="tala-coupon"
                    className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#81786F]"
                  >
                    <Tag size={13} />
                    Discount code
                  </label>

                  {couponApplied ? (
                    <div className="flex items-center justify-between border border-[#AAB7A0] bg-[#AAB7A0]/15 px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-[#657B62]">
                        <Check size={14} />
                        <span>TALA10 applied</span>
                      </div>

                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[9px] uppercase tracking-[0.12em] text-[#81786F] transition hover:text-[#A45E51]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex border border-[#D1C7BB] bg-white/40">
                        <input
                          id="tala-coupon"
                          value={coupon}
                          onChange={(event) => {
                            setCoupon(event.target.value);
                            setCouponError("");
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              applyCoupon();
                            }
                          }}
                          placeholder="Enter code"
                          className="w-full min-w-0 bg-transparent px-4 py-3 text-xs outline-none placeholder:text-[#A69A8D]"
                        />

                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="bg-[#24221F] px-5 text-[9px] uppercase tracking-[0.13em] text-white transition hover:bg-[#444039]"
                        >
                          Apply
                        </button>
                      </div>

                      {couponError && (
                        <p className="mt-2 text-[10px] text-[#A45E51]">
                          {couponError}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="my-7 border-t border-[#D8CFC2]" />

                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif text-xl">Total</span>
                  <span className="text-xl font-medium tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="mt-3 text-[9px] leading-5 text-[#918579]">
                  {shipping === 0
                    ? "Your order qualifies for complimentary delivery."
                    : `Add ${formatPrice(
                        amountUntilFreeDelivery
                      )} more for complimentary delivery.`}
                </p>

                <Link
                  href="/checkout"
                  className="mt-7 flex min-h-[58px] w-full items-center justify-center gap-3 bg-[#24221F] px-5 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#444039]"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#8C8175]">
                  <ShieldCheck size={14} />
                  Cash on delivery available
                </div>
              </div>

              <div className="px-5 py-7 text-center">
                <p className="font-serif text-lg italic text-[#766B60]">
                  A little detail makes all the difference.
                </p>
                <p className="mt-3 text-[8px] uppercase tracking-[0.25em] text-[#A19486]">
                  TALA — Luxury Fashion
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#24221F] px-5 py-11 text-white sm:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-7 sm:flex-row">
          <Link
            href="/"
            className="text-2xl font-light tracking-[0.38em]"
          >
            TALA
          </Link>

          <nav className="flex flex-wrap justify-center gap-6 text-[8px] uppercase tracking-[0.18em] text-white/55">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link
              href="/collections"
              className="transition hover:text-white"
            >
              Collections
            </Link>
            <Link
              href="/collections/sets"
              className="transition hover:text-white"
            >
              Sets
            </Link>
            <Link
              href="/collections/jackets"
              className="transition hover:text-white"
            >
              Jackets
            </Link>
          </nav>
        </div>

        <div className="mx-auto mt-8 max-w-[1440px] border-t border-white/10 pt-6 text-center">
          <p className="text-[8px] uppercase tracking-[0.2em] text-white/35">
            © {new Date().getFullYear()} TALA. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
