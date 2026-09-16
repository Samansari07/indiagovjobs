import { supabase } from "../lib/supabaseClient";

export async function signInWithGoogle(redirectPath = "/") {
  const redirectTo = `${window.location.origin}${redirectPath}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Ensures a user_profiles row exists after first login, without
 * overwriting fields the user may have already filled in.
 */
export async function ensureProfile(user) {
  const existing = await getProfile(user.id);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("user_profiles")
    .insert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? "",
      email: user.email,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// UI-ONLY check, used to decide whether to show the admin nav link.
// This is NOT a security boundary — actual admin authorization is enforced
// by RLS policies (via is_admin()) on the jobs/exams tables themselves.
export async function checkIsAdmin(userId) {
  const { data, error } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return false; // fail closed — never assume admin on error
  return data?.role === "admin";
}
