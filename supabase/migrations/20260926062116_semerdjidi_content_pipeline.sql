-- Semerdjidi content pipeline: draft storage for the research/news automation.
--
-- The `semerdjidi-research-drafts` Edge Function (see
-- supabase/functions/semerdjidi-research-drafts/index.ts) inserts rows here
-- with status = 'pending_review'. Nothing in the codebase ever sets
-- status = 'published' automatically — a human reviews each draft (checks the
-- source is real and the summary is accurate) in Supabase Studio and flips
-- the status by hand. There is no anon/authenticated INSERT policy: all
-- writes go through the Edge Function using the service_role key, which
-- bypasses RLS entirely.
--
-- Applied directly against the shared `vodeco` Supabase project (this
-- platform does not have a dedicated Supabase project of its own — see
-- docs/superpowers/specs/2026-09-25-semerdjidi-platform-design.md). Data is
-- isolated from the project's other tenants purely by the `semerdjidi_`
-- table name prefix.

create table if not exists public.semerdjidi_content_drafts (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  title text not null,
  subtitle text,
  category text,
  body text not null,
  social_caption text,
  source_url text,
  source_citation text,
  status text not null default 'pending_review',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_note text
);

create index if not exists semerdjidi_content_drafts_status_created_at_idx
  on public.semerdjidi_content_drafts (status, created_at desc);

alter table public.semerdjidi_content_drafts enable row level security;

-- Published drafts are readable by anyone (this is what the site's public
-- "Свежее" feed queries via a raw PostgREST fetch, no service key involved).
create policy "semerdjidi_content_drafts_select_published"
  on public.semerdjidi_content_drafts
  for select
  to anon, authenticated
  using (status = 'published');
