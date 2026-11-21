import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: string): string {
  // Compare phone numbers consistently while preserving the country digits.
  return value.replace(/[\s()+.-]/g, "");
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    {
      status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request. Please try again.", 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse("Please enter your order details.", 400);
    }

    const input = body as Record<string, unknown>;
    const orderNumber = cleanString(input.orderNumber);
    const phone = normalizePhone(cleanString(input.phone));

    if (!orderNumber || !phone) {
      return errorResponse("Please enter your order number and phone number.", 400);
    }

    if (orderNumber.length > 80 || phone.length < 7 || phone.length > 20) {
      return errorResponse("Please check your order details and try again.", 400);
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("order_number, customer_phone, status, payment_status, created_at, updated_at")
      .eq("order_number", orderNumber)
.maybeSingle();

    if (error) {
      console.error("Public order tracking lookup failed:", error.message);
      return errorResponse("We could not check your order right now. Please try again later.", 500);
    }
if (
  !data ||
  normalizePhone(data.customer_phone) !== phone
) {
  return errorResponse(
    "We couldn't find an order matching those details. Please check them and try again.",
    404
  );
}

    return NextResponse.json(
      {
        success: true,
        order: {
          orderNumber: data.order_number,
          status: data.status,
          paymentStatus: data.payment_status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Order tracking error:", error);
    return errorResponse("Something went wrong. Please try again later.", 500);
  }
}
