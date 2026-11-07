import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <p className="text-sm tracking-[0.4em] uppercase text-[#A58B70] mb-6">
          TALA Boutique
        </p>

        <h1 className="text-8xl md:text-9xl font-light tracking-tight">
          404
        </h1>

        <div className="w-16 h-px bg-[#B49A7C] mx-auto my-8" />

        <h2 className="text-2xl md:text-3xl font-light mb-4">
          Page Not Found
        </h2>

        <p className="text-[#81766D] leading-7 mb-10">
          The page you are looking for doesn&apos;t exist or may have been
          moved. Let&apos;s help you find your way back.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#332A23] text-white px-7 py-3 hover:bg-[#514237] transition-colors"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#B49A7C] px-7 py-3 hover:bg-[#EEE7DE] transition-colors"
          >
            <Search size={17} />
            Explore Collection
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
