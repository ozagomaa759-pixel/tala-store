
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

    if (
      body.status !== undefined &&
      (typeof body.status !== "string" || !body.status.trim())
    ) {
      return errorResponse("Invalid order status.");
    }

    if (
      body.payment_status !== undefined &&
      (typeof body.payment_status !== "string" ||
        !body.payment_status.trim())
    ) {
      return errorResponse("Invalid payment status.");
    }

    if (
      body.notes !== undefined &&
      body.notes !== null &&
      typeof body.notes !== "string"
    ) {
      return errorResponse("Invalid order notes.");
    }

    const supabase = createAdminClient();

    if (body.status === "cancelled") {
      const rpcClient = supabase as unknown as {
        rpc: (
          functionName: string,
          params: { p_order_id: string }
        ) => Promise<{
          data: unknown;
          error: { message: string } | null;
        }>;
      };

      const { error } = await rpcClient.rpc(
        "cancel_tala_order",
        { p_order_id: body.id }
      );

      if (error) {
        console.error("Cancel order:", error.message);

        if (error.message.includes("ORDER_NOT_FOUND")) {
          return errorResponse("Order not found.", 404);
        }

        if (
          error.message.includes(
            "DELIVERED_ORDER_CANNOT_BE_CANCELLED"
          )
        ) {
          return errorResponse(
            "Delivered orders cannot be cancelled.",
            400
          );
        }

        return errorResponse("Could not cancel order.", 400);
      }

      const extraUpdates: {
        payment_status?: string;
        notes?: string | null;
        updated_at?: string;
      } = {};

      if (body.payment_status !== undefined) {
        extraUpdates.payment_status =
          (body.payment_status as string).trim();
      }

      if (body.notes !== undefined) {
        extraUpdates.notes = body.notes as string | null;
      }

      if (Object.keys(extraUpdates).length > 0) {
        extraUpdates.updated_at = new Date().toISOString();

        const ordersUpdater = supabase as unknown as {
          from: (table: string) => {
            update: (values: typeof extraUpdates) => {
              eq: (
                column: string,
                value: string
              ) => Promise<{
                error: { message: string } | null;
              }>;
            };
          };
        };

        const { error: extraError } = await ordersUpdater
          .from("orders")
          .update(extraUpdates)
          .eq("id", body.id);

        if (extraError) {
          console.error(
            "Cancelled order extra update:",
            extraError.message
          );

          return errorResponse(
            "Order cancelled, but extra fields could not be updated.",
            500
          );
        }
      }

      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", body.id)
        .single();

      if (fetchError) {
        return errorResponse(
          "Order cancelled, but could not reload it.",
          500
        );
      }

      return NextResponse.json({
        success: true,
        order,
        message: "Order cancelled and stock restored successfully.",
      });
    }

    const updates: {
      status?: string;
      payment_status?: string;
      notes?: string | null;
      updated_at?: string;
    } = {};

    if (body.status !== undefined) {
      updates.status = (body.status as string).trim();
    }

    if (body.payment_status !== undefined) {
      updates.payment_status =
        (body.payment_status as string).trim();
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes as string | null;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No changes provided.");
    }

    updates.updated_at = new Date().toISOString();

    const ordersUpdater = supabase as unknown as {
      from: (table: string) => {
        update: (values: typeof updates) => {
          eq: (
            column: string,
            value: string
          ) => {
            select: () => {
              single: () => Promise<{
                data: unknown;
                error: { message: string } | null;
              }>;
            };
          };
        };
      };
    };

    const { data, error } = await ordersUpdater
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
