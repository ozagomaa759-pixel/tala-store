
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": {
    extension: "jpg",
    format: "jpeg",
  },
  "image/png": {
    extension: "png",
    format: "png",
  },
  "image/webp": {
    extension: "webp",
    format: "webp",
  },
  "image/avif": {
    extension: "avif",
    format: "heif",
  },
} as const;

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

function isValidProductId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "TALA Upload API is running",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized.", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!(file instanceof File)) {
      return errorResponse("Image file is required.", 400);
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return errorResponse(
        "Image must be between 1 byte and 5 MB.",
        400
      );
    }

    const typeConfig =
      ALLOWED_TYPES[
        file.type as keyof typeof ALLOWED_TYPES
      ];

    if (!typeConfig) {
      return errorResponse(
        "Only JPG, PNG, WEBP and AVIF images are allowed.",
        400
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let metadata;

    try {
      metadata = await sharp(buffer, {
        limitInputPixels: 40_000_000,
        failOn: "error",
      }).metadata();
    } catch {
      return errorResponse(
        "The uploaded file is not a valid image.",
        400
      );
    }

    if (
      !metadata.format ||
      metadata.format !== typeConfig.format ||
      !metadata.width ||
      !metadata.height ||
      metadata.width > 10000 ||
      metadata.height > 10000
    ) {
      return errorResponse(
        "Invalid image format or dimensions.",
        400
      );
    }

    const safeProductId =
      typeof productId === "string" &&
      isValidProductId(productId)
        ? productId
        : "general";

    if (safeProductId !== "general") {
      const { data: product, error: productError } =
        await auth.supabase
          .from("products")
          .select("id")
          .eq("id", safeProductId)
          .maybeSingle();

      if (productError) {
        console.error(
          "Product lookup error:",
          productError.message
        );

        return errorResponse(
          "Could not verify product.",
          500
        );
      }

      if (!product) {
        return errorResponse("Product not found.", 404);
      }
    }

    const db = createAdminClient();

    const fileName = `${crypto.randomUUID()}.${typeConfig.extension}`;
    const filePath = `${safeProductId}/${fileName}`;

    const { data, error } = await db.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      console.error("TALA upload error:", error.message);

      return errorResponse(
        "Could not upload image. Please try again.",
        500
      );
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
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("TALA upload error:", error);

    return errorResponse(
      "Image upload failed. Please try again.",
      500
    );
  }
}
