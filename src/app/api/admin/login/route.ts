
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_DURATION_SECONDS,
  createAdminSessionToken,
} from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeCompare(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const first = encoder.encode(a);
  const second = encoder.encode(b);

  if (first.length !== second.length) return false;

  let difference = 0;

  for (let i = 0; i < first.length; i++) {
    difference |= first[i] ^ second[i];
  }

  return difference === 0;
}

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminPassword || !sessionSecret) {
      console.error("Admin login environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Admin login is not configured.",
        },
        { status: 500 }
      );
    }

    const body: unknown = await request.json().catch(() => null);

    const enteredPassword =
      typeof body === "object" &&
      body !== null &&
      "password" in body &&
      typeof body.password === "string"
        ? body.password
        : "";

    if (!safeCompare(enteredPassword, adminPassword)) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password.",
        },
        { status: 401 }
      );
    }

    const token = await createAdminSessionToken(sessionSecret);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ADMIN_SESSION_DURATION_SECONDS,
      }
    );

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
