import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Fail loudly in dev, but never leak env details to end users in prod UI.
  // eslint-disable-next-line no-console
  console.error(
    "Missing Supabase env vars. Check your .env file against .env.example."
  );
}

// This client only ever uses the publishable/anon key.
// All access control is enforced by Postgres RLS policies — never trust
// client-side checks (e.g. isAdmin) for anything security-relevant.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
