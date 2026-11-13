
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
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

async function getAdminDatabase() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return null;
  }

  return createAdminClient();
}

export async function GET() {
  try {
    const supabase = await getAdminDatabase();

    if (!supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      categories: data ?? [],
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch categories",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getAdminDatabase();

    if (!supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return errorResponse("Category name is required");
    }

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? makeSlug(body.slug)
        : makeSlug(name);

    if (!slug) {
      return errorResponse("A valid category slug is required");
    }

    const category = {
      name,
      slug,
      description:
        typeof body.description === "string"
          ? body.description
          : "",
      image_url:
        typeof body.image_url === "string" && body.image_url.trim()
          ? body.image_url.trim()
          : null,
      is_active: body.is_active !== false,
      sort_order: Number.isInteger(body.sort_order)
        ? body.sort_order
        : 0,
    };

    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json(
      { success: true, category: data },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create category",
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await getAdminDatabase();

    if (!supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    if (typeof body.id !== "string" || !body.id.trim()) {
      return errorResponse("Category ID is required");
    }

    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {
        return errorResponse("Invalid category name");
      }

      updates.name = body.name.trim();
    }

    if (body.slug !== undefined) {
      if (typeof body.slug !== "string" || !body.slug.trim()) {
        return errorResponse("Invalid category slug");
      }

      updates.slug = makeSlug(body.slug);
    }

    if (body.description !== undefined) {
      if (
        body.description !== null &&
        typeof body.description !== "string"
      ) {
        return errorResponse("Invalid description");
      }

      updates.description = body.description;
    }

    if (body.image_url !== undefined) {
      if (
        body.image_url !== null &&
        typeof body.image_url !== "string"
      ) {
        return errorResponse("Invalid image URL");
      }

      updates.image_url = body.image_url;
    }

    if (body.is_active !== undefined) {
      if (typeof body.is_active !== "boolean") {
        return errorResponse("Invalid active status");
      }

      updates.is_active = body.is_active;
    }

    if (body.sort_order !== undefined) {
      if (!Number.isInteger(body.sort_order)) {
        return errorResponse("Invalid sort order");
      }

      updates.sort_order = body.sort_order;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      category: data,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to update category",
      500
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getAdminDatabase();

    if (!supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return errorResponse("Category ID is required");
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to delete category",
      500
    );
  }
}
