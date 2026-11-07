
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    inventory: [],
    message: "Inventory API is running.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Inventory management is not configured yet.",
    },
    { status: 503 }
  );
}

