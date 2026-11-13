
"use client";

import { useState } from "react";
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

  const sizes = Array.from(
    new Set(variants.map((v) => v.size).filter(Boolean))
  );

  const colors = Array.from(
    new Set(variants.map((v) => v.color).filter(Boolean))
  );

  const currentImage =
    selectedVariant?.image_url ||
    images[0] ||
    "";

  const currentPrice =
    selectedVariant?.price_override ?? product.price;

  function addToCart() {
    if (variants.length > 0 && !selectedVariant) {
      setMessage("Please select a size and color.");
      return;
    }

    if (
      selectedVariant &&
      quantity > selectedVariant.stock_quantity
    ) {
      setMessage("Not enough stock available.");
      return;
    }

    addToTalaCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: currentImage,
      size: selectedVariant?.size ?? undefined,
      color: selectedVariant?.color ?? undefined,
    });

    setMessage("Added to cart successfully.");
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
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${product.name} ${index + 1}`}
                onClick={() => {
                  setSelectedVariant(null);
                }}
                className="h-20 w-16 rounded-lg object-cover"
              />
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
                    onClick={() => {
                      setSelectedVariant((old) => {
                        const match = variants.find(
                          (v) =>
                            v.size === size &&
                            v.color === old?.color
                        );
                        return match ?? variants.find(
                          (v) => v.size === size
                        ) ?? null;
                      });
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
                  const variant = variants.find(
                    (v) =>
                      v.color === color &&
                      (!selectedVariant?.size ||
                        v.size === selectedVariant.size)
                  );

                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedVariant((old) => {
                          const match = variants.find(
                            (v) =>
                              v.color === color &&
                              (!old?.size || v.size === old.size)
                          );
                          return match ?? variants.find(
                            (v) => v.color === color
                          ) ?? null;
                        });
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
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-lg border"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(
                      selectedVariant?.stock_quantity ?? 99,
                      q + 1
                    )
                  )
                }
                className="h-10 w-10 rounded-lg border"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={addToCart}
            className="mt-9 w-full rounded-xl bg-[#29251F] px-6 py-4 text-sm tracking-[0.2em] text-white transition hover:bg-[#75604C]"
          >
            ADD TO BAG
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
