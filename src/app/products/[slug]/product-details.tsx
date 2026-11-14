"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
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
    useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setSelectedVariant(
      availableVariants[0] ?? activeVariants[0] ?? null
    );
    setSelectedImage("");
    setQuantity(1);
    setMessage("");
    setIsAdded(false);
  }, [product.id, variants, images, product.main_image, availableVariants, activeVariants]);

  useEffect(() => {
    if (!isAdded) return;

    const timeout = window.setTimeout(() => {
      setIsAdded(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [isAdded]);

  const currentImage =
    selectedImage ||
    selectedVariant?.image_url ||
    images[0] ||
    product.main_image ||
    "";

  const currentPrice =
    selectedVariant?.price_override ?? product.price;

  const availableStock = Math.max(
    0,
    Number(selectedVariant?.stock_quantity ?? 0)
  );

  const selectedSizeIsSoldOut =
    Boolean(selectedVariant) && availableStock <= 0;

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
      options.find((variant) => variant.stock_quantity > 0) ??
      options[0] ??
      null;

    setSelectedVariant(nextVariant);
    setSelectedImage("");
    setQuantity(1);
    setMessage(
      nextVariant && nextVariant.stock_quantity <= 0
        ? "✕ SOLD OUT — This size is currently unavailable."
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
        : activeVariants.filter((variant) => variant.color === color);

    const nextVariant =
      options.find((variant) => variant.stock_quantity > 0) ??
      options[0] ??
      null;

    setSelectedVariant(nextVariant);
    setSelectedImage("");
    setQuantity(1);
    setMessage(
      nextVariant && nextVariant.stock_quantity <= 0
        ? "✕ SOLD OUT — This color and size are currently unavailable."
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

    if (selectedVariant.stock_quantity <= 0) {
      setMessage("✕ SOLD OUT — Please choose another available option.");
      return;
    }

    if (quantity > selectedVariant.stock_quantity) {
      setMessage(
        `Only ${selectedVariant.stock_quantity} item(s) are available.`
      );
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
    setMessage("Added to bag successfully.");
  }

  const productUnavailable = activeVariants.length === 0;
  const selectedOptionUnavailable =
    !selectedVariant || selectedVariant.stock_quantity <= 0;

  return (
    <main className="min-h-screen bg-[#F4F0E9] px-5 py-12 text-[#29251F]">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div>
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-[#E9E1D6]">
              No image available
            </div>
          )}

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={currentImage === image}
                  className={`shrink-0 rounded-lg border ${
                    selectedImage === image
                      ? "border-[#75604C]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-16 rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="py-5">
          <p className="mb-3 text-xs tracking-[0.3em] text-[#A68B70]">
            TALA COLLECTION
          </p>

          <h1 className="text-3xl font-light tracking-wide">
            {product.name}
          </h1>

          <div className="mt-5 flex items-center gap-4">
            <span className="text-2xl">
              EGP {currentPrice.toLocaleString("en-EG")}
            </span>

            {product.compare_at_price &&
              product.compare_at_price > currentPrice && (
                <span className="text-sm text-gray-500 line-through">
                  EGP {product.compare_at_price.toLocaleString("en-EG")}
                </span>
              )}
          </div>

          {product.description && (
            <p className="mt-7 whitespace-pre-line leading-8 text-[#75604C]">
              {product.description}
            </p>
          )}

          {productUnavailable ? (
            <p className="mt-8 border border-[#D9C9B9] bg-white/50 p-4 text-sm text-[#8A3E2D]">
              This product is currently unavailable.
            </p>
          ) : (
            <>
              {sizes.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-sm">Select Size</h2>

                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => {
                      const matching = activeVariants.filter(
                        (variant) => variant.size === size
                      );
                      const matchingColor =
                        matching.filter(
                          (variant) =>
                            variant.color === selectedVariant?.color
                        );
                      const relevant =
                        matchingColor.length > 0 ? matchingColor : matching;
                      const soldOut = !relevant.some(
                        (variant) => variant.stock_quantity > 0
                      );
                      const selected = selectedVariant?.size === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => chooseSize(size)}
                          aria-pressed={selected}
                          className={`relative min-w-16 rounded-lg border px-5 py-3 text-sm transition ${
                            selected
                              ? "border-[#75604C] bg-[#75604C] text-white"
                              : soldOut
                                ? "border-[#D8BFB5] bg-[#F1E8E3] text-[#9A6B60]"
                                : "border-[#CFC2B3] bg-white/40"
                          }`}
                        >
                          {soldOut && (
                            <span className="mr-1 font-semibold">✕</span>
                          )}
                          <span className={soldOut ? "line-through" : ""}>
                            {size}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {colors.length > 0 && (
                <div className="mt-7">
                  <h2 className="mb-3 text-sm">Select Color</h2>

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
                        (variant) => variant.stock_quantity > 0
                      );

                      const colorCode =
                        matching.find((variant) => variant.color_code)
                          ?.color_code;

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => chooseColor(color)}
                          aria-pressed={selectedVariant?.color === color}
                          className={`rounded-lg border px-4 py-3 text-sm ${
                            selectedVariant?.color === color
                              ? "border-[#75604C] bg-[#75604C] text-white"
                              : "border-[#CFC2B3] bg-white/40"
                          }`}
                        >
                          {soldOut ? "✕ " : ""}
                          {color}
                          {colorCode && (
                            <span
                              className="ml-2 inline-block h-3 w-3 rounded-full border border-black/10"
                              style={{ backgroundColor: colorCode }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedSizeIsSoldOut && (
                <p className="mt-5 text-sm font-medium tracking-wide text-[#9A5145]">
                  ✕ SOLD OUT
                </p>
              )}

              {selectedVariant && availableStock > 0 && (
                <p className="mt-4 text-xs text-[#88745F]">
                  {availableStock} available
                </p>
              )}

              <div className="mt-8">
                <h2 className="mb-3 text-sm">Quantity</h2>

                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="h-10 w-10 rounded-lg border disabled:opacity-40"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
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
                    className="h-10 w-10 rounded-lg border disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={addProductToCart}
                disabled={selectedOptionUnavailable}
                className={`mt-9 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm tracking-[0.2em] text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isAdded
                    ? "bg-[#71836B]"
                    : "bg-[#29251F] hover:bg-[#75604C]"
                }`}
              >
                {selectedOptionUnavailable ? (
                  "SOLD OUT"
                ) : isAdded ? (
                  <>
                    <Check size={19} strokeWidth={2.5} />
                    ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    ADD TO BAG
                  </>
                )}
              </button>
            </>
          )}

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.includes("SOLD OUT")
                  ? "text-[#9A5145]"
                  : "text-[#75604C]"
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
