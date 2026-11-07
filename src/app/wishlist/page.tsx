import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23] px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8B7867] mb-16"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <header className="text-center mb-16">
          <Heart size={34} className="mx-auto mb-6 text-[#A58A6D]" />
          <p className="text-xs tracking-[0.4em] uppercase text-[#A58A6D] mb-4">
            TALA Boutique
          </p>
          <h1 className="text-4xl md:text-6xl font-light mb-5">
            Your Wishlist
          </h1>
          <p className="text-[#81766D] leading-8">
            Keep the pieces you love close.
          </p>
        </header>

        <section className="max-w-xl mx-auto text-center bg-white border border-[#E8E0D6] px-7 py-16">
          <div className="w-20 h-20 rounded-full bg-[#F3EEE7] flex items-center justify-center mx-auto mb-7">
            <Heart size={30} className="text-[#A58A6D]" />
          </div>

          <h2 className="text-2xl font-light mb-4">
            Your wishlist is empty
          </h2>

          <p className="text-sm text-[#81766D] leading-7 mb-9">
            Discover the TALA collection and find something you love.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-3 bg-[#332A23] text-white px-8 py-4 hover:bg-[#514237] transition-colors"
          >
            <ShoppingBag size={17} />
            Explore Collection
          </Link>
        </section>

        <p className="text-xs text-center text-[#9A8E82] mt-10">
          Wishlist saving and account syncing are not connected yet.
        </p>
      </div>
    </main>
  );
}
