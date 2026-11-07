"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, PackageSearch, MessageCircle } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8B7867] mb-14"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <PackageSearch size={38} className="mx-auto mb-6 text-[#A58A6D]" />
          <p className="text-xs tracking-[0.4em] uppercase text-[#A58A6D] mb-4">
            TALA Boutique
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-5">
            Track Your Order
          </h1>
          <p className="text-[#81766D] leading-8">
            Enter your order details to request an update.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8E0D6] p-7 md:p-10 space-y-6"
        >
          <div>
            <label className="block text-sm mb-2">Order Number</label>
            <input
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. TALA-1001"
              className="w-full border border-[#DED5CA] bg-[#FDFCFB] px-4 py-4 outline-none focus:border-[#A58A6D]"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-[#DED5CA] bg-[#FDFCFB] px-4 py-4 outline-none focus:border-[#A58A6D]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#332A23] text-white py-4 hover:bg-[#514237] transition-colors"
          >
            Request Order Update
          </button>

          {submitted && (
            <div className="bg-[#F3EEE7] p-5 text-sm leading-7">
              <p className="font-medium mb-2">Request details received.</p>
              <p className="text-[#81766D]">
                Live order tracking is not connected yet. Please contact our
                customer care team to confirm your order status.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-4 underline"
              >
                <MessageCircle size={16} />
                Contact TALA
              </Link>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
