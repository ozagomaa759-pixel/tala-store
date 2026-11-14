
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

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

    const supabase = createAdminClient();
    const params = request.nextUrl.searchParams;

    const search = params.get("search")?.trim();
    const status = params.get("status");
    const paymentStatus = params.get("payment_status");

    let query = supabase
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
      query = query.eq("status", status);
    }

    if (paymentStatus) {
      query = query.eq("payment_status", paymentStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admin orders GET:", error.message);
      return errorResponse("Could not load orders.", 500);
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
    console.error("Admin orders GET:", error);
    return errorResponse("Failed to fetch orders.", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const body: {
      id?: unknown;
      status?: unknown;
      payment_status?: unknown;
      notes?: unknown;
    } = await request.json();

    if (typeof body.id !== "string" || !body.id.trim()) {
      return errorResponse("Order ID is required.");
    }

    const updates: {
      status?: string;
      payment_status?: string;
      notes?: string | null;
      updated_at?: string;
    } = {};

    if (body.status !== undefined) {
      if (
        typeof body.status !== "string" ||
        !body.status.trim()
      ) {
        return errorResponse("Invalid order status.");
      }

      updates.status = body.status.trim();
    }

    if (body.payment_status !== undefined) {
      if (
        typeof body.payment_status !== "string" ||
        !body.payment_status.trim()
      ) {
        return errorResponse("Invalid payment status.");
      }

      updates.payment_status = body.payment_status.trim();
    }

    if (body.notes !== undefined) {
      if (
        body.notes !== null &&
        typeof body.notes !== "string"
      ) {
        return errorResponse("Invalid order notes.");
      }

      updates.notes = body.notes;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No changes provided.");
    }

    updates.updated_at = new Date().toISOString();

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Admin orders PATCH:", error.message);
      return errorResponse("Could not update order.", 400);
    }

    return NextResponse.json({
      success: true,
      order: data,
      message: "Order updated successfully.",
    });
  } catch (error) {
    console.error("Admin orders PATCH:", error);
    return errorResponse("Failed to update order.", 500);
  }
}
