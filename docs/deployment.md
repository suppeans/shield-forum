# Deployment Guide

This project is designed for three services:

- Vercel hosts the Next.js application.
- Supabase provides Auth, Postgres, RLS, and optional Storage.
- Cloudflare manages DNS, CDN, WAF, and Turnstile.

## 1. Supabase

Create a Supabase project, then run the migration:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Apply `supabase/migrations/0001_initial_schema.sql`. The migration creates:

- `profiles`, `categories`, `posts`, `comments`, `articles`, `tags`
- `post_tags`, `article_tags`
- Auth profile trigger
- RLS policies for public reads, author writes, and admin moderation

Set Auth to email/password. Add the production site URL and Vercel preview URL patterns to Supabase Auth redirect URLs.

## 2. Bootstrap First Admin

After creating the first account, promote it in SQL:

```sql
update public.profiles
set role = 'admin'
where username = '<generated-or-chosen-username>';
```

Only admins can publish knowledge base articles and manage moderation state.

## 3. Vercel

Import the repository into Vercel and set these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to browser code. The current app does not require it at runtime.

Build command:

```bash
npm run build
```

Development command:

```bash
npm run dev
```

## 4. Cloudflare

Point the production domain to Vercel using Cloudflare DNS:

- Use a CNAME from `forum.example.com` to Vercel's assigned target.
- Keep the record proxied when Vercel custom domain validation is complete.
- Use Full (strict) SSL mode.

Enable:

- WAF managed rules
- Bot Fight Mode or equivalent bot controls
- Turnstile for registration and high-abuse posting surfaces
- CDN caching for static assets

Do not cache authenticated HTML pages at Cloudflare. Cache static Next.js assets and public immutable files only.

## 5. Local Development

Copy `.env.example` to `.env.local` and set Supabase values:

```bash
cp .env.example .env.local
npm install
npm run dev
```

When Supabase env vars are missing, the app renders sample public data so UI development can continue offline. Writes no-op unless Supabase is configured.
