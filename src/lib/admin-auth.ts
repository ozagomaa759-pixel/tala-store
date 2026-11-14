
import { cookies } from "next/headers";

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

  const expiry = Number(expiresAt);

  if (!Number.isSafeInteger(expiry)) return false;

  if (expiry <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  try {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
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

export async function requireAdmin(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    console.error("ADMIN_SESSION_SECRET is missing.");
    return false;
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    return await verifyAdminSession(token, secret);
  } catch {
    return false;
  }
}
