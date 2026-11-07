import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Plus,
  ShoppingBag,
} from "lucide-react";

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-20 text-[#332A23]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#8A7969]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-12 flex items-center gap-4">
          <Package size={36} strokeWidth={1} />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A28A72]">
              TALA Administration
            </p>
            <h1 className="mt-2 text-5xl font-light">
              Products
            </h1>
          </div>
        </div>

        <section className="mt-12 border border-[#E5DACE] bg-white/60 p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-light">
                Product Management
              </h2>
              <p className="mt-3 text-sm text-[#77695D]">
                Organize and manage the TALA collection.
              </p>
            </div>
            <ShoppingBag size={30} strokeWidth={1} />
          </div>

          <div className="mt-10 border-t border-[#E5DACE] pt-8">
            <p className="text-sm text-[#77695D]">
              Your product management workspace is ready
              for database integration.
            </p>
          </div>
        </section>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-3 border-b border-[#A28A72] pb-2 text-xs uppercase tracking-widest"
        >
          <Plus size={16} />
          View Store Products
        </Link>
      </div>
    </main>
  );
}
