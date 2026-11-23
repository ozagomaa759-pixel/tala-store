
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getCart, clearCart, type CartItem } from "@/lib/cart";

const DELIVERY_FEE = 120;
const SUEZ_DELIVERY_FEE = 40;
const FREE_DELIVERY_LIMIT = 3000;

const THEME = {
  page: "#B8AA98",
  panel: "#C9BBA9",
  stone: "#A99A88",
  soft: "#D4C8B8",
  ink: "#292923",
  muted: "#665F55",
  lime: "#D8ED83",
  line: "rgba(41,41,35,0.16)",
  darkPanel: "#34342D",
};

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-EG")} EGP`;

type Customer = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#292923]/20 bg-[#D4C8B8] px-4 py-3.5 text-sm text-[#292923] outline-none transition placeholder:text-[#665F55]/65 focus:border-[#292923] focus:ring-2 focus:ring-[#D8ED83]/60";

const normalizeLocation = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s،,.-]+/g, "")
    .trim();

const isSuezLocation = (city: string, address: string) => {
  const normalizedCity = normalizeLocation(city);

  const isSuezCity = [
    "السويس",
    "suez",
    "السويسمصر",
    "suezegypt",
  ].includes(normalizedCity);

  const hasEnglishSuez =
    /(^|[^a-z])suez([^a-z]|$)/i.test(city);

  const addressParts = address
    .toLowerCase()
    .split(/[,،\n]/)
    .map((part) => normalizeLocation(part));

  const hasSuezInAddress = addressParts.some((part) =>
    ["السويس", "suez"].includes(part)
  );

  return isSuezCity || hasEnglishSuez || hasSuezInAddress;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const [customer, setCustomer] = useState<Customer>({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [successOrder, setSuccessOrder] = useState<{
    order_number: string;
    total: number;
  } | null>(null);

  useEffect(() => {
    const syncCart = () => {
      setCart(getCart());
      setCartLoaded(true);
    };

    syncCart();

    setCouponCode(
      window.localStorage.getItem("tala-coupon-code") || ""
    );

    window.addEventListener("tala-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("tala-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      ),
    [cart]
  );

  const isSuez = isSuezLocation(customer.city, customer.address);

  const deliveryFee =
    cart.length === 0 || subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : isSuez
        ? SUEZ_DELIVERY_FEE
        : DELIVERY_FEE;

  const discount =
    couponCode.trim().toUpperCase() === "TALA10"
      ? Math.round(subtotal * 0.1 * 100) / 100
      : 0;

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const remainingForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_LIMIT - subtotal
  );

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const updateField = (field: keyof Customer, value: string) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));

    setOrderError("");
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    if (!policyAccepted) {
      setOrderError(
        "Please read and accept the TALA order policy before placing your order."
      );
      return;
    }

    const cleanCustomer = {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      city: customer.city.trim(),
      address: customer.address.trim(),
    };

    if (
      !cleanCustomer.fullName ||
      !cleanCustomer.phone ||
      !cleanCustomer.city ||
      !cleanCustomer.address
    ) {
      setOrderError("Please complete all delivery details.");
      return;
    }

    const phoneDigits = cleanCustomer.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setOrderError("Please enter a valid phone number.");
      return;
    }

    const latestCart = getCart();

    if (latestCart.length === 0) {
      setCart([]);
      setOrderError("Your shopping bag is empty.");
      return;
    }

    setIsSubmitting(true);
    setOrderError("");
    setCart(latestCart);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: cleanCustomer,
          couponCode: couponCode.trim().toUpperCase(),
          policyAccepted,
          items: latestCart.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.order) {
        throw new Error(
          result.message || "Unable to place your order."
        );
      }

      clearCart();
      window.localStorage.removeItem("tala-coupon-code");

      setCouponCode("");
      setCart([]);

      setSuccessOrder({
        order_number: result.order.order_number,
        total: Number(result.order.total),
      });
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartLoaded) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-5"
        style={{ background: THEME.page, color: THEME.ink }}
      >
        <div className="text-center">
          <p className="text-4xl font-semibold tracking-[0.25em]">
            TALA
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] opacity-65">
            Preparing your checkout
          </p>
        </div>
      </main>
    );
  }

  if (successOrder) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-5 py-16"
        style={{ background: THEME.page, color: THEME.ink }}
      >
        <section
          className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border px-6 py-16 text-center sm:px-12 sm:py-20"
          style={{
            background: THEME.panel,
            borderColor: THEME.line,
          }}
        >
          <div
            className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
            style={{ background: `${THEME.lime}55` }}
          />
          <div
            className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full blur-3xl"
            style={{ background: `${THEME.stone}80` }}
          />

          <div className="relative">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: THEME.lime,
                color: THEME.ink,
              }}
            >
              <CheckCircle2 size={36} strokeWidth={1.5} />
            </div>

            <p className="mt-9 text-xs font-semibold uppercase tracking-[0.4em] opacity-65">
              TALA · Order confirmed
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">
              Thank you for choosing TALA.
            </h1>

            <p className="mt-6 text-lg opacity-70 sm:text-xl">
              Your order means everything 😊
            </p>

            <div
              className="mx-auto mt-10 max-w-sm rounded-2xl p-6"
              style={{
                background: THEME.darkPanel,
                color: "#F0E9DD",
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-65">
                Order number
              </p>
              <p className="mt-2 text-xl font-semibold tracking-wide">
                {successOrder.order_number}
              </p>
              <div
                className="my-4 h-px"
                style={{ background: "rgba(255,255,255,0.18)" }}
              />
              <p className="text-xs opacity-65">Order total</p>
              <p
                className="mt-1 text-2xl font-semibold"
                style={{ color: THEME.lime }}
              >
                {formatPrice(successOrder.total)}
              </p>
            </div>

            <p className="mx-auto mt-8 max-w-md text-sm leading-7 opacity-75">
              We appreciate your trust in TALA.
              <br />
              We look forward to delivering your order.
            </p>

            <Link
              href="/"
              className="mt-10 inline-flex min-h-14 items-center justify-center gap-4 rounded-full px-9 text-xs font-semibold uppercase tracking-[0.15em] transition hover:opacity-80"
              style={{
                background: THEME.ink,
                color: THEME.lime,
              }}
            >
              Back to home
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: THEME.page, color: THEME.ink }}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-7 lg:px-10 lg:py-10">
        <header
          className="flex items-center justify-between border-b pb-5"
          style={{ borderColor: THEME.line }}
        >
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-medium opacity-70 transition hover:opacity-100"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to bag</span>
            <span className="sm:hidden">Bag</span>
          </Link>

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.25em]"
          >
            TALA
          </Link>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] opacity-70">
            <LockKeyhole size={14} />
            <span className="hidden sm:inline">Secure checkout</span>
          </div>
        </header>

        <section className="mb-10 mt-12 text-center sm:mb-14 sm:mt-16">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{
              background: THEME.lime,
              color: THEME.ink,
            }}
          >
            <Sparkles size={13} />
            Almost yours
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
            Checkout<span style={{ color: THEME.lime }}>.</span>
          </h1>

          <p className="mt-4 text-sm opacity-70">
            Just a few details before your TALA order is on its way.
          </p>
        </section>

        {cart.length === 0 ? (
          <section
            className="mx-auto max-w-xl rounded-[2rem] border px-6 py-16 text-center"
            style={{
              background: THEME.panel,
              borderColor: THEME.line,
            }}
          >
            <ShoppingBag
              className="mx-auto"
              style={{ color: THEME.ink }}
              size={34}
              strokeWidth={1.4}
            />
            <h2 className="mt-6 text-2xl font-semibold">
              Your bag is empty
            </h2>
            <p className="mt-3 text-sm opacity-70">
              Find something you love and come back when you are ready.
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition hover:opacity-80"
              style={{
                background: THEME.ink,
                color: THEME.lime,
              }}
            >
              Explore TALA
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <section className="space-y-6">
              <div
                className="rounded-[1.75rem] border p-5 sm:p-8"
                style={{
                  background: THEME.panel,
                  borderColor: THEME.line,
                }}
              >
                <div
                  className="mb-7 flex items-center justify-between border-b pb-5"
                  style={{ borderColor: THEME.line }}
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-65">
                      Step 01
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Delivery details
                    </h2>
                  </div>
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                      background: THEME.lime,
                      color: THEME.ink,
                    }}
                  >
                    <MapPin size={19} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-xs font-medium sm:col-span-2">
                    Full name <span className="opacity-60">*</span>
                    <input
                      autoComplete="name"
                      className={inputClass}
                      placeholder="Your full name"
                      value={customer.fullName}
                      onChange={(event) =>
                        updateField("fullName", event.target.value)
                      }
                    />
                  </label>

                  <label className="text-xs font-medium sm:col-span-2">
                    Phone number <span className="opacity-60">*</span>
                    <input
                      autoComplete="tel"
                      inputMode="tel"
                      className={inputClass}
                      placeholder="01XXXXXXXXX"
                      value={customer.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                    />
                  </label>

                  <label className="text-xs font-medium sm:col-span-2">
                    City <span className="opacity-60">*</span>
                    <input
                      autoComplete="address-level2"
                      className={inputClass}
                      placeholder="Your city (e.g. Suez / السويس)"
                      value={customer.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                    />
                  </label>

                  <label className="text-xs font-medium sm:col-span-2">
                    Full address <span className="opacity-60">*</span>
                    <textarea
                      autoComplete="street-address"
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Street, building, floor and apartment number"
                      value={customer.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                    />
                  </label>
                </div>
              </div>

              <div
                className="rounded-[1.75rem] border p-5 sm:p-8"
                style={{
                  background: THEME.panel,
                  borderColor: THEME.line,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: THEME.lime,
                      color: THEME.ink,
                    }}
                  >
                    <Truck size={21} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">Cash on delivery</p>
                    <p className="mt-1 text-xs opacity-70">
                      Pay when your order arrives at your door.
                    </p>
                  </div>
                  <span
                    className="ml-auto rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]"
                    style={{
                      background: THEME.lime,
                      color: THEME.ink,
                    }}
                  >
                    Selected
                  </span>
                </div>
              </div>

              <div
                className="rounded-[1.75rem] border p-5 sm:p-8"
                style={{
                  background: THEME.panel,
                  borderColor: THEME.line,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: THEME.lime,
                      color: THEME.ink,
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">TALA Order Policy</p>
                    <p className="mt-2 text-sm leading-7 opacity-75">
                      You may inspect your order before accepting delivery.
                      Once you accept and receive the order, returns and
                      exchanges are not available.
                    </p>
                  </div>
                </div>

                <label
                  className="mt-6 flex cursor-pointer items-start gap-3 border-t pt-5 text-sm leading-6"
                  style={{ borderColor: THEME.line }}
                >
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(event) => {
                      setPolicyAccepted(event.target.checked);
                      setOrderError("");
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#292923]"
                  />
                  <span>
                    I have read and agree to the TALA order policy.
                    <span className="ml-1 opacity-60">*</span>
                  </span>
                </label>
              </div>
            </section>

            <aside
              className="rounded-[1.75rem] border p-5 sm:p-8 lg:sticky lg:top-8"
              style={{
                background: THEME.darkPanel,
                borderColor: "rgba(41,41,35,0.25)",
                color: "#F0E9DD",
              }}
            >
              <div
                className="flex items-center justify-between border-b pb-5"
                style={{ borderColor: "rgba(255,255,255,0.16)" }}
              >
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: THEME.lime }}
                  >
                    Step 02
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Your order
                  </h2>
                </div>
                <span
                  className="rounded-full px-3 py-2 text-xs font-medium"
                  style={{
                    background: THEME.lime,
                    color: THEME.ink,
                  }}
                >
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div
                      className="relative h-24 w-[76px] shrink-0 overflow-hidden rounded-xl"
                      style={{ background: THEME.stone }}
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-widest text-[#292923]">
                          TALA
                        </div>
                      )}
                      <span
                        className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[10px]"
                        style={{
                          background: THEME.lime,
                          color: THEME.ink,
                        }}
                      >
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-xs opacity-60">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-7 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {discount > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: THEME.lime }}
                      >
                        TALA10 applied
                      </p>
                      <p className="mt-1 text-[10px] opacity-65">
                        You saved 10% on your items.
                      </p>
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: THEME.lime }}
                    >
                      -{formatPrice(discount)}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs opacity-65">
                    No discount code applied.
                  </p>
                )}
              </div>

              <div
                className="mt-7 space-y-4 border-t pt-6 text-sm"
                style={{ borderColor: "rgba(255,255,255,0.16)" }}
              >
                <div className="flex justify-between opacity-70">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div
                    className="flex justify-between"
                    style={{ color: THEME.lime }}
                  >
                    <span>Discount</span>
                    <span className="tabular-nums">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between opacity-70">
                  <span>
                    Delivery
                    {deliveryFee > 0 && isSuez ? " · Suez" : ""}
                  </span>
                  <span className="tabular-nums">
                    {deliveryFee === 0
                      ? "FREE"
                      : formatPrice(deliveryFee)}
                  </span>
                </div>

                <div
                  className="flex items-center justify-between border-t pt-5 text-base font-semibold"
                  style={{ borderColor: "rgba(255,255,255,0.16)" }}
                >
                  <span>Total</span>
                  <span
                    className="text-xl tabular-nums"
                    style={{ color: THEME.lime }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div
                className="mt-5 rounded-xl p-4"
                style={{
                  background: "rgba(216,237,131,0.13)",
                  color: THEME.lime,
                }}
              >
                {deliveryFee === 0 ? (
                  <p className="text-xs font-medium">
                    You unlocked complimentary delivery!
                  </p>
                ) : (
                  <p className="text-xs leading-5">
                    Add {formatPrice(remainingForFreeDelivery)} more to unlock free delivery.
                  </p>
                )}
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.16)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (subtotal / FREE_DELIVERY_LIMIT) * 100
                      )}%`,
                      background: THEME.lime,
                    }}
                  />
                </div>
              </div>

              {orderError && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl border px-4 py-3 text-xs leading-relaxed"
                  style={{
                    borderColor: "#D7AAA4",
                    background: "#F0DCD5",
                    color: "#783F38",
                  }}
                >
                  {orderError}
                </p>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cart.length === 0}
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.13em] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: THEME.lime,
                  color: THEME.ink,
                }}
              >
                {isSubmitting ? "Placing your order..." : "Place order"}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>

              <p className="mt-4 text-center text-[10px] leading-5 opacity-55">
                <LockKeyhole className="mr-1 inline-block" size={11} />
                Your details are used to process your order.
              </p>
            </aside>
          </div>
        )}

        <footer
          className="mt-16 border-t pt-6 text-center"
          style={{ borderColor: THEME.line }}
        >
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.2em]"
          >
            TALA
          </Link>
          <p className="mt-2 text-[9px] uppercase tracking-[0.25em] opacity-60">
            Luxury fashion · Made with care
          </p>
        </footer>
      </div>
    </main>
  );
}
