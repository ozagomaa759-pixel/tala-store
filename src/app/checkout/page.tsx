import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-16 text-[#332A23]">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/cart"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#81766B] transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <div className="border border-[#E5DDD2] bg-white p-8 md:p-12">
          <ShoppingBag
            size={30}
            className="mb-6 text-[#A58B68]"
          />

          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#A58B68]">
            TALA Boutique
          </p>

          <h1 className="text-3xl font-light md:text-5xl">
            Checkout
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#81766B]">
            Your checkout experience is being prepared.
            Secure order processing and payment will be
            available once the store backend is configured.
          </p>

          <div className="mt-9 border-t border-[#E5DDD2] pt-7">
            <p className="text-sm font-medium">
              Online checkout is not active yet.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center justify-center bg-[#332A23] px-7 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#5A493B]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
