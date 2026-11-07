import Link from "next/link";
import { ArrowLeft, Package, Boxes } from "lucide-react";

export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-20 text-[#332A23]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#8A7969] hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-12 flex items-center gap-4">
          <Boxes size={34} strokeWidth={1} />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#A28A72]">
              TALA Administration
            </p>
            <h1 className="mt-2 text-4xl font-light sm:text-6xl">
              Inventory
            </h1>
          </div>
        </div>

        <section className="mt-12 border border-[#E5DACE] bg-white/60 p-8">
          <Package size={30} strokeWidth={1} />
          <h2 className="mt-6 text-2xl font-light">
            Inventory Management
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#77695D]">
            Manage your product stock, monitor availability,
            and organize inventory for the TALA store.
          </p>
          <p className="mt-6 text-xs uppercase tracking-widest text-[#A28A72]">
            Inventory dashboard
          </p>
        </section>
      </div>
    </main>
  );
}
