
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully.",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );

  response.cookies.set(
    ADMIN_SESSION_COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    }
  );

  return response;
}
