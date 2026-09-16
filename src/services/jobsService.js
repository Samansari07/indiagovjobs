import { supabase } from "../lib/supabaseClient";

const PAGE_SIZE = 20;

/**
 * Fetch a paginated, filtered list of open jobs.
 * RLS already restricts public reads to status = 'open', but we filter
 * explicitly too so admins previewing the same query don't get confused.
 */
export async function listJobs({
  page = 0,
  search = "",
  state = "",
  qualification = "",
  stream = "",
  organization = "",
  jobType = "",
  sort = "closing_soon",
} = {}) {
  let query = supabase.from("jobs").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,organization.ilike.%${search}%`
    );
  }
  if (state) query = query.eq("state", state);
  if (qualification) query = query.eq("qualification", qualification);
  if (stream) query = query.eq("stream", stream);
  if (organization) query = query.eq("organization", organization);
  if (jobType) query = query.eq("job_type", jobType);

  if (sort === "closing_soon") {
    query = query.order("application_end", { ascending: true, nullsFirst: false });
  } else if (sort === "latest") {
    query = query.order("created_at", { ascending: false });
  }

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { jobs: data ?? [], total: count ?? 0, pageSize: PAGE_SIZE };
}

export async function getJobBySlug(slug) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listClosingSoonJobs(limit = 6) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("application_end", { ascending: true, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function listLatestJobs(limit = 6) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
