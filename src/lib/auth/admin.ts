import { createClient } from "@/src/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return Boolean(data);
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false as const, status: 401, error: "No autenticado" };
  }
  const admin = await isCurrentUserAdmin();
  if (!admin) {
    return { ok: false as const, status: 403, error: "No autorizado" };
  }
  return { ok: true as const, user };
}
