"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { getCart, type CartItem } from "@/lib/cart";

const DELIVERY_FEE = 120;

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  const updateField = (
    field: keyof typeof customer,
    value: string
  ) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-12 text-[#332A23] md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/cart"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#81766B] transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#A58B68]">
            TALA Boutique
          </p>
          <h1 className="text-4xl font-light md:text-5xl">
            Checkout
          </h1>
          <p className="mt-3 text-sm text-[#81766B]">
            Complete your order details below.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="border border-[#E5DDD2] bg-white p-10 text-center">
            <ShoppingBag
              size={34}
              className="mx-auto mb-5 text-[#A58B68]"
            />
            <h2 className="text-xl font-light">
              Your bag is empty
            </h2>
            <Link
              href="/products"
              className="mt-6 inline-flex bg-[#332A23] px-7 py-4 text-xs uppercase tracking-[0.2em] text-white"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="border border-[#E5DDD2] bg-white p-6 md:p-9">
              <h2 className="mb-7 text-xl font-light">
                Delivery Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs text-[#81766B] sm:col-span-2">
                  Full Name
                  <input
                    value={customer.fullName}
                    onChange={(e) =>
                      updateField("fullName", e.target.value)
                    }
                    className="mt-2 w-full border border-[#E5DDD2] bg-[#FDFCFB] p-4 text-sm text-[#332A23] outline-none focus:border-[#A58B68]"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </label>

                <label className="text-xs text-[#81766B]">
                  Phone Number
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    className="mt-2 w-full border border-[#E5DDD2] bg-[#FDFCFB] p-4 text-sm text-[#332A23] outline-none focus:border-[#A58B68]"
                    placeholder="01xxxxxxxxx"
                    autoComplete="tel"
                  />
                </label>

                <label className="text-xs text-[#81766B]">
                  Email Address
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    className="mt-2 w-full border border-[#E5DDD2] bg-[#FDFCFB] p-4 text-sm text-[#332A23] outline-none focus:border-[#A58B68]"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </label>

                <label className="text-xs text-[#81766B]">
                  City
                  <input
                    value={customer.city}
                    onChange={(e) =>
                      updateField("city", e.target.value)
                    }
                    className="mt-2 w-full border border-[#E5DDD2] bg-[#FDFCFB] p-4 text-sm text-[#332A23] outline-none focus:border-[#A58B68]"
                    placeholder="Your city"
                    autoComplete="address-level2"
                  />
                </label>

                <label className="text-xs text-[#81766B]">
                  Full Address
                  <input
                    value={customer.address}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    className="mt-2 w-full border border-[#E5DDD2] bg-[#FDFCFB] p-4 text-sm text-[#332A23] outline-none focus:border-[#A58B68]"
                    placeholder="Street, building, apartment"
                    autoComplete="street-address"
                  />
                </label>
              </div>

              <div className="mt-8 border-t border-[#E5DDD2] pt-6">
                <div className="flex items-center gap-3 text-sm text-[#81766B]">
                  <Truck size={19} className="text-[#A58B68]" />
                  Delivery fee: 120 EGP
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-[#81766B]">
                  <ShieldCheck size={17} className="text-[#A58B68]" />
                  Your order details will be handled securely.
                </div>
              </div>
            </section>

            <aside className="h-fit border border-[#E5DDD2] bg-white p-6 md:p-9">
              <h2 className="mb-7 text-xl font-light">
                Order Summary
              </h2>

              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="relative h-24 w-20 shrink-0 bg-[#F8F5F0]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm">{item.name}</h3>
                      <p className="mt-1 text-xs text-[#81766B]">
                        Size: {item.size} · Color: {item.color}
                      </p>
                      <p className="mt-1 text-xs text-[#81766B]">
                        Quantity: {item.quantity}
                      </p>
                      <p className="mt-2 text-sm">
                        {(item.price * item.quantity).toLocaleString("en-EG")} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4 border-t border-[#E5DDD2] pt-6 text-sm">
                <div className="flex justify-between text-[#81766B]">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString("en-EG")} EGP</span>
                </div>

                <div className="flex justify-between text-[#81766B]">
                  <span>Delivery Fee</span>
                  <span>120 EGP</span>
                </div>

                <div className="flex justify-between border-t border-[#E5DDD2] pt-5 text-base font-medium">
                  <span>Total</span>
                  <span>
                    {total.toLocaleString("en-EG")} EGP
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-8 w-full cursor-not-allowed bg-[#332A23] px-6 py-5 text-xs uppercase tracking-[0.2em] text-white opacity-60"
              >
                Order Submission Coming Soon
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-[#81766B]">
                Secure order submission will be enabled after
                backend verification is completed.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
