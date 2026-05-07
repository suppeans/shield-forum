# Cybersecurity Forum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Next.js cybersecurity knowledge forum backed by Supabase and prepared for Vercel plus Cloudflare.

**Architecture:** The app uses Next.js App Router on Vercel, Supabase Auth/Postgres/RLS for identity and data, and Cloudflare DNS/WAF/CDN/Turnstile at the public edge. Local UI pages use server components and a typed repository boundary so the app can render with sample data when Supabase env vars are not configured, while mutations and production data access route through Supabase clients.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase JS/SSR, Zod, Vitest, Testing Library, Playwright, CSS modules/global CSS, SQL migrations.

---

## File Structure

- `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `postcss.config.mjs`: project tooling.
- `src/app`: Next.js routes and layouts.
- `src/components`: shared UI components for navigation, lists, forms, and cards.
- `src/lib`: domain types, validation, Supabase clients, sample data, repositories, and server actions.
- `supabase/migrations/0001_initial_schema.sql`: tables, indexes, triggers, and RLS policies.
- `tests`: unit tests for validation, repository fallback, and migration policy coverage.
- `e2e`: smoke tests for public pages.
- `docs/deployment.md`: Cloudflare, Vercel, and Supabase deployment setup.
- `.env.example`: required environment variables.

## Tasks

### Task 1: Scaffold Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `postcss.config.mjs`

- [ ] **Step 1: Write package scripts and dependency manifest**

Create `package.json` with scripts:

```json
{
  "name": "cybersecurity-knowledge-forum",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/ssr": "0.10.2",
    "@supabase/supabase-js": "2.105.3",
    "lucide-react": "1.14.0",
    "next": "16.2.5",
    "react": "19.2.6",
    "react-dom": "19.2.6",
    "zod": "4.4.3"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.1",
    "@playwright/test": "1.59.1",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "16.3.2",
    "@types/node": "^24.10.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.1.0",
    "eslint": "^9.39.0",
    "eslint-config-next": "16.2.5",
    "jsdom": "^27.2.0",
    "typescript": "^5.9.3",
    "vitest": "4.1.5"
  }
}
```

- [ ] **Step 2: Add TypeScript, Next, ESLint, Vitest, Playwright, and PostCSS config**

Use strict TypeScript, Next App Router defaults, Vitest jsdom environment, and Playwright web server `npm run dev`.

- [ ] **Step 3: Install dependencies**

Run: `node /tmp/codex-npm/bin/npm-cli.js install`

Expected: `package-lock.json` is created and dependencies install successfully.

- [ ] **Step 4: Commit tooling**

Run:

```bash
git add package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs vitest.config.ts playwright.config.ts postcss.config.mjs
git commit -m "chore: scaffold next tooling"
```

### Task 2: Domain Types, Sample Data, and Validation

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/sample-data.ts`
- Create: `src/lib/validation.ts`
- Test: `tests/validation.test.ts`

- [ ] **Step 1: Write failing validation tests**

Test that post input trims fields, rejects empty titles, rejects unsafe HTML, and accepts safe Markdown-like text.

- [ ] **Step 2: Run validation tests and confirm RED**

Run: `npm test -- tests/validation.test.ts`

Expected: FAIL because `src/lib/validation.ts` does not exist.

- [ ] **Step 3: Implement domain types, sample data, and Zod validation**

Create typed records for profiles, categories, tags, posts, comments, and articles. Implement `postInputSchema`, `commentInputSchema`, `articleInputSchema`, `profileInputSchema`, `slugify`, and `rejectUnsafeMarkup`.

- [ ] **Step 4: Run validation tests and confirm GREEN**

Run: `npm test -- tests/validation.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit domain layer**

Run:

```bash
git add src/lib/types.ts src/lib/sample-data.ts src/lib/validation.ts tests/validation.test.ts
git commit -m "feat: add forum domain validation"
```

### Task 3: Supabase Schema and RLS

**Files:**
- Create: `supabase/migrations/0001_initial_schema.sql`
- Test: `tests/supabase-migration.test.ts`

- [ ] **Step 1: Write failing migration coverage tests**

Test that the migration defines all required tables, enables RLS, includes public read policies, author write policies, admin policies, status checks, indexes, and profile trigger.

- [ ] **Step 2: Run migration tests and confirm RED**

Run: `npm test -- tests/supabase-migration.test.ts`

Expected: FAIL because migration does not exist.

- [ ] **Step 3: Implement migration**

Create enums, tables, indexes, timestamp trigger, auth profile trigger, helper `public.is_admin()`, and RLS policies matching the design spec.

- [ ] **Step 4: Run migration tests and confirm GREEN**

Run: `npm test -- tests/supabase-migration.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit Supabase schema**

Run:

```bash
git add supabase/migrations/0001_initial_schema.sql tests/supabase-migration.test.ts
git commit -m "feat: add supabase schema and rls"
```

### Task 4: Supabase Clients and Repository Boundary

**Files:**
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/repositories/forum.ts`
- Test: `tests/forum-repository.test.ts`

- [ ] **Step 1: Write failing repository tests**

Test that repository functions return sample data without Supabase env vars, filter hidden records, and can search posts and articles.

- [ ] **Step 2: Run repository tests and confirm RED**

Run: `npm test -- tests/forum-repository.test.ts`

Expected: FAIL because repository does not exist.

- [ ] **Step 3: Implement Supabase client helpers and repository functions**

Implement `hasSupabaseEnv`, browser/server client factories, `getHomeContent`, `getForumContent`, `getKnowledgeContent`, `getPostBySlug`, `getArticleBySlug`, and `searchContent`.

- [ ] **Step 4: Run repository tests and confirm GREEN**

Run: `npm test -- tests/forum-repository.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit repository layer**

Run:

```bash
git add src/lib/supabase src/lib/repositories/forum.ts tests/forum-repository.test.ts
git commit -m "feat: add forum repository boundary"
```

### Task 5: App Shell and Public Pages

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/forum/page.tsx`
- Create: `src/app/forum/[slug]/page.tsx`
- Create: `src/app/knowledge/page.tsx`
- Create: `src/app/knowledge/[slug]/page.tsx`
- Create: `src/app/tags/page.tsx`
- Create: `src/app/search/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/components/*.tsx`

- [ ] **Step 1: Implement accessible page shell and public pages**

Create a professional, information-dense UI with navigation, content lists, side panels, responsive layout, and real sample content.

- [ ] **Step 2: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`

Expected: both pass.

- [ ] **Step 3: Commit public UI**

Run:

```bash
git add src/app src/components
git commit -m "feat: build public forum and knowledge pages"
```

### Task 6: Auth, Profile, Forms, and Admin Surfaces

**Files:**
- Create: `src/app/auth/sign-in/page.tsx`
- Create: `src/app/profile/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/lib/actions/auth.ts`
- Create: `src/lib/actions/content.ts`
- Create: `src/components/auth-form.tsx`
- Create: `src/components/post-form.tsx`
- Create: `src/components/comment-form.tsx`
- Create: `src/components/admin-panel.tsx`

- [ ] **Step 1: Add server actions and forms**

Implement email/password sign in and sign up actions, post/comment validation actions, profile display, and admin dashboard UI.

- [ ] **Step 2: Run typecheck and unit tests**

Run: `npm run typecheck && npm test`

Expected: both pass.

- [ ] **Step 3: Commit auth and admin surfaces**

Run:

```bash
git add src/app/auth src/app/profile src/app/admin src/lib/actions src/components/*form.tsx src/components/admin-panel.tsx
git commit -m "feat: add auth forms and admin surfaces"
```

### Task 7: Deployment Configuration and Docs

**Files:**
- Create: `.env.example`
- Create: `vercel.json`
- Create: `docs/deployment.md`
- Create: `docs/cloudflare-security.md`

- [ ] **Step 1: Add deployment docs and config**

Document Supabase project setup, migration execution, Vercel env vars, Cloudflare DNS/WAF/CDN/Turnstile setup, and first admin bootstrap.

- [ ] **Step 2: Run docs/config checks**

Run: `npm run typecheck && npm run lint`

Expected: both pass.

- [ ] **Step 3: Commit deployment docs**

Run:

```bash
git add .env.example vercel.json docs/deployment.md docs/cloudflare-security.md
git commit -m "docs: add deployment configuration guide"
```

### Task 8: Smoke Tests and Final Verification

**Files:**
- Create: `e2e/public-pages.spec.ts`

- [ ] **Step 1: Write Playwright smoke tests**

Test that home, forum, knowledge, search, tags, sign-in, profile, and admin pages load and expose expected landmarks/text.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run e2e
```

Expected: all commands pass.

- [ ] **Step 3: Commit smoke tests**

Run:

```bash
git add e2e/public-pages.spec.ts
git commit -m "test: add public page smoke tests"
```

## Self-Review

Spec coverage:

- Product pages are covered by Tasks 5 and 6.
- Supabase schema, RLS, auth, and data boundaries are covered by Tasks 3 and 4.
- Abuse controls are covered by the migration, validation, Turnstile environment docs, and deployment docs in Tasks 2, 3, 6, and 7.
- Vercel and Cloudflare setup are covered by Task 7.
- Testing strategy is covered by Tasks 2, 3, 4, 5, 6, and 8.

Placeholder scan: no TBD/TODO placeholders are intentionally present in this plan.

Type consistency: domain names use `Profile`, `Category`, `Tag`, `Post`, `Comment`, and `Article`; repository function names are consistent across tasks.
