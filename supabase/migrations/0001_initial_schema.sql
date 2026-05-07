create extension if not exists pgcrypto;

create type public.user_role as enum ('user', 'admin');
create type public.content_status as enum ('published', 'hidden');
create type public.article_status as enum ('draft', 'published', 'hidden');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_]{3,32}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  bio text check (bio is null or char_length(bio) <= 280),
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 280),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 50),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 280),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  body text not null check (char_length(body) between 1 and 20000),
  category_id uuid not null references public.categories(id),
  author_id uuid not null references public.profiles(id) on delete cascade,
  status public.content_status not null default 'published',
  view_count integer not null default 0 check (view_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 8000),
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null check (char_length(summary) between 1 and 280),
  body text not null check (char_length(body) between 1 and 40000),
  author_id uuid not null references public.profiles(id) on delete cascade,
  status public.article_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create index posts_category_created_idx on public.posts(category_id, created_at desc);
create index posts_author_created_idx on public.posts(author_id, created_at desc);
create index posts_search_idx on public.posts using gin (
  to_tsvector('english', title || ' ' || body)
);
create index comments_post_created_idx on public.comments(post_id, created_at);
create index articles_published_idx on public.articles(published_at desc)
  where status = 'published';
create index articles_search_idx on public.articles using gin (
  to_tsvector('english', title || ' ' || summary || ' ' || body)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    'user_' || substr(replace(new.id::text, '-', ''), 1, 12),
    coalesce(new.raw_user_meta_data->>'display_name', 'New member')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.articles enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.article_tags enable row level security;

create policy "public profiles are readable"
on public.profiles for select
using (true);

create policy "users can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "admins can manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "visible categories are readable"
on public.categories for select
using (is_visible = true or public.is_admin());

create policy "admins can manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

create policy "tags are readable"
on public.tags for select
using (true);

create policy "admins can manage tags"
on public.tags for all
using (public.is_admin())
with check (public.is_admin());

create policy "published posts are readable"
on public.posts for select
using (status = 'published' or author_id = auth.uid() or public.is_admin());

create policy "authors can create posts"
on public.posts for insert
with check (author_id = auth.uid() and status = 'published');

create policy "authors can update own visible posts"
on public.posts for update
using (author_id = auth.uid() and status = 'published')
with check (author_id = auth.uid() and status = 'published');

create policy "admins can moderate posts"
on public.posts for all
using (public.is_admin())
with check (public.is_admin());

create policy "published comments are readable"
on public.comments for select
using (status = 'published' or author_id = auth.uid() or public.is_admin());

create policy "authors can create comments"
on public.comments for insert
with check (author_id = auth.uid() and status = 'published');

create policy "authors can update own visible comments"
on public.comments for update
using (author_id = auth.uid() and status = 'published')
with check (author_id = auth.uid() and status = 'published');

create policy "admins can moderate comments"
on public.comments for all
using (public.is_admin())
with check (public.is_admin());

create policy "published articles are readable"
on public.articles for select
using (status = 'published' or public.is_admin());

create policy "admins can manage articles"
on public.articles for all
using (public.is_admin())
with check (public.is_admin());

create policy "post tags are readable"
on public.post_tags for select
using (
  exists (
    select 1 from public.posts
    where posts.id = post_tags.post_id
      and (posts.status = 'published' or posts.author_id = auth.uid() or public.is_admin())
  )
);

create policy "authors can manage own post tags"
on public.post_tags for all
using (
  exists (
    select 1 from public.posts
    where posts.id = post_tags.post_id
      and posts.author_id = auth.uid()
      and posts.status = 'published'
  )
)
with check (
  exists (
    select 1 from public.posts
    where posts.id = post_tags.post_id
      and posts.author_id = auth.uid()
      and posts.status = 'published'
  )
);

create policy "admins can manage post tags"
on public.post_tags for all
using (public.is_admin())
with check (public.is_admin());

create policy "article tags are readable"
on public.article_tags for select
using (
  exists (
    select 1 from public.articles
    where articles.id = article_tags.article_id
      and (articles.status = 'published' or public.is_admin())
  )
);

create policy "admins can manage article tags"
on public.article_tags for all
using (public.is_admin())
with check (public.is_admin());
