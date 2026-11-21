
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  index?: number;
  viewMode?: "grid" | "list";
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductBadges({ product }: { product: Product }) {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-2">
      {product.isNew && (
        <span className="rounded-full bg-[#FAF8F4] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#75604A] shadow-sm">
          New arrival
        </span>
      )}

      {!product.isNew && product.isBestSeller && (
        <span className="rounded-full bg-[#40372F] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
          Best seller
        </span>
      )}

      {discount > 0 && (
        <span className="rounded-full bg-[#9B5F50] px-3 py-1 text-[9px] font-semibold text-white shadow-sm">
          -{discount}%
        </span>
      )}

      {!product.isAvailable && (
        <span className="rounded-full bg-[#40372F] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white">
          Sold out
        </span>
      )}
    </div>
  );
}

function ProductPrice({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] font-medium tracking-wide text-[#302A24]">
        {formatPrice(product.price)}
      </span>

      {product.oldPrice && product.oldPrice > product.price && (
        <span className="text-xs text-[#A99B8C] line-through">
          {formatPrice(product.oldPrice)}
        </span>
      )}
    </div>
  );
}

export default function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
  index = 0,
  viewMode = "grid",
}: ProductCardProps) {
  const productUrl = `/products/${encodeURIComponent(
    product.slug || product.id
  )}`;

  const image = product.image;

  const favoriteButton = onToggleFavorite ? (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggleFavorite(product.id);
      }}
      aria-label={
        isFavorite ? "Remove from favorites" : "Add to favorites"
      }
      aria-pressed={isFavorite}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE1D7] bg-[#FAF8F4]/95 text-[#66584B] shadow-sm backdrop-blur-sm transition hover:scale-105 hover:bg-white"
    >
      <Heart
        size={17}
        strokeWidth={1.5}
        fill={isFavorite ? "#9B5F50" : "transparent"}
        color={isFavorite ? "#9B5F50" : "currentColor"}
      />
    </button>
  ) : null;

  const quickViewButton = onQuickView ? (
    <button
      type="button"
      onClick={() => onQuickView(product)}
      aria-label={`Quick view ${product.name}`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE1D7] bg-[#FAF8F4]/95 text-[#66584B] shadow-sm backdrop-blur-sm transition hover:scale-105 hover:bg-white"
    >
      <Search size={16} strokeWidth={1.5} />
    </button>
  ) : null;

  const productImage = (
    <div className="group relative aspect-[4/5] overflow-hidden bg-[#EAE3D9]">
      {image ? (
        <Image
          src={image}
          alt={product.name}
          fill
          priority={index < 2}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.25em] text-[#9A8C7D]">
          TALA
        </div>
      )}

      <ProductBadges product={product} />

      <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
        {favoriteButton}
        {quickViewButton}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );

  if (viewMode === "list") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
        className="grid grid-cols-1 gap-5 border-b border-[#E9E0D5] py-6 sm:grid-cols-[220px_1fr] sm:gap-8"
      >
        <Link href={productUrl} className="block">
          {productImage}
        </Link>

        <div className="flex flex-col justify-center py-1">
          <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A28A72]">
            {product.category}
          </span>

          <Link href={productUrl}>
            <h3 className="font-serif text-2xl text-[#40372F] transition-colors hover:text-[#9B8065]">
              {product.name}
            </h3>
          </Link>

          {product.subtitle && (
            <p className="mt-2 text-sm text-[#8E8072]">
              {product.subtitle}
            </p>
          )}

          {product.reviews > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              <Star size={12} fill="#B99A78" stroke="#B99A78" />
              <span className="text-xs text-[#51463C]">
                {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>
          )}

          {product.description && (
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#897B6D]">
              {product.description}
            </p>
          )}

          <div className="mt-5">
            <ProductPrice product={product} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={`${product.id}-${color.name}`}
                title={color.name}
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: color.value }}
              />
            ))}

            <span className="text-[10px] text-[#968779]">
              {product.sizes.length} sizes
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={!product.isAvailable}
            className="mt-6 flex h-12 w-fit items-center justify-center gap-3 bg-[#40372F] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#655345] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={15} />
            {product.isAvailable ? "Add to bag" : "Unavailable"}
          </button>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.2) }}
      className="group min-w-0"
    >
      <Link href={productUrl} className="block">
        {productImage}
      </Link>

      <div className="pt-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A28A72]">
            {product.category}
          </span>

          {product.reviews > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-[10px] text-[#8E8072]">
              <Star size={11} fill="#B99A78" stroke="#B99A78" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <Link href={productUrl}>
          <h3 className="font-serif text-lg text-[#40372F] transition-colors hover:text-[#9B8065]">
            {product.name}
          </h3>
        </Link>

        {product.subtitle && (
          <p className="mt-1 text-xs text-[#968779]">
            {product.subtitle}
          </p>
        )}

        <div className="mt-3">
          <ProductPrice product={product} />
        </div>

        {product.colors.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={`${product.id}-${color.name}`}
                title={color.name}
                className="h-3.5 w-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: color.value }}
              />
            ))}

            {product.colors.length > 5 && (
              <span className="text-[10px] text-[#938476]">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={!product.isAvailable}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 border border-[#40372F] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#40372F] transition hover:bg-[#40372F] hover:text-white disabled:cursor-not-allowed disabled:border-[#D8D0C7] disabled:text-[#A99F94] disabled:hover:bg-transparent disabled:hover:text-[#A99F94]"
        >
          <ShoppingBag size={14} />
          {product.isAvailable ? "Add to bag" : "Sold out"}
        </button>
      </div>
    </motion.article>
  );
}

