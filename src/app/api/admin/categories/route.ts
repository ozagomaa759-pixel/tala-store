
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CORE_COLLECTIONS = {
  sets: "Sets",
  jackets: "Jackets",
} as const;

type CoreSlug = keyof typeof CORE_COLLECTIONS;

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

function isCoreSlug(value: string): value is CoreSlug {
  return value in CORE_COLLECTIONS;
}

async function getAdminDatabase() {
  const auth = await requireAdmin();

  if (!auth.authorized) return null;

  return createAdminClient();
}

function optionalText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function validOpacity(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
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

    if (error) return errorResponse(error.message, 500);

    return NextResponse.json({
      success: true,
      categories: data ?? [],
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to fetch categories",
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

    const name = optionalText(body.name);

    if (!name) {
      return errorResponse("Category name is required");
    }

    const slug = makeSlug(optionalText(body.slug) || name);

    if (!slug) {
      return errorResponse("A valid category slug is required");
    }

    if (isCoreSlug(slug)) {
      return errorResponse(
        `${CORE_COLLECTIONS[slug]} is a protected TALA collection. It already exists.`
      );
    }

    const { data: duplicate } = await supabase
      .from("categories")
      .select("id")
      .or(`slug.eq.${slug},name.ilike.${name}`)
      .limit(1)
      .maybeSingle();

    if (duplicate) {
      return errorResponse("A category with this name or slug already exists.");
    }

    const category = {
      name,
      slug,
      description: optionalText(body.description),
      image_url: optionalText(body.image_url) || null,
      mobile_image_url: optionalText(body.mobile_image_url) || null,
      subtitle: optionalText(body.subtitle),
      headline: optionalText(body.headline),
      button_text: optionalText(body.button_text, "EXPLORE"),
      button_link:
        optionalText(body.button_link) || `/collections/${slug}`,
      overlay_opacity: validOpacity(body.overlay_opacity)
        ? body.overlay_opacity
        : 20,
      show_on_homepage: body.show_on_homepage !== false,
      is_active: body.is_active !== false,
      sort_order:
        typeof body.sort_order === "number" &&
        Number.isInteger(body.sort_order)
          ? body.sort_order
          : 0,
    };

    const { data, error } = await supabase
      .from("categories")
      .insert([category] as never[])
      .select()
      .single();

    if (error) return errorResponse(error.message, 400);

    return NextResponse.json(
      { success: true, category: data },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to create category",
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

    const { data: existing, error: lookupError } = await supabase
      .from("categories")
      .select("id,name,slug,is_active")
      .eq("id", body.id)
      .maybeSingle();

    if (lookupError) {
      return errorResponse(lookupError.message, 500);
    }

    if (!existing) {
      return errorResponse("Category not found", 404);
    }

    const existingSlug = makeSlug(existing.slug || existing.name);
    const protectedCollection = isCoreSlug(existingSlug);

    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return errorResponse("Invalid category name");
      }

      if (protectedCollection) {
        return errorResponse(
          "The name of a core TALA collection cannot be changed."
        );
      }

      updates.name = body.name.trim();
    }

    if (body.slug !== undefined) {
      if (typeof body.slug !== "string" || !body.slug.trim()) {
        return errorResponse("Invalid category slug");
      }

      const slug = makeSlug(body.slug);

      if (!slug) {
        return errorResponse("Invalid category slug");
      }

      if (protectedCollection) {
        return errorResponse(
          "The slug of a core TALA collection cannot be changed."
        );
      }

      if (isCoreSlug(slug)) {
        return errorResponse(
          "This slug is reserved for a core TALA collection."
        );
      }

      updates.slug = slug;
    }

    const textFields = [
      "description",
      "subtitle",
      "headline",
      "button_text",
      "button_link",
      "image_url",
      "mobile_image_url",
    ] as const;

    for (const field of textFields) {
      if (body[field] !== undefined) {
        if (
          body[field] !== null &&
          typeof body[field] !== "string"
        ) {
          return errorResponse(`Invalid ${field}`);
        }

        updates[field] =
          typeof body[field] === "string"
            ? body[field].trim() || null
            : null;
      }
    }

    if (body.is_active !== undefined) {
      if (typeof body.is_active !== "boolean") {
        return errorResponse("Invalid active status");
      }

      if (protectedCollection && body.is_active === false) {
        return errorResponse(
          "Sets and Jackets must remain active TALA collections."
        );
      }

      updates.is_active = body.is_active;
    }

    if (body.show_on_homepage !== undefined) {
      if (typeof body.show_on_homepage !== "boolean") {
        return errorResponse("Invalid homepage visibility");
      }

      updates.show_on_homepage = body.show_on_homepage;
    }

    if (body.sort_order !== undefined) {
      if (
        typeof body.sort_order !== "number" ||
        !Number.isInteger(body.sort_order)
      ) {
        return errorResponse("Invalid sort order");
      }

      updates.sort_order = body.sort_order;
    }

    if (body.overlay_opacity !== undefined) {
      if (!validOpacity(body.overlay_opacity)) {
        return errorResponse(
          "Overlay opacity must be between 0 and 100"
        );
      }

      updates.overlay_opacity = body.overlay_opacity;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No valid category changes were provided");
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("categories")
      .update(updates as never)
      .eq("id", body.id)
      .select()
      .single();

    if (error) return errorResponse(error.message, 400);

    return NextResponse.json({
      success: true,
      category: data,
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to update category",
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

    if (!id?.trim()) {
      return errorResponse("Category ID is required");
    }

    const { data: existing, error: lookupError } = await supabase
      .from("categories")
      .select("id,name,slug")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      return errorResponse(lookupError.message, 500);
    }

    if (!existing) {
      return errorResponse("Category not found", 404);
    }

    const slug = makeSlug(existing.slug || existing.name);

    if (isCoreSlug(slug)) {
      return errorResponse(
        "Sets and Jackets are permanent TALA collections and cannot be deleted."
      );
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) return errorResponse(error.message, 400);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to delete category",
      500
    );
  }
}
