
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const orderId = request.nextUrl.searchParams
      .get("order_id")
      ?.trim();

    if (!orderId || !UUID_REGEX.test(orderId)) {
      return errorResponse("A valid order ID is required.");
    }

    const { data, error } = await auth.supabase
      .from("order_items")
      .select(
        "id, order_id, product_id, variant_id, product_name, product_image, selected_size, selected_color, sku, quantity, unit_price, line_total, created_at"
      )
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch order items error:", error.message);
      return errorResponse("Failed to fetch order items.", 500);
    }

    return NextResponse.json(
      {
        success: true,
        items: data ?? [],
        count: data?.length ?? 0,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Order items GET error:", error);

    return errorResponse("Failed to fetch order items.", 500);
  }
}

export async function POST() {
  return errorResponse(
    "Direct order item creation is disabled. Use the order management system.",
    405
  );
}

export async function PATCH() {
  return errorResponse(
    "Direct order item editing is disabled.",
    405
  );
}

export async function DELETE() {
  return errorResponse(
    "Direct order item deletion is disabled.",
    405
  );
}
