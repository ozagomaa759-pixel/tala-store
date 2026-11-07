
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "TALA API is running",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Chat service is not configured yet.",
    },
    { status: 503 }
  );
}

