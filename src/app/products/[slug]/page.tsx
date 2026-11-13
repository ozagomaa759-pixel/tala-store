
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductDetails from "./product-details";

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,description,price,compare_at_price,main_image,images"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !product) notFound();

  const { data: variants } = await supabase
    .from("product_variants")
    .select(
      "id,size,color,color_code,stock_quantity,price_override,image_url,is_active"
    )
    .eq("product_id", product.id)
    .eq("is_active", true)
    .gt("stock_quantity", 0);

  const typedProduct = product as Product;

  const typedVariants = (variants ?? []) as Variant[];

  const images = [
    typedProduct.main_image,
    ...(typedProduct.images ?? []),
  ].filter((image): image is string => Boolean(image));

  return (
    <ProductDetails
      product={typedProduct}
      variants={typedVariants}
      images={images}
    />
  );
}
