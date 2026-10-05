-- SHIELD NEWS: optional database storage for attributed daily news.
begin;

create table if not exists public.news_articles (
  id text primary key check (id ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$'),
  title text not null check (char_length(title) between 1 and 240),
  summary text not null check (char_length(summary) between 1 and 3000),
  category text not null check (category in ('ai','security','business','semiconductors','cloud','careers','development','dx','policy','startups','global')),
  source text not null check (char_length(source) between 1 and 160),
  source_url text not null check (source_url ~ '^https?://'),
  published_at timestamptz not null,
  edition_date date not null,
  image_url text check (image_url is null or image_url ~ '^https?://'),
  why_it_matters text not null check (char_length(why_it_matters) between 1 and 3000),
  core_facts text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  priority integer not null default 3 check (priority between 1 and 5),
  region text not null default 'japan' check (region in ('japan','global')),
  is_sample boolean not null default false,
  published_time_known boolean not null default true,
  collected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news_articles
  add column if not exists published_time_known boolean not null default true,
  add column if not exists collected_at timestamptz;
create index if not exists news_edition_category_idx on public.news_articles(edition_date desc, category);
create index if not exists news_tags_idx on public.news_articles using gin(tags);

create or replace function public.set_news_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists news_set_updated_at on public.news_articles;
create trigger news_set_updated_at before update on public.news_articles
for each row execute function public.set_news_updated_at();

alter table public.news_articles enable row level security;
revoke all on public.news_articles from public, anon, authenticated;
grant select on public.news_articles to anon, authenticated;
grant all on public.news_articles to service_role;
drop policy if exists "public news is readable" on public.news_articles;
create policy "public news is readable" on public.news_articles for select to anon, authenticated using (true);
-- Browser clients can read; imports write with a server-only service-role key.
commit;
