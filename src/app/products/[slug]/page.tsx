
import { notFound } from "next/navigation";
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

type ApiResponse = {
  success: boolean;
  product?: Product;
  variants?: Variant[];
};

async function getProduct(slug: string): Promise<ApiResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const response = await fetch(
    `${baseUrl}/api/products/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (response.status === 404) {
    return { success: false };
  }

  if (!response.ok) {
    throw new Error("Could not load product.");
  }

  return response.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let result: ApiResponse;

  try {
    result = await getProduct(slug);
  } catch (error) {
    console.error("TALA product page error:", error);
    throw error;
  }

  if (!result.success || !result.product) {
    notFound();
  }

  const product = result.product;

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
      variants={result.variants ?? []}
      images={[...new Set(images)]}
    />
  );
}
