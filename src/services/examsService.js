import { supabase } from "../lib/supabaseClient";

const PAGE_SIZE = 20;

export async function listExams({
  page = 0,
  search = "",
  organization = "",
  level = "",
  qualification = "",
} = {}) {
  let query = supabase.from("exams").select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,organization.ilike.%${search}%`);
  }
  if (organization) query = query.eq("organization", organization);
  if (level) query = query.eq("level", level);
  if (qualification) query = query.eq("qualification", qualification);

  query = query.order("application_end", { ascending: true, nullsFirst: false });

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { exams: data ?? [], total: count ?? 0, pageSize: PAGE_SIZE };
}

export async function getExamBySlug(slug) {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listPopularExams(limit = 6) {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("status", "open")
    .order("application_end", { ascending: true, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
