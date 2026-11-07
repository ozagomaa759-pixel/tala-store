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
  ArrowDown,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Clock3,
  Filter,
  Grid2X2,
  Heart,
  Info,
  LayoutGrid,
  List,
  Loader2,
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
  addToCart,
  getCartCount,
} from "@/lib/cart";

/* =========================================================
   TALA — PRODUCTS PAGE
   Version: 1.0
   Storefront product discovery experience
========================================================= */

/* ---------------------------------------------------------
   TYPES
--------------------------------------------------------- */

type ProductCategory =
  | "All"
  | "Dresses"
  | "Tops"
  | "Bottoms"
  | "Outerwear"
  | "Sets";

type ProductColor = {
  name: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: Exclude<ProductCategory, "All">;
  image: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  tags: string[];
};

type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "rating";

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
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Sets",
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
  {
    value: "rating",
    label: "Top rated",
  },
];

const PRICE_LIMIT = 10000;

const PAGE_SIZE = 12;

const DEFAULT_SIZE = "M";

/* ---------------------------------------------------------
   PRODUCT DATA
--------------------------------------------------------- */

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "The Essential Dress",
    subtitle: "Effortless everyday elegance",
    description:
      "A timeless wardrobe essential designed with a clean silhouette and a comfortable feel. Made for everyday styling and special moments.",
    price: 1890,
    oldPrice: 2290,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=85",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85",
    ],
    colors: [
      {
        name: "Ivory",
        value: "#E8DFD1",
      },
      {
        name: "Black",
        value: "#171717",
      },
      {
        name: "Taupe",
        value: "#A58E78",
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 28,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Essential", "Elegant", "Everyday"],
  },
  {
    id: "2",
    name: "Soft Structure Top",
    subtitle: "Minimal form, maximum comfort",
    description:
      "A refined top with a versatile shape. Designed to pair effortlessly with your favorite trousers, skirts, and everyday essentials.",
    price: 990,
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900&q=85",
      "https://images.unsplash.com/photo-1564257577-7a3c3e8e1f4a?w=900&q=85",
    ],
    colors: [
      {
        name: "Cream",
        value: "#E9E0D2",
      },
      {
        name: "Chocolate",
        value: "#5B3B2E",
      },
    ],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.8,
    reviews: 19,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    isAvailable: true,
    tags: ["Minimal", "Soft"],
  },
  {
    id: "3",
    name: "Modern Tailored Pants",
    subtitle: "A polished everyday silhouette",
    description:
      "Tailored trousers with a modern shape and a versatile finish. A refined piece for building effortless outfits.",
    price: 1450,
    oldPrice: 1690,
    category: "Bottoms",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9a8a7e4c4e5?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1506629905607-d9a8a7e4c4e5?w=900&q=85",
    ],
    colors: [
      {
        name: "Stone",
        value: "#B8AA96",
      },
      {
        name: "Black",
        value: "#171717",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 16,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Tailored", "Essential"],
  },
  {
    id: "4",
    name: "The Weekend Set",
    subtitle: "Relaxed matching essentials",
    description:
      "A coordinated set created for relaxed days and effortless styling. Wear it together or style each piece separately.",
    price: 2190,
    category: "Sets",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    ],
    colors: [
      {
        name: "Sand",
        value: "#C9B69C",
      },
      {
        name: "Black",
        value: "#171717",
      },
    ],
    sizes: ["S", "M", "L"],
    rating: 4.9,
    reviews: 34,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Matching", "Comfort"],
  },
  {
    id: "5",
    name: "Classic Layer Jacket",
    subtitle: "The finishing touch",
    description:
      "A versatile outer layer with a timeless look. Designed to bring structure and character to simple outfits.",
    price: 2490,
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1548624149-f7d8d6e1c9c5?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1548624149-f7d8d6e1c9c5?w=900&q=85",
    ],
    colors: [
      {
        name: "Taupe",
        value: "#A58E78",
      },
      {
        name: "Charcoal",
        value: "#383838",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 12,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    isAvailable: true,
    tags: ["Layering", "Classic"],
  },
  {
    id: "6",
    name: "Sculpted Midi Dress",
    subtitle: "Modern elegance",
    description:
      "A sophisticated midi dress with a beautifully balanced silhouette. An elegant choice for day-to-evening styling.",
    price: 1990,
    oldPrice: 2390,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85",
    ],
    colors: [
      {
        name: "Ivory",
        value: "#E8DFD1",
      },
      {
        name: "Mocha",
        value: "#80634F",
      },
    ],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.9,
    reviews: 41,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isAvailable: true,
    tags: ["Midi", "Elegant"],
  },
  {
    id: "7",
    name: "Everyday Essential Tee",
    subtitle: "Simple by design",
    description:
      "A clean everyday tee made to become part of your regular rotation. Easy to style, easy to wear.",
    price: 690,
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85",
    ],
    colors: [
      {
        name: "White",
        value: "#F4F1EA",
      },
      {
        name: "Black",
        value: "#171717",
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.6,
    reviews: 22,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    isAvailable: true,
    tags: ["Basic", "Everyday"],
  },
  {
    id: "8",
    name: "Relaxed Wide Leg Pants",
    subtitle: "Movement meets simplicity",
    description:
      "Relaxed wide-leg trousers designed for comfortable movement and a clean modern appearance.",
    price: 1390,
    category: "Bottoms",
    image:
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=900&q=85",
    ],
    colors: [
      {
        name: "Beige",
        value: "#D3C2A8",
      },
      {
        name: "Black",
        value: "#171717",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 18,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isAvailable: true,
    tags: ["Relaxed", "Modern"],
  },
];

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

function getProductById(
  id: string
): Product | undefined {
  return PRODUCTS.find(
    (product) => product.id === id
  );
}

function getInitialColor(
  product: Product
): ProductColor {
  return product.colors[0] ?? {
    name: "Default",
    value: "#D8C8B4",
  };
}

function getInitialSize(
  product: Product
): string {
  return product.sizes.includes(DEFAULT_SIZE)
    ? DEFAULT_SIZE
    : product.sizes[0] ?? "M";
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
      <span className="text-sm font-semibold tracking-wide text-[#40372F]">
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
            href={`/products/${product.id}`}
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

          <Link href={`/products/${product.id}`}>
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
      <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE3D9]">
        <Link
          href={`/products/${product.id}`}
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
            ? "Quick add"
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

        <Link href={`/products/${product.id}`}>
          <h3 className="truncate font-serif text-base text-[#40372F] transition-colors hover:text-[#9B8065] sm:text-lg">
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
   Product preview, gallery, variants and quantity
========================================================= */

type QuickViewModalProps = {
  quickView: QuickViewState | null;
  onClose: () => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: ProductColor) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
};

/* ---------------------------------------------------------
   QUICK VIEW IMAGE GALLERY
--------------------------------------------------------- */

function QuickViewGallery({
  product,
}: {
  product: Product;
}) {
  const images = product.images.length
    ? product.images
    : [product.image];

  const [activeImage, setActiveImage] = useState(
    images[0] ?? product.image
  );

  useEffect(() => {
    setActiveImage(images[0] ?? product.image);
  }, [product.id, product.image, images]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="group relative aspect-[4/5] overflow-hidden bg-[#EAE3D9]">
        <Image
          key={activeImage}
          src={activeImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
        />

        <div className="absolute left-4 top-4">
          <ProductBadges product={product} />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => {
            const selected = activeImage === image;

            return (
              <button
                key={`${product.id}-image-${index}`}
                type="button"
                onClick={() => setActiveImage(image)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={selected}
                className={`relative aspect-[4/5] overflow-hidden bg-[#EAE3D9] transition ${
                  selected
                    ? "ring-2 ring-[#9B8065] ring-offset-2 ring-offset-[#F8F5F0]"
                    : "opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   QUICK VIEW PRODUCT INFORMATION
--------------------------------------------------------- */

function QuickViewInformation({
  quickView,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  onAddToCart,
}: Omit<QuickViewModalProps, "onClose"> & {
  quickView: QuickViewState;
}) {
  const { product } = quickView;

  const discount = getDiscount(
    product.price,
    product.oldPrice
  );

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9B8065]">
          {product.category}
        </span>

        <span className="h-1 w-1 rounded-full bg-[#C5B4A1]" />

        <span className="text-[10px] uppercase tracking-[0.15em] text-[#A49789]">
          TALA Collection
        </span>
      </div>

      <h2
        id="tala-quick-view-title"
        className="font-serif text-3xl leading-tight text-[#40372F] sm:text-4xl"
      >
        {product.name}
      </h2>

      <p className="mt-3 text-sm leading-7 text-[#938476]">
        {product.subtitle}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <ProductRating
          rating={product.rating}
          reviews={product.reviews}
        />

        <span className="h-4 w-px bg-[#E5DACE]" />

        <span className="text-[10px] uppercase tracking-[0.12em] text-[#9B8C7D]">
          {product.reviews} customer reviews
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-xl font-semibold text-[#40372F]">
          {formatPrice(product.price)}
        </span>

        {product.oldPrice &&
          product.oldPrice > product.price && (
            <>
              <span className="text-sm text-[#A99B8C] line-through">
                {formatPrice(product.oldPrice)}
              </span>

              <span className="bg-[#F0E6DF] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#9B5F50]">
                Save {discount}%
              </span>
            </>
          )}
      </div>

      <div className="my-7 h-px bg-[#E8DED2]" />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#65584C]">
            Select color
          </span>

          <span className="text-xs text-[#9B8C7D]">
            {quickView.selectedColor.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {product.colors.map((color) => (
            <ColorSwatch
              key={color.name}
              color={color}
              selected={
                quickView.selectedColor.name === color.name
              }
              onClick={() => onColorChange(color)}
              size="md"
            />
          ))}
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#65584C]">
            Select size
          </span>

          <button
            type="button"
            className="flex items-center gap-1.5 text-[10px] text-[#9B8065] transition hover:text-[#40372F]"
            onClick={() => {
              window.alert(
                "Please check the product size information before ordering."
              );
            }}
          >
            <CircleHelp size={13} />
            Size guide
          </button>
        </div>

        <SizeSelector
          sizes={product.sizes}
          selectedSize={quickView.selectedSize}
          onSelect={onSizeChange}
        />
      </div>

      <div className="mt-7">
        <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#65584C]">
          Quantity
        </span>

        <QuantitySelector
          quantity={quickView.quantity}
          onChange={onQuantityChange}
          min={1}
          max={10}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!product.isAvailable}
          className="flex h-14 w-full items-center justify-center gap-3 bg-[#40372F] px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#655345] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag size={16} />

          {product.isAvailable
            ? "Add to shopping bag"
            : "Currently unavailable"}
        </button>

        <Link
          href={`/products/${product.id}`}
          className="flex h-12 w-full items-center justify-center border border-[#DCCFC0] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#66584B] transition hover:border-[#40372F] hover:bg-[#F1EBE2]"
        >
          View full product details
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#E8DED2] pt-6">
        <div className="flex items-center gap-2">
          <Sparkles
            size={16}
            className="shrink-0 text-[#A58B70]"
          />

          <span className="text-[10px] leading-5 text-[#8E8072]">
            Carefully selected styles
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3
            size={16}
            className="shrink-0 text-[#A58B70]"
          />

          <span className="text-[10px] leading-5 text-[#8E8072]">
            Easy everyday styling
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   QUICK VIEW MODAL
--------------------------------------------------------- */

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

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

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

  return (
    <AnimatePresence>
      {quickView && (
        <motion.div
          key="tala-quick-view-overlay"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="tala-quick-view-title"
            className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto bg-[#F8F5F0] shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product preview"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DACE] bg-[#F8F5F0]/95 text-[#66584B] shadow-sm transition hover:bg-white"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 md:grid-cols-2 md:gap-10">
              <QuickViewGallery
                product={quickView.product}
              />

              <QuickViewInformation
                quickView={quickView}
                onSizeChange={onSizeChange}
                onColorChange={onColorChange}
                onQuantityChange={onQuantityChange}
                onAddToCart={onAddToCart}
              />
            </div>

            <div className="border-t border-[#E8DED2] px-5 py-4 text-center sm:px-8">
              <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#A28A72]">
                TALA — Your style, your story
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------
   END OF PART 4
--------------------------------------------------------- */

/* =========================================================
   TALA — ADVANCED PRODUCT FILTERS
   Category, price, favorites and collection filters
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
};

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
  onChange: (checked: boolean) => void;
  count?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-3">
        <span
          className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center border transition ${
            checked
              ? "border-[#40372F] bg-[#40372F]"
              : "border-[#D8CBBB] bg-transparent group-hover:border-[#9B8065]"
          }`}
        >
          {checked && (
            <Check
              size={11}
              strokeWidth={2.5}
              className="text-white"
            />
          )}
        </span>

        <span
          className={`text-xs transition ${
            checked
              ? "font-medium text-[#40372F]"
              : "text-[#827466] group-hover:text-[#40372F]"
          }`}
        >
          {label}
        </span>
      </span>

      {typeof count === "number" && (
        <span className="text-[10px] text-[#B0A293]">
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
    </label>
  );
}

/* ---------------------------------------------------------
   FILTER SECTION
--------------------------------------------------------- */

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-[#E8DED2] py-5">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#51463C]">
          {title}
        </span>

        <motion.span
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <ChevronDown
            size={15}
            className="text-[#958575]"
          />
        </motion.span>
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
              duration: 0.22,
            }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
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
  const percentage = Math.min(
    100,
    Math.max(0, (maxPrice / PRICE_LIMIT) * 100)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#968779]">
          Maximum price
        </span>

        <span className="text-xs font-semibold text-[#40372F]">
          {formatPrice(maxPrice)}
        </span>
      </div>

      <div className="relative flex h-5 items-center">
        <div className="absolute h-[3px] w-full bg-[#E5DACE]" />

        <div
          className="absolute left-0 h-[3px] bg-[#9B8065]"
          style={{
            width: `${percentage}%`,
          }}
        />

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
}: ProductFiltersProps) {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: PRODUCTS.length,
    };

    PRODUCTS.forEach((product) => {
      counts[product.category] =
        (counts[product.category] ?? 0) + 1;
    });

    return counts;
  }, []);

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
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
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

/* =========================================================
   TALA — PRODUCT TOOLBAR
   Search, sorting, view controls and result information
========================================================= */

type ProductToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;

  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;

  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;

  onOpenFilters: () => void;

  resultCount: number;
  totalCount: number;

  selectedCategory: ProductCategory;
};

/* ---------------------------------------------------------
   SEARCH FIELD
--------------------------------------------------------- */

function ProductSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="group relative w-full sm:max-w-[320px]">
      <Search
        size={17}
        strokeWidth={1.5}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F7D] transition-colors group-focus-within:text-[#40372F]"
      />

      <input
        type="search"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Search the collection..."
        aria-label="Search products"
        className="h-12 w-full border border-[#E5DACE] bg-[#FBF9F5] pl-11 pr-10 text-xs text-[#40372F] outline-none transition placeholder:text-[#AA9D8F] focus:border-[#9B8065] focus:bg-white"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[#9B8C7D] transition hover:text-[#40372F]"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   SORT SELECT
--------------------------------------------------------- */

function ProductSortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as SortOption)
        }
        aria-label="Sort products"
        className="h-12 min-w-[155px] appearance-none border border-[#E5DACE] bg-[#FBF9F5] pl-4 pr-10 text-[10px] font-medium uppercase tracking-[0.12em] text-[#66584B] outline-none transition hover:border-[#9B8065] focus:border-[#9B8065]"
      >
        {SORT_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#958575]"
      />
    </div>
  );
}

/* ---------------------------------------------------------
   VIEW MODE SWITCH
--------------------------------------------------------- */

function ViewModeSwitch({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <div className="hidden h-12 items-center border border-[#E5DACE] bg-[#FBF9F5] p-1 sm:flex">
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        className={`flex h-9 w-10 items-center justify-center transition ${
          value === "grid"
            ? "bg-[#40372F] text-white"
            : "text-[#8F8173] hover:bg-[#F0EAE2]"
        }`}
      >
        <Grid2X2 size={16} />
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={value === "list"}
        className={`flex h-9 w-10 items-center justify-center transition ${
          value === "list"
            ? "bg-[#40372F] text-white"
            : "text-[#8F8173] hover:bg-[#F0EAE2]"
        }`}
      >
        <List size={17} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   RESULT COUNT
--------------------------------------------------------- */

function ProductResultCount({
  resultCount,
  totalCount,
  category,
}: {
  resultCount: number;
  totalCount: number;
  category: ProductCategory;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-[#40372F]">
        {resultCount}
        <span className="ml-1 font-normal text-[#8F8173]">
          {resultCount === 1 ? "product" : "products"}
        </span>
      </span>

      <span className="h-3 w-px bg-[#DDD1C3]" />

      <span className="text-[10px] uppercase tracking-[0.12em] text-[#A18F7D]">
        {category === "All"
          ? "Full collection"
          : category}
      </span>

      {resultCount !== totalCount && (
        <span className="text-[10px] text-[#A18F7D]">
          of {totalCount}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   MOBILE FILTER BUTTON
--------------------------------------------------------- */

function MobileFilterButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-2 border border-[#E5DACE] bg-[#FBF9F5] px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#66584B] transition hover:border-[#9B8065] hover:bg-white lg:hidden"
    >
      <Filter size={15} />

      Filters
    </button>
  );
}

/* ---------------------------------------------------------
   PRODUCT TOOLBAR
--------------------------------------------------------- */

function ProductToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenFilters,
  resultCount,
  totalCount,
  selectedCategory,
}: ProductToolbarProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ProductSearch
            value={search}
            onChange={onSearchChange}
          />

          <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex sm:items-center">
            <MobileFilterButton
              onClick={onOpenFilters}
            />

            <ProductSortSelect
              value={sortBy}
              onChange={onSortChange}
            />

            <ViewModeSwitch
              value={viewMode}
              onChange={onViewModeChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DED2] pb-4">
          <ProductResultCount
            resultCount={resultCount}
            totalCount={totalCount}
            category={selectedCategory}
          />

          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#A99B8C]">
            Curated by TALA
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ACTIVE FILTER CHIP
--------------------------------------------------------- */

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 border border-[#E5DACE] bg-[#F5F0E9] px-3 py-2 text-[10px] text-[#75695D] transition hover:border-[#9B8065] hover:text-[#40372F]"
    >
      {label}

      <X size={12} />
    </button>
  );
}

/* ---------------------------------------------------------
   ACTIVE FILTERS SUMMARY
--------------------------------------------------------- */

type ActiveFiltersSummaryProps = {
  selectedCategory: ProductCategory;
  onCategoryClear: () => void;

  search: string;
  onSearchClear: () => void;

  maxPrice: number;
  onPriceClear: () => void;

  onlyFavorites: boolean;
  onFavoritesClear: () => void;

  newOnly: boolean;
  onNewClear: () => void;

  bestSellersOnly: boolean;
  onBestSellersClear: () => void;

  onClearAll: () => void;
};

function ActiveFiltersSummary({
  selectedCategory,
  onCategoryClear,
  search,
  onSearchClear,
  maxPrice,
  onPriceClear,
  onlyFavorites,
  onFavoritesClear,
  newOnly,
  onNewClear,
  bestSellersOnly,
  onBestSellersClear,
  onClearAll,
}: ActiveFiltersSummaryProps) {
  const hasActiveFilters =
    selectedCategory !== "All" ||
    search.trim().length > 0 ||
    maxPrice !== PRICE_LIMIT ||
    onlyFavorites ||
    newOnly ||
    bestSellersOnly;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="mr-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A18F7D]">
        Active filters:
      </span>

      {selectedCategory !== "All" && (
        <ActiveFilterChip
          label={selectedCategory}
          onRemove={onCategoryClear}
        />
      )}

      {search.trim().length > 0 && (
        <ActiveFilterChip
          label={`Search: ${search}`}
          onRemove={onSearchClear}
        />
      )}

      {maxPrice !== PRICE_LIMIT && (
        <ActiveFilterChip
          label={`Up to ${formatPrice(maxPrice)}`}
          onRemove={onPriceClear}
        />
      )}

      {onlyFavorites && (
        <ActiveFilterChip
          label="Favorites"
          onRemove={onFavoritesClear}
        />
      )}

      {newOnly && (
        <ActiveFilterChip
          label="New arrivals"
          onRemove={onNewClear}
        />
      )}

      {bestSellersOnly && (
        <ActiveFilterChip
          label="Best sellers"
          onRemove={onBestSellersClear}
        />
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9B5F50] underline decoration-[#D9B8AA] underline-offset-4 transition hover:text-[#40372F]"
      >
        Clear all
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   END OF PART 6
--------------------------------------------------------- */

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("All");

  const [sortBy, setSortBy] =
    useState<SortOption>("featured");

  const [viewMode, setViewMode] =
    useState<ViewMode>("grid");

  const [maxPrice, setMaxPrice] =
    useState(PRICE_LIMIT);

  const [favorites, setFavorites] =
    useState<string[]>([]);

  const [favoritesReady, setFavoritesReady] =
    useState(false);

  const [onlyFavorites, setOnlyFavorites] =
    useState(false);

  const [newOnly, setNewOnly] =
    useState(false);

  const [bestSellersOnly, setBestSellersOnly] =
    useState(false);

  const [quickView, setQuickView] =
    useState<QuickViewState | null>(null);

  const [cartCount, setCartCount] =
    useState(0);

  const [notification, setNotification] =
    useState<NotificationState>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  // ----------------------------------------
  // INITIALIZATION
  // ----------------------------------------

  useEffect(() => {
    setFavorites(readFavorites());
    setFavoritesReady(true);

    setCartCount(getCartCount());
    setIsLoading(false);

    const syncCart = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener(
      "tala-cart-updated",
      syncCart
    );

    window.addEventListener(
      "storage",
      syncCart
    );

    return () => {
      window.removeEventListener(
        "tala-cart-updated",
        syncCart
      );

      window.removeEventListener(
        "storage",
        syncCart
      );
    };
  }, []);

  useEffect(() => {
    if (!favoritesReady) return;

    writeFavorites(favorites);
  }, [favorites, favoritesReady]);

  // ----------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------

  const showNotification = useCallback(
    (
      message: string,
      type: NotificationType = "success"
    ) => {
      setNotification({
        id: Date.now(),
        message,
        type,
      });
    },
    []
  );

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // ----------------------------------------
  // FAVORITES
  // ----------------------------------------

  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((current) => {
        const alreadyFavorite =
          current.includes(productId);

        if (alreadyFavorite) {
          showNotification(
            "Removed from your wishlist."
          );

          return current.filter(
            (id) => id !== productId
          );
        }

        showNotification(
          "Added to your wishlist."
        );

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

      const quantity =
        options?.quantity ?? 1;

      const updatedCart = addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor.name,
        quantity,
      });

      setCartCount(
        updatedCart.reduce(
          (total, item) =>
            total + item.quantity,
          0
        )
      );

      showNotification(
        `${product.name} added to your bag.`
      );
    },
    [showNotification]
  );

  // ----------------------------------------
  // QUICK VIEW
  // ----------------------------------------

  const openQuickView = useCallback(
    (product: Product) => {
      setQuickView({
        product,
        selectedSize: getInitialSize(product),
        selectedColor: getInitialColor(product),
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
      setQuickView((current) =>
        current
          ? {
              ...current,
              selectedSize: size,
            }
          : null
      );
    },
    []
  );

  const changeQuickViewColor = useCallback(
    (color: ProductColor) => {
      setQuickView((current) =>
        current
          ? {
              ...current,
              selectedColor: color,
            }
          : null
      );
    },
    []
  );

  const changeQuickViewQuantity = useCallback(
    (quantity: number) => {
      setQuickView((current) =>
        current
          ? {
              ...current,
              quantity: Math.max(
                1,
                Math.min(10, quantity)
              ),
            }
          : null
      );
    },
    []
  );

  const addQuickViewToCart = useCallback(() => {
    if (!quickView) return;

    addProductToCart(
      quickView.product,
      {
        size: quickView.selectedSize,
        color: quickView.selectedColor,
        quantity: quickView.quantity,
      }
    );

    setQuickView(null);
  }, [quickView, addProductToCart]);

  // ----------------------------------------
  // FILTERING AND SEARCH
  // ----------------------------------------

  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      normalizeSearch(search);

    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesPrice =
        product.price <= maxPrice;

      const matchesFavorites =
        !onlyFavorites ||
        favorites.includes(product.id);

      const matchesNew =
        !newOnly || product.isNew;

      const matchesBestSeller =
        !bestSellersOnly ||
        product.isBestSeller;

      const searchableText = normalizeSearch(
        [
          product.name,
          product.category,
          product.description,
          ...(product.tags ?? []),
        ].join(" ")
      );

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      return (
        matchesCategory &&
        matchesPrice &&
        matchesFavorites &&
        matchesNew &&
        matchesBestSeller &&
        matchesSearch
      );
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "rating":
          return b.rating - a.rating;

        case "newest":
          return (
            Number(b.isNew) - Number(a.isNew)
          );

        case "featured":
        default:
          return (
            Number(b.isFeatured) -
              Number(a.isFeatured) ||
            b.rating - a.rating
          );
      }
    });
  }, [
    search,
    selectedCategory,
    maxPrice,
    onlyFavorites,
    newOnly,
    bestSellersOnly,
    favorites,
    sortBy,
  ]);

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
    return filteredProducts.slice(
      0,
      currentPage * PAGE_SIZE
    );
  }, [filteredProducts, currentPage]);

  const hasMoreProducts =
    visibleProducts.length <
    filteredProducts.length;

  const loadMoreProducts = () => {
    setCurrentPage((current) => current + 1);
  };

  // ----------------------------------------
  // RESET FILTERS
  // ----------------------------------------

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("All");
    setMaxPrice(PRICE_LIMIT);
    setOnlyFavorites(false);
    setNewOnly(false);
    setBestSellersOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
  }, []);

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
  productsCount: PRODUCTS.length,
};

  // ----------------------------------------
  // PAGE
  // ----------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#40372F]">

      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-[#DCD3C8] bg-[#40372F] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">

          <Link
            href="/"
            className="font-serif text-3xl tracking-[0.22em] text-white"
          >
            TALA
          </Link>

          <nav className="flex items-center gap-5 text-sm md:gap-9">

            <Link
              href="/"
              className="transition-colors hover:text-[#D9C6A5]"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="text-[#D9C6A5]"
            >
              Shop
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 transition-colors hover:text-[#D9C6A5]"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />

              <span className="hidden sm:inline">
                Bag
              </span>

              {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D9C6A5] px-1 text-[10px] font-semibold text-[#40372F]">
                  {cartCount}
                </span>
              )}
            </Link>

          </nav>
        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-[#E6DED4]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 text-center md:px-10 md:py-24">

          <SectionEyebrow>
            THE TALA COLLECTION
          </SectionEyebrow>

          <motion.h1
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-tight text-[#40372F] sm:text-5xl md:text-7xl"
          >
            Discover your
            <span className="block italic text-[#9B8469]">
              next favorite.
            </span>
          </motion.h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#81766A] md:text-base">
            Thoughtfully selected pieces.
            Timeless details. Effortless style.
            Discover the latest collection from TALA.
          </p>

          <div className="mx-auto mt-8 h-px w-20 bg-[#B69B78]" />

        </div>
      </section>

      {/* PRODUCTS AREA */}

      <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-10 md:py-16">

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* DESKTOP FILTERS */}

          <aside className="hidden w-[270px] shrink-0 lg:block">
            <div className="sticky top-28">
              <ProductFilterSidebar
                {...filterProps}
              />
            </div>
          </aside>

          {/* PRODUCTS CONTENT */}

          <div className="min-w-0 flex-1">

            {/* TOOLBAR */}
  <ProductToolbar
  search={search}
  onSearchChange={setSearch}
  sortBy={sortBy}
  onSortChange={setSortBy}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  resultCount={filteredProducts.length}
  totalCount={PRODUCTS.length}
  selectedCategory={selectedCategory}
  onOpenFilters={() =>
    setMobileFiltersOpen(true)
  }
/>

            {/* ACTIVE FILTERS */}

            {activeFilterCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">

                <span className="mr-1 text-xs uppercase tracking-wider text-[#8B7D70]">
                  Active filters:
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
                    onRemove={() =>
                      setSelectedCategory("All")
                    }
                  />
                )}

                {maxPrice < PRICE_LIMIT && (
                  <ActiveFilterChip
                    label={`Under ${formatPrice(maxPrice)}`}
                    onRemove={() =>
                      setMaxPrice(PRICE_LIMIT)
                    }
                  />
                )}

                {onlyFavorites && (
                  <ActiveFilterChip
                    label="Favorites"
                    onRemove={() =>
                      setOnlyFavorites(false)
                    }
                  />
                )}

                {newOnly && (
                  <ActiveFilterChip
                    label="New arrivals"
                    onRemove={() =>
                      setNewOnly(false)
                    }
                  />
                )}

                {bestSellersOnly && (
                  <ActiveFilterChip
                    label="Best sellers"
                    onRemove={() =>
                      setBestSellersOnly(false)
                    }
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

            {/* LOADING */}

            {isLoading ? (
              <ProductSkeleton count={8} />
            ) : filteredProducts.length === 0 ? (

              /* EMPTY STATE */

              <EmptyState
                title="No pieces found"
                description="Try adjusting your search or filters to discover more from TALA."
                actionLabel="Clear filters"
                onAction={clearFilters}
              />

            ) : (

              /* PRODUCT GRID */

              <>
                <motion.div
                  key={viewMode}
                  variants={pageVariants}
                  initial="hidden"
                  animate="visible"
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3"
                      : "grid grid-cols-1 gap-5"
                  }
                >

                  {visibleProducts.map(
                    (product, index) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        custom={index}
                      >
                        <ProductCard
                          product={product}
                          isFavorite={favorites.includes(
                            product.id
                          )}
                          onToggleFavorite={() =>
                            toggleFavorite(product.id)
                          }
                          onQuickView={() =>
                            openQuickView(product)
                          }
                          onAddToCart={() =>
                            addProductToCart(product)
                          }
                          viewMode={viewMode}
                        />
                      </motion.div>
                    )
                  )}

                </motion.div>

                {/* LOAD MORE */}

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

                {/* RESULTS FOOTER */}

                <div className="mt-10 border-t border-[#E2D9CF] pt-6 text-center">
                  <p className="text-xs tracking-wide text-[#8B7D70]">
                    Showing {visibleProducts.length} of{" "}
                    {filteredProducts.length} pieces
                  </p>
                </div>

              </>
            )}

          </div>
        </div>
      </section>

      {/* BRAND FOOTER */}

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
                Timeless fashion, thoughtfully
                selected for everyday elegance.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C6A5]">
                Explore
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#D1C7BC]">
                <Link
                  href="/"
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/products"
                  className="transition-colors hover:text-white"
                >
                  Shop all
                </Link>

                <Link
                  href="/cart"
                  className="transition-colors hover:text-white"
                >
                  Shopping bag
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C6A5]">
                TALA
              </h3>

              <p className="mt-5 text-sm leading-7 text-[#D1C7BC]">
                Designed with care.
                Made to be remembered.
              </p>
            </div>

          </div>

          <div className="mt-12 border-t border-white/15 pt-6 text-center">
            <p className="text-[11px] tracking-wider text-[#BEB2A5]">
              © {new Date().getFullYear()} TALA.
              All rights reserved.
            </p>
          </div>

        </div>
      </footer>

      {/* MOBILE FILTER DRAWER */}

      <MobileFilterDrawer
        {...filterProps}
        isOpen={mobileFiltersOpen}
        onClose={() =>
          setMobileFiltersOpen(false)
        }
        resultCount={filteredProducts.length}
      />

      {/* QUICK VIEW MODAL */}

      <QuickViewModal
        quickView={quickView}
        onClose={closeQuickView}
        onSizeChange={changeQuickViewSize}
        onColorChange={changeQuickViewColor}
        onQuantityChange={changeQuickViewQuantity}
        onAddToCart={addQuickViewToCart}
      />

      {/* NOTIFICATION */}

      <NotificationToast
        notification={notification}
        onClose={closeNotification}
      />

    </main>
  );
}

export default ProductsPage;

/* END OF PART 7 */
