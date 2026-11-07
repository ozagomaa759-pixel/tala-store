import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "TALA authentication is currently disabled.",
    },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Customer accounts are not available yet.",
    },
    { status: 501 }
  );
}
