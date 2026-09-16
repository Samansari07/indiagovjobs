import { supabase } from "../lib/supabaseClient";

/**
 * All functions here rely on RLS ("admin_manage_jobs" / "admin_manage_exams"
 * policies keyed on is_admin()) to actually enforce who can write. If the
 * calling user isn't an admin, Postgres rejects the write and these calls
 * throw — there is no separate client-side admin check happening here.
 */

// ---------- Jobs ----------

export async function adminListJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminGetJob(id) {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function adminCreateJob(payload) {
  const { data, error } = await supabase.from("jobs").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateJob(id, payload) {
  const { data, error } = await supabase.from("jobs").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteJob(id) {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw error;
}

export async function adminSetJobStatus(id, status) {
  return adminUpdateJob(id, { status });
}

export async function adminVerifyJob(id) {
  return adminUpdateJob(id, { last_verified_at: new Date().toISOString() });
}

// ---------- Exams ----------

export async function adminListExams() {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminGetExam(id) {
  const { data, error } = await supabase.from("exams").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function adminCreateExam(payload) {
  const { data, error } = await supabase.from("exams").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateExam(id, payload) {
  const { data, error } = await supabase.from("exams").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteExam(id) {
  const { error } = await supabase.from("exams").delete().eq("id", id);
  if (error) throw error;
}

export async function adminSetExamStatus(id, status) {
  return adminUpdateExam(id, { status });
}

export async function adminVerifyExam(id) {
  return adminUpdateExam(id, { last_verified_at: new Date().toISOString() });
}
