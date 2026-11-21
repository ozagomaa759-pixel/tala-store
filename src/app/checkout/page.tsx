
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { getCart, clearCart, type CartItem } from "@/lib/cart";

const DELIVERY_FEE = 120;
const FREE_DELIVERY_LIMIT = 3000;

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-EG")} EGP`;

const inputClass =
  "mt-2 w-full rounded-xl border border-[#E5DED4] bg-white px-4 py-3.5 text-sm text-[#282821] outline-none transition placeholder:text-[#AAA49A] focus:border-[#8B9670] focus:ring-2 focus:ring-[#AAB7A0]/20";

type Customer = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
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

  const deliveryFee =
    cart.length === 0 || subtotal >= FREE_DELIVERY_LIMIT
      ? 0
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
      <main className="flex min-h-screen items-center justify-center bg-[#F5F1EB]">
        <div className="text-center">
          <p className="text-4xl font-semibold tracking-[0.25em] text-[#282821]">
            TALA
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#87916D]">
            Preparing your checkout
          </p>
        </div>
      </main>
    );
  }

  if (successOrder) {
    return (
      <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F1EB] px-5 py-16 text-[#282821]">
        <section className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[#E5DED4] bg-white px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D8ED83]/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#D7AAA4]/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF3DC] text-[#68734F]">
              <CheckCircle2 size={36} strokeWidth={1.5} />
            </div>

            <p className="mt-9 text-xs font-semibold uppercase tracking-[0.4em] text-[#87916D]">
              TALA · Order confirmed
            </p>

            <h1 className="mt-5 text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-6xl">
              Thank you for choosing TALA
            </h1>

            <p className="mt-6 text-lg text-[#817D72] sm:text-xl">
              Your order means everything 😊
            </p>

            <div className="mx-auto mt-10 max-w-sm rounded-2xl bg-[#F5F1EB] p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#898477]">
                Order number
              </p>
              <p className="mt-2 text-xl font-semibold tracking-wide">
                {successOrder.order_number}
              </p>
              <div className="my-4 h-px bg-[#E2DCD1]" />
              <p className="text-xs text-[#898477]">Order total</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatPrice(successOrder.total)}
              </p>
            </div>

            <p className="mx-auto mt-8 max-w-md text-sm leading-7 text-[#817D72]">
              We appreciate your trust in TALA.
              <br />
              We look forward to delivering your order.
            </p>

            <Link
              href="/"
              className="mt-10 inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#282821] px-9 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#596044]"
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
    <main className="min-h-screen bg-[#F5F1EB] text-[#282821]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-7 lg:px-10 lg:py-10">
        <header className="flex items-center justify-between border-b border-[#E3DDD2] pb-5">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#77766C] transition hover:text-[#282821]"
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

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#77766C]">
            <LockKeyhole size={14} />
            <span className="hidden sm:inline">Secure checkout</span>
          </div>
        </header>

        <section className="mb-10 mt-12 text-center sm:mb-14 sm:mt-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF0D9] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#65704C]">
            <PackageCheck size={13} />
            Almost yours
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
            Checkout<span className="text-[#AAB7A0]">.</span>
          </h1>

          <p className="mt-4 text-sm text-[#817D72]">
            Just a few details before your TALA order is on its way.
          </p>
        </section>

        {cart.length === 0 ? (
          <section className="mx-auto max-w-xl rounded-[2rem] border border-[#E5DED4] bg-white px-6 py-16 text-center">
            <ShoppingBag
              className="mx-auto text-[#87916D]"
              size={34}
              strokeWidth={1.4}
            />
            <h2 className="mt-6 text-2xl font-semibold">
              Your bag is empty
            </h2>
            <p className="mt-3 text-sm text-[#817D72]">
              Find something you love and come back when you are ready.
            </p>
            <Link
              href="/collections"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#282821] px-8 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#596044]"
            >
              Explore TALA
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <section className="space-y-6">
              <div className="rounded-[1.75rem] border border-[#E5DED4] bg-white p-5 sm:p-8">
                <div className="mb-7 flex items-center justify-between border-b border-[#EEE9E1] pb-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#87916D]">
                      Step 01
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Delivery details
                    </h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F1F3E8] text-[#78845E]">
                    <MapPin size={19} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-xs font-medium text-[#6F6D63] sm:col-span-2">
                    Full name <span className="text-[#B17F73]">*</span>
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

                  <label className="text-xs font-medium text-[#6F6D63] sm:col-span-2">
                    Phone number <span className="text-[#B17F73]">*</span>
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

                  <label className="text-xs font-medium text-[#6F6D63] sm:col-span-2">
                    City <span className="text-[#B17F73]">*</span>
                    <input
                      autoComplete="address-level2"
                      className={inputClass}
                      placeholder="Your city"
                      value={customer.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                    />
                  </label>

                  <label className="text-xs font-medium text-[#6F6D63] sm:col-span-2">
                    Full address <span className="text-[#B17F73]">*</span>
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

              <div className="rounded-[1.75rem] border border-[#E5DED4] bg-white p-5 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F1F3E8] text-[#78845E]">
                    <Truck size={21} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">Cash on delivery</p>
                    <p className="mt-1 text-xs text-[#817D72]">
                      Pay when your order arrives at your door.
                    </p>
                  </div>
                  <span className="ml-auto rounded-full bg-[#EAF0D9] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#65704C]">
                    Selected
                  </span>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#E5DED4] bg-white p-5 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F1F3E8] text-[#78845E]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">TALA Order Policy</p>
                    <p className="mt-2 text-sm leading-7 text-[#817D72]">
                      You may inspect your order before accepting delivery.
                      Once you accept and receive the order, returns and
                      exchanges are not available.
                    </p>
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-[#EEE9E1] pt-5 text-sm leading-6 text-[#555449]">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(event) => {
                      setPolicyAccepted(event.target.checked);
                      setOrderError("");
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#78845E]"
                  />
                  <span>
                    I have read and agree to the TALA order policy.
                    <span className="ml-1 text-[#B17F73]">*</span>
                  </span>
                </label>
              </div>
            </section>

            <aside className="rounded-[1.75rem] border border-[#E5DED4] bg-[#EEEAE1] p-5 sm:p-8 lg:sticky lg:top-8">
              <div className="flex items-center justify-between border-b border-[#DDD7CC] pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#87916D]">
                    Step 02
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Your order
                  </h2>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-medium text-[#6F6D63]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-24 w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#E1DCD1]">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-widest text-[#898477]">
                          TALA
                        </div>
                      )}
                      <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#282821] px-1 text-[10px] text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-xs text-[#817D72]">
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

              <div className="mt-7 rounded-2xl bg-white/70 p-4">
                {discount > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#65704C]">
                        TALA10 applied
                      </p>
                      <p className="mt-1 text-[10px] text-[#817D72]">
                        You saved 10% on your items.
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#65704C]">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[#817D72]">
                    No discount code applied.
                  </p>
                )}
              </div>

              <div className="mt-7 space-y-4 border-t border-[#DDD7CC] pt-6 text-sm">
                <div className="flex justify-between text-[#77766C]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#65704C]">
                    <span>Discount</span>
                    <span className="tabular-nums">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#77766C]">
                  <span>Delivery</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0
                      ? "FREE"
                      : formatPrice(deliveryFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#DDD7CC] pt-5 text-base font-semibold">
                  <span>Total</span>
                  <span className="text-xl tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#E5EBD4] p-4">
                {deliveryFee === 0 ? (
                  <p className="text-xs font-medium text-[#65704C]">
                    You unlocked complimentary delivery!
                  </p>
                ) : (
                  <p className="text-xs leading-5 text-[#65704C]">
                    Add {formatPrice(remainingForFreeDelivery)} more to unlock free delivery.
                  </p>
                )}
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#87916D] transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (subtotal / FREE_DELIVERY_LIMIT) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {orderError && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl border border-[#D7AAA4] bg-[#F8EDEA] px-4 py-3 text-xs leading-relaxed text-[#965F57]"
                >
                  {orderError}
                </p>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cart.length === 0}
                className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#282821] px-5 text-xs font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-[#596044] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Placing your order..." : "Place order"}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>

              <p className="mt-4 text-center text-[10px] leading-5 text-[#817D72]">
                <LockKeyhole className="mr-1 inline-block" size={11} />
                Your details are used to process your order.
              </p>
            </aside>
          </div>
        )}

        <footer className="mt-16 border-t border-[#E3DDD2] pt-6 text-center">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.2em]"
          >
            TALA
          </Link>
          <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-[#898477]">
            Luxury fashion · Made with care
          </p>
        </footer>
      </div>
    </main>
  );
}
