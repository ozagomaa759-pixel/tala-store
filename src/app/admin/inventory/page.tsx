"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  Loader2,
  RefreshCw,
  Save,
  Search,
  Package,
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

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/inventory", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load inventory.");
      }

      setRows(Array.isArray(result.inventory) ? result.inventory : []);
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

    if (!term) return rows;

    return rows.filter((row) =>
      [
        row.product_name,
        row.size ?? "",
        row.color ?? "",
        row.product_status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [rows, search]);

  const updateStockValue = (id: string, value: string) => {
    const stock = value === "" ? 0 : Number(value);

    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              stock_quantity:
                Number.isInteger(stock) && stock >= 0 ? stock : row.stock_quantity,
            }
          : row
      )
    );
  };

  async function saveRow(row: InventoryRow) {
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

      setSuccess(`Stock updated for ${row.product_name} — ${row.size || "One Size"}.`);
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

  const totalUnits = rows.reduce(
    (total, row) => total + Math.max(0, row.stock_quantity),
    0
  );
  const soldOutCount = rows.filter(
    (row) => row.is_active && row.stock_quantity === 0
  ).length;
  const inactiveCount = rows.filter((row) => !row.is_active).length;

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-12 text-[#332A23] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#8A7969] transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <Boxes size={36} strokeWidth={1} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#A28A72]">
                TALA Administration
              </p>
              <h1 className="mt-2 text-4xl font-light sm:text-6xl">
                Inventory
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadInventory()}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-[#DCCFC1] bg-white px-4 py-3 text-xs uppercase tracking-wider disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#77695D]">
          Review every product option and update the available quantity.
          A quantity of zero marks that size as sold out in the storefront.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-[#E5DACE] bg-white/70 p-5">
            <p className="text-xs uppercase tracking-wider text-[#8A7969]">
              Total units
            </p>
            <p className="mt-3 text-3xl font-light">{totalUnits}</p>
          </div>
          <div className="border border-[#E5DACE] bg-white/70 p-5">
            <p className="text-xs uppercase tracking-wider text-[#8A7969]">
              Sold-out options
            </p>
            <p className="mt-3 text-3xl font-light text-[#9A5145]">
              {soldOutCount}
            </p>
          </div>
          <div className="border border-[#E5DACE] bg-white/70 p-5">
            <p className="text-xs uppercase tracking-wider text-[#8A7969]">
              Disabled options
            </p>
            <p className="mt-3 text-3xl font-light">{inactiveCount}</p>
          </div>
        </div>

        {error && (
          <p className="mt-6 border border-[#E3C7BF] bg-[#FAEEEE] p-4 text-sm text-[#8A3E2D]">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-6 border border-[#D8E2D2] bg-[#F1F5EF] p-4 text-sm text-[#526A4D]">
            {success}
          </p>
        )}

        <section className="mt-8 border border-[#E5DACE] bg-white/70">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5DACE] p-5">
            <div>
              <h2 className="text-xl font-light">Stock by size and color</h2>
              <p className="mt-1 text-xs text-[#8A7969]">
                {filteredRows.length} option{filteredRows.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex items-center border border-[#E5DACE] bg-white px-3">
              <Search size={15} className="text-[#9B8A7A]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or sizes"
                className="w-48 bg-transparent px-2 py-3 text-xs outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-[#8A7969]">
              <Loader2 size={18} className="animate-spin" />
              Loading inventory...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={30} className="mx-auto text-[#A28A72]" />
              <p className="mt-4 text-sm text-[#77695D]">
                No inventory options found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EDE5DC]">
              {filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="grid gap-4 p-5 sm:grid-cols-[1fr_130px_130px_auto] sm:items-center"
                >
                  <div>
                    <p className="font-medium">{row.product_name}</p>
                    <p className="mt-1 text-xs text-[#8A7969]">
                      {row.size || "One Size"} · {row.color || "Default"}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[#A28A72]">
                      {row.product_status}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor={`stock-${row.id}`}
                      className="text-[10px] uppercase tracking-wider text-[#8A7969]"
                    >
                      Quantity
                    </label>
                    <input
                      id={`stock-${row.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={row.stock_quantity}
                      onChange={(event) =>
                        updateStockValue(row.id, event.target.value)
                      }
                      className="mt-1 w-full border border-[#E5DACE] bg-white px-3 py-2 text-sm outline-none focus:border-[#A28A72]"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#8A7969]">
                      Status
                    </p>
                    <p
                      className={`mt-2 text-xs font-semibold ${
                        !row.is_active
                          ? "text-[#8A7969]"
                          : row.stock_quantity === 0
                            ? "text-[#9A5145]"
                            : row.stock_quantity <= 3
                              ? "text-[#A47736]"
                              : "text-[#617A5A]"
                      }`}
                    >
                      {!row.is_active
                        ? "DISABLED"
                        : row.stock_quantity === 0
                          ? "✕ SOLD OUT"
                          : row.stock_quantity <= 3
                            ? "LOW STOCK"
                            : "IN STOCK"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void saveRow(row)}
                    disabled={savingId === row.id}
                    className="inline-flex items-center justify-center gap-2 bg-[#332A23] px-4 py-3 text-xs uppercase tracking-wider text-white disabled:opacity-50"
                  >
                    {savingId === row.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
