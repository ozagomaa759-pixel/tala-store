
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;
    const safeSlug = slug?.trim();

    if (!safeSlug || safeSlug.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product address.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: product, error: productError } =
      await supabase
        .from("products")
        .select(
          [
            "id",
            "category_id",
            "name",
            "slug",
            "description",
            "price",
            "compare_at_price",
            "main_image",
            "images",
            "is_featured",
            "is_best_seller",
            "is_new_arrival",
            "sort_order",
            "created_at",
          ].join(", ")
        )
        .eq("slug", safeSlug)
        .eq("status", "published")
        .maybeSingle();

    if (productError) {
      console.error(
        "Public product details API:",
        productError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Could not load this product.",
        },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    const { data: variants, error: variantsError } =
      await supabase
        .from("product_variants")
        .select(
          [
            "id",
            "product_id",
            "size",
            "color",
            "color_code",
            "sku",
            "stock_quantity",
            "price_override",
            "image_url",
            "is_active",
          ].join(", ")
        )
        .eq("product_id", product.id)
        .eq("is_active", true)
        .order("size", { ascending: true });

    if (variantsError) {
      console.error(
        "Public product variants API:",
        variantsError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Could not load product options.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
        variants: variants ?? [],
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Public product details API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
