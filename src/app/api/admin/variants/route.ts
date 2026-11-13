
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

function validOptionalPrice(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

// GET: عرض متغيرات المنتج
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const productId = request.nextUrl.searchParams.get("product_id");

    let query = auth.supabase
      .from("product_variants")
      .select("*")
      .order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      variants: data ?? [],
    });
  } catch {
    return errorResponse("Failed to fetch variants", 500);
  }
}

// POST: إضافة مقاس أو لون
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    if (
      typeof body.product_id !== "string" ||
      !body.product_id.trim()
    ) {
      return errorResponse("Product ID is required");
    }

    if (
      !Number.isInteger(body.stock_quantity) ||
      body.stock_quantity < 0
    ) {
      return errorResponse("Stock quantity must be a non-negative integer");
    }

    if (!validOptionalPrice(body.price_override)) {
      return errorResponse("Invalid price override");
    }

    const variant = {
      product_id: body.product_id,
      size: typeof body.size === "string" ? body.size.trim() : null,
      color: typeof body.color === "string" ? body.color.trim() : null,
      color_code:
        typeof body.color_code === "string"
          ? body.color_code.trim()
          : null,
      sku: typeof body.sku === "string" ? body.sku.trim() : null,
      stock_quantity: body.stock_quantity,
      price_override:
        body.price_override === "" ||
        body.price_override === undefined
          ? null
          : body.price_override,
      image_url:
        typeof body.image_url === "string"
          ? body.image_url
          : null,
      is_active: body.is_active !== false,
    };

    const { data, error } = await auth.supabase
      .from("product_variants")
      .insert(variant)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json(
      { success: true, variant: data },
      { status: 201 }
    );
  } catch {
    return errorResponse("Failed to create variant", 500);
  }
}

// PATCH: تعديل المقاس أو اللون أو المخزون
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    if (
      typeof body.id !== "string" ||
      !body.id.trim()
    ) {
      return errorResponse("Variant ID is required");
    }

    const updates: Record<string, unknown> = {};

    if (body.product_id !== undefined) {
      if (
        typeof body.product_id !== "string" ||
        !body.product_id.trim()
      ) {
        return errorResponse("Invalid product ID");
      }

      updates.product_id = body.product_id;
    }

    for (const field of ["size", "color", "color_code", "sku", "image_url"]) {
      if (body[field] !== undefined) {
        if (
          body[field] !== null &&
          typeof body[field] !== "string"
        ) {
          return errorResponse(`Invalid ${field}`);
        }

        updates[field] = body[field];
      }
    }

    if (body.stock_quantity !== undefined) {
      if (
        !Number.isInteger(body.stock_quantity) ||
        body.stock_quantity < 0
      ) {
        return errorResponse("Invalid stock quantity");
      }

      updates.stock_quantity = body.stock_quantity;
    }

    if (body.price_override !== undefined) {
      if (!validOptionalPrice(body.price_override)) {
        return errorResponse("Invalid price override");
      }

      updates.price_override =
        body.price_override === "" ? null : body.price_override;
    }

    if (body.is_active !== undefined) {
      if (typeof body.is_active !== "boolean") {
        return errorResponse("Invalid active status");
      }

      updates.is_active = body.is_active;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from("product_variants")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      variant: data,
    });
  } catch {
    return errorResponse("Failed to update variant", 500);
  }
}

// DELETE: حذف نسخة المنتج
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return errorResponse("Variant ID is required");
    }

    const { error } = await auth.supabase
      .from("product_variants")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      message: "Variant deleted successfully",
    });
  } catch {
    return errorResponse("Failed to delete variant", 500);
  }
}
