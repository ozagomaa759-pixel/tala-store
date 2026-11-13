
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { authorized } = await requireAdmin();

    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders GET error:", error.message);

      return NextResponse.json(
        { success: false, message: "Could not load orders." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data ?? [],
    });
  } catch (error) {
    console.error("Orders GET error:", error);

    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const customer = body?.customer;
    const items = body?.items;

    if (
      !customer ||
      typeof customer.fullName !== "string" ||
      typeof customer.phone !== "string" ||
      typeof customer.city !== "string" ||
      typeof customer.address !== "string" ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 30
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid order information." },
        { status: 400 }
      );
    }

    const cleanCustomer = {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      email:
        typeof customer.email === "string"
          ? customer.email.trim()
          : "",
      city: customer.city.trim(),
      address: customer.address.trim(),
    };

    if (
      !cleanCustomer.fullName ||
      !cleanCustomer.phone ||
      !cleanCustomer.city ||
      !cleanCustomer.address
    ) {
      return NextResponse.json(
        { success: false, message: "Please complete your delivery details." },
        { status: 400 }
      );
    }

    const cleanItems = items.map((item: any) => ({
      productId: String(item?.productId ?? ""),
      size: String(item?.size ?? ""),
      color: String(item?.color ?? ""),
      quantity: Number(item?.quantity),
    }));

    if (
      cleanItems.some(
        (item: {
          productId: string;
          size: string;
          color: string;
          quantity: number;
        }) =>
          !item.productId ||
          !item.size ||
          !item.color ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 10
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid product or quantity." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc(
      "create_tala_order",
      {
        p_customer: cleanCustomer,
        p_items: cleanItems,
      }
    );

    if (error) {
      console.error("Order creation error:", error.message);

      const message = error.message ?? "";

      if (message.includes("INSUFFICIENT_STOCK")) {
        return NextResponse.json(
          { success: false, message: "Some items are no longer available in the requested quantity." },
          { status: 409 }
        );
      }

      if (
        message.includes("PRODUCT_UNAVAILABLE") ||
        message.includes("VARIANT_UNAVAILABLE")
      ) {
        return NextResponse.json(
          { success: false, message: "A selected product or size is unavailable." },
          { status: 409 }
        );
      }

      if (
        message.includes("CUSTOMER_DETAILS_REQUIRED") ||
        message.includes("EMPTY_ORDER") ||
        message.includes("INVALID_QUANTITY")
      ) {
        return NextResponse.json(
          { success: false, message: "Please check your order information." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: "We could not process your order. Please try again." },
        { status: 500 }
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

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
