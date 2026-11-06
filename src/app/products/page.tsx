
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Filter,
  Grid2X2,
  Heart,
  List,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  secondaryImage: string;
  colors: string[];
  sizes: string[];
  description: string;
  badge?: string;
  isNew?: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "The Signature Dress",
    category: "Dresses",
    price: 1850,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900",
    colors: ["#292521", "#C9BBA8", "#E8E0D5"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "An elegant statement piece designed for timeless occasions.",
    badge: "BESTSELLER",
    isNew: true,
  },
  {
    id: 2,
    name: "Classic Elegance",
    category: "Dresses",
    price: 1250,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900",
    colors: ["#E8E0D5", "#292521"],
    sizes: ["S", "M", "L", "XL"],
    description: "A refined silhouette made for effortless everyday elegance.",
  },
  {
    id: 3,
    name: "Modern Essential",
    category: "Tops",
    price: 1450,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900",
    colors: ["#292521", "#A99A89"],
    sizes: ["XS", "S", "M", "L"],
    description: "A versatile essential that completes your wardrobe.",
    isNew: true,
  },
  {
    id: 4,
    name: "The Timeless Set",
    category: "Sets",
    price: 1650,
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
    colors: ["#A99A89", "#E8E0D5"],
    sizes: ["S", "M", "L"],
    description: "A coordinated look with a clean and sophisticated finish.",
  },
  {
    id: 5,
    name: "Soft Structure",
    category: "Outerwear",
    price: 2250,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900",
    colors: ["#292521", "#B5A28C"],
    sizes: ["S", "M", "L", "XL"],
    description: "A modern outer layer with understated character.",
    badge: "LIMITED",
  },
  {
    id: 6,
    name: "Everyday Grace",
    category: "Tops",
    price: 950,
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
    colors: ["#E8E0D5", "#292521"],
    sizes: ["XS", "S", "M", "L"],
    description: "Simple details and a comfortable silhouette.",
  },
  {
    id: 7,
    name: "Evening Muse",
    category: "Dresses",
    price: 2450,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900",
    colors: ["#292521", "#B5A28C"],
    sizes: ["S", "M", "L"],
    description: "A distinctive evening look with timeless appeal.",
    isNew: true,
  },
  {
    id: 8,
    name: "Minimal Form",
    category: "Sets",
    price: 1750,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
    secondaryImage: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900",
    colors: ["#B5A28C", "#292521"],
    sizes: ["S", "M", "L", "XL"],
    description: "A minimal coordinated outfit for versatile styling.",
  },
];

const CATEGORIES = [
  "All",
  "Dresses",
  "Tops",
  "Outerwear",
  "Sets",
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "low" },
  { label: "Price: High to Low", value: "high" },
  { label: "Newest First", value: "newest" },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-EG").format(price) + " EGP";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] tracking-[4px] text-[#A18B70]">
      {children}
    </p>
  );
}

function ProductCard({
  product,
  isFavorite,
  onFavorite,
  onQuickView,
}: {
  product: Product;
  isFavorite: boolean;
  onFavorite: () => void;
  onQuickView: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E6DED3]">
        <Link href={`/products/${product.id}`} className="absolute inset-0 z-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-700 group-hover:scale-105"
            unoptimized
          />
        </Link>

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-[#292521] px-3 py-2 text-[8px] tracking-[2px] text-white">
              {product.badge}
            </span>
          )}

          {product.isNew && (
            <span className="bg-[#F4F0E9] px-3 py-2 text-[8px] tracking-[2px]">
              NEW
            </span>
          )}
        </div>

        <button
          onClick={onFavorite}
          aria-label="Add to favorites"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F0E9]/90 transition hover:bg-white"
        >
          <Heart
            size={17}
            strokeWidth={1.4}
            fill={isFavorite ? "#292521" : "none"}
          />
        </button>

        <button
          onClick={onQuickView}
          className="absolute bottom-0 left-0 z-10 w-full translate-y-full bg-[#292521]/95 py-4 text-[9px] tracking-[3px] text-white transition duration-300 group-hover:translate-y-0"
        >
          QUICK VIEW
        </button>
      </div>

      <div className="flex items-start justify-between gap-2 pt-4">
        <div>
          <p className="text-[9px] tracking-[2px] text-[#9B8C7C]">
            {product.category.toUpperCase()}
          </p>
          <h3 className="mt-2 text-xs tracking-wide md:text-sm">
            {product.name}
          </h3>
          <p className="mt-2 text-[11px] text-[#77716A]">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="mt-7 flex gap-1">
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="h-3 w-3 rounded-full border border-black/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function QuickView({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, size: string, color: string) => void;
}) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) return null;

  const activeColor = selectedColor || product.colors[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={(event) => event.stopPropagation()}
          className="relative grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto bg-[#F4F0E9] md:grid-cols-2"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white"
            aria-label="Close quick view"
          >
            <X size={17} />
          </button>

          <div className="relative min-h-[350px] bg-[#E6DED3]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-center p-7 md:p-10">
            <SectionLabel>{product.category.toUpperCase()}</SectionLabel>

            <h2 className="mt-4 text-3xl font-light tracking-wide">
              {product.name}
            </h2>

            <p className="mt-4 text-sm">{formatPrice(product.price)}</p>

            <p className="mt-6 text-xs leading-7 text-[#77716A]">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="mb-4 text-[9px] tracking-[3px]">SELECT SIZE</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-10 border px-3 text-[10px] transition ${
                      selectedSize === size
                        ? "border-[#292521] bg-[#292521] text-white"
                        : "border-[#D4C9BC] hover:border-[#292521]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-4 text-[9px] tracking-[3px]">SELECT COLOR</p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      activeColor === color
                        ? "border-[#292521]"
                        : "border-transparent"
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onAdd(product, selectedSize, activeColor)}
              className="mt-9 flex items-center justify-center gap-3 bg-[#292521] px-6 py-4 text-[9px] tracking-[3px] text-white transition hover:bg-[#51483F]"
            >
              <ShoppingBag size={16} />
              ADD TO BAG
            </button>

            <Link
              href={`/products/${product.id}`}
              className="mt-5 text-center text-[9px] tracking-[2px] underline underline-offset-4"
            >
              VIEW FULL DETAILS
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [notification, setNotification] = useState("");

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== "All") {
      result = result.filter(
        (product) => product.category === activeCategory
      );
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    result = result.filter((product) => product.price <= maxPrice);

    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew)
      );
    }

    return result;
  }, [activeCategory, searchTerm, sortBy, maxPrice]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addToBag = (
    product: Product,
    size: string,
    color: string
  ) => {
    setCartCount((count) => count + 1);
    setNotification(`${product.name} added to your bag`);
    setQuickProduct(null);
  };

  return (
    <main className="min-h-screen bg-[#F4F0E9] text-[#292521]">
      <div className="bg-[#292521] px-4 py-3 text-center text-[9px] tracking-[3px] text-white">
        DISCOVER THE NEW TALA COLLECTION
      </div>

      <header className="sticky top-0 z-40 border-b border-[#DCD3C8] bg-[#F4F0E9]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-12">
          <Link
            href="/"
            className="text-[11px] tracking-[3px] transition hover:opacity-60"
          >
            <ArrowLeft size={17} />
          </Link>

          <Link
            href="/"
            className="text-3xl font-light tracking-[11px]"
          >
            TALA
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-2"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} strokeWidth={1.3} />
            <span className="text-[10px]">{cartCount}</span>
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#D9CFC3]">
        <div className="mx-auto max-w-[1500px] px-6 py-24 text-center md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>THE TALA COLLECTION</SectionLabel>

            <h1 className="mt-6 text-5xl font-light tracking-[7px] md:text-7xl">
              Our Collection
            </h1>

            <p className="mx-auto mt-7 max-w-md text-xs leading-7 tracking-wide text-[#6D6258]">
              Discover thoughtfully selected pieces that bring
              together timeless elegance and modern femininity.
            </p>

            <div className="mt-9 flex justify-center">
              <span className="h-px w-16 bg-[#A18B70]" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-16 md:px-12 md:py-24">
        <div className="mb-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>CURATED WITH CARE</SectionLabel>
            <h2 className="mt-4 text-3xl font-light tracking-[4px]">
              Shop All
            </h2>
            <p className="mt-3 text-[10px] tracking-wide text-[#82776C]">
              {filteredProducts.length} PRODUCTS
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <div className="relative flex flex-1 items-center border-b border-[#C9BBA8] md:w-64">
              <Search size={16} className="text-[#8A7B6B]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent px-3 py-3 text-xs outline-none placeholder:text-[#9A9086]"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")}>
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters((value) => !value)}
              className="flex items-center justify-center gap-3 border border-[#C9BBA8] px-5 py-3 text-[9px] tracking-[2px] transition hover:bg-[#E9E2D8]"
            >
              <SlidersHorizontal size={15} />
              FILTERS
            </button>

            <label className="flex items-center gap-3 border-b border-[#C9BBA8] px-3">
              <ArrowDownUp size={15} />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="bg-transparent py-3 text-[10px] outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 overflow-hidden border-y border-[#D8CFC4]"
            >
              <div className="grid gap-8 py-8 md:grid-cols-2">
                <div>
                  <p className="mb-5 text-[9px] tracking-[3px]">
                    PRICE RANGE
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span>0 EGP</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>

                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="50"
                    value={maxPrice}
                    onChange={(event) =>
                      setMaxPrice(Number(event.target.value))
                    }
                    className="mt-4 w-full accent-[#292521]"
                  />
                </div>

                <div>
                  <p className="mb-5 text-[9px] tracking-[3px]">
                    QUICK FILTERS
                  </p>

                  <button
                    onClick={() => setActiveCategory("All")}
                    className="border border-[#C9BBA8] px-4 py-3 text-[9px] tracking-[2px]"
                  >
                    CLEAR CATEGORY
                  </button>

                  <button
                    onClick={() => {
                      setMaxPrice(5000);
                      setSearchTerm("");
                      setActiveCategory("All");
                      setSortBy("featured");
                    }}
                    className="ml-3 border border-[#292521] bg-[#292521] px-4 py-3 text-[9px] tracking-[2px] text-white"
                  >
                    RESET ALL
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-5 border-y border-[#D8CFC4] py-5">
          <div className="flex flex-wrap gap-5 md:gap-9">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-[9px] tracking-[2px] transition ${
                  activeCategory === category
                    ? "border-b border-[#292521] pb-2 text-[#292521]"
                    : "text-[#91877D] hover:text-[#292521]"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={viewMode === "grid" ? "opacity-100" : "opacity-40"}
            >
              <Grid2X2 size={17} />
            </button>

            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={viewMode === "list" ? "opacity-100" : "opacity-40"}
            >
              <List size={19} />
            </button>
          </div>
        </div>

        <motion.div
          layout
          className={`grid gap-x-5 gap-y-12 ${
            viewMode === "list"
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onFavorite={() => toggleFavorite(product.id)}
                onQuickView={() => setQuickProduct(product)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <Search
              size={35}
              strokeWidth={1}
              className="mx-auto text-[#A18B70]"
            />

            <h3 className="mt-7 text-xl font-light tracking-[3px]">
              No products found
            </h3>

            <p className="mt-3 text-xs text-[#82776C]">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
                setMaxPrice(5000);
              }}
              className="mt-8 border border-[#292521] px-8 py-4 text-[9px] tracking-[3px]"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}

        <div className="mt-24 border-t border-[#D8CFC4] pt-12 text-center">
          <Sparkles
            size={19}
            className="mx-auto text-[#A18B70]"
          />

          <p className="mt-5 text-[9px] tracking-[4px]">
            MORE THAN FASHION
          </p>

          <h3 className="mt-4 text-3xl font-light tracking-[3px]">
            The TALA Experience
          </h3>

          <p className="mx-auto mt-5 max-w-md text-xs leading-7 text-[#82776C]">
            Every detail matters. Every piece tells a story.
            Discover a collection made to become part of yours.
          </p>
        </div>
      </section>

      <footer className="bg-[#292521] px-6 py-16 text-center text-white">
        <Link href="/" className="text-4xl font-light tracking-[12px]">
          TALA
        </Link>

        <p className="mt-5 text-[9px] tracking-[4px] text-[#C9BBA8]">
          TIMELESS FASHION. YOUR SIGNATURE.
        </p>

        <div className="mt-10 flex justify-center gap-7 text-[9px] tracking-[2px]">
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACT</Link>
          <Link href="/policies">POLICIES</Link>
        </div>

        <p className="mt-10 text-[9px] text-[#A99A89]">
          © 2026 TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>

      <QuickView
        product={quickProduct}
        onClose={() => setQuickProduct(null)}
        onAdd={addToBag}
      />

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-3 bg-[#292521] px-6 py-4 text-[10px] tracking-wide text-white shadow-xl"
          >
            <Check size={16} />
            {notification}

            <button
              onClick={() => setNotification("")}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

