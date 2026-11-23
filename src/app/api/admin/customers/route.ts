
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// GET: عرض العملاء مع Pagination والبحث
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim() || "";
    const requestedPage = Number(params.get("page") || "1");

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = auth.supabase
      .from("customers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      const safeSearch = search.replace(/[,%()]/g, "");

      if (safeSearch) {
        query = query.or(
          `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`
        );
      }
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Fetch customers:", error.message);
      return errorResponse("Could not load customers.", 500);
    }

    const total = count ?? 0;

    return NextResponse.json(
      {
        success: true,
        customers: data ?? [],
        count: total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Fetch customers error:", error);
    return errorResponse("Failed to fetch customers.", 500);
  }
}

// PATCH: تعديل بيانات عميل
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    if (
      typeof body.id !== "string" ||
      !body.id.trim()
    ) {
      return errorResponse("Customer ID is required.");
    }

    const updates: Record<string, unknown> = {};

    if (body.full_name !== undefined) {
      if (
        typeof body.full_name !== "string" ||
        !body.full_name.trim()
      ) {
        return errorResponse("Invalid customer name.");
      }

      updates.full_name = body.full_name.trim();
    }

    if (body.email !== undefined) {
      if (
        body.email !== null &&
        typeof body.email !== "string"
      ) {
        return errorResponse("Invalid email.");
      }

      updates.email = body.email?.trim() || null;
    }

    if (body.phone !== undefined) {
      if (
        body.phone !== null &&
        typeof body.phone !== "string"
      ) {
        return errorResponse("Invalid phone.");
      }

      updates.phone = body.phone?.trim() || null;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No changes provided.");
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from("customers")
      .update(updates as never)
      .eq("id", body.id.trim())
      .select()
      .single();

    if (error) {
      console.error("Update customer:", error.message);
      return errorResponse("Could not update customer.", 400);
    }

    return NextResponse.json({
      success: true,
      customer: data,
      message: "Customer updated successfully.",
    });
  } catch (error) {
    console.error("Update customer error:", error);
    return errorResponse("Failed to update customer.", 500);
  }
}

// DELETE: حذف عميل
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id?.trim()) {
      return errorResponse("Customer ID is required.");
    }

    const { error } = await auth.supabase
      .from("customers")
      .delete()
      .eq("id", id.trim());

    if (error) {
      console.error("Delete customer:", error.message);
      return errorResponse(
        "Could not delete customer. They may have linked orders.",
        400
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    console.error("Delete customer error:", error);
    return errorResponse("Failed to delete customer.", 500);
  }
}
