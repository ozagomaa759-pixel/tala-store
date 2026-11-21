
import { notFound } from "next/navigation";
import ProductDetails from "./product-details";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getProduct(identifier: string) {
  const supabase = await createClient();

  // First, look up the product using its slug.
  const { data: slugProduct, error: slugError } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, compare_at_price, main_image, images"
    )
    .eq("slug", identifier)
    .eq("status", "published")
    .maybeSingle();

  if (slugError) {
    console.error("TALA product slug query error:", slugError);
    throw new Error("Could not load product.");
  }

  let product = slugProduct;

  // If no slug matched, check whether the URL contains a UUID.
  // This supports product links that use the database ID.
  if (!product && UUID_REGEX.test(identifier)) {
    const { data: idProduct, error: idError } = await supabase
      .from("products")
      .select(
        "id, name, slug, description, price, compare_at_price, main_image, images"
      )
      .eq("id", identifier)
      .eq("status", "published")
      .maybeSingle();

    if (idError) {
      console.error("TALA product ID query error:", idError);
      throw new Error("Could not load product.");
    }

    product = idProduct;
  }

  if (!product) {
    return null;
  }

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select(
      "id, size, color, color_code, stock_quantity, price_override, image_url, is_active"
    )
    .eq("product_id", product.id)
    .eq("is_active", true)
    .order("size", { ascending: true });

  if (variantsError) {
    console.error("TALA variants query error:", variantsError);
    throw new Error("Could not load product options.");
  }

  return {
    product: product as Product,
    variants: (variants ?? []) as Variant[],
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await getProduct(slug);

  if (!result) {
    notFound();
  }

  const { product, variants } = result;

  const images = [
    product.main_image,
    ...(product.images ?? []),
  ].filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0
  );

  return (
    <ProductDetails
      product={product}
      variants={variants}
      images={[...new Set(images)]}
    />
  );
}
