
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  Check,
  ChevronDown,
  Loader2,
  Package,
  RefreshCw,
  Save,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  X,
} from "lucide-react";

type InventoryRow = {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_status: string;
  size: string | null;
  color: string | null;
  stock_quantity: number;
  is_active: boolean;
  updated_at: string | null;
};

type FilterType = "all" | "in_stock" | "low_stock" | "sold_out" | "disabled";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All options" },
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "sold_out", label: "Sold out" },
  { value: "disabled", label: "Disabled" },
];

function stockState(row: InventoryRow) {
  if (!row.is_active) {
    return {
      label: "Disabled",
      className: "bg-[#F0EEE9] text-[#858276]",
      dot: "bg-[#AAA69A]",
    };
  }

  if (row.stock_quantity <= 0) {
    return {
      label: "Sold out",
      className: "bg-[#F9ECE9] text-[#A05249]",
      dot: "bg-[#BD766B]",
    };
  }

  if (row.stock_quantity <= 3) {
    return {
      label: "Low stock",
      className: "bg-[#F8F1E3] text-[#98743C]",
      dot: "bg-[#C39B52]",
    };
  }

  return {
    label: "In stock",
    className: "bg-[#EEF3E8] text-[#62784D]",
    dot: "bg-[#8DA477]",
  };
}

function updatedLabel(value: string | null) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not recorded";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Cairo",
  });
}

function SummaryCard({
  label,
  value,
  note,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: number;
  note: string;
  icon: React.ReactNode;
  tone?: "neutral" | "warning" | "danger" | "success";
}) {
  const tones = {
    neutral: "bg-[#F2F1EB] text-[#737568]",
    warning: "bg-[#F8F1E3] text-[#98743C]",
    danger: "bg-[#F9ECE9] text-[#A05249]",
    success: "bg-[#EEF3E8] text-[#62784D]",
  };

  return (
    <div className="rounded-2xl border border-[#E9E5DC] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#929187]">
          {label}
        </p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#292D25]">
        {value.toLocaleString("en-US")}
      </p>
      <p className="mt-1 text-[10px] text-[#A09E93]">{note}</p>
    </div>
  );
}

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editedIds, setEditedIds] = useState<string[]>([]);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/inventory", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load inventory.");
      }

      const inventory = Array.isArray(result.inventory)
        ? result.inventory
        : [];

      setRows(inventory);
      setEditedIds([]);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load inventory."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        [
          row.product_name,
          row.size ?? "",
          row.color ?? "",
          row.product_status,
          row.product_slug,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesFilter =
        filter === "all" ||
        (filter === "disabled" && !row.is_active) ||
        (filter === "sold_out" &&
          row.is_active &&
          row.stock_quantity <= 0) ||
        (filter === "low_stock" &&
          row.is_active &&
          row.stock_quantity > 0 &&
          row.stock_quantity <= 3) ||
        (filter === "in_stock" &&
          row.is_active &&
          row.stock_quantity > 3);

      return matchesSearch && matchesFilter;
    });
  }, [rows, search, filter]);

  const totalUnits = rows.reduce(
    (total, row) =>
      total + (row.is_active ? Math.max(0, row.stock_quantity) : 0),
    0
  );

  const activeOptions = rows.filter((row) => row.is_active).length;

  const soldOutCount = rows.filter(
    (row) => row.is_active && row.stock_quantity <= 0
  ).length;

  const lowStockCount = rows.filter(
    (row) =>
      row.is_active &&
      row.stock_quantity > 0 &&
      row.stock_quantity <= 3
  ).length;

  const updateStockValue = (id: string, value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    const stock = value === "" ? 0 : Number(value);

    if (!Number.isSafeInteger(stock) || stock < 0) return;

    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, stock_quantity: stock } : row
      )
    );

    setEditedIds((current) =>
      current.includes(id) ? current : [...current, id]
    );

    setSuccess("");
  };

  async function saveRow(row: InventoryRow) {
    if (!Number.isSafeInteger(row.stock_quantity) || row.stock_quantity < 0) {
      setError("Stock quantity must be a valid non-negative whole number.");
      return;
    }

    setSavingId(row.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          stock_quantity: row.stock_quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save stock.");
      }

      setEditedIds((current) => current.filter((id) => id !== row.id));
      setSuccess(
        `Stock updated for ${row.product_name} — ${row.size || "One Size"}.`
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save stock."
      );
    } finally {
      setSavingId(null);
    }
  }

  function resetRow(row: InventoryRow) {
    void loadInventory();
    setSuccess("");
  }

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
              Inventory<span className="text-[#A7B68C]">.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#85857A]">
              Every size, every color, every available piece. Keep your stock
              accurate and your collections ready.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadInventory()}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#DCDDD2] bg-white px-5 text-xs font-semibold transition hover:border-[#292D25] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh inventory
          </button>
        </header>

        <section className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Available units"
            value={totalUnits}
            note="Total active stock quantity"
            icon={<Boxes size={18} />}
            tone="neutral"
          />
          <SummaryCard
            label="Active options"
            value={activeOptions}
            note="Active size and color variations"
            icon={<Package size={18} />}
            tone="success"
          />
          <SummaryCard
            label="Low stock"
            value={lowStockCount}
            note="Three units or fewer"
            icon={<TriangleAlert size={18} />}
            tone="warning"
          />
          <SummaryCard
            label="Sold out"
            value={soldOutCount}
            note="Active options with zero stock"
            icon={<X size={18} />}
            tone="danger"
          />
        </section>

        {error && (
          <div className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-[#EBCFCB] bg-[#FBF0EE] p-4 text-sm text-[#A05249]">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#D8E2D2] bg-[#F1F5EF] p-4 text-sm text-[#526A4D]">
            <Check size={16} />
            {success}
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#E9E5DC] bg-white">
          <div className="border-b border-[#EFEEE8] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#89877D]">
                  <SlidersHorizontal size={14} />
                  Stock management
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  Product variations
                </h2>
                <p className="mt-1 text-xs text-[#99968C]">
                  Update quantities for each product option.
                </p>
              </div>

              <span className="rounded-full bg-[#F2F1EB] px-3 py-1.5 text-[10px] font-medium text-[#777B70]">
                {filteredRows.length} options
              </span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A195]"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search product, size or color..."
                  className="h-12 w-full rounded-xl border border-[#E9E5DC] bg-[#FAF9F6] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#AAA99F] focus:border-[#9BA987]"
                />
              </div>

              <div className="relative">
                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as FilterType)
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-[#E9E5DC] bg-[#FAF9F6] px-4 pr-10 text-xs outline-none focus:border-[#9BA987]"
                >
                  {FILTERS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#99968C]"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#89877D]">
              <Loader2 size={19} className="animate-spin" />
              Loading inventory...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F2EC] text-[#858A75]">
                <Package size={25} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">
                No inventory options found
              </h3>
              <p className="mt-2 text-sm text-[#929187]">
                Try another search or select a different stock filter.
              </p>
              {(search || filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-5 rounded-full bg-[#292D25] px-5 py-2.5 text-xs font-semibold text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,1.5fr)_110px_130px_140px] gap-4 border-b border-[#EFEEE8] bg-[#FAF9F6] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#99968C] lg:grid">
                <span>Product / Variation</span>
                <span>Quantity</span>
                <span>Availability</span>
                <span className="text-right">Action</span>
              </div>

              <div className="divide-y divide-[#EFEEE8]">
                {filteredRows.map((row) => {
                  const state = stockState(row);
                  const isEdited = editedIds.includes(row.id);
                  const isSaving = savingId === row.id;

                  return (
                    <div
                      key={row.id}
                      className="grid gap-4 px-5 py-5 transition hover:bg-[#FCFBF8] sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_110px_130px_140px] lg:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F0E9] text-[#858A75]">
                            <Package size={18} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#292D25]">
                              {row.product_name}
                            </p>
                            <p className="mt-1 text-[10px] text-[#99968C]">
                              {row.size || "One Size"} 
                              {" · "}
                              {row.color || "Default color"}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 pl-[52px] text-[9px] uppercase tracking-[0.12em] text-[#AAA99F]">
                          Product: {row.product_status}
                          {" · "}
                          Updated: {updatedLabel(row.updated_at)}
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor={`stock-${row.id}`}
                          className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-[#99968C] lg:hidden"
                        >
                          Available quantity
                        </label>
                        <input
                          id={`stock-${row.id}`}
                          type="number"
                          min="0"
                          step="1"
                          inputMode="numeric"
                          value={row.stock_quantity}
                          onChange={(event) =>
                            updateStockValue(row.id, event.target.value)
                          }
                          disabled={!row.is_active || isSaving}
                          className="h-11 w-full rounded-xl border border-[#E9E5DC] bg-[#FAF9F6] px-3 text-sm font-semibold outline-none transition focus:border-[#9BA987] disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#99968C] lg:hidden">
                          Availability
                        </p>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold ${state.className}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${state.dot}`} />
                          {state.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 lg:justify-end">
                        <button
                          type="button"
                          onClick={() => void saveRow(row)}
                          disabled={!isEdited || isSaving || !row.is_active}
                          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#292D25] px-4 text-[10px] font-semibold text-white transition hover:bg-[#42483B] disabled:cursor-not-allowed disabled:bg-[#E9E8E1] disabled:text-[#A3A297] lg:flex-none"
                        >
                          {isSaving ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Save size={13} />
                          )}
                          Save
                        </button>

                        {isEdited && (
                          <button
                            type="button"
                            onClick={() => void loadInventory()}
                            disabled={isSaving}
                            aria-label="Discard changes and reload inventory"
                            title="Discard changes"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E9E5DC] text-[#89877D] transition hover:bg-[#F7F5EF] disabled:opacity-50"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#99968C]">
          <p>
            Changes are saved per product variation.
          </p>
          <p>
            Zero quantity means sold out on the storefront.
          </p>
        </div>

        <footer className="mt-12 border-t border-[#E4E3D9] py-6 text-center text-[9px] font-medium uppercase tracking-[0.25em] text-[#A2A294]">
          TALA / Luxury Fashion Administration
        </footer>
      </div>
    </main>
  );
}
