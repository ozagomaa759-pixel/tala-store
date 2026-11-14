
import { createClient } from "@/lib/supabase/browser";
import type { Product } from "@/data/products";

type ProductRow = {
  id: string;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  main_image?: string | null;
  images?: string[] | null;
  category_id?: string | null;
  is_new?: boolean | null;
  is_best_seller?: boolean | null;
  is_featured?: boolean | null;
  is_available?: boolean | null;
  tags?: string[] | null;
  sort_order?: number | null;
};

type CategoryRow = {
  id: string;
  name: string;
};

type VariantRow = {
  product_id: string;
  size?: string | null;
  color?: string | null;
  color_code?: string | null;
  stock_quantity?: number | null;
  is_active?: boolean | null;
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
  const supabase = createClient();

  const [
    { data: productsData, error: productsError },
    { data: categoriesData, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),

    supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true),
  ]);

  if (productsError) {
    console.error("TALA products loading error:", productsError);
    throw new Error("تعذر تحميل منتجات TALA. حاول تحديث الصفحة.");
  }

  if (categoriesError) {
    console.error("TALA categories loading error:", categoriesError);
    throw new Error("تعذر تحميل تصنيفات TALA. حاول تحديث الصفحة.");
  }

  const products = (productsData ?? []) as unknown as ProductRow[];
  const categories = (categoriesData ?? []) as unknown as CategoryRow[];

  if (products.length === 0) {
    return [];
  }

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name])
  );

  const productIds = products.map((product) => product.id);

  // Variants are optional. A product must remain visible even
  // when it has no sizes, colors, or inventory records.
  const { data: variantsData, error: variantsError } =
    await supabase
      .from("product_variants")
      .select(
        "product_id, size, color, color_code, stock_quantity, is_active"
      )
      .in("product_id", productIds)
      .eq("is_active", true);

  if (variantsError) {
    console.error("TALA variants loading error:", variantsError);
  }

  const variants = (
    variantsError ? [] : variantsData ?? []
  ) as unknown as VariantRow[];

  const variantsByProduct = new Map<string, VariantRow[]>();

  for (const variant of variants) {
    const current = variantsByProduct.get(variant.product_id) ?? [];
    current.push(variant);
    variantsByProduct.set(variant.product_id, current);
  }

  return products.map((product): Product => {
    const productVariants = variantsByProduct.get(product.id) ?? [];
    const images = normalizeImages(product.main_image, product.images);
    const firstImage = images[0] ?? PLACEHOLDER_IMAGE;

    const availableVariants = productVariants.filter(
      (variant) => Number(variant.stock_quantity ?? 0) > 0
    );

    const uniqueSizes = [
      ...new Set(
        availableVariants
          .map((variant) => variant.size?.trim())
          .filter((size): size is string => Boolean(size))
      ),
    ];

    const uniqueColors = [
      ...new Map(
        availableVariants
          .filter((variant) => variant.color?.trim())
          .map((variant) => [
            variant.color!.trim(),
            {
              name: variant.color!.trim(),
              value: variant.color_code || "#D8C8B8",
            },
          ])
      ).values(),
    ];

    return {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle ?? "",
      description: product.description ?? "",
      price: Number(product.price) || 0,
      oldPrice: product.compare_at_price
        ? Number(product.compare_at_price)
        : undefined,
      category: normalizeCategory(
        categoryMap.get(product.category_id ?? "")
      ),
      image: firstImage,
      images,
      colors: uniqueColors,
      sizes: uniqueSizes,
      rating: 5,
      reviews: 0,
      isNew: Boolean(product.is_new),
      isBestSeller: Boolean(product.is_best_seller),
      isFeatured: Boolean(product.is_featured),
      isAvailable:
        product.is_available !== false &&
        availableVariants.length > 0,
      tags: product.tags ?? [],
    };
  });
}
