
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "TALA Upload API is running",
  });
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const db = createAdminClient();

    const formData = await request.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!(file instanceof File)) {
      return errorResponse("Image file is required", 400);
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return errorResponse("Image must be between 1 byte and 5 MB", 400);
    }

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return errorResponse(
        "Only JPG, PNG, WEBP and AVIF images are allowed",
        400
      );
    }

    const safeProductId =
      typeof productId === "string" &&
      /^[a-zA-Z0-9_-]{1,80}$/.test(productId)
        ? productId
        : "general";

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `${safeProductId}/${fileName}`;

    const { data, error } = await db.storage
      .from("products")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      console.error("TALA upload error:", error);
      return errorResponse(error.message, 400);
    }

    const { data: publicUrlData } = db.storage
      .from("products")
      .getPublicUrl(data.path);

    return NextResponse.json(
      {
        success: true,
        path: data.path,
        url: publicUrlData.publicUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("TALA upload error:", error);

    return errorResponse(
      error instanceof Error ? error.message : "Image upload failed",
      500
    );
  }
}
