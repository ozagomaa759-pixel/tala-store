import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// GET: عرض العملاء والبحث
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized || !auth.supabase) {
      return errorResponse("Unauthorized", 401);
    }

    const params = request.nextUrl.searchParams;
    const search = params.get("search");

    let query = auth.supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      const safeSearch = search.replace(/[,%()]/g, "");

      query = query.or(
        `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse(error.message, 500);
    }

    return NextResponse.json({
      success: true,
      customers: data ?? [],
      count: data?.length ?? 0,
    });
  } catch {
    return errorResponse("Failed to fetch customers", 500);
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
      return errorResponse("Customer ID is required");
    }

    const updates: Record<string, unknown> = {};

    if (body.full_name !== undefined) {
      if (
        typeof body.full_name !== "string" ||
        !body.full_name.trim()
      ) {
        return errorResponse("Invalid customer name");
      }

      updates.full_name = body.full_name.trim();
    }

    if (body.email !== undefined) {
      if (
        body.email !== null &&
        typeof body.email !== "string"
      ) {
        return errorResponse("Invalid email");
      }

      updates.email = body.email?.trim() || null;
    }

    if (body.phone !== undefined) {
      if (
        body.phone !== null &&
        typeof body.phone !== "string"
      ) {
        return errorResponse("Invalid phone");
      }

      updates.phone = body.phone?.trim() || null;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No changes provided");
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from("customers")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      customer: data,
      message: "Customer updated successfully",
    });
  } catch {
    return errorResponse("Failed to update customer", 500);
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

    if (!id) {
      return errorResponse("Customer ID is required");
    }

    const { error } = await auth.supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      return errorResponse(error.message, 400);
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch {
    return errorResponse("Failed to delete customer", 500);
  }
}
