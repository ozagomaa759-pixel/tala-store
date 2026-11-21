
import type { Product, ProductVariantStock } from "@/data/products";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  main_image: string | null;
  images: unknown;
  category_id: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
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

function normalizeCategory(
  categoryName: string | undefined
): Product["category"] | null {
  const normalized = categoryName?.trim().toLowerCase();

  if (normalized === "sets" || normalized === "set") {
    return "Sets";
  }

  if (normalized === "jackets" || normalized === "jacket") {
    return "Jackets";
  }

  return null;
}

function normalizeImages(
  mainImage: string | null,
  images: unknown
): string[] {
  const imageList = Array.isArray(images) ? images : [];

  const allImages = [
    mainImage,
    ...imageList,
  ]
    .filter(
      (image): image is string =>
        typeof image === "string" &&
        image.trim().length > 0
    )
    .map((image) => image.trim());

  return [...new Set(allImages)];
}

function normalizePrice(
  value: number | string | null
): number {
  const price = Number(value ?? 0);

  return Number.isFinite(price) && price >= 0
    ? price
    : 0;
}

function normalizeStock(value: unknown): number {
  const stock = Number(value ?? 0);

  return Number.isFinite(stock)
    ? Math.max(0, Math.floor(stock))
    : 0;
}

function normalizeVariant(
  variant: VariantRow
): ProductVariantStock {
  return {
    id: variant.id,
    size: variant.size ?? "",
    color: variant.color ?? "Default",
    color_code: variant.color_code ?? null,
    stock_quantity: normalizeStock(variant.stock_quantity),
    price_override:
      variant.price_override == null
        ? null
        : normalizePrice(variant.price_override),
    is_active: variant.is_active !== false,
  };
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

  const products = Array.isArray(result.products)
    ? result.products
    : [];

  const categories = Array.isArray(result.categories)
    ? result.categories
    : [];

  const variants = Array.isArray(result.variants)
    ? result.variants
    : [];

  const categoryMap = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ])
  );

  const variantsByProduct = new Map<
    string,
    ProductVariantStock[]
  >();

  for (const variant of variants) {
    if (variant.is_active === false) continue;

    const current =
      variantsByProduct.get(variant.product_id) ?? [];

    current.push(normalizeVariant(variant));

    variantsByProduct.set(
      variant.product_id,
      current
    );
  }

  return products.flatMap((product): Product[] => {
    const categoryName = categoryMap.get(product.category_id);
    const category = normalizeCategory(categoryName);

    if (!category) {
      console.warn(
        `TALA: Product "${product.name}" skipped because its category is not Sets or Jackets.`
      );

      return [];
    }

    const productVariants =
      variantsByProduct.get(product.id) ?? [];

    const availableVariants = productVariants.filter(
      (variant) => variant.stock_quantity > 0
    );

    const images = normalizeImages(
      product.main_image,
      product.images
    );

    const sizes = [
      ...new Set(
        productVariants
          .map((variant) => variant.size.trim())
          .filter(Boolean)
      ),
    ];

    const colors = [
      ...new Map(
        productVariants
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

    const price = normalizePrice(product.price);

    const oldPrice =
      product.compare_at_price == null
        ? undefined
        : normalizePrice(product.compare_at_price);

    return [
      {
        id: product.id,
        slug: product.slug,
        variants: productVariants,

        name: product.name,
        subtitle: "",
        description: product.description ?? "",

        price,
        oldPrice,

        category,

        image: images[0] ?? "",
        images,

        colors,
        sizes,

        rating: 0,
        reviews: 0,

        isNew: Boolean(product.is_new_arrival),
        isBestSeller: Boolean(product.is_best_seller),
        isFeatured: Boolean(product.is_featured),

        // المنتج يظل ظاهرًا حتى لو نفد المخزون.
        // لكن لا يمكن شراؤه دون متغير متاح ومخزون فعلي.
        isAvailable: availableVariants.length > 0,

        tags: [],
      },
    ];
  });
}
