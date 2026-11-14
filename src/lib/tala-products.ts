import type { Product, ProductVariantStock } from "@/data/products";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  main_image?: string | null;
  images?: string[] | null;
  category_id?: string | null;
  is_new?: boolean | null;
  is_new_arrival?: boolean | null;
  is_best_seller?: boolean | null;
  is_featured?: boolean | null;
  is_available?: boolean | null;
  tags?: string[] | null;
};

type CategoryRow = {
  id: string;
  name: string;
};

type VariantRow = ProductVariantStock & {
  product_id: string;
};

type ProductsApiResponse = {
  success: boolean;
  message?: string;
  products?: ProductRow[];
  categories?: CategoryRow[];
  variants?: VariantRow[];
};

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x800/F5F0E8/332A23?text=TALA";

const ALLOWED_CATEGORIES = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Sets",
  "Jackets",
] as const;

function normalizeCategory(
  categoryName: string | undefined
): Product["category"] {
  const normalized = categoryName?.trim();

  if (
    normalized &&
    ALLOWED_CATEGORIES.includes(
      normalized as (typeof ALLOWED_CATEGORIES)[number]
    )
  ) {
    return normalized as Product["category"];
  }

  return "Sets";
}

function normalizeImages(
  mainImage: string | null | undefined,
  images: string[] | null | undefined
): string[] {
  const allImages = [
    mainImage,
    ...(Array.isArray(images) ? images : []),
  ].filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0
  );

  return [...new Set(allImages)];
}

export async function getTalaProducts(): Promise<Product[]> {
  const response = await fetch("/api/products", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Products API failed with status ${response.status}`
    );
  }

  const result =
    (await response.json()) as ProductsApiResponse;

  if (!result.success) {
    throw new Error(
      result.message || "Could not load TALA products."
    );
  }

  const products = result.products ?? [];
  const categories = result.categories ?? [];
  const variants = result.variants ?? [];

  const categoryMap = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ])
  );

  const variantsByProduct = new Map<string, ProductVariantStock[]>();

  for (const variant of variants) {
    if (variant.is_active === false) continue;

    const current =
      variantsByProduct.get(variant.product_id) ?? [];

    current.push({
      id: variant.id,
      size: variant.size ?? "",
      color: variant.color ?? "Default",
      color_code: variant.color_code ?? null,
      stock_quantity: Number(variant.stock_quantity ?? 0),
      price_override:
        variant.price_override == null
          ? null
          : Number(variant.price_override),
      is_active: true,
    });

    variantsByProduct.set(variant.product_id, current);
  }

  return products.map((product): Product => {
    const productVariants =
      variantsByProduct.get(product.id) ?? [];

    const availableVariants = productVariants.filter(
      (variant) => variant.stock_quantity > 0
    );

    const images = normalizeImages(
      product.main_image,
      product.images
    );

    const uniqueSizes = [
      ...new Set(
        availableVariants
          .map((variant) => variant.size.trim())
          .filter(Boolean)
      ),
    ];

    const uniqueColors = [
      ...new Map(
        availableVariants
          .filter((variant) => variant.color.trim())
          .map((variant) => [
            variant.color.trim(),
            {
              name: variant.color.trim(),
              value: variant.color_code || "#D8C8B8",
            },
          ])
      ).values(),
    ];

    return {
      id: product.id,
      slug: product.slug,
      variants: productVariants,
      name: product.name,
      subtitle: product.subtitle ?? "",
      description: product.description ?? "",
      price: Number(product.price) || 0,
      oldPrice:
        product.compare_at_price != null
          ? Number(product.compare_at_price)
          : undefined,
      category: normalizeCategory(
        categoryMap.get(product.category_id ?? "")
      ),
      image: images[0] ?? PLACEHOLDER_IMAGE,
      images,
      colors: uniqueColors,
      sizes: uniqueSizes,
      rating: 5,
      reviews: 0,
      isNew: Boolean(
        product.is_new ?? product.is_new_arrival
      ),
      isBestSeller: Boolean(product.is_best_seller),
      isFeatured: Boolean(product.is_featured),
      isAvailable: availableVariants.length > 0,
      tags: product.tags ?? [],
    };
  });
}
