
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// GET: عرض منتجات طلب معين
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const orderId = request.nextUrl.searchParams.get("order_id");

    if (!orderId) {
      return errorResponse("Order ID is required");
    }

    const { data, error } = await auth.supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch order items error:", error);
      return errorResponse("Failed to fetch order items", 500);
    }

    return NextResponse.json({
      success: true,
      items: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Order items GET error:", error);
    return errorResponse("Failed to fetch order items", 500);
  }
}

// POST: إضافة عنصر إلى طلب
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    if (
      typeof body.order_id !== "string" ||
      !body.order_id.trim()
    ) {
      return errorResponse("Order ID is required");
    }

    if (
      typeof body.product_name !== "string" ||
      !body.product_name.trim()
    ) {
      return errorResponse("Product name is required");
    }

    const quantity = Number(body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return errorResponse("Quantity must be at least 1");
    }

    const unitPrice = Number(body.unit_price);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return errorResponse("Invalid unit price");
    }

    const item = {
      order_id: body.order_id.trim(),
      product_id: body.product_id || null,
      variant_id: body.variant_id || null,
      product_name: body.product_name.trim(),
      product_image: body.product_image || null,
      selected_size: body.selected_size || null,
      selected_color: body.selected_color || null,
      sku: body.sku || null,
      quantity,
      unit_price: unitPrice,
      line_total: Number((unitPrice * quantity).toFixed(2)),
    };

    const supabase = auth.supabase as unknown as SupabaseClient;

    const { error } = await supabase
      .from("order_items")
      .insert(item);

    if (error) {
      console.error("Insert order item error:", error);
      return errorResponse(error.message, 400);
    }

    return NextResponse.json(
      { success: true, item },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order items POST error:", error);
    return errorResponse("Failed to add order item", 500);
  }
}

// DELETE: حذف عنصر من الطلب
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const itemId = request.nextUrl.searchParams.get("id");

    if (!itemId) {
      return errorResponse("Order item ID is required");
    }

    const { error } = await auth.supabase
      .from("order_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Delete order item error:", error);
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      message: "Order item deleted successfully",
    });
  } catch (error) {
    console.error("Order items DELETE error:", error);
    return errorResponse("Failed to delete order item", 500);
  }
}
