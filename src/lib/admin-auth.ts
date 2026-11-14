
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export async function requireAdmin(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    console.error("ADMIN_SESSION_SECRET is missing.");
    return false;
  }

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(
      ADMIN_SESSION_COOKIE_NAME
    )?.value;

    return await verifyAdminSessionToken(token, secret);
  } catch (error) {
    console.error("Admin session verification failed:", error);
    return false;
  }
}
