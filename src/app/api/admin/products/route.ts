
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["draft", "published", "archived"] as const;

function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidPrice(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

function isValidStatus(
  value: unknown
): value is (typeof ALLOWED_STATUSES)[number] {
  return (
    typeof value === "string" &&
    ALLOWED_STATUSES.includes(
      value as (typeof ALLOWED_STATUSES)[number]
    )
  );
}

async function authorizeAdmin() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return null;
  }

  return createAdminClient();
}

// GET: Fetch products
export async function GET(request: NextRequest) {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categoryId = searchParams.get("category_id");
    const status = searchParams.get("status");

    let query = db
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (search?.trim()) {
      const value = search.trim().replace(/[%]/g, "");
      query = query.or(
        `name.ilike.%${value}%,slug.ilike.%${value}%`
      );
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (status && isValidStatus(status)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET products error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      products: data ?? [],
    });
  } catch (error) {
    console.error("GET products error:", error);

    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}

// POST: Create product
export async function POST(request: NextRequest) {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return errorResponse("Product name is required");
    }

    const price = Number(body.price);

    if (!isValidPrice(price) || price <= 0) {
      return errorResponse("A valid product price is required");
    }

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? makeSlug(body.slug)
        : makeSlug(name);

    if (!slug) {
      return errorResponse("A valid product slug is required");
    }

    const compareAtPrice =
      body.compare_at_price === null ||
      body.compare_at_price === undefined ||
      body.compare_at_price === ""
        ? null
        : Number(body.compare_at_price);

    if (
      compareAtPrice !== null &&
      (!isValidPrice(compareAtPrice) || compareAtPrice < price)
    ) {
      return errorResponse("Invalid compare-at price");
    }

    const status =
      body.status === undefined ? "draft" : body.status;

    if (!isValidStatus(status)) {
      return errorResponse("Invalid product status");
    }

    if (
      typeof body.category_id !== "string" ||
      !body.category_id.trim()
    ) {
      return errorResponse("A product category is required");
    }

    const images = Array.isArray(body.images)
      ? body.images.filter(
          (image: unknown) => typeof image === "string"
        )
      : [];

    const productData = {
      name,
      slug,
      category_id: body.category_id,
      description:
        typeof body.description === "string"
          ? body.description.trim() || null
          : null,
      price,
      compare_at_price: compareAtPrice,
      main_image:
        typeof body.main_image === "string" && body.main_image
          ? body.main_image
          : null,
      images,
      status,
      is_featured: body.is_featured === true,
      is_best_seller: body.is_best_seller === true,
      is_new_arrival: body.is_new_arrival === true,
      sort_order: Number.isInteger(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0,
    };

    const { data, error } = await db
      .from("products")
      .insert([productData] as never[])
      .select("*")
      .single();

    if (error) {
      console.error("POST product error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json(
      {
        success: true,
        product: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST product error:", error);

    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}

// PATCH: Update product
export async function PATCH(request: NextRequest) {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    if (typeof body.id !== "string" || !body.id.trim()) {
      return errorResponse("Product ID is required");
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {
        return errorResponse("Invalid product name");
      }

      updates.name = body.name.trim();
    }

    if (body.slug !== undefined) {
      if (
        typeof body.slug !== "string" ||
        !body.slug.trim()
      ) {
        return errorResponse("Invalid product slug");
      }

      updates.slug = makeSlug(body.slug);
    }

    if (body.price !== undefined) {
      const price = Number(body.price);

      if (!isValidPrice(price) || price <= 0) {
        return errorResponse("Invalid product price");
      }

      updates.price = price;
    }

    if (body.compare_at_price !== undefined) {
      if (
        body.compare_at_price === null ||
        body.compare_at_price === ""
      ) {
        updates.compare_at_price = null;
      } else {
        const compareAtPrice = Number(body.compare_at_price);

        if (!isValidPrice(compareAtPrice)) {
          return errorResponse("Invalid compare-at price");
        }

        updates.compare_at_price = compareAtPrice;
      }
    }

    const allowedFields = [
      "category_id",
      "description",
      "main_image",
      "is_featured",
      "is_best_seller",
      "is_new_arrival",
      "sort_order",
    ] as const;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (body.images !== undefined) {
      if (!Array.isArray(body.images)) {
        return errorResponse("Images must be an array");
      }

      updates.images = body.images.filter(
        (image: unknown) => typeof image === "string"
      );
    }

    if (body.status !== undefined) {
      if (!isValidStatus(body.status)) {
        return errorResponse("Invalid product status");
      }

      updates.status = body.status;
    }

    for (const field of [
      "is_featured",
      "is_best_seller",
      "is_new_arrival",
    ] as const) {
      if (
        body[field] !== undefined &&
        typeof body[field] !== "boolean"
      ) {
        return errorResponse(`Invalid ${field} value`);
      }
    }

    const { data, error } = await db
      .from("products")
      .update(updates as never)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) {
      console.error("PATCH product error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error("PATCH product error:", error);

    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}

// DELETE: Delete product
export async function DELETE(request: NextRequest) {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Product ID is required");
    }

    const { error } = await db
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE product error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE product error:", error);

    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
