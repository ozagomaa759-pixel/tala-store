
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

async function authorizeAdmin() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return null;
  }

  return createAdminClient();
}

function isValidText(value: unknown): value is string {
  return typeof value === "string";
}

function isValidOrder(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0
  );
}

function isValidLink(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.startsWith("/") &&
    !value.startsWith("//")
  );
}

// GET: Fetch all hero slides for admin
export async function GET() {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const { data, error } = await db
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET hero slides error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      slides: data ?? [],
    });
  } catch (error) {
    console.error("GET hero slides error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unable to fetch hero slides",
      500
    );
  }
}

// POST: Create a hero slide
export async function POST(request: NextRequest) {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    const title = isValidText(body.title) ? body.title.trim() : "";
    const subtitle = isValidText(body.subtitle)
      ? body.subtitle.trim()
      : "";
    const description = isValidText(body.description)
      ? body.description.trim()
      : "";

    const imageUrl = isValidText(body.image_url)
      ? body.image_url.trim()
      : "";

    const mobileImageUrl =
      body.mobile_image_url === null ||
      body.mobile_image_url === ""
        ? null
        : isValidText(body.mobile_image_url)
          ? body.mobile_image_url.trim()
          : undefined;

    const buttonText = isValidText(body.button_text)
      ? body.button_text.trim()
      : "Discover Collection";

    const buttonLink =
      body.button_link === undefined
        ? "/products"
        : body.button_link;

    const sortOrder =
      body.sort_order === undefined ? 0 : body.sort_order;

    const isActive =
      body.is_active === undefined ? true : body.is_active;

    if (!imageUrl) {
      return errorResponse("Hero image is required");
    }

    if (mobileImageUrl === undefined) {
      return errorResponse("Invalid mobile image URL");
    }

    if (!isValidLink(buttonLink)) {
      return errorResponse("Button link must be a valid internal path");
    }

    if (!isValidOrder(sortOrder)) {
      return errorResponse("Invalid sort order");
    }

    if (typeof isActive !== "boolean") {
      return errorResponse("Invalid active status");
    }

    const insertData = {
      title,
      subtitle,
      description,
      image_url: imageUrl,
      mobile_image_url: mobileImageUrl,
      button_text: buttonText || "Discover Collection",
      button_link: buttonLink.trim(),
      is_active: isActive,
      sort_order: sortOrder,
    };

    const { data, error } = await db
      .from("hero_slides")
      .insert([insertData] as never[])
      .select("*")
      .single();

    if (error) {
      console.error("POST hero slide error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json(
      {
        success: true,
        slide: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST hero slide error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unable to create hero slide",
      500
    );
  }
}

// PATCH: Update a hero slide
export async function PATCH(request: NextRequest) {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    if (
      typeof body.id !== "string" ||
      !body.id.trim()
    ) {
      return errorResponse("Hero slide ID is required");
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    const textFields = [
      "title",
      "subtitle",
      "description",
      "image_url",
      "mobile_image_url",
      "button_text",
    ] as const;

    for (const field of textFields) {
      if (body[field] !== undefined) {
        if (
          body[field] !== null &&
          !isValidText(body[field])
        ) {
          return errorResponse(`Invalid ${field}`);
        }

        updates[field] =
          typeof body[field] === "string"
            ? body[field].trim() || null
            : null;
      }
    }

    if (body.image_url !== undefined) {
      if (
        typeof body.image_url !== "string" ||
        !body.image_url.trim()
      ) {
        return errorResponse("Hero image is required");
      }
    }

    if (body.button_link !== undefined) {
      if (!isValidLink(body.button_link)) {
        return errorResponse(
          "Button link must be a valid internal path"
        );
      }

      updates.button_link = body.button_link.trim();
    }

    if (body.sort_order !== undefined) {
      if (!isValidOrder(body.sort_order)) {
        return errorResponse("Invalid sort order");
      }

      updates.sort_order = body.sort_order;
    }

    if (body.is_active !== undefined) {
      if (typeof body.is_active !== "boolean") {
        return errorResponse("Invalid active status");
      }

      updates.is_active = body.is_active;
    }

    const { data, error } = await db
      .from("hero_slides")
      .update(updates as never)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) {
      console.error("PATCH hero slide error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      slide: data,
    });
  } catch (error) {
    console.error("PATCH hero slide error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unable to update hero slide",
      500
    );
  }
}

// DELETE: Delete a hero slide
export async function DELETE(request: NextRequest) {
  try {
    const db = await authorizeAdmin();

    if (!db) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Hero slide ID is required");
    }

    const { error } = await db
      .from("hero_slides")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE hero slide error:", error);
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      message: "Hero slide deleted successfully",
    });
  } catch (error) {
    console.error("DELETE hero slide error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unable to delete hero slide",
      500
    );
  }
}
