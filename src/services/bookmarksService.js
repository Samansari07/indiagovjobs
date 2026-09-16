import { supabase } from "../lib/supabaseClient";

export async function listMyBookmarks(userId) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, job_id, created_at, jobs(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function isJobBookmarked(userId, jobId) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function addBookmark(userId, jobId) {
  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: userId, job_id: jobId });
  if (error) throw error;
}

export async function removeBookmark(userId, jobId) {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);
  if (error) throw error;
}
