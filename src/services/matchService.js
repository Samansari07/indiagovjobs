import { supabase } from "../lib/supabaseClient";

/**
 * Calls the existing match_jobs RPC. This is the ONLY place matching
 * happens — never re-implement scoring logic in the frontend, it would
 * silently drift from the database's real eligibility rules.
 */
export async function matchJobs({
  qualification,
  state,
  stream,
  category,
  gender,
  age,
}) {
  const { data, error } = await supabase.rpc("match_jobs", {
    p_qualification: qualification,
    p_state: state,
    p_stream: stream,
    p_category: category,
    p_gender: gender,
    p_age: age,
  });
  if (error) throw error;
  return data ?? [];
}

/**
 * Builds human-readable match reasons from the wizard inputs and the
 * matched job row. This does NOT change the score — it only explains it,
 * using the same fields the RPC compared. If a field on the job is null,
 * we say so rather than guessing.
 */
export function buildMatchReasons(inputs, job) {
  const reasons = [];

  if (job.qualification == null) {
    reasons.push({ ok: null, text: "Qualification: not specified in available notification data" });
  } else {
    reasons.push({
      ok: job.qualification === inputs.qualification,
      text: `Qualification: ${job.qualification}`,
    });
  }

  if (job.age_min == null && job.age_max == null) {
    reasons.push({ ok: null, text: "Age: not specified in available notification data" });
  } else {
    const withinAge =
      (job.age_min == null || inputs.age >= job.age_min) &&
      (job.age_max == null || inputs.age <= job.age_max);
    reasons.push({
      ok: withinAge,
      text: `Age range: ${job.age_min ?? "?"}–${job.age_max ?? "?"} years`,
    });
  }

  if (job.state == null) {
    reasons.push({ ok: null, text: "State: not specified in available notification data" });
  } else {
    reasons.push({
      ok: job.state === inputs.state || job.state === "All India",
      text: `State eligibility: ${job.state}`,
    });
  }

  return reasons;
}
