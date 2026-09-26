-- Weekly scheduled trigger for the semerdjidi-research-drafts Edge Function.
--
-- pg_cron fires an async HTTP POST (via pg_net) every Monday at 06:00 UTC.
-- The function has verify_jwt = true, so the call needs *some* valid Supabase
-- JWT in the Authorization header — the public anon key is enough (it is not
-- a secret; it is the same key shipped to browsers). The function's own
-- writes to semerdjidi_content_drafts use the service_role key injected into
-- its own runtime environment by the Edge Function platform, not this token.
--
-- pg_cron and pg_net are already enabled on the shared `vodeco` project.

select cron.schedule(
  'semerdjidi_research_drafts_weekly',
  '0 6 * * 1',
  $$
  select net.http_post(
    url := 'https://cllbxumyagfhtcexqxvh.supabase.co/functions/v1/semerdjidi-research-drafts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbGJ4dW15YWdmaHRjZXhxeHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDI2NDYsImV4cCI6MjA5NTM3ODY0Nn0.jc1fliGi4fMQTm3B2o-QmFeGYvxfykSumaXoYQW7ae4',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbGJ4dW15YWdmaHRjZXhxeHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDI2NDYsImV4cCI6MjA5NTM3ODY0Nn0.jc1fliGi4fMQTm3B2o-QmFeGYvxfykSumaXoYQW7ae4'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);
