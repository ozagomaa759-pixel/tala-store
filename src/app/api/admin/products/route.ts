
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_STATUSES = ["draft", "published", "archived"] as const;

type ProductStatus = (typeof ALLOWED_STATUSES)[number];

type ProductUpdate = Record<string, unknown>;

function errorResponse(error: string, status = 400) {
  return NextResponse.json(
    { success: false, error },
    { status }
  );
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

function isValidStatus(value: unknown): value is ProductStatus {
  return (
    typeof value === "string" &&
    ALLOWED_STATUSES.includes(value as ProductStatus)
  );
}

function isValidBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateImages(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  if (value.length > 20) {
    return null;
  }

  const images: string[] = [];

  for (const image of value) {
    if (!isValidImageUrl(image)) {
      return null;
    }

    images.push(image);
  }

  return [...new Set(images)];
}

async function authorizeAdmin() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return null;
  }

  return createAdminClient();
}

async function getProductCategory(
  db: Awaited<ReturnType<typeof createAdminClient>>,
  categoryId: string
) {
  return db
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();
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

    if (status) {
      if (!isValidStatus(status)) {
        return errorResponse("Invalid product status");
      }

      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET products error:", error);
      return errorResponse("Could not load products", 500);
    }

    return NextResponse.json({
      success: true,
      products: data ?? [],
    });
  } catch (error) {
    console.error("GET products error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Internal server error",
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse("Invalid request body");
    }

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!name || name.length > 160) {
      return errorResponse("Product name is required (maximum 160 characters)");
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
      return errorResponse(
        "Compare-at price must be greater than or equal to product price"
      );
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

    const { data: category, error: categoryError } =
      await getProductCategory(db, body.category_id);

    if (categoryError || !category) {
      return errorResponse("The selected category does not exist");
    }

    const images =
      body.images === undefined ? [] : validateImages(body.images);

    if (images === null) {
      return errorResponse("Invalid product images");
    }

    const mainImage =
      body.main_image === null ||
      body.main_image === undefined ||
      body.main_image === ""
        ? null
        : isValidImageUrl(body.main_image)
          ? body.main_image
          : undefined;

    if (mainImage === undefined) {
      return errorResponse("Invalid main image URL");
    }

    if (
      body.is_featured !== undefined &&
      !isValidBoolean(body.is_featured)
    ) {
      return errorResponse("Invalid is_featured value");
    }

    if (
      body.is_best_seller !== undefined &&
      !isValidBoolean(body.is_best_seller)
    ) {
      return errorResponse("Invalid is_best_seller value");
    }

    if (
      body.is_new_arrival !== undefined &&
      !isValidBoolean(body.is_new_arrival)
    ) {
      return errorResponse("Invalid is_new_arrival value");
    }

    const sortOrder =
      body.sort_order === undefined ? 0 : Number(body.sort_order);

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      return errorResponse("Invalid sort order");
    }

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
      main_image: mainImage,
      images,
      status,
      is_featured: body.is_featured === true,
      is_best_seller: body.is_best_seller === true,
      is_new_arrival: body.is_new_arrival === true,
      sort_order: sortOrder,
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
      error instanceof Error
        ? error.message
        : "Internal server error",
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse("Invalid request body");
    }

    if (typeof body.id !== "string" || !body.id.trim()) {
      return errorResponse("Product ID is required");
    }

    const updates: ProductUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 160
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

      const slug = makeSlug(body.slug);

      if (!slug) {
        return errorResponse("Invalid product slug");
      }

      updates.slug = slug;
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

    if (body.category_id !== undefined) {
      if (
        typeof body.category_id !== "string" ||
        !body.category_id.trim()
      ) {
        return errorResponse("Invalid category");
      }

      const { data: category, error: categoryError } =
        await getProductCategory(db, body.category_id);

      if (categoryError || !category) {
        return errorResponse("The selected category does not exist");
      }

      updates.category_id = body.category_id;
    }

    if (body.description !== undefined) {
      if (
        body.description !== null &&
        typeof body.description !== "string"
      ) {
        return errorResponse("Invalid product description");
      }

      updates.description =
        typeof body.description === "string"
          ? body.description.trim() || null
          : null;
    }

    if (body.main_image !== undefined) {
      if (body.main_image === null || body.main_image === "") {
        updates.main_image = null;
      } else if (isValidImageUrl(body.main_image)) {
        updates.main_image = body.main_image;
      } else {
        return errorResponse("Invalid main image URL");
      }
    }

    if (body.images !== undefined) {
      const images = validateImages(body.images);

      if (images === null) {
        return errorResponse("Invalid product images");
      }

      updates.images = images;
    }

    if (body.status !== undefined) {
      if (!isValidStatus(body.status)) {
        return errorResponse("Invalid product status");
      }

      updates.status = body.status;
    }

    if (body.sort_order !== undefined) {
      const sortOrder = Number(body.sort_order);

      if (!Number.isInteger(sortOrder) || sortOrder < 0) {
        return errorResponse("Invalid sort order");
      }

      updates.sort_order = sortOrder;
    }

    const booleanFields = [
      "is_featured",
      "is_best_seller",
      "is_new_arrival",
    ] as const;

    for (const field of booleanFields) {
      if (body[field] !== undefined) {
        if (!isValidBoolean(body[field])) {
          return errorResponse(`Invalid ${field} value`);
        }

        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 1) {
      return errorResponse("No valid product changes were provided");
    }

    const { data, error } = await db
      .from("products")
      .update(updates as never)
      .eq("id", body.id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("PATCH product error:", error);
      return errorResponse(error.message, 500);
    }

    if (!data) {
      return errorResponse("Product not found", 404);
    }

    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error("PATCH product error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Internal server error",
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

    if (!id?.trim()) {
      return errorResponse("Product ID is required");
    }

    const { data, error } = await db
      .from("products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("DELETE product error:", error);
      return errorResponse(error.message, 500);
    }

    if (!data) {
      return errorResponse("Product not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE product error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Internal server error",
      500
    );
  }
}
