
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidPrice(value: unknown) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

// GET: عرض المنتجات
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const categoryId = searchParams.get("category_id");
    const status = searchParams.get("status");

    let query = auth.supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      products: data ?? [],
    });
  } catch {
    return errorResponse("Failed to fetch products", 500);
  }
}

// POST: إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return errorResponse("Product name is required");
    }

    if (!isValidPrice(body.price)) {
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
      (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)
    ) {
      return errorResponse("Invalid compare-at price");
    }

    const product = {
      name,
      slug,
      category_id: body.category_id || null,
      description:
        typeof body.description === "string"
          ? body.description
          : "",
      price: body.price,
      compare_at_price: compareAtPrice,
      main_image: body.main_image || null,
      images: Array.isArray(body.images) ? body.images : [],
      status: body.status || "draft",
      is_featured: body.is_featured === true,
      sort_order: Number.isInteger(body.sort_order)
        ? body.sort_order
        : 0,
    };

    const { data, error } = await auth.supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json(
      { success: true, product: data },
      { status: 201 }
    );
  } catch {
    return errorResponse("Failed to create product", 500);
  }
}

// PATCH: تعديل منتج
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const id = body.id;

    if (typeof id !== "string" || !id.trim()) {
      return errorResponse("Product ID is required");
    }

    const updates: Record<string, unknown> = {};

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
      if (typeof body.slug !== "string" || !body.slug.trim()) {
        return errorResponse("Invalid product slug");
      }

      updates.slug = makeSlug(body.slug);
    }

    if (body.price !== undefined) {
      if (!isValidPrice(body.price)) {
        return errorResponse("Invalid product price");
      }

      updates.price = body.price;
    }

    if (body.compare_at_price !== undefined) {
      if (
        body.compare_at_price !== null &&
        body.compare_at_price !== "" &&
        (
          !Number.isFinite(Number(body.compare_at_price)) ||
          Number(body.compare_at_price) < 0
        )
      ) {
        return errorResponse("Invalid compare-at price");
      }

      updates.compare_at_price =
        body.compare_at_price === "" ||
        body.compare_at_price === null
          ? null
          : Number(body.compare_at_price);
    }

    if (body.category_id !== undefined) {
      updates.category_id = body.category_id || null;
    }

    if (body.description !== undefined) {
      updates.description = body.description;
    }

    if (body.main_image !== undefined) {
      updates.main_image = body.main_image || null;
    }

    if (body.images !== undefined) {
      if (!Array.isArray(body.images)) {
        return errorResponse("Images must be an array");
      }

      updates.images = body.images;
    }

    if (body.status !== undefined) {
      if (!["draft", "active", "archived"].includes(body.status)) {
        return errorResponse("Invalid product status");
      }

      updates.status = body.status;
    }

    if (body.is_featured !== undefined) {
      updates.is_featured = body.is_featured === true;
    }

    if (body.sort_order !== undefined) {
      if (!Number.isInteger(body.sort_order)) {
        return errorResponse("Invalid sort order");
      }

      updates.sort_order = body.sort_order;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch {
    return errorResponse("Failed to update product", 500);
  }
}

// DELETE: حذف منتج
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return errorResponse("Unauthorized", 401);
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return errorResponse("Product ID is required");
    }

    const { error } = await auth.supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch {
    return errorResponse("Failed to delete product", 500);
  }
}
