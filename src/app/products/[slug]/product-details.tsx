
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  X,
  Minus,
  Plus,
  ShoppingBag,
  ZoomIn,
  Image as ImageIcon,
} from "lucide-react";
import { addToTalaCart } from "@/lib/tala-cart";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  main_image: string | null;
  images: string[] | null;
};

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  color_code: string | null;
  stock_quantity: number;
  price_override: number | null;
  image_url: string | null;
  is_active: boolean;
};

const THEME = {
  page: "#B8AA98",
  surface: "#A99A88",
  surfaceDark: "#998A78",
  ink: "#292923",
  muted: "#625B50",
  lime: "#D8ED83",
  border: "rgba(41,39,35,0.24)",
  cream: "#E5D9C9",
};

const priceFormat = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

function formatPrice(price: number) {
  return priceFormat.format(price);
}

export default function ProductDetails({
  product,
  variants,
  images,
}: {
  product: Product;
  variants: Variant[];
  images: string[];
}) {
  const activeVariants = useMemo(
    () => variants.filter((variant) => variant.is_active),
    [variants]
  );

  const availableVariants = useMemo(
    () =>
      activeVariants.filter(
        (variant) => Number(variant.stock_quantity) > 0
      ),
    [activeVariants]
  );

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          activeVariants
            .map((variant) => variant.size?.trim())
            .filter((size): size is string => Boolean(size))
        )
      ),
    [activeVariants]
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          activeVariants
            .map((variant) => variant.color?.trim())
            .filter((color): color is string => Boolean(color))
        )
      ),
    [activeVariants]
  );

  const [selectedVariant, setSelectedVariant] =
    useState<Variant | null>(
      availableVariants[0] ?? activeVariants[0] ?? null
    );

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const initialVariant =
      availableVariants[0] ?? activeVariants[0] ?? null;

    setSelectedVariant(initialVariant);
    setSelectedImage(initialVariant?.image_url ?? "");
    setQuantity(1);
    setMessage("");
    setIsAdded(false);
  }, [product.id, variants, availableVariants, activeVariants]);

  useEffect(() => {
    if (!isAdded) return;

    const timeout = window.setTimeout(() => {
      setIsAdded(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [isAdded]);

  const selectedColor = selectedVariant?.color ?? null;

  const selectedColorImages = useMemo(
    () =>
      Array.from(
        new Set(
          activeVariants
            .filter(
              (variant) =>
                variant.color === selectedColor &&
                typeof variant.image_url === "string" &&
                variant.image_url.trim().length > 0
            )
            .map((variant) => variant.image_url as string)
        )
      ),
    [activeVariants, selectedColor]
  );

  const galleryImages = useMemo(() => {
    const source =
      selectedColorImages.length > 0
        ? selectedColorImages
        : [
            ...(product.main_image ? [product.main_image] : []),
            ...(product.images ?? []),
            ...images,
          ];

    return Array.from(
      new Set(source.filter((image) => Boolean(image?.trim())))
    );
  }, [
    selectedColorImages,
    product.main_image,
    product.images,
    images,
  ]);

  const currentImage =
    (selectedImage && galleryImages.includes(selectedImage)
      ? selectedImage
      : "") ||
    selectedVariant?.image_url ||
    galleryImages[0] ||
    product.main_image ||
    "";

  const currentImageIndex = Math.max(
    0,
    galleryImages.indexOf(currentImage)
  );

  const currentPrice =
    Number(selectedVariant?.price_override) > 0
      ? Number(selectedVariant?.price_override)
      : Number(product.price);

  const availableStock = Math.max(
    0,
    Number(selectedVariant?.stock_quantity ?? 0)
  );

  const productUnavailable = activeVariants.length === 0;
  const selectedOptionUnavailable =
    !selectedVariant || availableStock <= 0;

  function showNextImage() {
    if (galleryImages.length < 2) return;

    const nextIndex =
      (currentImageIndex + 1) % galleryImages.length;

    setSelectedImage(galleryImages[nextIndex]);
  }

  function showPreviousImage() {
    if (galleryImages.length < 2) return;

    const previousIndex =
      (currentImageIndex - 1 + galleryImages.length) %
      galleryImages.length;

    setSelectedImage(galleryImages[previousIndex]);
  }

  function openGallery() {
    if (galleryImages.length > 0) setIsGalleryOpen(true);
  }

  function closeGallery() {
    setIsGalleryOpen(false);
    setTouchStart(null);
  }

  useEffect(() => {
    if (!isGalleryOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowRight") showNextImage();
      if (event.key === "ArrowLeft") showPreviousImage();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isGalleryOpen, currentImageIndex, galleryImages]);

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    setTouchStart(event.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    if (touchStart === null) return;

    const touchEnd = event.changedTouches[0]?.clientX;

    if (typeof touchEnd !== "number") {
      setTouchStart(null);
      return;
    }

    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > 45) {
      if (distance > 0) showNextImage();
      else showPreviousImage();
    }

    setTouchStart(null);
  }

  function chooseSize(size: string) {
    const sameColor = activeVariants.filter(
      (variant) =>
        variant.size === size &&
        variant.color === selectedVariant?.color
    );

    const options =
      sameColor.length > 0
        ? sameColor
        : activeVariants.filter((variant) => variant.size === size);

    const nextVariant =
      options.find(
        (variant) => Number(variant.stock_quantity) > 0
      ) ??
      options[0] ??
      null;

    setSelectedVariant(nextVariant);

    setSelectedImage(
      nextVariant?.image_url ||
        (nextVariant?.color === selectedVariant?.color
          ? selectedColorImages[0]
          : "") ||
        product.main_image ||
        images[0] ||
        ""
    );

    setQuantity(1);
    setMessage(
      nextVariant && Number(nextVariant.stock_quantity) <= 0
        ? "This size is currently unavailable."
        : ""
    );
    setIsAdded(false);
  }

  function chooseColor(color: string) {
    const sameSize = activeVariants.filter(
      (variant) =>
        variant.color === color &&
        variant.size === selectedVariant?.size
    );

    const options =
      sameSize.length > 0
        ? sameSize
        : activeVariants.filter(
            (variant) => variant.color === color
          );

    const nextVariant =
      options.find(
        (variant) => Number(variant.stock_quantity) > 0
      ) ??
      options[0] ??
      null;

    const nextColorImage =
      nextVariant?.image_url ||
      activeVariants.find(
        (variant) =>
          variant.color === color &&
          Boolean(variant.image_url)
      )?.image_url ||
      product.main_image ||
      images[0] ||
      "";

    setSelectedVariant(nextVariant);
    setSelectedImage(nextColorImage);
    setQuantity(1);
    setMessage(
      nextVariant && Number(nextVariant.stock_quantity) <= 0
        ? "This color and size are currently unavailable."
        : ""
    );
    setIsAdded(false);
  }

  function addProductToCart() {
    setMessage("");

    if (!selectedVariant) {
      setMessage("Please select a size and color.");
      return;
    }

    if (availableStock <= 0) {
      setMessage("This option is sold out. Please choose another.");
      return;
    }

    if (quantity > availableStock) {
      setMessage(`Only ${availableStock} item(s) are available.`);
      return;
    }

    addToTalaCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: currentImage,
      size: selectedVariant.size ?? "One Size",
      color: selectedVariant.color ?? "Default",
    });

    setIsAdded(true);
    setMessage("Added to your bag successfully.");
  }

  return (
    <main
      className="min-h-screen bg-[#B8AA98] text-[#292923]"
      style={{ backgroundColor: THEME.page }}
    >
      {/* Announcement */}
      <div className="bg-[#292923] px-4 py-2.5 text-center text-[9px] font-semibold tracking-[0.25em] text-[#D8ED83]">
        TALA LUXURY FASHION — A NEW WAY TO FEEL ELEGANT
      </div>

      {/* Header */}
      <header className="relative flex h-[76px] items-center justify-between border-b border-[#292923]/20 px-5 sm:px-10">
        <Link
          href="/collections"
          className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#625B50] transition hover:text-[#292923]"
        >
          <ArrowLeft size={15} strokeWidth={1.3} />
          Collections
        </Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.4em] text-[#292923]"
        >
          TALA
        </Link>

        <Link
          href="/cart"
          aria-label="Shopping bag"
          className="text-[#292923] transition hover:text-[#59633D]"
        >
          <ShoppingBag size={21} strokeWidth={1.3} />
        </Link>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-5 py-5 text-[9px] uppercase tracking-[0.15em] text-[#625B50] sm:px-10">
        <Link href="/" className="transition hover:text-[#292923]">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href="/collections"
          className="transition hover:text-[#292923]"
        >
          Collections
        </Link>
        <ChevronRight size={12} />
        <span className="max-w-[150px] truncate text-[#292923]">
          {product.name}
        </span>
      </div>

      {/* Product section */}
      <section className="mx-auto max-w-[1500px] px-5 pb-20 sm:px-10 sm:pb-28">
        <div className="grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          {/* Gallery */}
          <div className="min-w-0">
            <div
              className="group relative overflow-hidden bg-[#A99A88]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {currentImage ? (
                <button
                  type="button"
                  onClick={openGallery}
                  aria-label="Open full-screen product gallery"
                  className="relative block w-full cursor-zoom-in text-left"
                >
                  <img
                    key={currentImage}
                    src={currentImage}
                    alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ""}`}
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                  />

                  <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#D8ED83] text-[#292923] shadow-sm transition group-hover:bg-[#292923] group-hover:text-[#D8ED83]">
                    <ZoomIn size={17} strokeWidth={1.4} />
                  </span>
                </button>
              ) : (
                <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 bg-[#A99A88] text-[#292923]/60">
                  <ImageIcon size={28} strokeWidth={1} />
                  <span className="text-[9px] uppercase tracking-[0.2em]">
                    Image coming soon
                  </span>
                  <span className="font-serif text-3xl tracking-[0.2em]">
                    TALA
                  </span>
                </div>
              )}

              <div className="pointer-events-none absolute bottom-5 left-5 text-[8px] font-semibold uppercase tracking-[0.25em] text-white drop-shadow">
                TALA — LUXURY FASHION
              </div>

              {selectedColor && (
                <div className="absolute right-5 top-5 rounded-full border border-white/40 bg-[#292923]/75 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-[#F0E7D9] backdrop-blur-sm">
                  {selectedColor}
                </div>
              )}

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label="Previous product image"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#292923]/80 text-[#D8ED83] opacity-100 transition hover:bg-[#D8ED83] hover:text-[#292923] sm:left-5 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ArrowLeft size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Next product image"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#292923]/80 text-[#D8ED83] opacity-100 transition hover:bg-[#D8ED83] hover:text-[#292923] sm:right-5 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ArrowRight size={17} />
                  </button>

                  <div className="absolute bottom-5 right-16 rounded-full bg-[#292923]/75 px-3 py-1.5 text-[9px] tracking-[0.15em] text-white">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {galleryImages.map((image, index) => {
                  const isActive = currentImage === image;

                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={isActive}
                      className="relative overflow-hidden border transition duration-300"
                      style={{
                        borderColor: isActive
                          ? THEME.ink
                          : "transparent",
                        opacity: isActive ? 1 : 0.65,
                      }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-105"
                      />
                      {isActive && (
                        <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#D8ED83]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.16em] text-[#625B50]">
              <span>
                {galleryImages.length > 0
                  ? `${galleryImages.length} product view${galleryImages.length === 1 ? "" : "s"}`
                  : "Product photography"}
              </span>

              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={openGallery}
                  className="flex items-center gap-2 transition hover:text-[#292923]"
                >
                  <ZoomIn size={13} />
                  View gallery
                </button>
              )}
            </div>
          </div>

          {/* Product information */}
          <div className="lg:sticky lg:top-10">
            <div className="border-b border-[#292923]/25 pb-7">
              <p className="mb-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.35em] text-[#59633D]">
                <span className="h-px w-7 bg-[#59633D]" />
                TALA LUXURY FASHION
              </p>

              <h1 className="font-serif text-3xl font-normal leading-tight tracking-[-0.035em] text-[#292923] sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-lg font-semibold tracking-wide text-[#292923]">
                  {formatPrice(currentPrice)}
                </span>

                {product.compare_at_price &&
                  product.compare_at_price > currentPrice && (
                    <span className="text-sm text-[#625B50] line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
              </div>

              {product.description && (
                <p className="mt-7 whitespace-pre-line text-sm leading-8 text-[#514A40]">
                  {product.description}
                </p>
              )}
            </div>

            {productUnavailable ? (
              <div className="mt-8 border border-[#292923]/25 bg-[#A99A88] p-5 text-sm text-[#292923]">
                This product is currently unavailable.
              </div>
            ) : (
              <>
                {/* Color */}
                {colors.length > 0 && (
                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Select Color
                      </h2>
                      <span className="text-xs text-[#59633D]">
                        {selectedVariant?.color ?? ""}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => {
                        const matching = activeVariants.filter(
                          (variant) => variant.color === color
                        );

                        const relevant = matching.filter(
                          (variant) =>
                            !selectedVariant?.size ||
                            variant.size === selectedVariant.size
                        );

                        const options =
                          relevant.length > 0 ? relevant : matching;

                        const soldOut = !options.some(
                          (variant) =>
                            Number(variant.stock_quantity) > 0
                        );

                        const colorCode =
                          matching.find((variant) => variant.color_code)
                            ?.color_code ?? "#D5CEC5";

                        const selected =
                          selectedVariant?.color === color;

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => chooseColor(color)}
                            aria-label={`Select ${color}`}
                            aria-pressed={selected}
                            className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition-all duration-300"
                            style={{
                              borderColor: selected
                                ? THEME.ink
                                : "rgba(41,39,35,0.25)",
                              backgroundColor: selected
                                ? "#D8ED83"
                                : "#A99A88",
                              color: THEME.ink,
                            }}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-black/20"
                              style={{ backgroundColor: colorCode }}
                            />
                            <span>{color}</span>
                            {soldOut && (
                              <span className="text-[9px] text-[#783F35]">
                                Sold out
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size */}
                {sizes.length > 0 && (
                  <div className="mt-9">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Select Size
                      </h2>
                      <span className="text-[9px] uppercase tracking-[0.12em] text-[#625B50]">
                        Choose your fit
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => {
                        const matching = activeVariants.filter(
                          (variant) => variant.size === size
                        );

                        const matchingColor = matching.filter(
                          (variant) =>
                            variant.color === selectedVariant?.color
                        );

                        const relevant =
                          matchingColor.length > 0
                            ? matchingColor
                            : matching;

                        const soldOut = !relevant.some(
                          (variant) =>
                            Number(variant.stock_quantity) > 0
                        );

                        const selected = selectedVariant?.size === size;

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => chooseSize(size)}
                            aria-pressed={selected}
                            className="relative min-w-[58px] border px-4 py-3 text-[11px] font-semibold tracking-wide transition-all duration-300"
                            style={{
                              borderColor: selected
                                ? THEME.ink
                                : "rgba(41,39,35,0.3)",
                              backgroundColor: selected
                                ? THEME.ink
                                : "#A99A88",
                              color: selected
                                ? THEME.lime
                                : THEME.ink,
                              opacity: soldOut ? 0.55 : 1,
                            }}
                          >
                            <span
                              className={soldOut ? "line-through" : ""}
                            >
                              {size}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock */}
                <div className="mt-7 min-h-5">
                  {selectedOptionUnavailable ? (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#783F35]">
                      This option is currently sold out
                    </p>
                  ) : (
                    <p className="flex items-center gap-2 text-[10px] tracking-wide text-[#59633D]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#59633D]" />
                      Available for purchase
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="mt-5">
                  <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Quantity
                  </h2>

                  <div className="flex h-12 w-[145px] items-center justify-between border border-[#292923]/30 bg-[#A99A88]">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                      onClick={() =>
                        setQuantity((current) =>
                          Math.max(1, current - 1)
                        )
                      }
                      className="flex h-full w-11 items-center justify-center text-[#292923] transition hover:bg-[#D8ED83] disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-xs font-semibold tabular-nums">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={
                        selectedOptionUnavailable ||
                        quantity >= availableStock ||
                        quantity >= 10
                      }
                      onClick={() =>
                        setQuantity((current) =>
                          Math.min(availableStock, 10, current + 1)
                        )
                      }
                      className="flex h-full w-11 items-center justify-center text-[#292923] transition hover:bg-[#D8ED83] disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Add to bag */}
                <button
                  type="button"
                  onClick={addProductToCart}
                  disabled={selectedOptionUnavailable}
                  className="mt-8 flex min-h-[58px] w-full items-center justify-center gap-3 bg-[#292923] px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#D8ED83] transition-all duration-300 hover:bg-[#D8ED83] hover:text-[#292923] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {selectedOptionUnavailable ? (
                    "Sold Out"
                  ) : isAdded ? (
                    <>
                      <Check size={17} />
                      Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} strokeWidth={1.4} />
                      Add to Bag
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                {message && (
                  <p
                    className={`mt-4 text-center text-xs ${
                      message.includes("unavailable") ||
                      message.includes("sold out") ||
                      message.includes("Only")
                        ? "text-[#783F35]"
                        : "text-[#465638]"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {message}
                  </p>
                )}
              </>
            )}

            {/* Details */}
            <div className="mt-9 border-t border-[#292923]/25">
              <div className="flex items-center justify-between border-b border-[#292923]/20 py-5">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#514A40]">
                  TALA Quality
                </span>
                <span className="font-serif text-sm text-[#59633D]">
                  Thoughtfully selected
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#292923]/20 py-5">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#514A40]">
                  Payment
                </span>
                <span className="text-[10px] text-[#514A40]">
                  Cash on Delivery
                </span>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#514A40]">
                  Need assistance?
                </span>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-[10px] text-[#514A40] transition hover:text-[#292923]"
                >
                  Contact TALA
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <Link
              href="/collections"
              className="mt-7 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#625B50] transition hover:text-[#292923]"
            >
              <ArrowLeft size={14} />
              Continue exploring
            </Link>
          </div>
        </div>
      </section>

      {/* Full screen gallery */}
      {isGalleryOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#171714]/[0.98] text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Product image gallery"
        >
          <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-8">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#D8ED83]">
                TALA — PRODUCT GALLERY
              </p>
              <p className="mt-1 max-w-[200px] truncate text-xs tracking-wide text-white/90">
                {product.name}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <span className="text-[10px] tracking-[0.2em] text-white/60">
                {currentImageIndex + 1} / {galleryImages.length}
              </span>
              <button
                type="button"
                onClick={closeGallery}
                aria-label="Close gallery"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10"
              >
                <X size={19} strokeWidth={1.4} />
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-5 sm:px-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Previous image"
              className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/15 sm:left-7 sm:h-14 sm:w-14"
            >
              <ArrowLeft size={20} strokeWidth={1.3} />
            </button>

            <img
              key={`lightbox-${currentImage}`}
              src={currentImage}
              alt={`${product.name} image ${currentImageIndex + 1}`}
              className="max-h-full max-w-full select-none object-contain"
              draggable={false}
            />

            <button
              type="button"
              onClick={showNextImage}
              aria-label="Next image"
              className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/15 sm:right-7 sm:h-14 sm:w-14"
            >
              <ArrowRight size={20} strokeWidth={1.3} />
            </button>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-4">
            {galleryImages.map((image, index) => {
              const isActive = currentImage === image;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Open image ${index + 1}`}
                  aria-pressed={isActive}
                  className="h-[58px] w-[46px] shrink-0 overflow-hidden border transition sm:h-[72px] sm:w-[56px]"
                  style={{
                    borderColor: isActive
                      ? THEME.lime
                      : "rgba(255,255,255,0.12)",
                    opacity: isActive ? 1 : 0.45,
                  }}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          <p className="pb-4 text-center text-[8px] uppercase tracking-[0.2em] text-white/35">
            Swipe to explore · Press ESC to close
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#292923]/25 bg-[#A99A88] px-5 py-10 text-center">
        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.38em] text-[#292923]"
        >
          TALA
        </Link>

        <p className="mt-3 text-[9px] font-semibold tracking-[0.28em] text-[#625B50]">
          TALA LUXURY FASHION
        </p>

        <div className="mx-auto mt-7 h-px max-w-5xl bg-[#292923]/20" />

        <Link
          href="/collections"
          className="mt-6 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#514A40] transition hover:text-[#292923]"
        >
          Discover more pieces
          <ArrowRight size={13} />
        </Link>
      </footer>
    </main>
  );
}
