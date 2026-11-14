
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  MapPin,
  CalendarDays,
  CreditCard,
  Loader2,
} from "lucide-react";

type OrderItem = {
  id: string;
  product_name: string | null;
  product_image: string | null;
  selected_size: string | null;
  selected_color: string | null;
  sku: string | null;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: unknown;
  subtotal: number | string;
  shipping_cost: number | string;
  discount: number | string;
  total: number | string;
  currency: string | null;
  payment_method: string | null;
  payment_status: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
};

const ORDER_STATUSES = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const money = (value: number | string | null | undefined) =>
  `${Number(value ?? 0).toLocaleString("en-US")} EGP`;

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAddress(value: unknown): string {
  if (!value) return "No address provided";

  if (typeof value === "string") return value;

  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(
      value as Record<string, unknown>
    );

    const parts = entries
      .filter(
        ([, item]) =>
          typeof item === "string" ||
          typeof item === "number"
      )
      .map(([, item]) => String(item).trim())
      .filter(Boolean);

    return parts.join(", ") || "No address provided";
  }

  return "No address provided";
}

function statusLabel(value: string | null) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusStyle(value: string | null) {
  switch (value) {
    case "delivered":
    case "paid":
      return "bg-green-50 text-green-700";

    case "cancelled":
    case "failed":
    case "refunded":
      return "bg-red-50 text-red-700";

    case "shipped":
    case "processing":
    case "confirmed":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);
      if (paymentFilter) {
        params.set("payment_status", paymentFilter);
      }

      const response = await fetch(
        `/api/admin/orders?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not load orders");
      }

      setOrders(result.orders ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, paymentFilter]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  async function updateOrder(
    id: string,
    changes: {
      status?: string;
      payment_status?: string;
    }
  ) {
    setUpdatingOrder(id);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...changes }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not update order");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? { ...order, ...result.order }
            : order
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Update failed"
      );
    } finally {
      setUpdatingOrder(null);
    }
  }

  const totalOrders = orders.length;
  const newOrders = orders.filter(
    (order) => order.status === "new"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-12 text-[#332A23] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#8A7969] transition hover:text-[#332A23]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <ClipboardList size={36} strokeWidth={1} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#A28A72]">
                TALA Administration
              </p>
              <h1 className="mt-2 text-4xl font-light sm:text-5xl">
                Orders
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchOrders()}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#DCCFC1] px-5 text-xs uppercase tracking-widest transition hover:bg-white disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="border border-[#E5DACE] bg-white/70 p-6">
            <ShoppingBag size={23} strokeWidth={1} />
            <p className="mt-4 text-sm text-[#8A7969]">
              Total Orders
            </p>
            <p className="mt-1 text-3xl font-light">
              {totalOrders}
            </p>
          </div>

          <div className="border border-[#E5DACE] bg-white/70 p-6">
            <ClipboardList size={23} strokeWidth={1} />
            <p className="mt-4 text-sm text-[#8A7969]">
              New Orders
            </p>
            <p className="mt-1 text-3xl font-light">
              {newOrders}
            </p>
          </div>

          <div className="border border-[#E5DACE] bg-white/70 p-6">
            <Package size={23} strokeWidth={1} />
            <p className="mt-4 text-sm text-[#8A7969]">
              Delivered Orders
            </p>
            <p className="mt-1 text-3xl font-light">
              {deliveredOrders}
            </p>
          </div>
        </section>

        <section className="mt-8 border border-[#E5DACE] bg-white/60 p-5 sm:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_200px_200px_auto]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A28A72]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void fetchOrders();
                }}
                placeholder="Search order, customer or phone..."
                className="h-12 w-full border border-[#E5DACE] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#A28A72]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-12 border border-[#E5DACE] bg-white px-3 text-sm outline-none"
            >
              <option value="">All order statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="h-12 border border-[#E5DACE] bg-white px-3 text-sm outline-none"
            >
              <option value="">All payment statuses</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void fetchOrders()}
              className="h-12 bg-[#332A23] px-6 text-xs uppercase tracking-widest text-white transition hover:bg-[#51473D]"
            >
              Search
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-[#8A7969]">
              <Loader2 size={20} className="animate-spin" />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-[#E5DACE] bg-white/60 px-6 py-20 text-center">
              <ShoppingBag
                size={34}
                strokeWidth={1}
                className="mx-auto text-[#A28A72]"
              />
              <h2 className="mt-5 text-2xl font-light">
                No Orders Found
              </h2>
              <p className="mt-3 text-sm text-[#8A7969]">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const isUpdating = updatingOrder === order.id;

                return (
                  <article
                    key={order.id}
                    className="border border-[#E5DACE] bg-white/80"
                  >
                    <div className="p-5 sm:p-7">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-[#A28A72]">
                            Order Number
                          </p>
                          <h2 className="mt-2 text-xl font-medium">
                            {order.order_number || order.id}
                          </h2>
                          <p className="mt-2 flex items-center gap-2 text-xs text-[#8A7969]">
                            <CalendarDays size={14} />
                            {formatDate(order.created_at)}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-[#8A7969]">
                            Order Total
                          </p>
                          <p className="mt-1 text-2xl font-light">
                            {money(order.total)}
                          </p>
                          <span
                            className={`mt-2 inline-flex px-3 py-1 text-xs ${statusStyle(order.status)}`}
                          >
                            {statusLabel(order.status)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 border-t border-[#EEE6DD] pt-5 sm:grid-cols-2">
                        <div>
                          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A28A72]">
                            <User size={14} />
                            Customer
                          </p>
                          <p className="mt-2 text-sm">
                            {order.customer_name || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A28A72]">
                            <Phone size={14} />
                            Phone
                          </p>
                          <p className="mt-2 text-sm">
                            {order.customer_phone || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs uppercase tracking-wider text-[#8A7969]">
                            Order Status
                          </label>
                          <select
                            value={order.status || "new"}
                            disabled={isUpdating}
                            onChange={(event) =>
                              void updateOrder(order.id, {
                                status: event.target.value,
                              })
                            }
                            className="mt-2 h-11 w-full border border-[#E5DACE] bg-white px-3 text-sm outline-none disabled:opacity-50"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {statusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A7969]">
                            <CreditCard size={14} />
                            Payment Status
                          </label>
                          <select
                            value={order.payment_status || "pending"}
                            disabled={isUpdating}
                            onChange={(event) =>
                              void updateOrder(order.id, {
                                payment_status: event.target.value,
                              })
                            }
                            className="mt-2 h-11 w-full border border-[#E5DACE] bg-white px-3 text-sm outline-none disabled:opacity-50"
                          >
                            {PAYMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {statusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {isUpdating && (
                        <p className="mt-3 flex items-center gap-2 text-xs text-[#8A7969]">
                          <Loader2 size={14} className="animate-spin" />
                          Saving changes...
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(
                            isExpanded ? null : order.id
                          )
                        }
                        className="mt-6 flex w-full items-center justify-between border-t border-[#EEE6DD] pt-5 text-xs uppercase tracking-widest text-[#77695D]"
                      >
                        {isExpanded ? "Hide Details" : "View Order Details"}
                        {isExpanded ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-5 space-y-6">
                          <div>
                            <h3 className="text-sm font-medium">
                              Customer Details
                            </h3>
                            <div className="mt-3 space-y-2 text-sm text-[#77695D]">
                              <p>{order.customer_name}</p>
                              <p>{order.customer_email || "No email provided"}</p>
                              <p>{order.customer_phone}</p>
                              <p className="flex items-start gap-2">
                                <MapPin size={15} className="mt-1 shrink-0" />
                                {formatAddress(order.shipping_address)}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium">
                              Products
                            </h3>

                            <div className="mt-3 divide-y divide-[#EEE6DD] border-y border-[#EEE6DD]">
                              {(order.order_items ?? []).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                                >
                                  <div>
                                    <p className="text-sm">
                                      {item.product_name || "Product"}
                                    </p>
                                    <p className="mt-1 text-xs text-[#8A7969]">
                                      Size: {item.selected_size || "—"}
                                      {" · "}
                                      Color: {item.selected_color || "—"}
                                      {" · "}
                                      Qty: {item.quantity}
                                    </p>
                                    {item.sku && (
                                      <p className="mt-1 text-xs text-[#A28A72]">
                                        SKU: {item.sku}
                                      </p>
                                    )}
                                  </div>

                                  <p className="text-sm">
                                    {money(item.line_total)}
                                  </p>
                                </div>
                              ))}

                              {(order.order_items ?? []).length === 0 && (
                                <p className="py-4 text-sm text-[#8A7969]">
                                  No product details found for this order.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="ml-auto max-w-sm space-y-2 text-sm">
                            <div className="flex justify-between gap-4 text-[#77695D]">
                              <span>Subtotal</span>
                              <span>{money(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-[#77695D]">
                              <span>Shipping</span>
                              <span>{money(order.shipping_cost)}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-[#77695D]">
                              <span>Discount</span>
                              <span>{money(order.discount)}</span>
                            </div>
                            <div className="flex justify-between gap-4 border-t border-[#E5DACE] pt-3 text-base font-medium">
                              <span>Total</span>
                              <span>{money(order.total)}</span>
                            </div>
                          </div>

                          <div className="text-xs text-[#8A7969]">
                            Payment method:{" "}
                            {statusLabel(order.payment_method)}
                          </div>

                          {order.notes && (
                            <div className="border border-[#E5DACE] bg-[#F8F5F0] p-4">
                              <p className="text-xs uppercase tracking-wider text-[#A28A72]">
                                Order Notes
                              </p>
                              <p className="mt-2 text-sm">
                                {order.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
