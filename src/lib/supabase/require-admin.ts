
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export async function requireAdmin() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  let authorized = false;

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(
      ADMIN_SESSION_COOKIE_NAME
    )?.value;

    authorized = await verifyAdminSessionToken(
      token,
      secret
    );
  } catch (error) {
    console.error("Admin session verification failed:", error);
  }

  return {
    authorized,
    user: null,
    supabase: authorized ? createAdminClient() : null,
  };
}
