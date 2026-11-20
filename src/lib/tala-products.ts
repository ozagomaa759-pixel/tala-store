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

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x800/F5F0E8/332A23?text=TALA";

const NEW_ARRIVAL_DAYS = 15;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function isWithinNewArrivalPeriod(
  createdAt: string | null | undefined
): boolean {
  if (!createdAt) return false;

  const createdTime = new Date(createdAt).getTime();

  if (!Number.isFinite(createdTime)) return false;

  const age = Date.now() - createdTime;

  return age >= 0 && age < NEW_ARRIVAL_DAYS * DAY_IN_MS;
}

function normalizeCategory(
  categoryName: string | undefined
): Product["category"] | null {
  const normalized = categoryName?.trim().toLowerCase();

  if (!normalized) return null;

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
  ].filter(
    (image): image is string =>
      typeof image === "string" &&
      image.trim().length > 0
  );

  return [...new Set(allImages)];
}

function normalizePrice(value: number | string | null | undefined): number {
  const price = Number(value ?? 0);

  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function normalizeVariant(
  variant: VariantRow
): ProductVariantStock {
  return {
    id: variant.id,
    size: variant.size ?? "",
    color: variant.color ?? "Default",
    color_code: variant.color_code ?? null,
    stock_quantity: Math.max(
      0,
      Number(variant.stock_quantity ?? 0)
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

  const products = result.products ?? [];
  const categories = result.categories ?? [];
  const variants = result.variants ?? [];

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

    // لا ننسب المنتج تلقائياً إلى Sets إذا كان القسم
    // مفقوداً أو غير معروف؛ هذا يمنع ظهوره في قسم خاطئ.
    const category = normalizeCategory(categoryName);

    if (!category) {
      console.warn(
        `TALA: Product "${product.name}" was skipped because its category is not Sets or Jackets.`
      );
      return [];
    }

    const productVariants =
      variantsByProduct.get(product.id) ?? [];

    // نعرض كل المقاسات والألوان النشطة،
    // حتى لو المخزون الخاص بها أصبح صفراً.
    const activeVariants = productVariants.filter(
      (variant) => variant.is_active
    );

    const availableVariants = activeVariants.filter(
      (variant) => variant.stock_quantity > 0
    );

    const images = normalizeImages(
      product.main_image,
      product.images
    );

    const uniqueSizes = [
      ...new Set(
        activeVariants
          .map((variant) => variant.size.trim())
          .filter(Boolean)
      ),
    ];

    const uniqueColors = [
      ...new Map(
        activeVariants
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

    const isNewArrival =
      Boolean(product.is_new) ||
      Boolean(product.is_new_arrival);

    const isNew =
      isNewArrival &&
      isWithinNewArrivalPeriod(product.created_at);

    const price = normalizePrice(product.price);

    const oldPrice =
      product.compare_at_price != null
        ? normalizePrice(product.compare_at_price)
        : undefined;

    const hasStock = availableVariants.length > 0;

    return [{
      id: product.id,
      slug: product.slug,

      variants: productVariants,

      name: product.name,
      subtitle: product.subtitle ?? "",
      description: product.description ?? "",

      price,
      oldPrice,

      category,

      image: images[0] ?? PLACEHOLDER_IMAGE,
      images,

      colors: uniqueColors,
      sizes: uniqueSizes,

      rating: 5,
      reviews: 0,

      isNew,
      isBestSeller: Boolean(product.is_best_seller),
      isFeatured: Boolean(product.is_featured),

      // المنتج يظل ظاهراً حتى لو نفد المخزون.
      // هذه القيمة تتحكم في إمكانية الشراء.
      isAvailable:
        product.is_available !== false && hasStock,

      tags: product.tags ?? [],
    }];
  });
}
