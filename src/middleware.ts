
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminLogin = pathname === "/admin/login";

  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isAdminOrdersGet =
    pathname === "/api/orders" &&
    request.method === "GET";

  if (isAdminLogin || (!isAdminPage && !isAdminOrdersGet)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(
    ADMIN_SESSION_COOKIE_NAME
  )?.value;

  const authorized = await verifyAdminSessionToken(
    token,
    process.env.ADMIN_SESSION_SECRET
  );

  if (authorized) {
    return NextResponse.next();
  }

  if (isAdminOrdersGet) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      }
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
