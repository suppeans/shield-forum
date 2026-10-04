-- Keep source publication precision separate from the briefing's collection time.
begin;
alter table public.news_articles
  add column published_time_known boolean not null default true,
  add column collected_at timestamptz;
commit;
