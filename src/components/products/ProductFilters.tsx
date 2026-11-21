
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

export type ProductFilterState = {
  sizes: string[];
  colors: string[];
  minPrice: number | "";
  maxPrice: number | "";
  availableOnly: boolean;
};

type ProductFiltersProps = {
  value: ProductFilterState;
  onChange: (value: ProductFilterState) => void;
  sizes?: string[];
  colors?: { name: string; value: string }[];
  maxPriceLimit?: number;
  className?: string;
};

export default function ProductFilters({
  value,
  onChange,
  sizes = ["S", "M", "L", "XL", "XXL"],
  colors = [],
  maxPriceLimit = 10000,
  className = "",
}: ProductFiltersProps) {
  const [expanded, setExpanded] = useState(true);

  const update = (changes: Partial<ProductFilterState>) => {
    onChange({ ...value, ...changes });
  };

  const toggleValue = (
    key: "sizes" | "colors",
    item: string
  ) => {
    const current = value[key];
    update({
      [key]: current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item],
    });
  };

  const clearFilters = () => {
    onChange({
      sizes: [],
      colors: [],
      minPrice: "",
      maxPrice: "",
      availableOnly: false,
    });
  };

  const activeCount =
    value.sizes.length +
    value.colors.length +
    Number(value.minPrice !== "") +
    Number(value.maxPrice !== "") +
    Number(value.availableOnly);

  return (
    <section
      className={`border-y border-[#E8DED2] py-4 ${className}`}
      aria-label="Product filters"
    >
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3"
      >
        <span className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#40372F]">
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#40372F] px-1 text-[9px] text-white">
              {activeCount}
            </span>
          )}
        </span>

        {expanded ? (
          <ChevronUp size={16} className="text-[#8C7B68]" />
        ) : (
          <ChevronDown size={16} className="text-[#8C7B68]" />
        )}
      </button>

      {expanded && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <fieldset>
            <legend className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7B68]">
              Size
            </legend>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const selected = value.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleValue("sizes", size)}
                    className={`min-w-10 border px-3 py-2 text-[10px] transition ${
                      selected
                        ? "border-[#40372F] bg-[#40372F] text-white"
                        : "border-[#E5DBD0] text-[#62574B] hover:border-[#8C7B68]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7B68]">
              Color
            </legend>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const selected = value.colors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    aria-pressed={selected}
                    onClick={() => toggleValue("colors", color.name)}
                    className={`h-7 w-7 rounded-full border-2 transition ${
                      selected
                        ? "border-[#40372F] ring-2 ring-[#C9B9A7] ring-offset-2"
                        : "border-black/10"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                );
              })}
              {colors.length === 0 && (
                <span className="text-xs text-[#A09284]">
                  No colors available
                </span>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7B68]">
              Price (EGP)
            </legend>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={value.minPrice}
                onChange={(event) =>
                  update({
                    minPrice:
                      event.target.value === ""
                        ? ""
                        : Math.max(0, Number(event.target.value)),
                  })
                }
                className="h-10 w-full min-w-0 border border-[#E5DBD0] bg-transparent px-3 text-xs text-[#40372F] outline-none focus:border-[#8C7B68]"
              />
              <span className="text-[#A09284]">—</span>
              <input
                type="number"
                min="0"
                max={maxPriceLimit}
                placeholder="Max"
                value={value.maxPrice}
                onChange={(event) =>
                  update({
                    maxPrice:
                      event.target.value === ""
                        ? ""
                        : Math.max(0, Number(event.target.value)),
                  })
                }
                className="h-10 w-full min-w-0 border border-[#E5DBD0] bg-transparent px-3 text-xs text-[#40372F] outline-none focus:border-[#8C7B68]"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8C7B68]">
              Availability
            </legend>
            <label className="flex cursor-pointer items-center gap-3 text-xs text-[#62574B]">
              <input
                type="checkbox"
                checked={value.availableOnly}
                onChange={(event) =>
                  update({ availableOnly: event.target.checked })
                }
                className="h-4 w-4 accent-[#40372F]"
              />
              In-stock pieces only
            </label>
          </fieldset>
        </div>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#947C65] underline underline-offset-4 transition hover:text-[#40372F]"
        >
          Clear all filters
        </button>
      )}
    </section>
  );
}

