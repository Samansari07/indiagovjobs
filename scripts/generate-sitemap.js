// Generates public/sitemap.xml from live job/exam slugs before each build.
// Run automatically via `npm run build` (see package.json "prebuild" script).
//
// Uses the publishable key only, same as the frontend — this script only
// reads public, already-open jobs/exams, nothing sensitive.

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import "dotenv/config";

const SITE_URL = process.env.VITE_SITE_URL || "https://indiagovjobs.in";
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Skipping sitemap generation: Supabase env vars not set.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STATIC_PATHS = ["/", "/jobs", "/exams", "/find-my-jobs", "/login"];

async function main() {
  const [{ data: jobs }, { data: exams }] = await Promise.all([
    supabase.from("jobs").select("slug, updated_at").eq("status", "open"),
    supabase.from("exams").select("slug, updated_at").eq("status", "open"),
  ]);

  const urls = [
    ...STATIC_PATHS.map((path) => ({ loc: `${SITE_URL}${path}` })),
    ...(jobs ?? []).map((j) => ({ loc: `${SITE_URL}/jobs/${j.slug}`, lastmod: j.updated_at })),
    ...(exams ?? []).map((e) => ({ loc: `${SITE_URL}/exams/${e.slug}`, lastmod: e.updated_at })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>
`;

  writeFileSync("public/sitemap.xml", xml);
  console.log(`Sitemap generated with ${urls.length} URLs.`);
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err.message);
  // Don't fail the whole build over a sitemap issue.
  process.exit(0);
});
