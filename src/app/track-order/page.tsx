"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  PackageSearch,
  Truck,
  XCircle,
} from "lucide-react";

type TrackedOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: "Order received",
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  processing: "Being prepared",
  preparing: "Being prepared",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-EG", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function readableStatus(status: string) {
  const normalized = status.trim().toLowerCase();
  return STATUS_LABELS[normalized] ?? normalized.replace(/[_-]+/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ orderNumber: orderNumber.trim(), phone: phone.trim() }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.message || "We couldn't find your order. Please check your details.");
        return;
      }

      setOrder(result.order as TrackedOrder);
    } catch {
      setError("We couldn't connect to order tracking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const status = order?.status?.toLowerCase() ?? "";
  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered" || status === "completed";

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-16 text-[#332A23]">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-14 inline-flex items-center gap-2 text-sm text-[#8B7867]">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <header className="mb-12 text-center">
          <PackageSearch size={38} className="mx-auto mb-6 text-[#A58A6D]" />
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#A58A6D]">TALA LUXURY FASHION</p>
          <h1 className="mb-5 text-4xl font-light md:text-5xl">Track Your Order</h1>
          <p className="leading-8 text-[#81766D]">
            Enter the order number and phone number used at checkout to view your latest order status.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 border border-[#E8E0D6] bg-white p-7 md:p-10">
          <div>
            <label htmlFor="orderNumber" className="mb-2 block text-sm">Order Number</label>
            <input
              id="orderNumber"
              required
              autoComplete="off"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="e.g. TALA-1001"
              className="w-full border border-[#DED5CA] bg-[#FDFCFB] px-4 py-4 outline-none transition-colors focus:border-[#A58A6D]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm">Phone Number</label>
            <input
              id="phone"
              required
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="The phone number used at checkout"
              className="w-full border border-[#DED5CA] bg-[#FDFCFB] px-4 py-4 outline-none transition-colors focus:border-[#A58A6D]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#332A23] py-4 text-white transition-colors hover:bg-[#514237] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking your order…" : "Track Order"}
          </button>

          {error && (
            <p role="alert" className="border border-[#E8D5D0] bg-[#FBF4F1] p-4 text-sm leading-7 text-[#8A453A]">
              {error}
            </p>
          )}
        </form>

        {order && (
          <section aria-live="polite" className="mt-8 border border-[#E8E0D6] bg-white p-7 md:p-10">
            <div className="mb-7 flex items-start gap-3">
              {isCancelled ? (
                <XCircle className="mt-1 text-[#9B5148]" size={24} />
              ) : isDelivered ? (
                <CheckCircle2 className="mt-1 text-[#667D62]" size={24} />
              ) : (
                <Truck className="mt-1 text-[#A58A6D]" size={24} />
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#A58A6D]">Order status</p>
                <h2 className="mt-2 text-2xl font-light">{readableStatus(order.status)}</h2>
              </div>
            </div>

            <div className="grid gap-5 border-t border-[#EEE8E0] pt-6 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-[#9A8D80]">Order number</p>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-[#9A8D80]">Payment status</p>
                <p className="font-medium">{readableStatus(order.paymentStatus)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-[#9A8D80]">Placed on</p>
                <p className="text-sm">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-[#9A8D80]">Last updated</p>
                <p className="inline-flex items-center gap-2 text-sm"><Clock3 size={14} /> {formatDate(order.updatedAt)}</p>
              </div>
            </div>
            <p className="mt-7 border-t border-[#EEE8E0] pt-5 text-sm leading-7 text-[#81766D]">
              Thank you for choosing TALA. For help with your order, please contact our customer care team.
            </p>
            <Link href="/contact" className="mt-3 inline-flex text-sm underline underline-offset-4">Contact TALA</Link>
          </section>
        )}
      </div>
    </main>
  );
}
