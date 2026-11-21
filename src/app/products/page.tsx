"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Grid2X2,
  Heart,
  Info,
  List,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  XCircle,
} from "lucide-react";

import {
  type Product,
  type ProductColor,
} from "@/data/products";

import {
  addToCart,
  getCartCount,
} from "@/lib/cart";

import { getTalaProducts } from "@/lib/tala-products";

/* =========================================================
   TALA — PRODUCTS PAGE
   Version: 1.0
   Storefront product discovery experience
========================================================= */

/* ---------------------------------------------------------
   TYPES
--------------------------------------------------------- */

type ProductCategory = "All" | "Sets" | "Jackets";

type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high";

type ViewMode = "grid" | "list";

type QuickViewState = {
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
};

type NotificationType =
  | "success"
  | "error"
  | "info";

type NotificationState = {
  id: number;
  message: string;
  type: NotificationType;
} | null;

/* ---------------------------------------------------------
   CONSTANTS
--------------------------------------------------------- */

const FAVORITES_STORAGE_KEY = "tala-favorites";

const CATEGORIES: ProductCategory[] = [
  "All",
  "Sets",
  "Jackets",
];

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest",
    label: "Newest arrivals",
  },
  {
    value: "price-low",
    label: "Price: low to high",
  },
  {
    value: "price-high",
    label: "Price: high to low",
  },
];

const PRICE_LIMIT = 10000;

const PAGE_SIZE = 12;

const DEFAULT_SIZE = "M";

/* ---------------------------------------------------------
   FORMATTERS
--------------------------------------------------------- */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}

function getDiscount(
  price: number,
  oldPrice?: number
): number {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}

function getInitialColor(
  product: Product
): ProductColor {
  const firstAvailable = product.variants?.find(
    (variant) => variant.is_active && variant.stock_quantity > 0
  );

  return (
    product.colors.find((color) => color.name === firstAvailable?.color) ??
    product.colors[0] ?? {
      name: "Default",
      value: "#D8C8B4",
    }
  );
}

function getInitialSize(
  product: Product
): string {
  const firstAvailable = product.variants?.find(
    (variant) => variant.is_active && variant.stock_quantity > 0
  );

  return (
    firstAvailable?.size ||
    (product.sizes.includes(DEFAULT_SIZE)
      ? DEFAULT_SIZE
      : product.sizes[0] ?? "M")
  );
}

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/* ---------------------------------------------------------
   FAVORITES STORAGE
--------------------------------------------------------- */

function readFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(
      FAVORITES_STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is string =>
        typeof value === "string"
    );
  } catch {
    return [];
  }
}

function writeFavorites(
  favorites: string[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.error(
      "TALA: Unable to save favorites.",
      error
    );
  }
}

/* ---------------------------------------------------------
   ANIMATION SETTINGS
--------------------------------------------------------- */

const pageVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: {
      duration: 0.18,
    },
  },
};

/* ---------------------------------------------------------
   END OF PART 1
--------------------------------------------------------- */
/* =========================================================
   TALA — REUSABLE UI COMPONENTS
========================================================= */

/* ---------------------------------------------------------
   NOTIFICATION COMPONENT
--------------------------------------------------------- */

type NotificationProps = {
  notification: NotificationState;
  onClose: () => void;
};

function NotificationToast({
  notification,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (!notification) return;

    const timeout = window.setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [notification, onClose]);

  const notificationStyles = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-emerald-700",
      background: "bg-[#F1F5EF]",
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-700",
      background: "bg-[#FAEEEE]",
    },
    info: {
      icon: Info,
      iconColor: "text-[#8A755E]",
      background: "bg-[#F4EFE8]",
    },
  };

  if (!notification) return null;

  const style = notificationStyles[notification.type];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      <motion.div
        key={notification.id}
        initial={{
          opacity: 0,
          y: -18,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: -12,
          scale: 0.97,
        }}
        transition={{
          duration: 0.25,
        }}
        className="fixed right-4 top-5 z-[120] w-[calc(100%-2rem)] max-w-sm"
        role="status"
        aria-live="polite"
      >
        <div
          className={`flex items-center gap-3 rounded-xl border border-[#E8DED1] p-4 shadow-xl ${style.background}`}
        >
          <Icon
            size={20}
            className={style.iconColor}
          />

          <p className="flex-1 text-sm font-medium text-[#40372F]">
            {notification.message}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="rounded-full p-1 text-[#75695D] transition hover:bg-black/5"
          >
            <X size={17} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------
   SECTION EYEBROW
--------------------------------------------------------- */

function SectionEyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9B8065]">
      <span className="h-px w-6 bg-[#B99A78]" />
      {children}
    </span>
  );
}

/* ---------------------------------------------------------
   COLOR SWATCH
--------------------------------------------------------- */

type ColorSwatchProps = {
  color: ProductColor;
  selected: boolean;
  onClick: () => void;
  size?: "sm" | "md";
};

function ColorSwatch({
  color,
  selected,
  onClick,
  size = "sm",
}: ColorSwatchProps) {
  const dimensions =
    size === "md"
      ? "h-8 w-8"
      : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={onClick}
      title={color.name}
      aria-label={`Select ${color.name}`}
      aria-pressed={selected}
      className={`relative flex shrink-0 items-center justify-center rounded-full transition-all duration-200 ${dimensions} ${
        selected
          ? "ring-1 ring-[#9B8065] ring-offset-2 ring-offset-[#F8F5F0]"
          : "hover:scale-110"
      }`}
    >
      <span
        className="h-full w-full rounded-full border border-black/10"
        style={{
          backgroundColor: color.value,
        }}
      />

      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check
            size={size === "md" ? 15 : 11}
            className={
              color.value.toLowerCase() === "#171717" ||
              color.value.toLowerCase() === "#383838" ||
              color.value.toLowerCase() === "#5b3b2e"
                ? "text-white"
                : "text-[#40372F]"
            }
          />
        </span>
      )}
    </button>
  );
}

/* ---------------------------------------------------------
   PRODUCT BADGES
--------------------------------------------------------- */

function ProductBadges({
  product,
}: {
  product: Product;
}) {
  const discount = getDiscount(
    product.price,
    product.oldPrice
  );

  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-2">
      {product.isNew && (
        <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#75604A] shadow-sm">
          New arrival
        </span>
      )}

      {!product.isNew && product.isBestSeller && (
        <span className="rounded-full bg-[#40372F] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
          Best seller
        </span>
      )}

      {discount > 0 && (
        <span className="rounded-full bg-[#9B5F50] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
          -{discount}%
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   PRODUCT RATING
--------------------------------------------------------- */

function ProductRating({
  rating,
  reviews,
}: {
  rating: number;
  reviews: number;
}) {
  // Never display a rating until real customer reviews exist.
  if (reviews <= 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Star
        size={12}
        fill="#B99A78"
        stroke="#B99A78"
      />

      <span className="text-xs font-medium text-[#51463C]">
        {rating.toFixed(1)}
      </span>

      <span className="text-[11px] text-[#9A8C7D]">
        ({reviews})
      </span>
    </div>
  );
}

/* ---------------------------------------------------------
   PRODUCT PRICE
--------------------------------------------------------- */

function ProductPrice({
  price,
  oldPrice,
}: {
  price: number;
  oldPrice?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] font-medium tracking-[0.025em] text-[#302A24]">
        {formatPrice(price)}
      </span>

      {oldPrice && oldPrice > price && (
        <span className="text-xs text-[#A99B8C] line-through">
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   PRODUCT COLOR PREVIEW
--------------------------------------------------------- */

function ProductColorPreview({
  colors,
}: {
  colors: ProductColor[];
}) {
  return (
    <div className="flex items-center gap-2">
      {colors.slice(0, 4).map((color) => (
        <span
          key={color.name}
          title={color.name}
          className="h-3.5 w-3.5 rounded-full border border-black/10"
          style={{
            backgroundColor: color.value,
          }}
        />
      ))}

      {colors.length > 4 && (
        <span className="text-[10px] text-[#938476]">
          +{colors.length - 4}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   PRODUCT IMAGE
--------------------------------------------------------- */

type ProductImageProps = {
  product: Product;
  priority?: boolean;
  className?: string;
};

function ProductImage({
  product,
  priority = false,
  className = "",
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product.image]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#EAE3D9] ${className}`}
    >
      {!imageError ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#9A8C7D]">
          <ShoppingBag size={32} strokeWidth={1} />

          <span className="text-[10px] uppercase tracking-[0.2em]">
            TALA
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

/* ---------------------------------------------------------
   EMPTY STATE
--------------------------------------------------------- */

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5D9CA] bg-[#F1EBE2]">
        <ShoppingBag
          size={29}
          strokeWidth={1}
          className="text-[#947A61]"
        />
      </div>

      <h3 className="mb-2 font-serif text-2xl text-[#40372F]">
        {title}
      </h3>

      <p className="max-w-sm text-sm leading-7 text-[#8F8173]">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 border-b border-[#9B8065] pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#75604A] transition hover:text-[#40372F]"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

/* ---------------------------------------------------------
   SIZE SELECTOR
--------------------------------------------------------- */

type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
  compact?: boolean;
};

function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  compact = false,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const selected = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            aria-pressed={selected}
            className={`flex items-center justify-center border transition-all duration-200 ${
              compact
                ? "h-8 min-w-8 px-2 text-[10px]"
                : "h-11 min-w-11 px-3 text-xs"
            } ${
              selected
                ? "border-[#40372F] bg-[#40372F] text-white"
                : "border-[#E4D9CC] bg-transparent text-[#66584B] hover:border-[#9B8065]"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   QUANTITY SELECTOR
--------------------------------------------------------- */

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
};

function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  const decrease = () => {
    onChange(Math.max(min, quantity - 1));
  };

  const increase = () => {
    onChange(Math.min(max, quantity + 1));
  };

  return (
    <div className="inline-flex h-11 items-center border border-[#E5DACE]">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-10 items-center justify-center text-[#75695D] transition hover:bg-[#F0EAE2] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={14} />
      </button>

      <span
        className="min-w-8 text-center text-sm font-medium text-[#40372F]"
        aria-live="polite"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="flex h-full w-10 items-center justify-center text-[#75695D] transition hover:bg-[#F0EAE2] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   END OF PART 2
--------------------------------------------------------- */
/* =========================================================
   TALA — PRODUCT CARD
========================================================= */

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  index: number;
  viewMode: ViewMode;
};

/* ---------------------------------------------------------
   FAVORITE BUTTON
--------------------------------------------------------- */

function FavoriteButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      aria-label={
        active
          ? "Remove from favorites"
          : "Add to favorites"
      }
      aria-pressed={active}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE1D7] bg-[#FAF8F4]/95 text-[#66584B] shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
    >
      <motion.span
        animate={{
          scale: active ? [1, 1.25, 1] : 1,
        }}
        transition={{
          duration: 0.25,
        }}
      >
        <Heart
          size={17}
          strokeWidth={1.5}
          fill={active ? "#9B5F50" : "transparent"}
          color={active ? "#9B5F50" : "currentColor"}
        />
      </motion.span>
    </button>
  );
}

/* ---------------------------------------------------------
   QUICK VIEW TRIGGER
--------------------------------------------------------- */

function QuickViewButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EAE1D7] bg-[#FAF8F4]/95 text-[#66584B] shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
      aria-label="Quick view product"
    >
      <Search size={16} strokeWidth={1.5} />
    </button>
  );
}

/* ---------------------------------------------------------
   PRODUCT CARD COMPONENT
--------------------------------------------------------- */

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onQuickView,
  onAddToCart,
  index,
  viewMode,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const discount = getDiscount(
    product.price,
    product.oldPrice
  );

  const handleQuickView = useCallback(() => {
    onQuickView(product);
  }, [onQuickView, product]);

  const handleAdd = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  if (viewMode === "list") {
    return (
      <motion.article
        variants={itemVariants}
        custom={index}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group grid grid-cols-1 gap-5 border-b border-[#E9E0D5] py-6 sm:grid-cols-[220px_1fr] sm:gap-8"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE3D9]">
          <Link
            href={`/products/${encodeURIComponent(product.slug || product.id)}`}
            aria-label={`View ${product.name}`}
            className="group block h-full"
          >
            <ProductImage product={product} />

            <ProductBadges product={product} />
          </Link>

          <div className="absolute right-3 top-3">
            <FavoriteButton
              active={isFavorite}
              onClick={() =>
                onToggleFavorite(product.id)
              }
            />
          </div>
        </div>

        <div className="flex flex-col justify-center py-1">
          <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A28A72]">
            {product.category}
          </span>

          <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`}>
            <h3 className="font-serif text-2xl text-[#40372F] transition-colors hover:text-[#9B8065]">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-[#8E8072]">
            {product.subtitle}
          </p>

          <div className="mt-4">
            <ProductRating
              rating={product.rating}
              reviews={product.reviews}
            />
          </div>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#897B6D]">
            {product.description}
          </p>

          <div className="mt-5">
            <ProductPrice
              price={product.price}
              oldPrice={product.oldPrice}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <ProductColorPreview
              colors={product.colors}
            />

            <span className="h-4 w-px bg-[#E5DACE]" />

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#968779]">
              {product.sizes.length} sizes
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.isAvailable}
              className="flex h-12 items-center justify-center gap-3 bg-[#40372F] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#655345] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={15} />

              {product.isAvailable
                ? "Add to bag"
                : "Unavailable"}
            </button>

            <button
              type="button"
              onClick={handleQuickView}
              className="flex h-12 items-center justify-center border border-[#DCCFC0] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66584B] transition hover:border-[#40372F] hover:bg-[#F1EBE2]"
            >
              Quick view
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={itemVariants}
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group min-w-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE3D9]">
        <Link
          href={`/products/${encodeURIComponent(product.slug || product.id)}`}
          aria-label={`View ${product.name}`}
          className="block h-full"
        >
          <ProductImage product={product} />

          <ProductBadges product={product} />
        </Link>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <FavoriteButton
            active={isFavorite}
            onClick={() =>
              onToggleFavorite(product.id)
            }
          />

          <div
            className={`transition-all duration-300 ${
              hovered
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-100 sm:translate-y-2 sm:opacity-0"
            }`}
          >
            <QuickViewButton
              onClick={handleQuickView}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.isAvailable}
          className="absolute bottom-0 left-0 right-0 flex h-12 translate-y-0 items-center justify-center gap-2 bg-[#40372F]/95 text-[10px] font-semibold uppercase tracking-[0.2em] text-white opacity-100 transition-all duration-300 hover:bg-[#665345] sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag size={14} />

          {product.isAvailable
            ? "Add to bag"
            : "Unavailable"}
        </button>
      </div>

      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A28A72]">
            {product.category}
          </span>

          {product.isBestSeller && (
            <span className="text-[9px] uppercase tracking-[0.12em] text-[#9B8065]">
              Bestseller
            </span>
          )}
        </div>

        <Link href={`/products/${encodeURIComponent(product.slug || product.id)}`}>
          <h3 className="truncate font-serif text-[17px] tracking-[0.005em] text-[#302A24] transition-colors hover:text-[#9B8065] sm:text-[19px]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 truncate text-[11px] text-[#9A8C7D]">
          {product.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <ProductPrice
            price={product.price}
            oldPrice={product.oldPrice}
          />

          <ProductRating
            rating={product.rating}
            reviews={product.reviews}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <ProductColorPreview
            colors={product.colors}
          />

          {discount > 0 && (
            <span className="text-[9px] font-medium uppercase tracking-wider text-[#9B5F50]">
              Save {discount}%
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ---------------------------------------------------------
   PRODUCT GRID SKELETON
--------------------------------------------------------- */

function ProductSkeleton({
  count = 4,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
      {Array.from({
        length: count,
      }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse"
        >
          <div className="aspect-[3/4] bg-[#EAE3D9]" />

          <div className="mt-4 h-3 w-1/4 bg-[#E5DACE]" />

          <div className="mt-3 h-5 w-3/4 bg-[#E5DACE]" />

          <div className="mt-3 h-3 w-1/2 bg-[#E5DACE]" />

          <div className="mt-5 h-4 w-1/3 bg-[#E5DACE]" />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   END OF PART 3
--------------------------------------------------------- */
/* =========================================================
   TALA — QUICK VIEW MODAL
========================================================= */

type QuickViewModalProps = {
  quickView: QuickViewState | null;
  onClose: () => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: ProductColor) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
};

function QuickViewModal({
  quickView,
  onClose,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  onAddToCart,
}: QuickViewModalProps) {
  useEffect(() => {
    if (!quickView) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [quickView, onClose]);

  if (!quickView) return null;

  const {
    product,
    selectedSize,
    selectedColor,
    quantity,
  } = quickView;

  const selectedVariant = product.variants?.find(
    (variant) =>
      variant.is_active &&
      variant.size === selectedSize &&
      variant.color === selectedColor.name
  );

  const availableStock =
    selectedVariant?.stock_quantity ?? 0;

  const selectedPrice =
    selectedVariant?.price_override ?? product.price;

  const isAvailable =
    Boolean(selectedVariant) && availableStock > 0;

  const maxQuantity = Math.min(
    10,
    availableStock
  );

  return (
    <AnimatePresence>
      <motion.div
        key="tala-quick-view-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211B16]/65 p-3 backdrop-blur-sm sm:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-[#F8F5F0] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view ${product.name}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DACE] bg-[#F8F5F0]/95 text-[#66584B] transition hover:bg-white"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-[4/5] bg-[#EAE3D9] md:aspect-auto md:min-h-[560px]">
              <ProductImage
                product={product}
                priority
              />

              <ProductBadges product={product} />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-9 md:p-10">
              <SectionEyebrow>
                {product.category}
              </SectionEyebrow>

              <h2 className="mt-3 font-serif text-3xl leading-tight text-[#40372F] sm:text-4xl">
                {product.name}
              </h2>

              {product.subtitle && (
                <p className="mt-3 text-sm leading-6 text-[#8F8173]">
                  {product.subtitle}
                </p>
              )}

              <div className="mt-5 flex items-center gap-3">
                <ProductPrice
                  price={selectedPrice}
                  oldPrice={product.oldPrice}
                />

                <ProductRating
                  rating={product.rating}
                  reviews={product.reviews}
                />
              </div>

              {product.description && (
                <p className="mt-6 text-sm leading-7 text-[#897B6D]">
                  {product.description}
                </p>
              )}

              <div className="mt-7 border-t border-[#E5DACE] pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66584B]">
                    Color
                  </span>

                  <span className="text-xs text-[#9A8C7D]">
                    {selectedColor.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    const colorAvailable =
                      product.variants?.some(
                        (variant) =>
                          variant.is_active &&
                          variant.color === color.name &&
                          variant.stock_quantity > 0
                      ) ?? false;

                    return (
                      <div
                        key={color.name}
                        className="relative"
                      >
                        <ColorSwatch
                          color={color}
                          selected={
                            selectedColor.name === color.name
                          }
                          onClick={() =>
                            onColorChange(color)
                          }
                          size="md"
                        />

                        {!colorAvailable && (
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#F8F5F0] bg-[#9B5F50] text-white">
                            <X size={10} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66584B]">
                    Size
                  </span>

                  <Link
                    href="/size-guide"
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.12em] text-[#9B8065] underline underline-offset-4 transition hover:text-[#40372F]"
                  >
                    Size guide
                  </Link>
                </div>

                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelect={onSizeChange}
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66584B]">
                  Quantity
                </span>

                <QuantitySelector
                  quantity={quantity}
                  onChange={onQuantityChange}
                  max={Math.max(1, maxQuantity)}
                />
              </div>

              <div className="mt-5">
                {isAvailable ? (
                  <p className="flex items-center gap-2 text-xs text-[#6F806A]">
                    <CheckCircle2 size={14} />
                    {availableStock} available
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-xs text-[#9B5F50]">
                    <Info size={14} />
                    This combination is currently unavailable
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onAddToCart}
                disabled={!isAvailable || quantity > availableStock}
                className="mt-6 flex h-14 w-full items-center justify-center gap-3 bg-[#40372F] text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#655345] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={17} />

                {isAvailable
                  ? "Add to bag"
                  : "Unavailable"}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#A18F7D]">
                <Info size={13} />
                Secure checkout · Cash on delivery
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================
   TALA — FILTER COMPONENTS
========================================================= */

type ProductFiltersProps = {
  selectedCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;

  maxPrice: number;
  onMaxPriceChange: (price: number) => void;

  onlyFavorites: boolean;
  onOnlyFavoritesChange: (value: boolean) => void;

  newOnly: boolean;
  onNewOnlyChange: (value: boolean) => void;

  bestSellersOnly: boolean;
  onBestSellersOnlyChange: (value: boolean) => void;

  onClear: () => void;

  favoritesCount: number;
  productsCount: number;

  categoryCounts: Record<string, number>;
};

/* ---------------------------------------------------------
   FILTER SECTION
--------------------------------------------------------- */

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-[#E8DED2] py-5">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#51463C]">
          {title}
        </span>

        {isOpen ? (
          <Minus size={14} className="text-[#9B8065]" />
        ) : (
          <Plus size={14} className="text-[#9B8065]" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------
   FILTER OPTION
--------------------------------------------------------- */

function FilterOption({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-3">
        <span
          className={`flex h-4 w-4 items-center justify-center border transition ${
            checked
              ? "border-[#40372F] bg-[#40372F]"
              : "border-[#CFC2B4] bg-transparent"
          }`}
        >
          {checked && (
            <Check
              size={11}
              className="text-white"
            />
          )}
        </span>

        <span className="text-xs text-[#75695D]">
          {label}
        </span>
      </span>

      <span className="flex items-center gap-2">
        {typeof count === "number" && (
          <span className="text-[10px] text-[#AA9C8D]">
            {count}
          </span>
        )}

        <input
          type="checkbox"
          checked={checked}
          onChange={(event) =>
            onChange(event.target.checked)
          }
          className="sr-only"
        />
      </span>
    </label>
  );
}

/* ---------------------------------------------------------
   PRICE RANGE FILTER
--------------------------------------------------------- */

function PriceRangeFilter({
  maxPrice,
  onChange,
}: {
  maxPrice: number;
  onChange: (price: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#75695D]">
          Up to
        </span>

        <span className="text-xs font-semibold text-[#40372F]">
          {formatPrice(maxPrice)}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={PRICE_LIMIT}
          step={100}
          value={maxPrice}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          aria-label="Maximum product price"
          className="tala-price-range relative z-10 h-5 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#A99B8C]">
        <span>{formatPrice(0)}</span>
        <span>{formatPrice(PRICE_LIMIT)}</span>
      </div>

      <style jsx>{`
        .tala-price-range::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #40372f;
          border: 2px solid #f8f5f0;
          box-shadow: 0 0 0 1px #9b8065;
        }

        .tala-price-range::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #40372f;
          border: 2px solid #f8f5f0;
          box-shadow: 0 0 0 1px #9b8065;
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------
   FILTER CONTENT
--------------------------------------------------------- */

function ProductFilterContent({
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  onlyFavorites,
  onOnlyFavoritesChange,
  newOnly,
  onNewOnlyChange,
  bestSellersOnly,
  onBestSellersOnlyChange,
  onClear,
  favoritesCount,
  productsCount,
  categoryCounts,
}: ProductFiltersProps) {
  const hasActiveFilters =
    selectedCategory !== "All" ||
    maxPrice !== PRICE_LIMIT ||
    onlyFavorites ||
    newOnly ||
    bestSellersOnly;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            className="text-[#9B8065]"
          />

          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#40372F]">
            Refine selection
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9B5F50] transition hover:text-[#40372F]"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Categories">
        <div className="space-y-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                onCategoryChange(category)
              }
              aria-pressed={
                selectedCategory === category
              }
              className={`flex w-full items-center justify-between py-2 text-left transition ${
                selectedCategory === category
                  ? "text-[#40372F]"
                  : "text-[#827466] hover:text-[#40372F]"
              }`}
            >
              <span
                className={`text-xs ${
                  selectedCategory === category
                    ? "font-semibold"
                    : "font-normal"
                }`}
              >
                {category === "All"
                  ? "All products"
                  : category}
              </span>

              <span className="text-[10px] text-[#AA9C8D]">
                {categoryCounts[category] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price range">
        <PriceRangeFilter
          maxPrice={maxPrice}
          onChange={onMaxPriceChange}
        />
      </FilterSection>

      <FilterSection title="Collections">
        <div className="space-y-1">
          <FilterOption
            label="New arrivals"
            checked={newOnly}
            onChange={onNewOnlyChange}
          />

          <FilterOption
            label="Best sellers"
            checked={bestSellersOnly}
            onChange={onBestSellersOnlyChange}
          />

          <FilterOption
            label="My favorites"
            checked={onlyFavorites}
            onChange={onOnlyFavoritesChange}
            count={favoritesCount}
          />
        </div>
      </FilterSection>

      <div className="mt-5 border border-[#E8DED2] bg-[#F3EEE7] p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles
            size={15}
            className="text-[#A58B70]"
          />

          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#65584B]">
            The TALA edit
          </span>
        </div>

        <p className="text-xs leading-6 text-[#938476]">
          Discover carefully selected pieces designed
          to bring effortless elegance to your wardrobe.
        </p>

        <p className="mt-3 text-[10px] text-[#A28A72]">
          {productsCount} products available
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DESKTOP FILTER SIDEBAR
--------------------------------------------------------- */

function ProductFilterSidebar(
  props: ProductFiltersProps
) {
  return (
    <aside className="hidden w-full shrink-0 lg:block lg:w-[230px] xl:w-[250px]">
      <div className="sticky top-8">
        <ProductFilterContent {...props} />
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------
   MOBILE FILTER DRAWER
--------------------------------------------------------- */

type MobileFilterDrawerProps =
  ProductFiltersProps & {
    isOpen: boolean;
    onClose: () => void;
    resultCount: number;
  };

function MobileFilterDrawer({
  isOpen,
  onClose,
  resultCount,
  ...filterProps
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="tala-mobile-filter-overlay"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-[90] bg-[#211B16]/55 backdrop-blur-sm lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              duration: 0.28,
              ease: "easeOut",
            }}
            className="flex h-full w-[min(88%,380px)] flex-col bg-[#F8F5F0] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E8DED2] px-5 py-5">
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#9B8065]">
                  TALA Collection
                </span>

                <h2 className="mt-1 font-serif text-2xl text-[#40372F]">
                  Refine collection
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close collection refinements"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DACE] text-[#66584B] transition hover:bg-[#F0EAE2]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ProductFilterContent
                {...filterProps}
              />
            </div>

            <div className="border-t border-[#E8DED2] bg-[#F8F5F0] p-5">
              <button
                type="button"
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#40372F] text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#655345]"
              >
                Show {resultCount} products

                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------
   END OF PART 5
--------------------------------------------------------- */
  // ----------------------------------------
  // FAVORITES
  // ----------------------------------------

  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((current) => {
        const alreadyFavorite =
          current.includes(productId);

        if (alreadyFavorite) {
          showNotification("Removed from your wishlist.");
          return current.filter((id) => id !== productId);
        }

        showNotification("Added to your wishlist.");
        return [...current, productId];
      });
    },
    [showNotification]
  );

  // ----------------------------------------
  // CART
  // ----------------------------------------

  const addProductToCart = useCallback(
    (
      product: Product,
      options?: {
        size?: string;
        color?: ProductColor;
        quantity?: number;
      }
    ) => {
      if (!product.isAvailable) {
        showNotification(
          "This product is currently unavailable.",
          "error"
        );
        return;
      }

      const selectedColor =
        options?.color ?? getInitialColor(product);

      const selectedSize =
        options?.size ?? getInitialSize(product);

      const quantity = options?.quantity ?? 1;

      const selectedVariant = product.variants?.find(
        (variant) =>
          variant.is_active &&
          variant.size === selectedSize &&
          variant.color === selectedColor.name
      );

      if (!selectedVariant || selectedVariant.stock_quantity <= 0) {
        showNotification(
          "This size and color combination is sold out. Please choose another option.",
          "error"
        );
        return;
      }

      if (quantity > selectedVariant.stock_quantity) {
        showNotification(
          `Only ${selectedVariant.stock_quantity} item(s) are available.`,
          "error"
        );
        return;
      }

      const updatedCart = addToCart({
        productId: product.id,
        name: product.name,
        price: selectedVariant.price_override ?? product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor.name,
        quantity,
      });

      setCartCount(
        updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        )
      );

      showNotification(`${product.name} added to your bag.`);
    },
    [showNotification]
  );

  // ----------------------------------------
  // QUICK VIEW
  // ----------------------------------------

  const openQuickView = useCallback(
    (product: Product) => {
      const firstAvailable = product.variants?.find(
        (variant) =>
          variant.is_active && variant.stock_quantity > 0
      );

      setQuickView({
        product,
        selectedSize: firstAvailable?.size ?? getInitialSize(product),
        selectedColor:
          product.colors.find(
            (color) => color.name === firstAvailable?.color
          ) ?? getInitialColor(product),
        quantity: 1,
      });
    },
    []
  );

  const closeQuickView = useCallback(() => {
    setQuickView(null);
  }, []);

  const changeQuickViewSize = useCallback(
    (size: string) => {
      setQuickView((current) => {
        if (!current) return null;

        const matching = current.product.variants?.filter(
          (variant) =>
            variant.is_active &&
            variant.size === size &&
            variant.stock_quantity > 0
        ) ?? [];

        const sameColor = matching.find(
          (variant) => variant.color === current.selectedColor.name
        );

        const nextVariant = sameColor ?? matching[0];

        return {
          ...current,
          selectedSize: size,
          selectedColor: nextVariant
            ? current.product.colors.find(
                (color) => color.name === nextVariant.color
              ) ?? current.selectedColor
            : current.selectedColor,
        };
      });
    },
    []
  );

  const changeQuickViewColor = useCallback(
    (color: ProductColor) => {
      setQuickView((current) => {
        if (!current) return null;

        const matching = current.product.variants?.filter(
          (variant) =>
            variant.is_active &&
            variant.color === color.name &&
            variant.stock_quantity > 0
        ) ?? [];

        const sameSize = matching.find(
          (variant) => variant.size === current.selectedSize
        );

        return {
          ...current,
          selectedColor: color,
          selectedSize:
            sameSize?.size ??
            matching[0]?.size ??
            current.selectedSize,
        };
      });
    },
    []
  );

  const changeQuickViewQuantity = useCallback(
    (quantity: number) => {
      setQuickView((current) =>
        current
          ? {
              ...current,
              quantity: Math.max(1, Math.min(10, quantity)),
            }
          : null
      );
    },
    []
  );

  const addQuickViewToCart = useCallback(() => {
    if (!quickView) return;

    addProductToCart(quickView.product, {
      size: quickView.selectedSize,
      color: quickView.selectedColor,
      quantity: quickView.quantity,
    });

    setQuickView(null);
  }, [quickView, addProductToCart]);

  // ----------------------------------------
  // FILTERING AND SEARCH
  // ----------------------------------------

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeSearch(search);

    const filtered = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          product.name,
          product.subtitle,
          product.description,
          product.category,
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesPrice = product.price <= maxPrice;
      const matchesFavorites =
        !onlyFavorites || favorites.includes(product.id);
      const matchesNew = !newOnly || product.isNew;
      const matchesBestSeller =
        !bestSellersOnly || product.isBestSeller;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesFavorites &&
        matchesNew &&
        matchesBestSeller
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return Number(b.isNew) - Number(a.isNew);

        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "featured":
        default:
          return (
            Number(b.isFeatured) - Number(a.isFeatured) ||
            Number(b.isNew) - Number(a.isNew) ||
            b.price - a.price
          );
      }
    });
  }, [
    products,
    search,
    selectedCategory,
    maxPrice,
    onlyFavorites,
    favorites,
    newOnly,
    bestSellersOnly,
    sortBy,
  ]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: products.length,
    };

    for (const product of products) {
      counts[product.category] =
        (counts[product.category] ?? 0) + 1;
    }

    return counts;
  }, [products]);

  // ----------------------------------------
  // PAGINATION
  // ----------------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategory,
    maxPrice,
    onlyFavorites,
    newOnly,
    bestSellersOnly,
    sortBy,
  ]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, currentPage * PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const hasMoreProducts =
    visibleProducts.length < filteredProducts.length;

  const loadMoreProducts = () => {
    setCurrentPage((current) => current + 1);
  };

  // ----------------------------------------
  // RESET FILTERS
  // ----------------------------------------

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory(pageCategory);
    setMaxPrice(PRICE_LIMIT);
    setOnlyFavorites(false);
    setNewOnly(false);
    setBestSellersOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
  }, [pageCategory]);

  const activeFilterCount = [
    selectedCategory !== "All",
    maxPrice < PRICE_LIMIT,
    onlyFavorites,
    newOnly,
    bestSellersOnly,
    search.trim().length > 0,
  ].filter(Boolean).length;

  // ----------------------------------------
  // FILTER COMPONENT PROPS
  // ----------------------------------------

  const filterProps: ProductFiltersProps = {
    selectedCategory,
    onCategoryChange: setSelectedCategory,
    maxPrice,
    onMaxPriceChange: setMaxPrice,
    onlyFavorites,
    onOnlyFavoritesChange: setOnlyFavorites,
    newOnly,
    onNewOnlyChange: setNewOnly,
    bestSellersOnly,
    onBestSellersOnlyChange: setBestSellersOnly,
    onClear: clearFilters,
    favoritesCount: favorites.length,
    productsCount: products.length,
    categoryCounts,
  };

  // ----------------------------------------
  // PAGE
  // ----------------------------------------

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#302A24]">
      <header className="sticky top-0 z-40 border-b border-[#DCD3C8] bg-[#40372F] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/"
            className="font-serif text-3xl tracking-[0.22em] text-white"
          >
            TALA
          </Link>

          <nav className="flex items-center gap-5 text-sm md:gap-9">
            <Link href="/" className="transition-colors hover:text-[#D9C6A5]">
              Home
            </Link>

            <Link href="/products" className="text-[#D9C6A5]">
              Shop
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 transition-colors hover:text-[#D9C6A5]"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />
              <span className="hidden sm:inline">Bag</span>

              {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D9C6A5] px-1 text-[10px] font-semibold text-[#40372F]">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#E6DED4] bg-[linear-gradient(180deg,#F9F7F3_0%,#F3EEE7_100%)]">
        <div className="mx-auto max-w-[1500px] px-5 py-20 text-center md:px-10 md:py-28">
          <SectionEyebrow>
            {selectedCategory === "All"
              ? "THE TALA COLLECTION"
              : `THE TALA ${selectedCategory.toUpperCase()} EDIT`}
          </SectionEyebrow>

          <motion.h1
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-5 max-w-4xl font-serif text-4xl leading-[1.08] tracking-[-0.035em] text-[#302A24] sm:text-5xl md:text-7xl"
          >
            {selectedCategory === "Sets"
              ? "Effortlessly"
              : selectedCategory === "Jackets"
                ? "The finishing"
                : "A study in"}

            <span className="block italic font-normal text-[#9B8065]">
              {selectedCategory === "Sets"
                ? "put together."
                : selectedCategory === "Jackets"
                  ? "touch."
                  : "quiet elegance."}
            </span>
          </motion.h1>

          <p className="mx-auto mt-7 max-w-[540px] text-[13px] leading-8 tracking-[0.015em] text-[#81766A] md:text-sm">
            {selectedCategory === "Sets"
              ? "Considered silhouettes, beautifully coordinated. Discover pieces made to bring ease and intention to the everyday."
              : selectedCategory === "Jackets"
                ? "Thoughtful layers with a confident point of view. Discover the pieces that complete a look, season after season."
                : "A considered edit of modern essentials, timeless silhouettes and the little details that make a look your own."}
          </p>

          <div className="mx-auto mt-9 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#C9B8A4]" />
            <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#9B8065]">
              Considered. Timeless. TALA.
            </span>
            <span className="h-px w-10 bg-[#C9B8A4]" />
          </div>

          <nav
            aria-label="Shop TALA collections"
            className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
            {[
              { label: "All pieces", href: "/products", category: "All" as const },
              { label: "Sets", href: "/products?category=sets", category: "Sets" as const },
              { label: "Jackets", href: "/products?category=jackets", category: "Jackets" as const },
            ].map((item) => (
              <Link
                key={item.category}
                href={item.href}
                aria-current={
                  selectedCategory === item.category ? "page" : undefined
                }
                className={`border-b pb-2 text-[9px] font-medium uppercase tracking-[0.22em] transition-colors ${
                  selectedCategory === item.category
                    ? "border-[#8F7358] text-[#40372F]"
                    : "border-transparent text-[#9A8C7D] hover:border-[#C9B8A4] hover:text-[#40372F]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-[1540px] px-4 py-12 md:px-10 md:py-20">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="hidden w-[250px] shrink-0 lg:block xl:w-[270px]">
            <div className="sticky top-28">
              <ProductFilterSidebar {...filterProps} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <ProductToolbar
              search={search}
              onSearchChange={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultCount={filteredProducts.length}
              totalCount={products.length}
              selectedCategory={selectedCategory}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />

            {activeFilterCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs uppercase tracking-wider text-[#8B7D70]">
                  Applied refinements:
                </span>

                {search.trim() && (
                  <ActiveFilterChip
                    label={`Search: ${search}`}
                    onRemove={() => setSearch("")}
                  />
                )}

                {selectedCategory !== "All" && (
                  <ActiveFilterChip
                    label={selectedCategory}
                    onRemove={() => setSelectedCategory("All")}
                  />
                )}

                {maxPrice < PRICE_LIMIT && (
                  <ActiveFilterChip
                    label={`Under ${formatPrice(maxPrice)}`}
                    onRemove={() => setMaxPrice(PRICE_LIMIT)}
                  />
                )}

                {onlyFavorites && (
                  <ActiveFilterChip
                    label="Favorites"
                    onRemove={() => setOnlyFavorites(false)}
                  />
                )}

                {newOnly && (
                  <ActiveFilterChip
                    label="New arrivals"
                    onRemove={() => setNewOnly(false)}
                  />
                )}

                {bestSellersOnly && (
                  <ActiveFilterChip
                    label="Best sellers"
                    onRemove={() => setBestSellersOnly(false)}
                  />
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 text-xs font-medium text-[#8B6F50] underline underline-offset-4 transition-colors hover:text-[#40372F]"
                >
                  Clear all
                </button>
              </div>
            )}

            {isLoading ? (
              <ProductSkeleton count={8} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title="No pieces found"
                description="Try adjusting your search or filters to discover more from TALA."
                actionLabel="Clear filters"
                onAction={clearFilters}
              />
            ) : (
              <motion.div
                key={viewMode}
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3"
                    : "grid grid-cols-1 gap-6"
                }
              >
                {visibleProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={() => toggleFavorite(product.id)}
                      onQuickView={() => openQuickView(product)}
                      onAddToCart={() => addProductToCart(product)}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {hasMoreProducts && (
              <div className="mt-14 flex justify-center">
                <button
                  type="button"
                  onClick={loadMoreProducts}
                  className="border border-[#A99A88] px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#40372F] transition-all duration-300 hover:border-[#40372F] hover:bg-[#40372F] hover:text-white"
                >
                  Load more
                </button>
              </div>
            )}

            <div className="mt-10 border-t border-[#E2D9CF] pt-6 text-center">
              <p className="text-xs tracking-wide text-[#8B7D70]">
                Showing {visibleProducts.length} of {filteredProducts.length} pieces
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#DCD3C8] bg-[#40372F] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 md:px-10">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Link
                href="/"
                className="font-serif text-3xl tracking-[0.22em]"
              >
                TALA
              </Link>

              <p className="mt-5 max-w-xs text-sm leading-7 text-[#D1C7BC]">
                Timeless fashion, thoughtfully selected for everyday elegance.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C6A5]">
                Explore
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#D1C7BC]">
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <Link href="/products" className="transition-colors hover:text-white">
                  Shop all
                </Link>
                <Link href="/cart" className="transition-colors hover:text-white">
                  Shopping bag
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C6A5]">
                TALA
              </h3>

              <p className="mt-5 text-sm leading-7 text-[#D1C7BC]">
                Designed with care. Made to be remembered.
              </p>
            </div>
          </div>

          <div className="mt-12 border-t border-white/15 pt-6 text-center">
            <p className="text-[11px] tracking-wider text-[#BEB2A5]">
              © {new Date().getFullYear()} TALA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <MobileFilterDrawer
        {...filterProps}
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        resultCount={filteredProducts.length}
      />

      <QuickViewModal
        quickView={quickView}
        onClose={closeQuickView}
        onSizeChange={changeQuickViewSize}
        onColorChange={changeQuickViewColor}
        onQuantityChange={changeQuickViewQuantity}
        onAddToCart={addQuickViewToCart}
      />

      <NotificationToast
        notification={notification}
        onClose={closeNotification}
      />
    </main>
  );
}

export default ProductsPage;
