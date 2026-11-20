import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

type CustomerInput = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
};

type OrderItemInput = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized.", 401);
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders GET error:", error.message);
      return errorResponse("Could not load orders.", 500);
    }

    return NextResponse.json({
      success: true,
      orders: data ?? [],
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return errorResponse("Server error.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body.", 400);
    }

    if (!isRecord(body)) {
      return errorResponse("Invalid order information.", 400);
    }

    const rawCustomer = body.customer;
    const rawItems = body.items;
    const couponCode = cleanString(body.couponCode).toUpperCase();

    if (couponCode && couponCode !== "TALA10") {
      return errorResponse("This coupon code is not valid.", 400);
    }

    if (
      !isRecord(rawCustomer) ||
      !Array.isArray(rawItems) ||
      rawItems.length === 0 ||
      rawItems.length > 30
    ) {
      return errorResponse("Invalid order information.", 400);
    }

    const customer: CustomerInput = {
      fullName: cleanString(rawCustomer.fullName),
      phone: cleanString(rawCustomer.phone),
      city: cleanString(rawCustomer.city),
      address: cleanString(rawCustomer.address),
    };

    if (
      !customer.fullName ||
      !customer.phone ||
      !customer.city ||
      !customer.address
    ) {
      return errorResponse(
        "Please complete your delivery details.",
        400
      );
    }

    if (
      customer.fullName.length > 120 ||
      customer.phone.length > 30 ||
      customer.city.length > 100 ||
      customer.address.length > 500
    ) {
      return errorResponse(
        "Some customer information is too long.",
        400
      );
    }

    const cleanItems: OrderItemInput[] = [];

    for (const rawItem of rawItems) {
      if (!isRecord(rawItem)) {
        return errorResponse("Invalid product information.", 400);
      }

      const productId = cleanString(rawItem.productId);
      const size = cleanString(rawItem.size);
      const color = cleanString(rawItem.color);
      const quantity = Number(rawItem.quantity);

      if (
        !isValidUuid(productId) ||
        !size ||
        !color ||
        size.length > 40 ||
        color.length > 80 ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        return errorResponse(
          "Invalid product, size, color, or quantity.",
          400
        );
      }

      cleanItems.push({
        productId,
        size,
        color,
        quantity,
      });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc(
      "create_tala_order" as never,
      {
        p_customer: customer,
        p_items: cleanItems,
        p_coupon_code: couponCode || null,
      } as never
    );

    if (error) {
      console.error("Order creation error:", error.message);

      const message = error.message ?? "";

      if (message.includes("INSUFFICIENT_STOCK")) {
        return errorResponse(
          "Some items are no longer available in the requested quantity.",
          409
        );
      }

      if (
        message.includes("PRODUCT_UNAVAILABLE") ||
        message.includes("VARIANT_UNAVAILABLE")
      ) {
        return errorResponse(
          "A selected product or size is unavailable.",
          409
        );
      }

      if (
        message.includes("CUSTOMER_DETAILS_REQUIRED") ||
        message.includes("EMPTY_ORDER") ||
        message.includes("INVALID_QUANTITY") ||
        message.includes("INVALID_COUPON")
      ) {
        return errorResponse(
          "Please check your order information.",
          400
        );
      }

      return errorResponse(
        "We could not process your order. Please try again.",
        500
      );
    }

    return NextResponse.json(
      {
        success: true,
        order: data,
        message: "Your order has been received successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order POST error:", error);

    return errorResponse(
      "Something went wrong. Please try again.",
      500
    );
  }
}
