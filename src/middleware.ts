
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "tala_admin_session";

async function verifyAdminSession(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expiresAt, signature] = parts;

  // Correctly validate the numeric expiration timestamp.
  if (!/^\d+$/.test(expiresAt)) return false;

  const expiry = Number(expiresAt);

  if (
    !Number.isSafeInteger(expiry) ||
    expiry <= Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  try {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const base64 = signature
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const binary = atob(padded);

    const signatureBytes = Uint8Array.from(
      binary,
      (character) => character.charCodeAt(0)
    );

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(expiresAt)
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminLogin = pathname === "/admin/login";
  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isOrdersGet =
    pathname === "/api/orders" && request.method === "GET";

  if (isAdminLogin || (!isAdminPage && !isOrdersGet)) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const authorized = secret
    ? await verifyAdminSession(token, secret)
    : false;

  if (authorized) {
    return NextResponse.next();
  }

  if (isOrdersGet) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/admin/login", request.url);

  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/orders"],
};
