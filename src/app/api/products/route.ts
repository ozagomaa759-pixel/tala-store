import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    products: [],
    message: "Products API is running.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Product management is not configured yet.",
    },
    { status: 503 }
  );
}
