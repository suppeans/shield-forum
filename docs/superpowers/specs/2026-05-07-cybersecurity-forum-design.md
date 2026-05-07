# Cybersecurity Knowledge Forum Design

Date: 2026-05-07

## Goal

Build the first version of a public cybersecurity community website that combines a discussion forum with a curated knowledge base. The site should be deployable with Vercel, Supabase, and Cloudflare, and should be usable as a real community product rather than a static landing page.

## Confirmed Scope

The first version is a public community. Anyone can register with email and password, then publish forum posts and comments directly. Moderation is handled after publication by administrators.

The knowledge base starts with tutorial articles only. It does not include automated CVE feeds, RSS ingestion, CTF labs, rankings, or challenge infrastructure in the first version.

## Product Structure

Primary navigation:

- Home
- Forum
- Knowledge
- Tags
- Search
- Sign in / account menu

Core pages:

- Home: featured tutorials, popular discussions, latest posts, and category entry points.
- Forum index: category navigation, recent thread lists, tag filtering, and create-post entry point.
- Post detail: post content, author metadata, tags, comments, and reply form.
- Knowledge index: tutorial article list with tag filtering.
- Article detail: tutorial content, author metadata, tags, and related discussions.
- Profile: public user details, posts, and comments.
- Admin: publish knowledge articles, hide or restore posts and comments, and manage categories and tags.

## User Roles

- Anonymous visitor: can read published posts, comments, articles, categories, tags, and profiles.
- Authenticated user: can create posts and comments, edit their own content, and update their profile.
- Admin: can publish and edit knowledge articles, hide or restore user-generated content, and manage categories and tags.

## Platform Architecture

Use the standard three-platform split:

- Cloudflare: DNS, WAF, CDN-level caching rules, and Turnstile protection for registration and high-abuse form submissions.
- Vercel: Next.js application hosting, server-side rendering, route handlers, and server actions.
- Supabase: email/password Auth, Postgres database, Row Level Security policies, and optional Storage for avatars or article media.

Cloudflare Workers are out of scope for the first version. They can be added later if the site needs custom edge rate limiting, request filtering, or routing logic that cannot be handled cleanly by Cloudflare WAF and the application.

## Data Model

Supabase Postgres tables:

- `profiles`: one row per auth user, including username, display name, avatar URL, bio, role, and timestamps.
- `categories`: forum category name, slug, description, sort order, and visibility.
- `posts`: forum post title, body, category, author, status, view count, and timestamps.
- `comments`: post comments with post ID, author, body, status, parent comment ID for future threading, and timestamps.
- `articles`: knowledge base tutorials with title, slug, summary, body, author, status, published timestamp, and timestamps.
- `tags`: shared tag records with name, slug, and description.
- `post_tags`: many-to-many relationship between posts and tags.
- `article_tags`: many-to-many relationship between articles and tags.

Status fields should support at least `published` and `hidden`. Articles should also support `draft` so admins can prepare content before publication.

## Access Control

Use Supabase Row Level Security as the primary database boundary.

Read policies:

- Published posts, comments, articles, categories, tags, and public profiles are readable by anyone.
- Hidden content is readable by admins and, where useful, by its author.
- Draft articles are readable only by admins.

Write policies:

- Authenticated users can create posts and comments as themselves.
- Users can edit their own posts and comments while those records are not hidden.
- Users can update their own profile, except role fields.
- Admins can hide and restore posts and comments.
- Admins can create, edit, publish, or hide articles.
- Admins can manage categories and tags.

## Application Behavior

All mutations should run through server-side code so validation and authorization remain consistent.

Validation rules:

- Require non-empty titles and bodies.
- Enforce reasonable title, summary, and body length limits.
- Normalize slugs for articles, categories, and tags.
- Store rich text as sanitized Markdown or a constrained editor format.
- Reject unsafe HTML and script content.

Search should start simple with Postgres text search across posts and articles. External search services are out of scope for the first version.

## Abuse Controls

The first version uses post-publication moderation but still includes baseline protections:

- Cloudflare WAF rules for common abuse and known bad traffic.
- Cloudflare Turnstile on registration and post/comment submission.
- Server-side rate checks for posting and commenting.
- Input validation and sanitization before database writes.
- Admin hide/restore actions instead of hard deletion.
- Content status and timestamps to support future audit views.

## Interface Direction

The UI should feel like a professional security community and knowledge tool: quiet, information-dense, easy to scan, and not marketing-heavy.

Desktop layout:

- Home page prioritizes real content immediately.
- Forum pages use category navigation, central thread lists, and a right-side panel for trending tags or featured tutorials.
- Knowledge pages emphasize article titles, summaries, tags, and reading clarity.

Mobile layout:

- Collapse sidebars into filters or stacked sections.
- Keep create-post, search, and auth actions easy to reach.
- Ensure long technical titles, tags, and code-like text wrap cleanly.

## Testing Strategy

Verification should cover:

- Supabase migrations and RLS policies.
- Authenticated and anonymous access paths.
- Post and comment creation.
- Admin-only article publishing.
- Admin hide/restore moderation.
- Search results across forum posts and articles.
- Smoke tests for home, forum, post detail, knowledge index, article detail, sign-in, and profile pages.
- Desktop and mobile layout checks before delivery.

## Out of Scope For First Version

- Automated CVE or RSS ingestion.
- CTF challenges, leaderboards, labs, or writeup scoring.
- Private communities or invite-only access.
- Real-time chat.
- Paid memberships.
- Advanced reputation systems.
- Cloudflare Worker request pipeline.
- External search infrastructure.
