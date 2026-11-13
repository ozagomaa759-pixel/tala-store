
import { createServerClient } from "@supabase/ssr";
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

  if (!/^\d+$/.test(expiresAt)) return false;

  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
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

    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

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
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            response = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    await supabase.auth.getUser();
  }

  const pathname = request.nextUrl.pathname;

  const isAdminPage = pathname.startsWith("/admin");
  const isOrdersApi =
    pathname === "/api/orders" && request.method === "GET";

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (
    (isAdminPage && !isLoginPage) ||
    isOrdersApi
  ) {
    if (isLoginApi) return response;

    const secret = process.env.ADMIN_SESSION_SECRET;

    const token = request.cookies.get(COOKIE_NAME)?.value;

    const authorized = secret
      ? await verifyAdminSession(token, secret)
      : false;

    if (!authorized) {
      if (isOrdersApi) {
        return NextResponse.json(
          { success: false, message: "Unauthorized." },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
