
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
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

type ColorTheme = {
  page: string;
  accent: string;
  button: string;
  buttonText: string;
  border: string;
};

function getColorTheme(color: string | null | undefined): ColorTheme {
  const value = (color ?? "").toLowerCase();

  if (value.includes("black")) {
    return {
      page: "#F1F0ED",
      accent: "#373633",
      button: "#292825",
      buttonText: "#FFFFFF",
      border: "#C8C5BE",
    };
  }

  if (value.includes("mint") || value.includes("sage") || value.includes("green")) {
    return {
      page: "#F1F4EF",
      accent: "#758A72",
      button: "#657B62",
      buttonText: "#FFFFFF",
      border: "#C8D3C4",
    };
  }

  if (value.includes("pink") || value.includes("blush") || value.includes("rose")) {
    return {
      page: "#F7F0EF",
      accent: "#B7837D",
      button: "#A97570",
      buttonText: "#FFFFFF",
      border: "#E2C9C5",
    };
  }

  if (value.includes("beige") || value.includes("cream") || value.includes("ivory")) {
    return {
      page: "#F6F2EB",
      accent: "#A58B68",
      button: "#8E7658",
      buttonText: "#FFFFFF",
      border: "#E2D8C9",
    };
  }

  if (value.includes("white")) {
    return {
      page: "#F7F7F5",
      accent: "#8A8982",
      button: "#55544F",
      buttonText: "#FFFFFF",
      border: "#DADAD5",
    };
  }

  if (value.includes("brown") || value.includes("chocolate") || value.includes("camel")) {
    return {
      page: "#F4F0EB",
      accent: "#92745D",
      button: "#765B46",
      buttonText: "#FFFFFF",
      border: "#DCCFC2",
    };
  }

  return {
    page: "#FAF8F5",
    accent: "#A58B68",
    button: "#292521",
    buttonText: "#FFFFFF",
    border: "#E5DDD2",
  };
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

  const colorTheme = useMemo(
    () => getColorTheme(selectedColor),
    [selectedColor]
  );

  const selectedColorImages = useMemo(
    () =>
      activeVariants
        .filter(
          (variant) =>
            variant.color === selectedColor &&
            typeof variant.image_url === "string" &&
            variant.image_url.trim().length > 0
        )
        .map((variant) => variant.image_url as string),
    [activeVariants, selectedColor]
  );

  const galleryImages = useMemo(
    () =>
      Array.from(
        new Set([
          ...selectedColorImages,
          ...images,
        ])
      ),
    [selectedColorImages, images]
  );

  const currentImage =
    selectedImage ||
    selectedVariant?.image_url ||
    selectedColorImages[0] ||
    images[0] ||
    "";

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
      nextVariant?.image_url ??
      (nextVariant?.color === selectedColor
        ? selectedColorImages[0]
        : "") ??
      images[0] ??
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
      nextVariant?.image_url ??
      activeVariants.find(
        (variant) =>
          variant.color === color && variant.image_url
      )?.image_url ??
      images[0] ??
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

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(price);
  }

  return (
    <main
      className="min-h-screen text-[#302A24] transition-colors duration-700"
      style={{ backgroundColor: colorTheme.page }}
    >
      {/* Announcement */}
      <div className="bg-[#292521] px-4 py-2.5 text-center text-[9px] tracking-[0.25em] text-white">
        TALA LUXURY FASHION — A NEW WAY TO FEEL ELEGANT
      </div>

      {/* Header */}
      <header className="relative flex h-[76px] items-center justify-between border-b border-[#EAE4DC] px-5 transition-colors duration-500 sm:px-10">
        <Link
          href="/collections"
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#81766B] transition hover:text-[#292521]"
        >
          <ArrowLeft size={15} strokeWidth={1.3} />
          Collections
        </Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-2xl font-light tracking-[0.4em]"
        >
          TALA
        </Link>

        <Link
          href="/cart"
          aria-label="Shopping bag"
          className="relative"
        >
          <ShoppingBag size={21} strokeWidth={1.3} />
        </Link>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-5 py-5 text-[9px] uppercase tracking-[0.15em] text-[#9B9084] sm:px-10">
        <Link href="/" className="transition hover:text-[#302A24]">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href="/collections"
          className="transition hover:text-[#302A24]"
        >
          Collections
        </Link>
        <ChevronRight size={12} />
        <span className="max-w-[150px] truncate text-[#5D5146]">
          {product.name}
        </span>
      </div>

      {/* Product */}
      <section className="mx-auto max-w-[1500px] px-5 pb-20 transition-colors duration-700 sm:px-10 sm:pb-28">
        <div className="grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          {/* Gallery */}
          <div className="min-w-0">
            <div className="relative overflow-hidden bg-[#EEE9E2]">
              {currentImage ? (
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ""}`}
                  className="aspect-[4/5] w-full object-cover transition-opacity duration-700"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-sm text-[#897D70]">
                  Image coming soon
                </div>
              )}

              <div className="pointer-events-none absolute bottom-5 left-5 text-[8px] uppercase tracking-[0.25em] text-white drop-shadow">
                TALA — LUXURY FASHION
              </div>

              {selectedColor && (
                <div className="absolute right-5 top-5 rounded-full border border-white/50 bg-white/75 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-[#403A33] backdrop-blur-sm">
                  {selectedColor}
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={currentImage === image}
                    className={`relative overflow-hidden border transition duration-300 ${
                      currentImage === image
                        ? "opacity-100"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                    style={{
                      borderColor:
                        currentImage === image
                          ? colorTheme.accent
                          : "transparent",
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="lg:sticky lg:top-10">
            <div className="border-b border-[#E5DDD2] pb-7">
              <p
                className="mb-5 text-[9px] uppercase tracking-[0.35em] transition-colors duration-500"
                style={{ color: colorTheme.accent }}
              >
                TALA LUXURY FASHION
              </p>

              <h1 className="font-serif text-3xl font-light leading-tight tracking-wide sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-lg tracking-wide">
                  {formatPrice(currentPrice)}
                </span>

                {product.compare_at_price &&
                  product.compare_at_price > currentPrice && (
                    <span className="text-sm text-[#A69A90] line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
              </div>

              {product.description && (
                <p className="mt-7 whitespace-pre-line text-sm leading-8 text-[#81766B]">
                  {product.description}
                </p>
              )}
            </div>

            {productUnavailable ? (
              <div className="mt-8 border border-[#DED2C5] bg-white/50 p-5 text-sm text-[#8A5145]">
                This product is currently unavailable.
              </div>
            ) : (
              <>
                {/* Color */}
                {colors.length > 0 && (
                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-[10px] uppercase tracking-[0.2em]">
                        Select Color
                      </h2>
                      <span
                        className="text-xs transition-colors duration-500"
                        style={{ color: colorTheme.accent }}
                      >
                        {selectedVariant?.color ?? ""}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
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
                            className="group flex items-center gap-2 rounded-full border bg-white/40 px-3 py-2 text-xs transition-all duration-300 hover:bg-white/80"
                            style={{
                              borderColor: selected
                                ? colorTheme.accent
                                : "#E5DDD2",
                            }}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-black/10"
                              style={{ backgroundColor: colorCode }}
                            />
                            <span className="text-[#62584E]">
                              {color}
                            </span>
                            {soldOut && (
                              <span className="text-[9px] text-[#A66C60]">
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
                      <h2 className="text-[10px] uppercase tracking-[0.2em]">
                        Select Size
                      </h2>
                      <span
                        className="text-[10px] uppercase tracking-[0.12em] transition-colors duration-500"
                        style={{ color: colorTheme.accent }}
                      >
                        Size selection
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
                            className={`relative min-w-[58px] border px-4 py-3 text-[11px] tracking-wide transition-all duration-300 ${
                              selected
                                ? "text-white"
                                : soldOut
                                  ? "bg-[#F1EAE5] text-[#A58B80]"
                                  : "bg-white/50 text-[#51473D] hover:bg-white"
                            }`}
                            style={{
                              borderColor: selected
                                ? colorTheme.button
                                : colorTheme.border,
                              backgroundColor: selected
                                ? colorTheme.button
                                : undefined,
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
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#A45E51]">
                      This option is currently sold out
                    </p>
                  ) : (
                    <p className="text-[10px] tracking-wide text-[#81766B]">
                      Available for purchase
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="mt-5">
                  <h2 className="mb-4 text-[10px] uppercase tracking-[0.2em]">
                    Quantity
                  </h2>

                  <div className="flex h-12 w-[145px] items-center justify-between border bg-white/50 transition-colors duration-500"
                    style={{ borderColor: colorTheme.border }}
                  >
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                      onClick={() =>
                        setQuantity((current) =>
                          Math.max(1, current - 1)
                        )
                      }
                      className="flex h-full w-11 items-center justify-center text-[#75685B] transition hover:bg-[#EEE8DF] disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-xs tabular-nums">
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
                      className="flex h-full w-11 items-center justify-center text-[#75685B] transition hover:bg-[#EEE8DF] disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={addProductToCart}
                  disabled={selectedOptionUnavailable}
                  className="mt-8 flex min-h-[56px] w-full items-center justify-center gap-3 px-6 text-[10px] font-medium uppercase tracking-[0.25em] transition-all duration-500 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: isAdded
                      ? "#71836B"
                      : colorTheme.button,
                    color: colorTheme.buttonText,
                  }}
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
                        ? "text-[#A45E51]"
                        : "text-[#71836B]"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {message}
                  </p>
                )}
              </>
            )}

            {/* Additional information */}
            <div className="mt-9 border-t border-[#E5DDD2]">
              <div className="flex items-center justify-between border-b border-[#E5DDD2] py-5">
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#62584E]">
                  TALA Quality
                </span>
                <span className="font-serif text-sm text-[#A58B68]">
                  Thoughtfully selected
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E5DDD2] py-5">
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#62584E]">
                  Payment
                </span>
                <span className="text-[10px] text-[#81766B]">
                  Cash on Delivery
                </span>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#62584E]">
                  Need assistance?
                </span>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-[10px] text-[#81766B] transition hover:text-[#292521]"
                >
                  Contact TALA
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <Link
              href="/collections"
              className="mt-7 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-[#81766B] transition hover:text-[#292521]"
            >
              <ArrowLeft size={14} />
              Continue exploring
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5DDD2] px-5 py-10 text-center">
        <Link
          href="/"
          className="text-xl font-light tracking-[0.38em]"
        >
          TALA
        </Link>
        <p className="mt-4 text-[9px] tracking-[0.28em] text-[#A69A8D]">
          TALA LUXURY FASHION
        </p>
      </footer>
    </main>
  );
}
