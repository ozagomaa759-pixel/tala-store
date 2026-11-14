
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim();
    const status = params.get("status");
    const paymentStatus = params.get("payment_status");

    let query = auth.supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (search) {
      const safeSearch = search.replace(/[,%()]/g, "");

      if (safeSearch) {
        query = query.or(
          `order_number.ilike.%${safeSearch}%,customer_name.ilike.%${safeSearch}%,customer_phone.ilike.%${safeSearch}%`
        );
      }
    }

    if (status) {
      if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
        return errorResponse("Invalid order status");
      }

      query = query.eq("status", status);
    }

    if (paymentStatus) {
      if (
        !PAYMENT_STATUSES.includes(
          paymentStatus as (typeof PAYMENT_STATUSES)[number]
        )
      ) {
        return errorResponse("Invalid payment status");
      }

      query = query.eq("payment_status", paymentStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admin orders GET error:", error.message);
      return errorResponse("Could not load orders", 500);
    }

    return NextResponse.json(
      {
        success: true,
        orders: data ?? [],
        count: data?.length ?? 0,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin orders GET exception:", error);
    return errorResponse("Failed to fetch orders", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return errorResponse("Invalid request body");
    }

    const payload = body as Record<string, unknown>;

    if (
      typeof payload.id !== "string" ||
      !payload.id.trim()
    ) {
      return errorResponse("Order ID is required");
    }

    const updates: Record<string, unknown> = {};

    if (payload.status !== undefined) {
      if (
        typeof payload.status !== "string" ||
        !ORDER_STATUSES.includes(
          payload.status as (typeof ORDER_STATUSES)[number]
        )
      ) {
        return errorResponse("Invalid order status");
      }

      updates.status = payload.status;
    }

    if (payload.payment_status !== undefined) {
      if (
        typeof payload.payment_status !== "string" ||
        !PAYMENT_STATUSES.includes(
          payload.payment_status as (typeof PAYMENT_STATUSES)[number]
        )
      ) {
        return errorResponse("Invalid payment status");
      }

      updates.payment_status = payload.payment_status;
    }

    if (payload.notes !== undefined) {
      if (
        payload.notes !== null &&
        (typeof payload.notes !== "string" ||
          payload.notes.length > 2000)
      ) {
        return errorResponse("Invalid order notes");
      }

      updates.notes = payload.notes;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No changes provided");
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from("orders")
      .update(updates)
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      console.error("Admin orders PATCH error:", error.message);
      return errorResponse("Could not update order", 400);
    }

    return NextResponse.json({
      success: true,
      order: data,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Admin orders PATCH exception:", error);
    return errorResponse("Failed to update order", 500);
  }
}
