
import { createClient } from "@/lib/supabase/browser";
import type { Product, ProductColor } from "@/data/products";

type SupabaseProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  main_image: string | null;
  images: string[] | null;
  status: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  sort_order: number;
  categories:
    | { name: string }
    | { name: string }[]
    | null;
};

type SupabaseVariant = {
  product_id: string;
  size: string | null;
  color: string | null;
  color_code: string | null;
  stock_quantity: number;
  is_active: boolean;
};

export async function getTalaProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      price,
      compare_at_price,
      main_image,
      images,
      status,
      is_featured,
      is_best_seller,
      is_new_arrival,
      sort_order,
      categories (
        name
      )
    `)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("TALA products error:", error.message);
    throw new Error("Could not load TALA products.");
  }

  const products = (data ?? []) as unknown as SupabaseProduct[];

  if (products.length === 0) return [];

  const productIds = products.map((product) => product.id);

  const { data: variantsData, error: variantsError } =
    await supabase
      .from("product_variants")
      .select(`
        product_id,
        size,
        color,
        color_code,
        stock_quantity,
        is_active
      `)
      .in("product_id", productIds)
      .eq("is_active", true)
      .gt("stock_quantity", 0);

  if (variantsError) {
    console.error("TALA variants error:", variantsError.message);
    throw new Error("Could not load product variants.");
  }

  const variants = (variantsData ?? []) as SupabaseVariant[];

  return products.map((product) => {
    const productVariants = variants.filter(
      (variant) => variant.product_id === product.id
    );

    const colorsMap = new Map<string, ProductColor>();
    const sizesSet = new Set<string>();

    productVariants.forEach((variant) => {
      if (variant.color) {
        colorsMap.set(variant.color, {
          name: variant.color,
          value: variant.color_code || "#A99A88",
        });
      }

      if (variant.size) sizesSet.add(variant.size);
    });

    const categoryRelation = Array.isArray(product.categories)
      ? product.categories[0]
      : product.categories;

    const allowedCategories = [
      "Dresses",
      "Tops",
      "Bottoms",
      "Outerwear",
      "Sets",
    ] as const;

    const categoryName = categoryRelation?.name ?? "Dresses";

    const category = allowedCategories.includes(
      categoryName as (typeof allowedCategories)[number]
    )
      ? (categoryName as (typeof allowedCategories)[number])
      : "Dresses";

    const images = [
      ...(product.main_image ? [product.main_image] : []),
      ...(product.images ?? []),
    ].filter((image, index, array) => array.indexOf(image) === index);

    return {
      id: product.id,
      name: product.name,
      subtitle: "",
      description: product.description ?? "",
      price: Number(product.price),
      oldPrice:
        product.compare_at_price === null
          ? undefined
          : Number(product.compare_at_price),
      category,
      image: images[0] || "/images/product-placeholder.webp",
      images,
      colors: Array.from(colorsMap.values()),
      sizes: Array.from(new Set([...sizesSet, "XXL"])),
      rating: 0,
      reviews: 0,
      isNew: product.is_new_arrival,
      isBestSeller: product.is_best_seller,
      isFeatured: product.is_featured,
      isAvailable: productVariants.length > 0,
      tags: [],
    };
  });
}
