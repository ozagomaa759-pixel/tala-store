"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Ruler,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";

import { addToCart } from "@/lib/cart";
import { getTalaProducts } from "@/lib/tala-products";

type ProductColor = {
  name: string;
  value: string;
};

type StoreProduct = {
  id: string | number;
  name: string;
  subtitle?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  category?: string;
  image?: string;
  images?: string[];
  colors?: ProductColor[];
  sizes?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  tags?: string[];
};

const CURRENCY = "EGP";
const MAX_QUANTITY = 10;

const FALLBACK_IMAGE =
  "https://placehold.co/600x800/F5F0E8/332A23?text=TALA";

const SIZE_MEASUREMENTS = [
  { size: "XS", bust: "Contact TALA", waist: "Contact TALA", hips: "Contact TALA" },
  { size: "S", bust: "Contact TALA", waist: "Contact TALA", hips: "Contact TALA" },
  { size: "M", bust: "Contact TALA", waist: "Contact TALA", hips: "Contact TALA" },
  { size: "L", bust: "Contact TALA", waist: "Contact TALA", hips: "Contact TALA" },
  { size: "XL", bust: "Contact TALA", waist: "Contact TALA", hips: "Contact TALA" },
  { size: "2XL", bust: "Contact TALA", waist: "Contact TALA", hips: "Contact TALA" },
];

function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("en-EG", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)} ${CURRENCY}`;
}

function normalizeSizeLabel(size: string): string {
  const normalized = size.trim().toUpperCase();
  return normalized === "XXL" ? "2XL" : normalized;
}

function getProductImages(product: StoreProduct): string[] {
  const candidates = [
    ...(product.image ? [product.image] : []),
    ...(Array.isArray(product.images) ? product.images : []),
  ];

  const uniqueImages = Array.from(
    new Set(
      candidates.filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
    )
  );

  return uniqueImages.length > 0
    ? uniqueImages
    : [FALLBACK_IMAGE];
}

function getProductColors(product: StoreProduct): ProductColor[] {
  if (!Array.isArray(product.colors)) return [];

  const seen = new Set<string>();

  return product.colors.filter((color) => {
    if (
      !color ||
      typeof color.name !== "string" ||
      typeof color.value !== "string" ||
      !color.value.trim()
    ) {
      return false;
    }

    const key = color.value.trim().toLowerCase();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function getProductSizes(product: StoreProduct): string[] {
  if (!Array.isArray(product.sizes)) return [];

  const seen = new Set<string>();

  return product.sizes.filter((size): size is string => {
    if (typeof size !== "string" || !size.trim()) {
      return false;
    }

    const key = size.trim().toUpperCase();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function getSizeDescription(size: string): string {
  const descriptions: Record<string, string> = {
    XS: "Extra small",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra large",
    XXL: "2XL — double extra large",
    "2XL": "2XL — double extra large",
  };

  return (
    descriptions[size.trim().toUpperCase()] ??
    "Choose an available size"
  );
}

function clampQuantity(value: number): number {
  return Math.min(
    MAX_QUANTITY,
    Math.max(1, Math.floor(value))
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[9px] tracking-[3px] text-[#A18B70]">
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-serif text-3xl md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
function ProductGallery({
  product,
  images,
  onZoom,
}: {
  product: StoreProduct;
  images: string[];
  onZoom: (index: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id]);

  function moveImage(direction: number) {
    setActiveIndex((current) => {
      if (images.length <= 1) return 0;

      return (
        (current + direction + images.length) %
        images.length
      );
    });
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#E6DED3]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${String(product.id)}-${activeIndex}`}
            initial={{ opacity: 0.2, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex] || FALLBACK_IMAGE}
              alt={`${product.name}, image ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => moveImage(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4F0E9]/90"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={() => moveImage(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4F0E9]/90"
            >
              <ChevronRight size={19} />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onZoom(activeIndex)}
          aria-label="Zoom product image"
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F0E9]/90"
        >
          <ZoomIn size={18} />
        </button>

        <span className="absolute bottom-5 left-5 z-10 bg-[#292521]/80 px-3 py-2 text-[9px] tracking-[2px] text-white">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${String(product.id)}-thumb-${index}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative aspect-[3/4] overflow-hidden bg-[#E6DED3] ${
                activeIndex === index
                  ? "outline outline-1 outline-offset-2 outline-[#292521]"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image || FALLBACK_IMAGE}
                alt={`${product.name}, thumbnail ${index + 1}`}
                fill
                sizes="150px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ZoomViewer({
  image,
  name,
  onClose,
}: {
  image: string;
  name: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Product image preview"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-6 top-6 z-10 text-white"
      >
        <X size={28} />
      </button>

      <div
        className="relative h-[85vh] w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={image || FALLBACK_IMAGE}
          alt={name}
          fill
          sizes="90vw"
          className="object-contain"
          unoptimized
        />
      </div>
    </motion.div>
  );
}

function ColorSelector({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductColor[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  if (colors.length === 0) return null;

  const selectedColor = colors.find(
    (color) => color.value === selected
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[2px]">
          SELECT COLOR
        </span>

        <span className="text-xs text-[#77716A]">
          {selectedColor?.name ?? "Choose a color"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {colors.map((color) => (
          <button
            type="button"
            key={`${color.value}-${color.name}`}
            onClick={() => onSelect(color.value)}
            aria-label={`Choose ${color.name}`}
            aria-pressed={selected === color.value}
            title={color.name}
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${
              selected === color.value
                ? "border-[#292521] outline outline-1 outline-offset-2 outline-[#292521]"
                : "border-[#CFC5B8]"
            }`}
          >
            <span
              className="h-7 w-7 rounded-full border border-black/10"
              style={{ backgroundColor: color.value }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeSelector({
  sizes,
  selected,
  onSelect,
  onOpenGuide,
}: {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
  onOpenGuide: () => void;
}) {
  if (sizes.length === 0) {
    return (
      <div className="border border-[#D8CFC2] p-4 text-xs text-[#77716A]">
        Size availability is not currently provided for this
        product. Please contact TALA before ordering.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[2px]">
          SELECT SIZE
        </span>

        <button
          type="button"
          onClick={onOpenGuide}
          className="flex items-center gap-2 text-[10px] tracking-[1px] text-[#8D765A]"
        >
          <Ruler size={14} />
          SIZE GUIDE
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {sizes.map((size) => (
          <button
            type="button"
            key={size}
            onClick={() => onSelect(size)}
            aria-pressed={selected === size}
            className={`border px-2 py-4 text-xs transition ${
              selected === size
                ? "border-[#292521] bg-[#292521] text-white"
                : "border-[#D8CFC2] text-[#292521] hover:border-[#292521]"
            }`}
          >
            {normalizeSizeLabel(size)}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-[#8B8176]">
        {selected
          ? getSizeDescription(selected)
          : "Select the size you prefer."}
      </p>
    </div>
  );
}

function QuantitySelector({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] tracking-[2px]">
        QUANTITY
      </span>

      <div className="flex items-center border border-[#D8CFC2]">
        <button
          type="button"
          onClick={() => onChange(clampQuantity(quantity - 1))}
          aria-label="Decrease quantity"
          className="px-4 py-3"
        >
          <Minus size={13} />
        </button>

        <span className="min-w-8 text-center text-xs">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => onChange(clampQuantity(quantity + 1))}
          aria-label="Increase quantity"
          className="px-4 py-3"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

function SizeGuide({
  selectedSize,
  onSelect,
  onClose,
}: {
  selectedSize: string;
  onSelect: (size: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="TALA size guide"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-[#F4F0E9] p-7 md:p-10"
      >
        <div className="flex items-center justify-between">
          <Eyebrow>THE TALA FIT GUIDE</Eyebrow>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
          >
            <X size={21} />
          </button>
        </div>

        <h2 className="mt-5 font-serif text-3xl">
          Find Your Perfect Fit
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#77716A]">
          Measurements are in centimeters. The 2XL measurements
          have not yet been verified by TALA, so please contact
          the store before relying on them.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-center text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#D8CFC2]">
                {["Size", "Bust", "Waist", "Hips"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-2 py-4 font-medium"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {SIZE_MEASUREMENTS.map((row) => (
                <tr
                  key={row.size}
                  className={`border-b border-[#E3DBD0] ${
                    normalizeSizeLabel(selectedSize) === row.size
                      ? "bg-[#E8E0D5]"
                      : ""
                  }`}
                >
                  <td className="px-2 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(
                          row.size === "2XL" ? "XXL" : row.size
                        );
                        onClose();
                      }}
                      className="underline-offset-4 hover:underline"
                    >
                      {row.size}
                    </button>
                  </td>

                  <td className="px-2 py-4">{row.bust}</td>
                  <td className="px-2 py-4">{row.waist}</td>
                  <td className="px-2 py-4">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-[10px] leading-5 text-[#77716A]">
          The 2XL row is shown as “Contact TALA” until actual
          measurements are confirmed. Only sizes available for
          this product can be selected.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full bg-[#292521] py-4 text-[10px] tracking-[3px] text-white"
        >
          CONTINUE SHOPPING
        </button>
      </motion.div>
    </motion.div>
  );
}
function Accordion({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#DDD5CA]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[10px] tracking-[2px]">
          {title}
        </span>

        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={17} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-7 text-[#77716A]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceBenefits() {
  const benefits = [
    {
      icon: Truck,
      title: "DELIVERY",
      subtitle: "Delivery details at checkout",
    },
    {
      icon: PackageCheck,
      title: "RETURNS",
      subtitle: "Store policy applies",
    },
    {
      icon: ShieldCheck,
      title: "SECURE",
      subtitle: "Protected shopping",
    },
  ];

  return (
    <div className="mt-9 grid grid-cols-3 gap-3 border-y border-[#DED6CB] py-6">
      {benefits.map(({ icon: Icon, title, subtitle }) => (
        <div
          key={title}
          className="flex flex-col items-center gap-3 text-center"
        >
          <Icon size={19} strokeWidth={1.3} />

          <span className="text-[8px] leading-4 tracking-[1px]">
            {title}
          </span>

          <span className="text-[8px] text-[#8B8176]">
            {subtitle}
          </span>
        </div>
      ))}
    </div>
  );
}

function RelatedProducts({
  products,
  currentProductId,
}: {
  products: StoreProduct[];
  currentProductId: string;
}) {
  const related = useMemo(() => {
    return products
      .filter(
        (item) =>
          String(item.id) !== currentProductId &&
          item.isAvailable !== false
      )
      .slice(0, 4);
  }, [products, currentProductId]);

  if (related.length === 0) return null;

  return (
    <section className="container mt-28 border-t border-[#DED6CB] pt-16">
      <SectionHeading
        eyebrow="CURATED FOR YOU"
        title="You may also love"
      />

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
        {related.map((item, index) => {
          const image = getProductImages(item)[0];

          return (
            <motion.article
              key={String(item.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
            >
              <Link
                href={`/products/${encodeURIComponent(String(item.id))}`}
                aria-label={`View details for ${item.name}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E7DED3]">
                  <Image
                    src={image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 hover:scale-105"
                    unoptimized
                  />
                </div>

                <div className="mt-4">
                  <p className="text-[9px] tracking-[2px] text-[#A18B70]">
                    {(item.category || "TALA").toUpperCase()}
                  </p>

                  <h3 className="mt-2 font-serif text-lg">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function BrandFooter() {
  return (
    <footer className="mt-24 bg-[#292521] px-6 py-16 text-[#F4F0E9]">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-serif text-4xl tracking-[5px] text-white"
            >
              TALA
            </Link>

            <p className="mt-5 max-w-xs text-xs leading-7 text-[#C5BCAF]">
              Timeless pieces. Thoughtful details. A considered
              wardrobe, curated by TALA.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] tracking-[3px] text-[#C5AD8D]">
              EXPLORE
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-xs text-[#D7D0C5]">
              <Link href="/" className="hover:text-white">
                Home
              </Link>

              <Link href="/products" className="hover:text-white">
                Collection
              </Link>

              <Link href="/cart" className="hover:text-white">
                Shopping Bag
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] tracking-[3px] text-[#C5AD8D]">
              CONNECT
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-xs text-[#D7D0C5]">
              <a
                href="https://www.instagram.com/tala.store/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/15 pt-7 text-[9px] tracking-[1px] text-[#BEB5A8] md:flex-row">
          <p>
            © {new Date().getFullYear()} TALA. All rights reserved.
          </p>

          <p>DESIGNED WITH ELEGANCE.</p>
        </div>
      </div>
    </footer>
  );
}
export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const productId = String(params.id ?? "");

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [allProducts, setAllProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setLoadError("");

      try {
        const result = await getTalaProducts();

        if (!active) return;

        const products = result as unknown as StoreProduct[];
        const found = products.find(
          (item) => String(item.id) === productId
        );

        setAllProducts(products);
        setProduct(found ?? null);

        if (found) {
          setSelectedSize("");
          setSelectedColor(
            getProductColors(found)[0]?.value ?? ""
          );
          setQuantity(1);
        }
      } catch (error) {
        console.error("TALA product page loading error:", error);

        if (active) {
          setLoadError(
            "We couldn't load this product. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    } else {
      setLoading(false);
      setLoadError("Invalid product address.");
    }

    return () => {
      active = false;
    };
  }, [productId]);

  const images = useMemo(
    () => (product ? getProductImages(product) : []),
    [product]
  );

  const colors = useMemo(
    () => (product ? getProductColors(product) : []),
    [product]
  );

  const sizes = useMemo(
    () => (product ? getProductSizes(product) : []),
    [product]
  );

  const selectedColorName =
    colors.find((color) => color.value === selectedColor)?.name ??
    (colors.length === 0 ? "Default" : "");

  const available =
    Boolean(product?.isAvailable) && sizes.length > 0;

  function handleSizeSelect(size: string) {
    const matchingSize = sizes.find(
      (item) =>
        normalizeSizeLabel(item) === normalizeSizeLabel(size)
    );

    if (matchingSize) {
      setSelectedSize(matchingSize);
      setCartMessage("");
    }
  }

  async function handleShare() {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name ?? "TALA",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCartMessage("Product link copied.");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name !== "AbortError"
      ) {
        console.error("TALA share error:", error);
      }
    }
  }

  function handleAddToCart() {
    if (!product || !available || !selectedSize) {
      setCartMessage("Please select an available size first.");
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      setCartMessage("Please select a color first.");
      return;
    }

    setAdding(true);
    setCartMessage("");

    try {
      addToCart({
        productId: String(product.id),
        name: product.name,
        price: Number(product.price),
        image: images[0] ?? FALLBACK_IMAGE,
        size: selectedSize,
        color: selectedColorName,
        quantity: clampQuantity(quantity),
      });

      setCartMessage("Added to your shopping bag.");
    } catch (error) {
      console.error("TALA add to cart error:", error);
      setCartMessage("Could not add this item. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F0E9]">
        <div className="text-center">
          <p className="font-serif text-4xl tracking-[5px]">TALA</p>
          <div className="mx-auto mt-7 h-px w-28 overflow-hidden bg-[#D8CFC2]">
            <motion.div
              animate={{ x: [-112, 112] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-full w-1/2 bg-[#A18B70]"
            />
          </div>
          <p className="mt-5 text-[9px] tracking-[3px] text-[#8B8176]">
            PREPARING YOUR EXPERIENCE
          </p>
        </div>
      </main>
    );
  }

  if (loadError || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F0E9] px-6">
        <div className="max-w-md text-center">
          <p className="font-serif text-4xl tracking-[5px]">TALA</p>

          <div className="my-8">
            <Sparkles
              size={25}
              className="mx-auto text-[#A18B70]"
            />
          </div>

          <h1 className="font-serif text-3xl">
            {loadError ? "Something went wrong" : "Product not found"}
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#77716A]">
            {loadError ||
              "This product may no longer be available in our collection."}
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-3 bg-[#292521] px-8 py-4 text-[10px] tracking-[2px] text-white"
          >
            <ArrowLeft size={15} />
            BACK TO COLLECTION
          </Link>

          {loadError && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 block w-full text-xs underline"
            >
              Try again
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F0E9] text-[#292521]">
      <header className="sticky top-0 z-40 border-b border-[#DED6CB] bg-[#F4F0E9]/95 backdrop-blur">
        <div className="container flex h-[76px] items-center justify-between px-5">
          <Link
            href="/"
            className="font-serif text-3xl tracking-[5px]"
          >
            TALA
          </Link>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setIsFavorite((value) => !value)}
              aria-label={
                isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              aria-pressed={isFavorite}
            >
              <Heart
                size={19}
                fill={isFavorite ? "#292521" : "none"}
              />
            </button>

            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative"
            >
              <ShoppingBag size={20} />
            </Link>
          </div>
        </div>
      </header>

      <div className="container px-5 pt-7">
        <nav className="flex flex-wrap items-center gap-2 text-[9px] tracking-[1px] text-[#8B8176]">
          <Link href="/" className="hover:text-[#292521]">
            HOME
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#292521]">
            COLLECTION
          </Link>
          <span>/</span>
          <span className="text-[#292521]">{product.name}</span>
        </nav>
      </div>

      <section className="container grid gap-10 px-5 pb-16 pt-8 lg:grid-cols-2 lg:gap-16 lg:pt-12">
        <ProductGallery
          product={product}
          images={images}
          onZoom={setZoomIndex}
        />

        <div className="flex flex-col justify-center lg:py-8">
          <div className="flex items-center justify-between">
            <Eyebrow>
              {(product.category ?? "TALA COLLECTION").toUpperCase()}
            </Eyebrow>

            {product.isFeatured && (
              <span className="flex items-center gap-2 text-[9px] tracking-[1px] text-[#9A805F]">
                <BadgeCheck size={14} />
                FEATURED
              </span>
            )}
          </div>

          <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>

          {product.subtitle && (
            <p className="mt-4 text-sm text-[#8B8176]">
              {product.subtitle}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span className="text-lg">
              {formatPrice(product.price)}
            </span>

            {product.oldPrice &&
              product.oldPrice > product.price && (
                <>
                  <span className="text-sm text-[#9A9187] line-through">
                    {formatPrice(product.oldPrice)}
                  </span>

                  <span className="border border-[#B9A48A] px-3 py-1 text-[9px] tracking-[1px] text-[#8D765A]">
                    SPECIAL PRICE
                  </span>
                </>
              )}
          </div>

          <div className="my-9 h-px bg-[#DED6CB]" />

          <p className="text-sm leading-8 text-[#6F685F]">
            {product.description ||
              "A thoughtfully selected piece from the TALA collection."}
          </p>

          <div className="mt-9">
            <ColorSelector
              colors={colors}
              selected={selectedColor}
              onSelect={(value) => {
                setSelectedColor(value);
                setCartMessage("");
              }}
            />
          </div>

          <div className="mt-9">
            <SizeSelector
              sizes={sizes}
              selected={selectedSize}
              onSelect={handleSizeSelect}
              onOpenGuide={() => setShowSizeGuide(true)}
            />
          </div>

          <div className="mt-8">
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
            />
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!available || adding}
              className="flex w-full items-center justify-center gap-3 bg-[#292521] px-6 py-5 text-[10px] tracking-[3px] text-white transition hover:bg-[#51483E] disabled:cursor-not-allowed disabled:bg-[#A69C90]"
            >
              <ShoppingBag size={17} />
              {adding
                ? "ADDING..."
                : available
                  ? "ADD TO SHOPPING BAG"
                  : "CURRENTLY UNAVAILABLE"}
            </button>

            {cartMessage && (
              <p
                role="status"
                className="mt-4 text-center text-xs text-[#76664F]"
              >
                {cartMessage}
              </p>
            )}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 text-[10px] tracking-[2px] text-[#77716A] hover:text-[#292521]"
            >
              <Share2 size={14} />
              SHARE THIS PIECE
            </button>
          </div>

          <ServiceBenefits />

          <div className="mt-7">
            <Accordion title="PRODUCT DETAILS">
              <p>
                {product.description ||
                  "Please contact TALA for additional product information."}
              </p>

              <p className="mt-3">
                Category: {product.category ?? "TALA Collection"}
              </p>
            </Accordion>

            <Accordion title="SIZING & FIT">
              <p>
                Available sizes are displayed above according to
                the current product variants. Please use the size
                guide or contact TALA if you need help choosing.
              </p>
            </Accordion>

            <Accordion title="DELIVERY & RETURNS">
              <p>
                Delivery and return details should be confirmed
                with TALA before placing your order.
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      <RelatedProducts
        products={allProducts}
        currentProductId={String(product.id)}
      />

      <div className="container mt-20 border-t border-[#DED6CB] px-5 pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>THE TALA EXPERIENCE</Eyebrow>
          <h2 className="mt-5 font-serif text-3xl md:text-4xl">
            Elegance in every detail.
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#77716A]">
            Discover a considered collection created around
            timeless style and thoughtful details.
          </p>
        </div>
      </div>

      <BrandFooter />

      <AnimatePresence>
        {zoomIndex !== null && (
          <ZoomViewer
            image={images[zoomIndex] ?? images[0] ?? FALLBACK_IMAGE}
            name={product.name}
            onClose={() => setZoomIndex(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuide
            selectedSize={selectedSize}
            onSelect={handleSizeSelect}
            onClose={() => setShowSizeGuide(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
