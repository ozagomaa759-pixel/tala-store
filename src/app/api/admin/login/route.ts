
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const COOKIE_NAME = "tala_admin_session";
const SESSION_DURATION = 8 * 60 * 60;

async function sign(value: string, secret: string) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );

  return btoa(
    String.fromCharCode(...new Uint8Array(signature))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function safeCompare(a: string, b: string) {
  const encoder = new TextEncoder();
  const first = encoder.encode(a);
  const second = encoder.encode(b);

  if (first.length !== second.length) return false;

  let result = 0;

  for (let i = 0; i < first.length; i++) {
    result |= first[i] ^ second[i];
  }

  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    const password = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!password || !secret) {
      return NextResponse.json(
        { success: false, message: "Admin login is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    const enteredPassword =
      typeof body?.password === "string" ? body.password : "";

    if (!safeCompare(enteredPassword, password)) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;
    const payload = String(expiresAt);
    const signature = await sign(payload, secret);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set(
      COOKIE_NAME,
      `${payload}.${signature}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_DURATION,
      }
    );

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
