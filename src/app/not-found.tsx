import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <p className="text-sm tracking-[0.45em] uppercase text-[#9B826B] mb-6">
          TALA Boutique
        </p>

        <h1 className="text-8xl md:text-9xl font-light tracking-tight">
          404
        </h1>

        <div className="w-16 h-px bg-[#B69A78] mx-auto my-8" />

        <h2 className="text-2xl md:text-3xl font-medium mb-4">
          Page Not Found
        </h2>

        <p className="text-[#81766D] leading-8 mb-10">
          The page you are looking for doesn't exist or may have been moved.
          Let's help you find your way back.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#332A23] text-white px-7 py-4 hover:bg-[#514237] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-[#B69A78] px-7 py-4 hover:bg-[#EEE7DE] transition-colors"
          >
            <Search size={18} />
            Explore Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
