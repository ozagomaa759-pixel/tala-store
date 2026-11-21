
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
  created_at?: string | null;
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

function normalizeCategory(
  categoryName: string | undefined
): Product["category"] | null {
  const normalized = categoryName?.trim().toLowerCase();

  if (normalized === "sets" || normalized === "set") {
    return "Sets";
  }

  if (
    normalized === "jackets" ||
    normalized === "jacket"
  ) {
    return "Jackets";
  }

  return null;
}

function normalizeImages(
  mainImage: string | null | undefined,
  images: string[] | null | undefined
): string[] {
  const allImages = [
    mainImage,
    ...(Array.isArray(images) ? images : []),
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
  value: number | string | null | undefined
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
    stock_quantity: normalizeStock(
      variant.stock_quantity
    ),
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
    const categoryName = categoryMap.get(
      product.category_id ?? ""
    );

    const category = normalizeCategory(categoryName);

    // لا نعرض منتجات غير مصنفة ضمن Sets أو Jackets.
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
              value:
                variant.color_code || "#D8C8B8",
            },
          ])
      ).values(),
    ];

    const price = normalizePrice(product.price);

    const oldPrice =
      product.compare_at_price == null
        ? undefined
        : normalizePrice(product.compare_at_price);

    // نحترم اختيار الإدارة لعلامة New مباشرة.
    const isNew =
      Boolean(product.is_new) ||
      Boolean(product.is_new_arrival);

    // المنتج يظل ظاهراً حتى لو نفد المخزون.
    // لكن لا يمكن شراؤه بدون مقاس/لون متاح ومخزون فعلي.
    const isAvailable =
      product.is_available !== false &&
      availableVariants.length > 0;

    return [
      {
        id: product.id,
        slug: product.slug,

        variants: productVariants,

        name: product.name,
        subtitle: product.subtitle ?? "",
        description: product.description ?? "",

        price,
        oldPrice,

        category,

        // لا نستخدم صور Placeholder خارجية.
        // مكونات عرض الصور تتولى إظهار البديل عند غياب الصورة.
        image: images[0] ?? "",
        images,

        colors,
        sizes,

        rating: 0,
        reviews: 0,

        isNew,
        isBestSeller: Boolean(product.is_best_seller),
        isFeatured: Boolean(product.is_featured),
        isAvailable,

        tags: product.tags ?? [],
      },
    ];
  });
}
