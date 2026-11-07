
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: [],
    message: "Orders API is running.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Order processing is not configured yet.",
    },
    { status: 503 }
  );
}

