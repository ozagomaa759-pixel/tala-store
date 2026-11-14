
"use client";

import { useEffect, useState } from "react";
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
  const [selectedVariant, setSelectedVariant] =
    useState<Variant | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) return;

    const timeout = window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [isAdded]);

  const activeVariants = variants.filter(
    (variant) =>
      variant.is_active && variant.stock_quantity > 0
  );

  const sizes = Array.from(
    new Set(
      activeVariants
        .map((variant) => variant.size)
        .filter((size): size is string => Boolean(size))
    )
  );

  const colors = Array.from(
    new Set(
      activeVariants
        .map((variant) => variant.color)
        .filter((color): color is string => Boolean(color))
    )
  );

  const currentImage =
    selectedVariant?.image_url ||
    images[0] ||
    product.main_image ||
    "";

  const currentPrice =
    selectedVariant?.price_override ?? product.price;

  const availableStock =
    selectedVariant?.stock_quantity ?? 0;

  function addProductToCart() {
    setMessage("");

    if (activeVariants.length === 0) {
      setMessage("This product is currently unavailable.");
      return;
    }

    if (!selectedVariant) {
      setMessage("Please select a size and color.");
      return;
    }

    if (quantity > selectedVariant.stock_quantity) {
      setMessage("Not enough stock available.");
      return;
    }

    addToTalaCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: currentImage,
      size: selectedVariant.size ?? "",
      color: selectedVariant.color ?? "",
    });

    setIsAdded(true);
    setMessage("Added to bag successfully.");
  }

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

          <div className="mt-4 flex gap-3 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedVariant(null)}
                className="shrink-0"
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="h-20 w-16 rounded-lg object-cover"
                />
              </button>
            ))}
          </div>
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

          {sizes.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm">Select Size</h2>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedVariant((old) => {
                        const match = activeVariants.find(
                          (variant) =>
                            variant.size === size &&
                            variant.color === old?.color
                        );

                        return (
                          match ??
                          activeVariants.find(
                            (variant) => variant.size === size
                          ) ??
                          null
                        );
                      });

                      setQuantity(1);
                      setMessage("");
                      setIsAdded(false);
                    }}
                    className={`rounded-lg border px-5 py-3 ${
                      selectedVariant?.size === size
                        ? "border-[#75604C] bg-[#75604C] text-white"
                        : "border-[#CFC2B3]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-7">
              <h2 className="mb-3 text-sm">Select Color</h2>

              <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                  const variant = activeVariants.find(
                    (item) =>
                      item.color === color &&
                      (!selectedVariant?.size ||
                        item.size === selectedVariant.size)
                  );

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedVariant((old) => {
                          const match = activeVariants.find(
                            (item) =>
                              item.color === color &&
                              (!old?.size || item.size === old.size)
                          );

                          return (
                            match ??
                            activeVariants.find(
                              (item) => item.color === color
                            ) ??
                            null
                          );
                        });

                        setQuantity(1);
                        setMessage("");
                        setIsAdded(false);
                      }}
                      className={`rounded-lg border px-4 py-3 ${
                        selectedVariant?.color === color
                          ? "border-[#75604C] bg-[#75604C] text-white"
                          : "border-[#CFC2B3]"
                      }`}
                    >
                      {color}

                      {variant?.color_code && (
                        <span
                          className="ml-2 inline-block h-3 w-3 rounded-full border"
                          style={{
                            backgroundColor: variant.color_code,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 text-sm">Quantity</h2>

            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                className="h-10 w-10 rounded-lg border"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                disabled={
                  !selectedVariant ||
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
            disabled={activeVariants.length === 0}
            className={`mt-9 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm tracking-[0.2em] text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              isAdded
                ? "bg-[#71836B]"
                : "bg-[#29251F] hover:bg-[#75604C]"
            }`}
          >
            {activeVariants.length === 0 ? (
              "CURRENTLY UNAVAILABLE"
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

          {message && (
            <p className="mt-4 text-center text-sm text-[#75604C]">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
