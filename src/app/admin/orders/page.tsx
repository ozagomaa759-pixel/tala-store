import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Package,
  ShoppingBag,
} from "lucide-react";

export default function AdminOrdersPage() {
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
          <ClipboardList size={36} strokeWidth={1} />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A28A72]">
              TALA Administration
            </p>
            <h1 className="mt-2 text-5xl font-light">
              Orders
            </h1>
          </div>
        </div>

        <section className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="border border-[#E5DACE] bg-white/60 p-8">
            <ShoppingBag size={28} strokeWidth={1} />
            <h2 className="mt-5 text-2xl font-light">
              Order Management
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#77695D]">
              View and manage customer orders from one place.
            </p>
          </div>

          <div className="border border-[#E5DACE] bg-white/60 p-8">
            <Package size={28} strokeWidth={1} />
            <h2 className="mt-5 text-2xl font-light">
              Order Status
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#77695D]">
              Prepare the order workflow for processing,
              shipping, and delivery.
            </p>
          </div>
        </section>

        <p className="mt-10 text-sm text-[#8A7969]">
          No order records are connected yet.
        </p>
      </div>
    </main>
  );
}
