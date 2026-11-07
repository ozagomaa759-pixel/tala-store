import Link from "next/link";
import { UserRound, ShoppingBag, ArrowRight } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-24 text-[#332A23]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#A28A72]">
          Welcome to TALA
        </p>

        <div className="mt-8 flex items-center gap-4">
          <UserRound size={34} strokeWidth={1} />
          <h1 className="text-5xl font-light sm:text-7xl">
            My Account
          </h1>
        </div>

        <p className="mt-6 max-w-xl leading-8 text-[#77695D]">
          Your personal space at TALA. Discover your collection
          and manage your shopping experience.
        </p>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          <Link
            href="/products"
            className="group border border-[#E5DACE] bg-white/50 p-8 transition hover:bg-white"
          >
            <ShoppingBag size={26} strokeWidth={1} />
            <h2 className="mt-6 text-2xl">Explore Products</h2>
            <p className="mt-3 text-sm text-[#77695D]">
              Discover the latest TALA collection.
            </p>
            <ArrowRight className="mt-8 transition group-hover:translate-x-2" />
          </Link>

          <Link
            href="/cart"
            className="group border border-[#E5DACE] bg-white/50 p-8 transition hover:bg-white"
          >
            <ShoppingBag size={26} strokeWidth={1} />
            <h2 className="mt-6 text-2xl">My Shopping Bag</h2>
            <p className="mt-3 text-sm text-[#77695D]">
              Review your selected items.
            </p>
            <ArrowRight className="mt-8 transition group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </main>
  );
}
