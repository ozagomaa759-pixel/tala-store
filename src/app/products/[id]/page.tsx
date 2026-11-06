
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";

type ProductDetails = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  details: string[];
  images: string[];
  colors: {
    name: string;
    value: string;
  }[];
  sizes: string[];
  badge?: string;
};

const PRODUCTS: ProductDetails[] = [
  {
    id: 1,
    name: "The Signature Dress",
    category: "Dresses",
    price: 1850,
    description:
      "An elegant statement piece designed to bring timeless sophistication to your wardrobe. Carefully selected details create a refined look for every special moment.",
    details: [
      "Elegant and versatile silhouette",
      "Designed for effortless styling",
      "Comfort-focused construction",
      "Carefully selected finishing details",
    ],
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200",
    ],
    colors: [
      { name: "Classic Black", value: "#292521" },
      { name: "Soft Beige", value: "#C9BBA8" },
      { name: "Ivory", value: "#E8E0D5" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "BESTSELLER",
  },
  {
    id: 2,
    name: "Classic Elegance",
    category: "Dresses",
    price: 1250,
    description:
      "A refined design that celebrates simplicity and everyday elegance. An effortless addition to a thoughtfully curated wardrobe.",
    details: [
      "Timeless design",
      "Versatile styling options",
      "Minimal finishing",
      "Everyday wardrobe essential",
    ],
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
    ],
    colors: [
      { name: "Ivory", value: "#E8E0D5" },
      { name: "Black", value: "#292521" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Modern Essential",
    category: "Tops",
    price: 1450,
    description:
      "A modern wardrobe essential with a clean silhouette and versatile styling possibilities.",
    details: [
      "Modern minimal design",
      "Easy to style",
      "Versatile wardrobe piece",
      "Clean finishing",
    ],
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1200",
    ],
    colors: [
      { name: "Black", value: "#292521" },
      { name: "Taupe", value: "#A99A89" },
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 4,
    name: "The Timeless Set",
    category: "Sets",
    price: 1650,
    description:
      "A coordinated look created for effortless sophistication and versatile styling.",
    details: [
      "Coordinated two-piece look",
      "Modern silhouette",
      "Versatile styling",
      "Refined appearance",
    ],
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    ],
    colors: [
      { name: "Taupe", value: "#A99A89" },
      { name: "Ivory", value: "#E8E0D5" },
    ],
    sizes: ["S", "M", "L"],
  },
  {
    id: 5,
    name: "Soft Structure",
    category: "Outerwear",
    price: 2250,
    description:
      "An understated outerwear piece that combines modern character with timeless styling.",
    details: [
      "Structured appearance",
      "Versatile outer layer",
      "Classic color palette",
      "Minimal design",
    ],
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200",
    ],
    colors: [
      { name: "Black", value: "#292521" },
      { name: "Sand", value: "#B5A28C" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 6,
    name: "Everyday Grace",
    category: "Tops",
    price: 950,
    description:
      "A simple essential designed to bring comfort and elegance into everyday styling.",
    details: [
      "Minimal silhouette",
      "Easy everyday styling",
      "Versatile wardrobe essential",
      "Clean design",
    ],
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1200",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    ],
    colors: [
      { name: "Ivory", value: "#E8E0D5" },
      { name: "Black", value: "#292521" },
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 7,
    name: "Evening Muse",
    category: "Dresses",
    price: 2450,
    description:
      "A distinctive evening look with an elegant silhouette and timeless appeal.",
    details: [
      "Elegant occasion styling",
      "Distinctive silhouette",
      "Timeless appearance",
      "Refined details",
    ],
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200",
    ],
    colors: [
      { name: "Black", value: "#292521" },
      { name: "Taupe", value: "#B5A28C" },
    ],
    sizes: ["S", "M", "L"],
    badge: "NEW ARRIVAL",
  },
  {
    id: 8,
    name: "Minimal Form",
    category: "Sets",
    price: 1750,
    description:
      "A minimal coordinated outfit designed for a polished and effortless appearance.",
    details: [
      "Coordinated styling",
      "Minimal aesthetic",
      "Versatile wardrobe addition",
      "Classic color options",
    ],
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200",
    ],
    colors: [
      { name: "Sand", value: "#B5A28C" },
      { name: "Black", value: "#292521" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-EG").format(price) + " EGP";

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] tracking-[3px] text-[#A18B70]">
      {children}
    </p>
  );
}

function ImageGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const nextImage = () => {
    setActiveImage((current) => (current + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage(
      (current) => (current - 1 + images.length) % images.length
    );
  };

  return (
    <div className="w-full">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#E6DED3]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.4, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeImage]}
              alt={`${productName} image ${activeImage + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={previousImage}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4F0E9]/85 transition hover:bg-white"
        >
          <ChevronLeft size={19} />
        </button>

        <button
          onClick={nextImage}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4F0E9]/85 transition hover:bg-white"
        >
          <ChevronRight size={19} />
        </button>

        <button
          onClick={() => setZoomOpen(true)}
          aria-label="Zoom image"
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F0E9]/90"
        >
          <ZoomIn size={18} />
        </button>

        <span className="absolute bottom-5 left-5 z-10 bg-[#292521]/80 px-3 py-2 text-[9px] tracking-[2px] text-white">
          {String(activeImage + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setActiveImage(index)}
            className={`relative aspect-[3/4] overflow-hidden bg-[#E6DED3] ${
              activeImage === index
                ? "outline outline-1 outline-[#292521] outline-offset-2"
                : "opacity-65 hover:opacity-100"
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              sizes="150px"
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-5"
          >
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute right-6 top-6 z-10 text-white"
              aria-label="Close zoom"
            >
              <X size={28} />
            </button>

            <div className="relative h-[85vh] w-full max-w-3xl">
              <Image
                src={images[activeImage]}
                alt={productName}
                fill
                sizes="90vw"
                className="object-contain"
                unoptimized
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SizeGuide({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg bg-[#F4F0E9] p-7 md:p-10"
          >
            <div className="flex items-center justify-between">
              <SmallLabel>FIND YOUR FIT</SmallLabel>

              <button onClick={onClose} aria-label="Close size guide">
                <X size={19} />
              </button>
            </div>

            <h3 className="mt-5 text-3xl font-light tracking-[3px]">
              Size Guide
            </h3>

            <p className="mt-3 text-xs leading-6 text-[#82776C]">
              Use this general size guide as a starting point.
              Actual garment measurements should be confirmed
              by the TALA team before ordering.
            </p>

            <div className="mt-7 overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="border-b border-[#D8CFC4]">
                    <th className="py-4 font-normal">Size</th>
                    <th className="py-4 font-normal">Bust</th>
                    <th className="py-4 font-normal">Waist</th>
                    <th className="py-4 font-normal">Hip</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["XS", "76–80", "58–62", "84–88"],
                    ["S", "81–85", "63–67", "89–93"],
                    ["M", "86–90", "68–72", "94–98"],
                    ["L", "91–97", "73–79", "99–105"],
                    ["XL", "98–104", "80–86", "106–112"],
                  ].map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-[#E4DCD2]"
                    >
                      {row.map((value) => (
                        <td key={value} className="py-4">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-[9px] text-[#82776C]">
              Measurements are shown in centimeters and are illustrative,
              not verified measurements for TALA garments.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProductAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#D8CFC4]">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[10px] tracking-[2px]">{title}</span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
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
            <div className="pb-6 text-xs leading-7 text-[#82776C]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RelatedProducts({
  currentProduct,
}: {
  currentProduct: ProductDetails;
}) {
  const related = PRODUCTS.filter(
    (product) =>
      product.id !== currentProduct.id &&
      product.category === currentProduct.category
  ).slice(0, 4);

  const recommendations =
    related.length > 0
      ? related
      : PRODUCTS.filter(
          (product) => product.id !== currentProduct.id
        ).slice(0, 4);

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-24 md:px-12">
      <div className="mb-12 text-center">
        <SmallLabel>DISCOVER MORE</SmallLabel>

        <h2 className="mt-5 text-3xl font-light tracking-[4px] md:text-4xl">
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
        {recommendations.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#E6DED3]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
                unoptimized
              />
            </div>

            <h3 className="mt-4 text-xs tracking-wide">
              {product.name}
            </h3>

            <p className="mt-2 text-[10px] text-[#82776C]">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();

  const product = useMemo(
    () => PRODUCTS.find((item) => item.id === Number(params.id)),
    [params.id]
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F0E9] px-5 text-center">
        <div>
          <SmallLabel>TALA COLLECTION</SmallLabel>

          <h1 className="mt-6 text-4xl font-light tracking-[4px]">
            Product Not Found
          </h1>

          <p className="mt-5 text-xs text-[#82776C]">
            This product may no longer be available.
          </p>

          <Link
            href="/products"
            className="mt-9 inline-flex items-center gap-3 bg-[#292521] px-8 py-4 text-[9px] tracking-[3px] text-white"
          >
            <ArrowLeft size={15} />
            BACK TO COLLECTION
          </Link>
        </div>
      </main>
    );
  }

  const color = selectedColor || product.colors[0].value;

  const addToBag = () => {
    if (!selectedSize) {
      setNotification("Please select a size first.");
      return;
    }

    setNotification(
      `${quantity} × ${product.name} (${selectedSize}) added locally.`
    );
  };

  return (
    <main className="min-h-screen bg-[#F4F0E9] text-[#292521]">
      <div className="bg-[#292521] px-4 py-3 text-center text-[9px] tracking-[3px] text-white">
        DISCOVER THE NEW TALA COLLECTION
      </div>

      <header className="sticky top-0 z-40 border-b border-[#D8CFC4] bg-[#F4F0E9]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-12">
          <Link
            href="/products"
            aria-label="Back to products"
            className="flex items-center gap-2 text-[9px] tracking-[2px]"
          >
            <ArrowLeft size={17} />
            <span className="hidden md:inline">COLLECTION</span>
          </Link>

          <Link href="/" className="text-3xl font-light tracking-[11px]">
            TALA
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="flex items-center gap-2"
          >
            <ShoppingBag size={20} strokeWidth={1.3} />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-12">
        <nav className="flex flex-wrap items-center gap-3 text-[9px] tracking-[2px] text-[#8B8075]">
          <Link href="/" className="hover:text-[#292521]">
            HOME
          </Link>

          <span>/</span>

          <Link href="/products" className="hover:text-[#292521]">
            COLLECTION
          </Link>

          <span>/</span>

          <span className="text-[#292521]">
            {product.name.toUpperCase()}
          </span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-5 pb-20 md:grid-cols-2 md:gap-16 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImageGallery
            images={product.images}
            productName={product.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col pt-2 md:pt-8"
        >
          <div className="flex items-center justify-between">
            <SmallLabel>{product.category.toUpperCase()}</SmallLabel>

            {product.badge && (
              <span className="bg-[#292521] px-3 py-2 text-[8px] tracking-[2px] text-white">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="mt-7 text-4xl font-light tracking-[2px] md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-6 text-lg">
            {formatPrice(product.price)}
          </p>

          <div className="my-8 h-px w-full bg-[#D8CFC4]" />

          <p className="text-xs leading-8 text-[#82776C]">
            {product.description}
          </p>

          <div className="mt-9">
            <div className="flex items-center justify-between">
              <p className="text-[9px] tracking-[3px]">SELECT COLOR</p>

              <span className="text-[10px] text-[#82776C]">
                {product.colors.find((item) => item.value === color)?.name}
              </span>
            </div>

            <div className="mt-5 flex gap-4">
              {product.colors.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSelectedColor(item.value)}
                  aria-label={`Choose ${item.name}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    color === item.value
                      ? "border-[#292521]"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className="h-7 w-7 rounded-full border border-black/10"
                    style={{ backgroundColor: item.value }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9">
            <div className="flex items-center justify-between">
              <p className="text-[9px] tracking-[3px]">SELECT SIZE</p>

              <button
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-2 text-[9px] tracking-[1px] underline underline-offset-4"
              >
                <Ruler size={14} />
                SIZE GUIDE
              </button>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setNotification("");
                  }}
                  className={`border py-4 text-[10px] transition ${
                    selectedSize === size
                      ? "border-[#292521] bg-[#292521] text-white"
                      : "border-[#D8CFC4] hover:border-[#292521]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9">
            <p className="mb-4 text-[9px] tracking-[3px]">
              QUANTITY
            </p>

            <div className="flex w-36 items-center justify-between border border-[#D8CFC4]">
              <button
                onClick={() =>
                  setQuantity((value) => Math.max(1, value - 1))
                }
                aria-label="Decrease quantity"
                className="p-4"
              >
                <Minus size={13} />
              </button>

              <span className="text-xs">{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((value) => Math.min(10, value + 1))
                }
                aria-label="Increase quantity"
                className="p-4"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <button
              onClick={addToBag}
              className="flex flex-1 items-center justify-center gap-3 bg-[#292521] px-5 py-5 text-[9px] tracking-[3px] text-white transition hover:bg-[#51483F]"
            >
              <ShoppingBag size={17} />
              ADD TO BAG
            </button>

            <button
              onClick={() => setFavorite((value) => !value)}
              aria-label="Toggle favorite"
              className="flex h-14 w-14 items-center justify-center border border-[#D8CFC4] transition hover:border-[#292521]"
            >
              <Heart
                size={19}
                fill={favorite ? "#292521" : "none"}
              />
            </button>
          </div>

          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-center gap-3 border border-[#D8CFC4] p-4 text-[10px]"
              >
                <Check size={15} />
                {notification}

                <button
                  onClick={() => setNotification("")}
                  className="ml-auto"
                  aria-label="Close notification"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-9 space-y-4 border-y border-[#D8CFC4] py-6">
            <div className="flex items-center gap-4">
              <Truck size={18} strokeWidth={1.3} />

              <div>
                <p className="text-[9px] tracking-[2px]">
                  DELIVERY INFORMATION
                </p>
                <p className="mt-2 text-[10px] text-[#82776C]">
                  Shipping options will be confirmed at checkout.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck size={18} strokeWidth={1.3} />

              <div>
                <p className="text-[9px] tracking-[2px]">
                  SECURE SHOPPING
                </p>
                <p className="mt-2 text-[10px] text-[#82776C]">
                  Your order information is handled securely.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <ProductAccordion title="PRODUCT DESCRIPTION">
              {product.description}
            </ProductAccordion>

            <ProductAccordion title="PRODUCT DETAILS">
              <ul className="list-inside list-disc space-y-2">
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </ProductAccordion>

            <ProductAccordion title="DELIVERY & RETURNS">
              Delivery fees, delivery estimates and return eligibility
              will be confirmed by the store policy before checkout.
              No delivery promise is made on this demo page.
            </ProductAccordion>
          </div>
        </motion.div>
      </section>

      <section className="bg-[#E9E2D8] px-5 py-16 text-center md:py-24">
        <SmallLabel>THE TALA DIFFERENCE</SmallLabel>

        <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-light leading-relaxed tracking-[3px] md:text-5xl">
          Designed to become part of your story.
        </h2>

        <p className="mx-auto mt-6 max-w-md text-xs leading-7 text-[#82776C]">
          Thoughtful design, timeless style and a refined
          approach to everyday fashion.
        </p>
      </section>

      <RelatedProducts currentProduct={product} />

      <footer className="bg-[#292521] px-6 py-16 text-center text-white">
        <Link href="/" className="text-4xl font-light tracking-[12px]">
          TALA
        </Link>

        <p className="mt-5 text-[9px] tracking-[4px] text-[#C9BBA8]">
          TIMELESS FASHION. YOUR SIGNATURE.
        </p>

        <div className="mt-9 flex justify-center gap-7 text-[9px] tracking-[2px]">
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACT</Link>
          <Link href="/policies">POLICIES</Link>
        </div>

        <p className="mt-10 text-[9px] text-[#A99A89]">
          © 2026 TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>

      <SizeGuide
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </main>
  );
}

