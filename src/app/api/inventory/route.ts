
import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type InventoryVariant = {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  stock_quantity: number;
  is_active: boolean;
  updated_at: string | null;
};

type InventoryProduct = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized.", 401);
    }

    const supabase = createAdminClient() as unknown as SupabaseClient;

    const [
      { data: products, error: productsError },
      { data: variants, error: variantsError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, slug, status")
        .order("name", { ascending: true }),

      supabase
        .from("product_variants")
        .select(
          "id, product_id, size, color, stock_quantity, is_active, updated_at"
        )
        .order("updated_at", { ascending: false }),
    ]);

    if (productsError) {
      console.error("Inventory products error:", productsError);
      return errorResponse("Could not load products.", 500);
    }

    if (variantsError) {
      console.error("Inventory variants error:", variantsError);
      return errorResponse("Could not load stock records.", 500);
    }

    const productRows = (products ?? []) as unknown as InventoryProduct[];
    const variantRows = (variants ?? []) as unknown as InventoryVariant[];

    const productMap = new Map(
      productRows.map((product) => [product.id, product])
    );

    const inventory = variantRows.map((variant) => {
      const product = productMap.get(variant.product_id);

      return {
        ...variant,
        product_name: product?.name ?? "Unknown product",
        product_slug: product?.slug ?? "",
        product_status: product?.status ?? "unknown",
      };
    });

    return NextResponse.json(
      { success: true, inventory },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Inventory GET error:", error);
    return errorResponse("Could not load inventory.", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized.", 401);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body.");
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return errorResponse("Invalid request data.");
    }

    const payload = body as Record<string, unknown>;

    if (
      typeof payload.id !== "string" ||
      !UUID_REGEX.test(payload.id.trim())
    ) {
      return errorResponse("A valid variant ID is required.");
    }

    const updates: {
      stock_quantity?: number;
      is_active?: boolean;
    } = {};

    if (payload.stock_quantity !== undefined) {
      if (
        typeof payload.stock_quantity !== "number" ||
        !Number.isSafeInteger(payload.stock_quantity) ||
        payload.stock_quantity < 0
      ) {
        return errorResponse(
          "Stock must be a whole number of zero or more."
        );
      }

      updates.stock_quantity = payload.stock_quantity;
    }

    if (payload.is_active !== undefined) {
      if (typeof payload.is_active !== "boolean") {
        return errorResponse("Invalid availability status.");
      }

      updates.is_active = payload.is_active;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No inventory changes were provided.");
    }

    const supabase = createAdminClient() as unknown as SupabaseClient;

    const { data, error } = await supabase
      .from("product_variants")
      .update(updates)
      .eq("id", payload.id.trim())
      .select(
        "id, product_id, size, color, stock_quantity, is_active, updated_at"
      )
      .maybeSingle();

    if (error) {
      console.error("Inventory PATCH error:", error);
      return errorResponse("Could not update stock.", 500);
    }

    if (!data) {
      return errorResponse("Inventory option was not found.", 404);
    }

    return NextResponse.json({
      success: true,
      variant: data,
      message: "Inventory updated successfully.",
    });
  } catch (error) {
    console.error("Inventory PATCH error:", error);
    return errorResponse("Could not update stock.", 500);
  }
}
