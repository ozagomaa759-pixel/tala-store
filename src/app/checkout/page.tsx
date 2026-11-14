
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  ShoppingBag,
  Truck,
  CheckCircle2,
} from "lucide-react";
import {
  getCart,
  clearCart,
  type CartItem,
} from "@/lib/cart";

const DELIVERY_FEE = 120;
const FREE_DELIVERY_LIMIT = 3000;

const inputClassName =
  "mt-2 w-full border border-[#DED5CA] bg-white/70 px-4 py-3.5 text-sm text-[#332A23] outline-none transition placeholder:text-[#A69A8D] focus:border-[#A58B68] focus:ring-1 focus:ring-[#A58B68]/20";

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-EG")} EGP`;

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const [customer, setCustomer] = useState({
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
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0
      ),
    [cart]
  );

  const deliveryFee =
    cart.length === 0 || subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : DELIVERY_FEE;

  const total = subtotal + deliveryFee;

  const updateField = (
    field: keyof typeof customer,
    value: string
  ) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    if (
      !customer.fullName.trim() ||
      !customer.phone.trim() ||
      !customer.city.trim() ||
      !customer.address.trim()
    ) {
      setOrderError(
        "Please complete all required delivery details."
      );
      return;
    }

    if (cart.length === 0) {
      setOrderError("Your shopping bag is empty.");
      return;
    }

    setIsSubmitting(true);
    setOrderError("");

    try {
      // Read the latest cart before submitting the order.
      const latestCart = getCart();

      if (latestCart.length === 0) {
        setCart([]);
        throw new Error("Your shopping bag is empty.");
      }

      setCart(latestCart);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            fullName: customer.fullName.trim(),
            phone: customer.phone.trim(),
            city: customer.city.trim(),
            address: customer.address.trim(),
          },
          items: latestCart.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.order
      ) {
        throw new Error(
          result.message || "Unable to place your order."
        );
      }

      clearCart();
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
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">
        <div className="text-center">
          <p className="text-3xl font-serif tracking-[0.3em] text-[#332A23]">
            TALA
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#A58B68]">
            Preparing your checkout
          </p>
        </div>
      </main>
    );
  }

  // SUCCESS SCREEN
  if (successOrder) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0] px-6 text-center">
        <section className="w-full max-w-3xl py-20">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#D8C7B2] bg-[#F1ECE5]">
            <CheckCircle2
              size={30}
              strokeWidth={1.3}
              className="text-[#A58B68]"
            />
          </div>

          <p className="mb-8 text-xs font-medium uppercase tracking-[0.55em] text-[#A58B68]">
            TALA
          </p>

          <h1 className="text-4xl font-light leading-tight tracking-[-0.04em] text-[#332A23] sm:text-6xl md:text-7xl">
            Thank you for choosing TALA
          </h1>

          <p className="mt-7 text-xl font-light leading-relaxed text-[#806F5E] sm:text-2xl md:text-3xl">
            Your order means everything 😊
          </p>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#A58B68]">
            Order: {successOrder.order_number}
          </p>

          <p className="mt-3 text-sm text-[#806F5E]">
            Total: {formatPrice(successOrder.total)}
          </p>

          <div className="mx-auto mt-10 h-px w-20 bg-[#D8C7B2]" />

          <p className="mt-8 text-sm leading-7 text-[#806F5E]">
            We appreciate your trust in TALA.
            <br />
            We look forward to delivering your order.
          </p>

          <Link
            href="/"
            scroll={true}
            className="mt-10 inline-flex min-h-[58px] items-center justify-center gap-3 bg-[#332A23] px-10 py-5 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition duration-300 hover:bg-[#59483A]"
          >
            Back to Home
            <ArrowRight size={15} />
          </Link>

          <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-[#A99B8B]">
            TALA · Luxury Fashion
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#E5DDD2] pb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#76695D] transition hover:text-[#332A23]"
          >
            <ArrowLeft size={15} strokeWidth={1.6} />
            Back to bag
          </Link>

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.28em] text-[#332A23]"
          >
            TALA
          </Link>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#8C7D6D]">
            <LockKeyhole size={13} strokeWidth={1.5} />
            Secure checkout
          </div>
        </header>

        {/* Checkout Heading */}
        <div className="mb-10 mt-12 text-center sm:mb-14 sm:mt-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#A58B68]">
            TALA Boutique
          </p>

          <h1 className="mt-4 text-4xl font-light uppercase tracking-[0.12em] text-[#332A23] sm:text-5xl">
            CHECKOUT
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-[#A58B68]" />

          <p className="mt-4 text-sm font-light text-[#8C7D6D]">
            A few details and your order will be on its way.
          </p>
        </div>

        {cart.length === 0 ? (
          <section className="mx-auto max-w-xl border border-[#E5DDD2] bg-white/60 px-6 py-16 text-center">
            <ShoppingBag
              className="mx-auto text-[#A58B68]"
              size={30}
              strokeWidth={1.3}
            />

            <h2 className="mt-6 text-2xl font-light">
              Your bag is empty
            </h2>

            <p className="mt-2 text-sm text-[#8C7D6D]">
              Add something you love before checking out.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex bg-[#332A23] px-8 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-[#59483A]"
            >
              Explore collection
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            {/* Delivery Details */}
            <section className="border border-[#E5DDD2] bg-white/55 p-5 sm:p-8">
              <div className="mb-8 flex items-center justify-between border-b border-[#EAE3DA] pb-5">
                <h2 className="text-lg font-light tracking-wide">
                  Delivery details
                </h2>

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A58B68]">
                  Step 01
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-[10px] uppercase tracking-[0.16em] text-[#76695D] sm:col-span-2">
                  Full name{" "}
                  <span className="text-[#A58B68]">*</span>

                  <input
                    autoComplete="name"
                    className={inputClassName}
                    placeholder="Your full name"
                    value={customer.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                  />
                </label>

                <label className="text-[10px] uppercase tracking-[0.16em] text-[#76695D] sm:col-span-2">
                  Phone number{" "}
                  <span className="text-[#A58B68]">*</span>

                  <input
                    autoComplete="tel"
                    inputMode="tel"
                    className={inputClassName}
                    placeholder="Your phone number"
                    value={customer.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                  />
                </label>

                <label className="text-[10px] uppercase tracking-[0.16em] text-[#76695D] sm:col-span-2">
                  City{" "}
                  <span className="text-[#A58B68]">*</span>

                  <input
                    autoComplete="address-level2"
                    className={inputClassName}
                    placeholder="Your city"
                    value={customer.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                  />
                </label>

                <label className="text-[10px] uppercase tracking-[0.16em] text-[#76695D] sm:col-span-2">
                  Full address{" "}
                  <span className="text-[#A58B68]">*</span>

                  <textarea
                    autoComplete="street-address"
                    rows={4}
                    className={`${inputClassName} resize-none`}
                    placeholder="Street, building, floor, and apartment number"
                    value={customer.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                  />
                </label>
              </div>

              {/* Payment Method */}
              <div className="mt-8 border-t border-[#EAE3DA] pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F1ECE5] text-[#8A745C]">
                    <Truck size={19} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-sm">
                      Cash on delivery
                    </p>

                    <p className="mt-1 text-xs text-[#8C7D6D]">
                      Pay when your order arrives.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Order Summary */}
            <aside className="h-fit border border-[#E5DDD2] bg-[#F2EDE6] p-5 sm:p-8">
              <div className="mb-7 flex items-center justify-between border-b border-[#DED5CA] pb-5">
                <h2 className="text-lg font-light tracking-wide">
                  Your order
                </h2>

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A58B68]">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  {cart.reduce((sum, item) => sum + item.quantity, 0) === 1
                    ? "Item"
                    : "Items"}
                </span>
              </div>

              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#E7DFD5]">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-[#332A23]">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-xs text-[#8C7D6D]">
                          Size: {item.size} · Color: {item.color}
                        </p>

                        <p className="mt-1 text-xs text-[#8C7D6D]">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm tabular-nums">
                        {formatPrice(
                          Number(item.price) * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-8 space-y-4 border-t border-[#DED5CA] pt-6 text-sm">
                <div className="flex justify-between text-[#76695D]">
                  <span>Subtotal</span>

                  <span className="tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[#76695D]">
                  <span>Delivery</span>

                  <span className="tabular-nums">
                    {deliveryFee === 0
                      ? "Complimentary"
                      : formatPrice(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-[#DED5CA] pt-5 text-base text-[#332A23]">
                  <span>Total</span>

                  <span className="font-medium tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[#8C7D6D]">
                {deliveryFee === 0
                  ? "Your order qualifies for complimentary delivery."
                  : `Add ${formatPrice(
                      FREE_DELIVERY_LIMIT - subtotal
                    )} more to enjoy free delivery.`}
              </p>

              {/* Error */}
              {orderError && (
                <p
                  role="alert"
                  className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700"
                >
                  {orderError}
                </p>
              )}

              {/* Place Order */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cart.length === 0}
                className="mt-7 w-full bg-[#332A23] px-6 py-5 text-[10px] uppercase tracking-[0.24em] text-white transition hover:bg-[#59483A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Placing your order..."
                  : "Place order · Cash on delivery"}
              </button>

              <p className="mt-4 text-center text-[10px] leading-relaxed text-[#8C7D6D]">
                Your order details are submitted securely.
              </p>
            </aside>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-[#E5DDD2] pt-6 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#A99B8B]">
            TALA · Made with care
          </p>
        </footer>
      </div>
    </main>
  );
}
