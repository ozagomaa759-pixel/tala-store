
"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  TrendingUp,
  UserRound,
  XCircle,
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
  delivered_at: string | null;
  order_items: OrderItem[];
};

type PeriodStats = {
  orders: number;
  revenue: number;
};

type Analytics = {
  success: boolean;
  timeZone: string;
  currency: string;
  sales: {
    today: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
    allTime: PeriodStats;
  };
  orders: {
    total: number;
    delivered: number;
    pending: number;
    cancelled: number;
    deliveredWithoutDate: number;
  };
  pending: {
    orders: number;
    value: number;
  };
  generatedAt: string;
};

const ORDER_STATUSES = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
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
    timeZone: "Africa/Cairo",
  });
}

function formatAddress(value: unknown): string {
  if (!value) return "No address provided";
  if (typeof value === "string") return value;

  if (typeof value === "object" && !Array.isArray(value)) {
    const parts = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => typeof item === "string" || typeof item === "number")
      .map(([, item]) => String(item).trim())
      .filter(Boolean);

    return parts.join(", ") || "No address provided";
  }

  return "No address provided";
}

function statusLabel(value: string | null) {
  if (!value) return "Unknown";
  if (value === "shipped") return "With Delivery";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusStyle(value: string | null) {
  switch (value) {
    case "delivered":
    case "paid":
      return "border-[#D8E7C5] bg-[#F0F6E8] text-[#526B3C]";
    case "cancelled":
    case "failed":
    case "refunded":
      return "border-[#EBCFCB] bg-[#FBF0EE] text-[#A05249]";
    case "shipped":
    case "processing":
    case "confirmed":
      return "border-[#D5DFE8] bg-[#F0F4F8] text-[#536B82]";
    default:
      return "border-[#E8DFC4] bg-[#FAF6E9] text-[#92763B]";
  }
}

function SectionLabel({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89877D]">
      {icon}
      {children}
    </div>
  );
}

function SalesCard({
  title,
  stats,
  icon,
  loading,
  featured = false,
}: {
  title: string;
  stats: PeriodStats | null;
  icon: ReactNode;
  loading: boolean;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 ${
        featured
          ? "border-[#292D25] bg-[#292D25] text-white"
          : "border-[#E9E5DC] bg-white text-[#292D25]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-xs ${
            featured ? "text-white/60" : "text-[#89877D]"
          }`}
        >
          {title}
        </p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            featured
              ? "bg-[#D8ED83] text-[#292D25]"
              : "bg-[#F4F2EC] text-[#686C5D]"
          }`}
        >
          {icon}
        </span>
      </div>

      {loading || !stats ? (
        <div
          className={`mt-6 h-8 w-32 animate-pulse rounded ${
            featured ? "bg-white/10" : "bg-[#F0EEE8]"
          }`}
        />
      ) : (
        <>
          <p className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">
            {money(stats.revenue)}
          </p>
          <p
            className={`mt-2 text-[11px] ${
              featured ? "text-white/55" : "text-[#99968C]"
            }`}
          >
            {stats.orders.toLocaleString("en-US")} delivered orders
          </p>
        </>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string | number;
  detail?: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E9E5DC] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#89877D]">{title}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F2EC] text-[#777B69]">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-medium tracking-tight text-[#292D25]">
        {value}
      </p>
      {detail && (
        <p className="mt-1 text-[11px] text-[#99968C]">{detail}</p>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError("");

    try {
      const response = await fetch("/api/admin/analytics", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not load sales analytics");
      }

      setAnalytics(result as Analytics);
    } catch (err) {
      setAnalyticsError(
        err instanceof Error ? err.message : "Could not load sales analytics"
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);
      if (paymentFilter) params.set("payment_status", paymentFilter);

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

  const refreshAll = useCallback(() => {
    void Promise.all([fetchOrders(), fetchAnalytics()]);
  }, [fetchOrders, fetchAnalytics]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  async function updateOrder(
    id: string,
    changes: {
      status?: string;
      payment_status?: string;
    }
  ) {
    if (changes.status === "cancelled") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order? Its reserved stock will be restored to inventory."
      );

      if (!confirmed) return;
    }

    setUpdatingOrder(id);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not update order");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, ...result.order } : order
        )
      );

      void fetchAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingOrder(null);
    }
  }

  async function deleteOrder(order: Order) {
    const confirmed = window.confirm(
      `Permanently delete order ${order.order_number || order.id}?\n\nIf this order has not been delivered or cancelled, its stock will be restored first. This action cannot be undone.`
    );

    if (!confirmed) return;

    setUpdatingOrder(order.id);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not delete order");
      }

      setOrders((current) =>
        current.filter((item) => item.id !== order.id)
      );

      if (expandedOrder === order.id) setExpandedOrder(null);

      void fetchAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setUpdatingOrder(null);
    }
  }

  const newOrders = orders.filter((order) => order.status === "new").length;

  return (
    <main className="min-h-screen bg-[#F5F3ED] px-4 py-7 text-[#292D25] sm:px-7 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#777B70] transition hover:text-[#292D25]"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        <header className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8B9278]">
              TALA / Administration
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Orders<span className="text-[#A7B68C]">.</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#85857A]">
              Manage customer orders, track deliveries and keep an eye on
              your store performance.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshAll}
            disabled={loading || analyticsLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#DCDDD2] bg-white px-5 text-xs font-semibold transition hover:border-[#292D25] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={
                loading || analyticsLoading ? "animate-spin" : ""
              }
            />
            Refresh Data
          </button>
        </header>

        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionLabel icon={<TrendingUp size={14} />}>
                Store Performance
              </SectionLabel>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Sales overview
              </h2>
            </div>
            <span className="rounded-full bg-[#E9EDDF] px-3 py-1.5 text-[10px] font-medium text-[#65734F]">
              Delivered orders only
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SalesCard
              title="Total Revenue"
              stats={analytics?.sales.allTime ?? null}
              icon={<ShoppingBag size={17} />}
              loading={analyticsLoading}
              featured
            />
            <SalesCard
              title="Today's Sales"
              stats={analytics?.sales.today ?? null}
              icon={<CalendarDays size={17} />}
              loading={analyticsLoading}
            />
            <SalesCard
              title="This Week"
              stats={analytics?.sales.week ?? null}
              icon={<TrendingUp size={17} />}
              loading={analyticsLoading}
            />
            <SalesCard
              title="This Month"
              stats={analytics?.sales.month ?? null}
              icon={<Package size={17} />}
              loading={analyticsLoading}
            />
          </div>

          {analyticsError && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#EBCFCB] bg-[#FBF0EE] p-4 text-sm text-[#A05249]">
              <span>{analyticsError}</span>
              <button
                type="button"
                onClick={() => void fetchAnalytics()}
                className="font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          {analytics && (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="All Orders"
                  value={analytics.orders.total.toLocaleString("en-US")}
                  icon={<ShoppingBag size={17} />}
                />
                <MetricCard
                  title="Delivered"
                  value={analytics.orders.delivered.toLocaleString("en-US")}
                  icon={<CheckCircle2 size={17} />}
                />
                <MetricCard
                  title="Pending Orders"
                  value={analytics.pending.orders.toLocaleString("en-US")}
                  detail={`${money(analytics.pending.value)} potential value`}
                  icon={<Clock3 size={17} />}
                />
                <MetricCard
                  title="Cancelled"
                  value={analytics.orders.cancelled.toLocaleString("en-US")}
                  icon={<XCircle size={17} />}
                />
              </div>

              {analytics.orders.deliveredWithoutDate > 0 && (
                <div className="mt-4 rounded-xl border border-[#E8DFC4] bg-[#FAF6E9] p-4 text-xs leading-6 text-[#92763B]">
                  <strong>{analytics.orders.deliveredWithoutDate}</strong>{" "}
                  previously delivered orders have no recorded delivery date.
                  They are included in delivered orders but excluded from dated
                  sales periods.
                </div>
              )}

              <p className="mt-3 text-[10px] text-[#99968C]">
                Sales periods use Cairo time. Pending orders are not included
                in sales revenue.
              </p>
            </>
          )}
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-[#E9E5DC] bg-white p-5">
            <div>
              <p className="text-xs text-[#89877D]">New orders in results</p>
              <p className="mt-2 text-3xl font-semibold">{newOrders}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F4E8] text-[#75875D]">
              <ShoppingBag size={20} />
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#E9E5DC] bg-white p-5">
            <div>
              <p className="text-xs text-[#89877D]">Orders in current results</p>
              <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F2EC] text-[#777B69]">
              <Package size={20} />
            </span>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#E9E5DC] bg-white p-4 sm:p-5">
          <div className="mb-4">
            <SectionLabel icon={<Search size={14} />}>
              Find an order
            </SectionLabel>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A195]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void fetchOrders();
                }}
                placeholder="Order number, customer or phone..."
                className="h-12 w-full rounded-xl border border-[#E9E5DC] bg-[#FAF9F6] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#AAA99F] focus:border-[#9BA987]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-12 rounded-xl border border-[#E9E5DC] bg-[#FAF9F6] px-3 text-xs outline-none focus:border-[#9BA987]"
            >
              <option value="">All order statuses</option>
              {[...ORDER_STATUSES, "cancelled"].map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="h-12 rounded-xl border border-[#E9E5DC] bg-[#FAF9F6] px-3 text-xs outline-none focus:border-[#9BA987]"
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
              className="h-12 rounded-xl bg-[#292D25] px-6 text-xs font-semibold text-white transition hover:bg-[#42483B]"
            >
              Search Orders
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-xl border border-[#EBCFCB] bg-[#FBF0EE] p-4 text-sm text-[#A05249]">
            {error}
          </div>
        )}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <SectionLabel icon={<ClipboardIcon />}>
                Order management
              </SectionLabel>
              <h2 className="mt-2 text-xl font-semibold">Customer orders</h2>
            </div>
            <span className="rounded-full border border-[#E4E3D9] bg-white px-3 py-1.5 text-[10px] text-[#777B70]">
              {orders.length} results
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 rounded-2xl border border-[#E9E5DC] bg-white text-sm text-[#89877D]">
              <Loader2 size={19} className="animate-spin" />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-[#E9E5DC] bg-white px-6 py-20 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F2EC] text-[#858A75]">
                <ShoppingBag size={25} />
              </span>
              <h3 className="mt-5 text-xl font-semibold">No orders found</h3>
              <p className="mt-2 text-sm text-[#929187]">
                Try changing your search or filters. New customer orders will
                appear here.
              </p>
              {(search || statusFilter || paymentFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("");
                    setPaymentFilter("");
                  }}
                  className="mt-5 rounded-full bg-[#292D25] px-5 py-2.5 text-xs font-semibold text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const isUpdating = updatingOrder === order.id;
                const isCancelled = order.status === "cancelled";
                const isDelivered = order.status === "delivered";
                const isFinalStatus = isCancelled || isDelivered;

                return (
                  <article
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-[#E9E5DC] bg-white"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99988D]">
                            Order number
                          </p>
                          <h3 className="mt-1 break-all text-lg font-semibold tracking-tight">
                            {order.order_number || order.id}
                          </h3>
                          <p className="mt-2 flex items-center gap-2 text-[11px] text-[#99988D]">
                            <CalendarDays size={13} />
                            {formatDate(order.created_at)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${statusStyle(order.status)}`}
                          >
                            {statusLabel(order.status)}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold ${statusStyle(order.payment_status)}`}
                          >
                            Payment: {statusLabel(order.payment_status)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 rounded-xl bg-[#F8F8F4] p-4 sm:grid-cols-3">
                        <div>
                          <SectionLabel icon={<UserRound size={13} />}>
                            Customer
                          </SectionLabel>
                          <p className="mt-2 text-sm font-medium">
                            {order.customer_name || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <SectionLabel icon={<Phone size={13} />}>
                            Phone
                          </SectionLabel>
                          {order.customer_phone ? (
                            <a
                              href={`tel:${order.customer_phone}`}
                              className="mt-2 inline-block text-sm font-medium underline decoration-[#C6C9B9] underline-offset-4"
                            >
                              {order.customer_phone}
                            </a>
                          ) : (
                            <p className="mt-2 text-sm">Not provided</p>
                          )}
                        </div>

                        <div>
                          <SectionLabel icon={<ShoppingBag size={13} />}>
                            Order total
                          </SectionLabel>
                          <p className="mt-1 text-xl font-semibold tracking-tight">
                            {money(order.total)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#89877D]">
                            Update order status
                          </label>
                          <select
                            value={order.status || "new"}
                            disabled={isUpdating || isFinalStatus}
                            onChange={(event) =>
                              void updateOrder(order.id, {
                                status: event.target.value,
                              })
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-[#E9E5DC] bg-white px-3 text-xs outline-none focus:border-[#9BA987] disabled:cursor-not-allowed disabled:bg-[#F4F3EF] disabled:opacity-60"
                          >
                            {isFinalStatus && (
                              <option value={order.status || ""}>
                                {statusLabel(order.status)}
                              </option>
                            )}
                            {!isFinalStatus &&
                              ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {statusLabel(status)}
                                </option>
                              ))}
                          </select>
                          {isFinalStatus && (
                            <p className="mt-1.5 text-[10px] text-[#99968C]">
                              Final order status cannot be changed.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#89877D]">
                            <CreditCard size={13} />
                            Update payment status
                          </label>
                          <select
                            value={order.payment_status || "pending"}
                            disabled={isUpdating}
                            onChange={(event) =>
                              void updateOrder(order.id, {
                                payment_status: event.target.value,
                              })
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-[#E9E5DC] bg-white px-3 text-xs outline-none focus:border-[#9BA987] disabled:opacity-50"
                          >
                            {PAYMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {statusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {!isFinalStatus && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              void updateOrder(order.id, {
                                status: "cancelled",
                              })
                            }
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#EBCFCB] px-4 text-[10px] font-semibold text-[#A05249] transition hover:bg-[#FBF0EE] disabled:opacity-50"
                          >
                            <XCircle size={14} />
                            Cancel order
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void deleteOrder(order)}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E5E2D9] px-4 text-[10px] font-semibold text-[#777B70] transition hover:border-[#EBCFCB] hover:bg-[#FBF0EE] hover:text-[#A05249] disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Delete order
                        </button>

                        {isUpdating && (
                          <span className="flex items-center gap-2 text-[10px] text-[#89877D]">
                            <Loader2 size={13} className="animate-spin" />
                            Saving changes...
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order.id)
                        }
                        className="mt-5 flex w-full items-center justify-between border-t border-[#EFEEE8] pt-4 text-left text-[10px] font-semibold uppercase tracking-[0.17em] text-[#777B70] transition hover:text-[#292D25]"
                      >
                        {isExpanded ? "Hide order details" : "View full order details"}
                        {isExpanded ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-5 space-y-7">
                          <section>
                            <SectionLabel icon={<UserRound size={13} />}>
                              Customer information
                            </SectionLabel>
                            <div className="mt-3 grid gap-4 rounded-xl bg-[#F8F8F4] p-4 text-sm sm:grid-cols-2">
                              <div>
                                <p className="text-[10px] text-[#99988D]">Full name</p>
                                <p className="mt-1 font-medium">
                                  {order.customer_name || "Not provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-[#99988D]">Email</p>
                                <p className="mt-1 break-all font-medium">
                                  {order.customer_email || "No email provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-[#99988D]">Phone</p>
                                <p className="mt-1 font-medium">
                                  {order.customer_phone || "Not provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-[#99988D]">Delivery address</p>
                                <p className="mt-1 flex items-start gap-2 font-medium">
                                  <MapPin size={14} className="mt-0.5 shrink-0 text-[#858A75]" />
                                  {formatAddress(order.shipping_address)}
                                </p>
                              </div>
                            </div>
                          </section>

                          <section>
                            <SectionLabel icon={<Clock3 size={13} />}>
                              Order timeline
                            </SectionLabel>
                            <div className="mt-3 space-y-4 border-l border-[#D9DDCE] pl-4">
                              <div>
                                <p className="text-sm font-medium">Order created</p>
                                <p className="mt-1 text-[11px] text-[#99968C]">
                                  {formatDate(order.created_at)}
                                </p>
                              </div>
                              {isDelivered && (
                                <div>
                                  <p className="text-sm font-medium text-[#657B4D]">
                                    Order delivered
                                  </p>
                                  <p className="mt-1 text-[11px] text-[#99968C]">
                                    {order.delivered_at
                                      ? formatDate(order.delivered_at)
                                      : "Historical delivery date unavailable"}
                                  </p>
                                </div>
                              )}
                              {isCancelled && (
                                <div>
                                  <p className="text-sm font-medium text-[#A05249]">
                                    Order cancelled
                                  </p>
                                </div>
                              )}
                            </div>
                          </section>

                          <section>
                            <SectionLabel icon={<Package size={13} />}>
                              Products in this order
                            </SectionLabel>
                            <div className="mt-3 divide-y divide-[#EFEEE8] rounded-xl border border-[#EFEEE8]">
                              {(order.order_items ?? []).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-4"
                                >
                                  {item.product_image ? (
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name || "Product"}
                                      className="h-16 w-14 rounded-lg bg-[#F2F0EA] object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-[#F2F0EA] text-[#A2A294]">
                                      <Package size={19} />
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">
                                      {item.product_name || "Product"}
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#929187]">
                                      Size: {item.selected_size || "—"}
                                      {" · "}
                                      Color: {item.selected_color || "—"}
                                      {" · "}
                                      Qty: {item.quantity}
                                    </p>
                                    {item.sku && (
                                      <p className="mt-1 text-[10px] text-[#A2A294]">
                                        SKU: {item.sku}
                                      </p>
                                    )}
                                  </div>

                                  <p className="shrink-0 text-sm font-semibold">
                                    {money(item.line_total)}
                                  </p>
                                </div>
                              ))}

                              {(order.order_items ?? []).length === 0 && (
                                <p className="p-4 text-sm text-[#929187]">
                                  No product details found for this order.
                                </p>
                              )}
                            </div>
                          </section>

                          <section className="ml-auto max-w-sm rounded-xl bg-[#F8F8F4] p-4">
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between gap-4 text-[#85857A]">
                                <span>Subtotal</span>
                                <span>{money(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between gap-4 text-[#85857A]">
                                <span>Shipping</span>
                                <span>{money(order.shipping_cost)}</span>
                              </div>
                              <div className="flex justify-between gap-4 text-[#85857A]">
                                <span>Discount</span>
                                <span>{money(order.discount)}</span>
                              </div>
                              <div className="flex justify-between gap-4 border-t border-[#E4E3D9] pt-3 text-base font-semibold text-[#292D25]">
                                <span>Total</span>
                                <span>{money(order.total)}</span>
                              </div>
                            </div>
                          </section>

                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFEEE8] pt-4 text-[10px] text-[#929187]">
                            <span>
                              Payment method: {statusLabel(order.payment_method)}
                            </span>
                            <span>
                              Currency: {order.currency || "EGP"}
                            </span>
                          </div>

                          {order.notes && (
                            <div className="rounded-xl border border-[#E9E5DC] bg-[#FAF9F6] p-4">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#89877D]">
                                Order notes
                              </p>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
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

        <footer className="mt-12 border-t border-[#E4E3D9] py-6 text-center text-[9px] font-medium uppercase tracking-[0.25em] text-[#A2A294]">
          TALA / Luxury Fashion Administration
        </footer>
      </div>
    </main>
  );
}

function ClipboardIcon() {
  return <ShoppingBag size={14} />;
}
