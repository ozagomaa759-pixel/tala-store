
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

    const [
      { data: products, error: productsError },
      { data: categories, error: categoriesError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id, category_id, name, slug, description, price, compare_at_price, main_image, images, is_featured, is_best_seller, is_new_arrival, sort_order, created_at"
        )
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),

      supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true),
    ]);

    if (productsError) {
      console.error("Public products API:", productsError);

      return NextResponse.json(
        {
          success: false,
          message: "Could not load published products.",
        },
        { status: 500 }
      );
    }

    if (categoriesError) {
      console.error("Public categories API:", categoriesError);

      return NextResponse.json(
        {
          success: false,
          message: "Could not load product categories.",
        },
        { status: 500 }
      );
    }

    const productIds = (products ?? []).map(
      (product) => product.id
    );

    let variants: Array<{
      id: string;
      product_id: string;
      size: string | null;
      color: string | null;
      color_code: string | null;
      stock_quantity: number;
      price_override: number | null;
      is_active: boolean;
    }> = [];

    if (productIds.length > 0) {
      const { data, error } = await supabase
        .from("product_variants")
        .select(
          "id, product_id, size, color, color_code, stock_quantity, price_override, is_active"
        )
        .in("product_id", productIds)
        .eq("is_active", true);

      if (error) {
        console.error("Public variants API:", error);

        return NextResponse.json(
          {
            success: false,
            message:
              "Could not load product sizes, colors, and stock.",
          },
          { status: 500 }
        );
      }

      variants = data ?? [];
    }

    return NextResponse.json(
      {
        success: true,
        products: products ?? [],
        categories: categories ?? [],
        variants,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Public products API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
