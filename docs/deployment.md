# Deployment and database transition

## Existing services

This is a Next.js App Router application, not a static HTML upload. Use Node 24, `npm ci`, `npm run build`. The existing Vercel deployment and optional Cloudflare proxy can coexist with Netlify.

## Netlify with GitHub automatic deployment

Import `suppeans/shield-forum` into Netlify and select `main` as the production branch. The checked-in `netlify.toml` sets `npm run build`, publish directory `.next`, Node 24, security headers and the bundled news JSON. Leave the base directory empty.

Netlify automatically applies its Next.js adapter for server-rendered pages and route handlers; no extra framework plugin dependency or static export is needed. [Official Next.js setup](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

File storage is the default and needs no secrets. Import the daily JSON, commit `src/data/news.json`, and push to `main`; Netlify rebuilds and publishes automatically. Hosted functions cannot persist edits to this file, so HTTP import stays disabled in file mode.

For future Supabase imports, complete the migration below and set the Supabase configuration and import token as server environment variables in the Netlify project. Set `NEWS_STORAGE=supabase` in the function runtime environment, then redeploy. Never commit secrets.

## File storage (no credentials required)

`NEWS_STORAGE=file` is the default. Import the daily JSON locally, commit `src/data/news.json`, and deploy the resulting branch. The file is included in Next.js output tracing and Netlify function packaging. HTTP writes are deliberately disabled for this mode because hosted function filesystems are not persistent datastores.

## Reuse the existing Supabase database

The repo already has migrations 0001 and 0002. **Do not edit their migration history on an existing installation.** New migration `0003_japan_it_news.sql` creates the news table, public read policy and service-role write access, then removes old community tables/triggers/roles. It also deletes Auth users linked by the former application's profiles.

1. Back up/export the old database and Auth users. Migration 0003 irreversibly removes old accounts, posts, comments, tutorials, categories and tags. Its transaction prevents partial migration if any operation fails.
2. Verify the database is the original project's database and apply only pending migrations with `supabase db push`. For a fresh database, all three migrations run in order. Do not apply the new migration to an unrelated/shared application's schema.
3. Disable signup and email/password authentication in the hosted Supabase project's Auth configuration. The checked-in local config disables Auth; it does not change hosted project settings automatically. Managed Supabase Auth API remains a provider service, while the app has no login/session/account API.
4. Set `NEWS_STORAGE=supabase`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and server-only `SUPABASE_SERVICE_ROLE_KEY` on your hosting project. For HTTP imports add `NEWS_IMPORT_TOKEN` (32+ characters).
5. Import a verified real daily JSON; no sample news is seeded in the new database.
6. Redeploy once to switch storage mode, then import future editions without rebuilding.

The application fails visibly on a configured database error rather than silently substituting demo data. Remove obsolete Turnstile and signup redirect environment variables from the deployment. Existing anon keys remain for public news reads. Never expose service-role/import secrets as NEXT_PUBLIC variables.

## Cloudflare

Preserve the existing worker origin (`https://shield-forum.vercel.app`) while changing the application at that origin. Security headers are retained. Cache immutable static assets, not `/api/news/import` or HTML news responses. [Security notes](cloudflare-security.md).
