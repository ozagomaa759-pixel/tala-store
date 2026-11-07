import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "TALA Webhooks API is running.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Webhook processing is not configured yet.",
    },
    { status: 503 }
  );
}
