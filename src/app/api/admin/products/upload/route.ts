
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image must be between 1 byte and 5 MB" },
        { status: 400 }
      );
    }

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WEBP and AVIF images are allowed" },
        { status: 400 }
      );
    }

    const safeProductId =
      typeof productId === "string" &&
      /^[a-zA-Z0-9_-]{1,80}$/.test(productId)
        ? productId
        : "general";

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `${safeProductId}/${fileName}`;

    const { data, error } = await auth.supabase.storage
      .from("products")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    const { data: publicUrlData } = auth.supabase.storage
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
  } catch {
    return NextResponse.json(
      { success: false, error: "Image upload failed" },
      { status: 500 }
    );
  }
}
