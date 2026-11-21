
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string | null;
  updated_at?: string | null;
};

type Notice = {
  type: "success" | "error";
  message: string;
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#E8E5DD] bg-white px-4 py-3 text-sm text-[#292D25] outline-none transition placeholder:text-[#AAA99F] focus:border-[#899573] focus:ring-2 focus:ring-[#899573]/10";

function formatDate(value: string | null) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-EG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
    null
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const loadCustomers = useCallback(async (searchValue = "") => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      const response = await fetch(
        `/api/admin/customers?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not load customers.");
      }

      setCustomers(
        Array.isArray(data.customers) ? data.customers : []
      );
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while loading customers.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.full_name,
        customer.email || "",
        customer.phone || "",
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [customers, search]);

  function startEditing(customer: Customer) {
    setEditingCustomer(customer);
    setFullName(customer.full_name || "");
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setNotice(null);
  }

  function closeEditor() {
    if (saving) return;

    setEditingCustomer(null);
    setFullName("");
    setEmail("");
    setPhone("");
  }

  async function saveCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingCustomer || saving) return;

    if (!fullName.trim()) {
      setNotice({
        type: "error",
        message: "Customer name is required.",
      });
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setNotice({
        type: "error",
        message: "Enter a valid email address.",
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCustomer.id,
          full_name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Could not update customer.");
      }

      setNotice({
        type: "success",
        message: "Customer information updated successfully.",
      });

      setEditingCustomer(null);
      await loadCustomers(search);
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not save customer information.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteCustomer(customer: Customer) {
    const confirmed = window.confirm(
      `Delete ${customer.full_name} from the customer list? This may be blocked if the customer has linked orders.`
    );

    if (!confirmed || saving) return;

    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/admin/customers?id=${encodeURIComponent(customer.id)}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            "Could not delete this customer. They may have linked orders."
        );
      }

      setNotice({
        type: "success",
        message: "Customer removed successfully.",
      });

      await loadCustomers(search);
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not delete this customer.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F6F0] px-4 py-7 text-[#292D25] sm:px-7 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#85877A] transition hover:text-[#303429]"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        <header className="mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A9277]">
            TALA / Administration
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                Customer book<span className="text-[#A6B18C]">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#85877A]">
                Keep customer contact details organized and easy to find.
                Every customer can shop as a guest — no account required.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#85877A]">
              <Users size={16} />
              Customer records
            </div>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-6 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
              notice.type === "success"
                ? "border-[#D9E4CD] bg-[#F0F5E9] text-[#526344]"
                : "border-[#F0D8D1] bg-[#FBF0ED] text-[#985B4D]"
            }`}
          >
            {notice.type === "success" ? (
              <Check size={17} className="mt-0.5 shrink-0" />
            ) : (
              <X size={17} className="mt-0.5 shrink-0" />
            )}
            {notice.message}
          </div>
        )}

        <section className="mt-8 grid gap-3 sm:grid-cols-[1fr_2fr]">
          <div className="rounded-2xl border border-[#EAE9E0] bg-white p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#929487]">
              Customer records
            </p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-4xl font-semibold tracking-tight">
                {customers.length}
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF1E6] text-[#71805D]">
                <Users size={19} />
              </span>
            </div>
            <p className="mt-2 text-[10px] text-[#A1A296]">
              Records returned by your customer database
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#EAE9E0] bg-white p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold">Find a customer</p>
              <p className="mt-1 text-xs text-[#929387]">
                Search by name, email address or phone number.
              </p>
            </div>

            <div className="flex w-full items-center gap-2 rounded-full border border-[#E7E6DE] bg-[#FBFBF8] px-4 sm:max-w-sm">
              <Search size={15} className="shrink-0 text-[#929387]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers..."
                className="min-w-0 flex-1 bg-transparent py-3 text-xs outline-none placeholder:text-[#AAA99F]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-[#929387] hover:text-[#292D25]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </section>

        {editingCustomer && (
          <form
            onSubmit={saveCustomer}
            className="mt-6 overflow-hidden rounded-2xl border border-[#E5E6DA] bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-[#EFEEE8] bg-[#FBFBF7] px-5 py-4 sm:px-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#929A7D]">
                  Customer details
                </p>
                <h2 className="mt-1 text-lg font-semibold">Edit customer</h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                aria-label="Close editor"
                className="rounded-full border border-[#E7E5DC] bg-white p-2 text-[#77796D]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#77796D]">
                Full name *
                <input
                  className={fieldClass}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  maxLength={120}
                />
              </label>

              <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#77796D]">
                Email address
                <input
                  className={fieldClass}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#77796D]">
                Phone number
                <input
                  className={fieldClass}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone number"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#EFEEE8] bg-[#FBFBF8] px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                className="rounded-full border border-[#E2E1D8] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#77796D]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#292D25] px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-white disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save customer
              </button>
            </div>
          </form>
        )}

        <section className="mt-7 overflow-hidden rounded-2xl border border-[#EAE8DF] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEEE8] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold">All customers</h2>
              <p className="mt-1 text-[11px] text-[#929387]">
                Contact information saved during guest checkout.
              </p>
            </div>

            <span className="rounded-full bg-[#F2F2EC] px-3 py-1.5 text-[10px] font-semibold text-[#64695A]">
              {filteredCustomers.length} shown
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-14 text-sm text-[#85877A]">
              <Loader2 size={18} className="animate-spin" />
              Loading customer records...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <UserRound
                size={28}
                strokeWidth={1.3}
                className="mx-auto text-[#B4B6A9]"
              />
              <p className="mt-3 text-sm font-medium text-[#55594B]">
                {search ? "No matching customers" : "No customer records yet"}
              </p>
              <p className="mt-1 text-xs text-[#929387]">
                {search
                  ? "Try another name, email or phone number."
                  : "Customer records will appear here after orders are placed."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EFE9]">
              {filteredCustomers.map((customer) => (
                <article
                  key={customer.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FAFAF6] sm:flex-row sm:items-center sm:px-6"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EDF1E6] text-xs font-semibold uppercase tracking-wider text-[#647250]">
                      {initials(customer.full_name) || "T"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#292D25]">
                        {customer.full_name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#85877A]">
                        {customer.phone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone size={12} />
                            {customer.phone}
                          </span>
                        )}

                        {customer.email && (
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <Mail size={12} />
                            <span className="truncate">{customer.email}</span>
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-[9px] uppercase tracking-wider text-[#A1A296]">
                        Added {formatDate(customer.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => startEditing(customer)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-full bg-[#292D25] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#41483A] disabled:opacity-50"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void deleteCustomer(customer)}
                      disabled={saving}
                      aria-label={`Delete ${customer.full_name}`}
                      className="rounded-full border border-[#F0DCD6] bg-white p-2.5 text-[#A45F50] transition hover:bg-[#FBF0ED] disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E6DE] pt-5">
          <p className="text-[10px] uppercase tracking-wider text-[#A0A194]">
            TALA · Customer management
          </p>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#626C52] transition hover:text-[#303429]"
          >
            View orders
            <ChevronDown size={14} className="-rotate-90" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
