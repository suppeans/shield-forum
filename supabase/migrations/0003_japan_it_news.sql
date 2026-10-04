-- Upgrade existing installations instead of rewriting previously applied migrations.
-- Back up the old community first: the legacy account/content removal below is irreversible.
-- Scope is this application's tables and the auth users linked by public.profiles.
begin;
create table public.news_articles (
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_edition_category_idx on public.news_articles(edition_date desc, category);
create index news_tags_idx on public.news_articles using gin(tags);
create trigger news_set_updated_at before update on public.news_articles
for each row execute function public.set_updated_at();
alter table public.news_articles enable row level security;
revoke all on public.news_articles from anon, authenticated;
grant select on public.news_articles to anon, authenticated;
grant all on public.news_articles to service_role;
create policy "public news is readable" on public.news_articles for select to anon, authenticated using (true);
-- No browser write policy. Imports use a server-only service-role key.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
-- Remove only the account records belonging to the old app, before dropping profiles.
delete from auth.users where id in (select id from public.profiles);
drop table public.comments, public.post_tags, public.article_tags, public.posts, public.articles, public.profiles, public.categories, public.tags cascade;
drop function if exists public.is_admin();
drop type if exists public.user_role;
drop type if exists public.content_status;
drop type if exists public.article_status;
commit;
