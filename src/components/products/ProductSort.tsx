
"use client";

import { ArrowDownUp } from "lucide-react";

export type ProductSortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "name";

type ProductSortProps = {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
  className?: string;
};

const options: { value: ProductSortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export default function ProductSort({
  value,
  onChange,
  className = "",
}: ProductSortProps) {
  return (
    <label
      className={`flex min-h-11 items-center gap-3 border-b border-[#DCD2C6] ${className}`}
    >
      <ArrowDownUp
        size={15}
        strokeWidth={1.5}
        className="shrink-0 text-[#8C7B68]"
      />

      <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7B68]">
        Sort by
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as ProductSortOption)
        }
        aria-label="Sort products"
        className="min-w-0 flex-1 cursor-pointer bg-transparent py-2 text-right text-xs text-[#40372F] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

