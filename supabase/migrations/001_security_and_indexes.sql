-- IndiaGovJobs — initial security & schema migration
-- Run this once in the Supabase SQL Editor for the IndiaGovJobs project.
-- Safe to re-run: uses IF EXISTS / IF NOT EXISTS guards where possible.

-- 1. Safe migration: add selection_process to exams (does not exist yet)
alter table public.exams
  add column if not exists selection_process text;

-- 2. Before touching is_admin(), verify its current definition:
--   select prosecdef, proconfig from pg_proc where proname = 'is_admin';
-- Only recreate it if it is NOT security definer or has no search_path set.
-- Example safe pattern (adjust to match your existing signature):
--
-- create or replace function public.is_admin()
-- returns boolean
-- language sql
-- security definer
-- set search_path = public
-- as $$
--   select exists (
--     select 1 from admin_roles
--     where user_id = auth.uid() and role = 'admin'
--   );
-- $$;

-- 3. JOBS — public can read only open jobs; admins manage everything
drop policy if exists "public_read_open_jobs" on public.jobs;
create policy "public_read_open_jobs"
  on public.jobs for select
  using (status = 'open');

drop policy if exists "admin_manage_jobs" on public.jobs;
create policy "admin_manage_jobs"
  on public.jobs for all
  using (is_admin())
  with check (is_admin());

-- 4. EXAMS — same pattern
drop policy if exists "public_read_open_exams" on public.exams;
create policy "public_read_open_exams"
  on public.exams for select
  using (status = 'open');

drop policy if exists "admin_manage_exams" on public.exams;
create policy "admin_manage_exams"
  on public.exams for all
  using (is_admin())
  with check (is_admin());

-- 5. USER_PROFILES — users manage only their own row
drop policy if exists "own_profile_select" on public.user_profiles;
create policy "own_profile_select"
  on public.user_profiles for select
  using (auth.uid() = id);

drop policy if exists "own_profile_upsert" on public.user_profiles;
create policy "own_profile_upsert"
  on public.user_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "own_profile_update" on public.user_profiles;
create policy "own_profile_update"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 6. BOOKMARKS — strictly own rows only
drop policy if exists "own_bookmarks_select" on public.bookmarks;
create policy "own_bookmarks_select"
  on public.bookmarks for select
  using (auth.uid() = user_id);

drop policy if exists "own_bookmarks_insert" on public.bookmarks;
create policy "own_bookmarks_insert"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

drop policy if exists "own_bookmarks_delete" on public.bookmarks;
create policy "own_bookmarks_delete"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- 7. ADMIN_ROLES — nobody can self-insert/escalate.
-- Only a select policy for reading your own role; no insert/update/delete
-- policy exists for regular users, so RLS blocks those by default.
drop policy if exists "admin_roles_read_own" on public.admin_roles;
create policy "admin_roles_read_own"
  on public.admin_roles for select
  using (auth.uid() = user_id);

-- 8. Make sure RLS is actually enabled everywhere
alter table public.jobs enable row level security;
alter table public.exams enable row level security;
alter table public.user_profiles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.admin_roles enable row level security;
alter table public.alerts enable row level security;

-- 9. Helpful indexes for common filters (safe if they already exist)
create index if not exists idx_jobs_status on public.jobs (status);
create index if not exists idx_jobs_state on public.jobs (state);
create index if not exists idx_jobs_qualification on public.jobs (qualification);
create index if not exists idx_jobs_application_end on public.jobs (application_end);
create index if not exists idx_exams_status on public.exams (status);
create index if not exists idx_bookmarks_user_id on public.bookmarks (user_id);
