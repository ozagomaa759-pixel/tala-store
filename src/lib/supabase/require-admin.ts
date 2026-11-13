import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      user: null,
      supabase,
    };
  }

  const {
    data: isAdmin,
    error: adminError,
  } = await supabase.rpc("is_tala_admin");

  if (adminError || isAdmin !== true) {
    return {
      authorized: false,
      user: null,
      supabase,
    };
  }

  return {
    authorized: true,
    user,
    supabase,
  };
}
