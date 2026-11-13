
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// GET: عرض الطلبات والبحث والفلترة
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const params = request.nextUrl.searchParams;
    const search = params.get("search");
    const status = params.get("status");
    const paymentStatus = params.get("payment_status");

    let query = auth.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      const safeSearch = search.replace(/[,%()]/g, "");
      query = query.or(
        `order_number.ilike.%${safeSearch}%,customer_name.ilike.%${safeSearch}%,customer_phone.ilike.%${safeSearch}%`
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (paymentStatus) {
      query = query.eq("payment_status", paymentStatus);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      orders: data ?? [],
      count: data?.length ?? 0,
    });
  } catch {
    return errorResponse("Failed to fetch orders", 500);
  }
}

// PATCH: تحديث حالة الطلب أو الدفع
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
      return errorResponse("Order ID is required");
    }

    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (
        typeof body.status !== "string" ||
        !body.status.trim()
      ) {
        return errorResponse("Invalid order status");
      }

      updates.status = body.status.trim();
    }

    if (body.payment_status !== undefined) {
      if (
        typeof body.payment_status !== "string" ||
        !body.payment_status.trim()
      ) {
        return errorResponse("Invalid payment status");
      }

      updates.payment_status = body.payment_status.trim();
    }

    if (body.notes !== undefined) {
      if (
        body.notes !== null &&
        typeof body.notes !== "string"
      ) {
        return errorResponse("Invalid order notes");
      }

      updates.notes = body.notes;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No changes provided");
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from("orders")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      order: data,
      message: "Order updated successfully",
    });
  } catch {
    return errorResponse("Failed to update order", 500);
  }
}
