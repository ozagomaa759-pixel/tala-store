
const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE_NAME = "tala_admin_session";
export const ADMIN_SESSION_DURATION_SECONDS = 8 * 60 * 60;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]{43}$/.test(value)) {
    return null;
  }

  try {
    const base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const binary = atob(padded);

    return Uint8Array.from(
      binary,
      (character) => character.charCodeAt(0)
    );
  } catch {
    return null;
  }
}

async function importHmacKey(
  secret: string,
  usage: "sign" | "verify"
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    [usage]
  );
}

export async function createAdminSessionToken(
  secret: string
): Promise<string> {
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is missing.");
  }

  const expiresAt =
    Math.floor(Date.now() / 1000) +
    ADMIN_SESSION_DURATION_SECONDS;

  const payload = String(expiresAt);
  const key = await importHmacKey(secret, "sign");

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  if (!token || !secret) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const [expiresAt, encodedSignature] = parts;

  if (!/^\d{10,12}$/.test(expiresAt)) {
    return false;
  }

  const expiry = Number(expiresAt);
  const now = Math.floor(Date.now() / 1000);

  if (
    !Number.isSafeInteger(expiry) ||
    expiry <= now ||
    expiry > now + ADMIN_SESSION_DURATION_SECONDS + 60
  ) {
    return false;
  }

  const signature = fromBase64Url(encodedSignature);

  if (!signature || signature.length !== 32) {
    return false;
  }

  try {
    const key = await importHmacKey(secret, "verify");

    // Copy into an ArrayBuffer-backed Uint8Array for TypeScript compatibility.
    const signatureBuffer = new Uint8Array(32);
    signatureBuffer.set(signature);

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer.buffer,
      encoder.encode(expiresAt)
    );
  } catch {
    return false;
  }
}
