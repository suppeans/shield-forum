import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/0001_initial_schema.sql",
);

function migrationSql() {
  return readFileSync(migrationPath, "utf8").toLowerCase();
}

describe("initial Supabase migration", () => {
  it("defines all required forum and knowledge tables", () => {
    const sql = migrationSql();

    for (const table of [
      "profiles",
      "categories",
      "posts",
      "comments",
      "articles",
      "tags",
      "post_tags",
      "article_tags",
    ]) {
      expect(sql).toContain(`create table public.${table}`);
    }
  });

  it("enables RLS on every user-facing table", () => {
    const sql = migrationSql();

    for (const table of [
      "profiles",
      "categories",
      "posts",
      "comments",
      "articles",
      "tags",
      "post_tags",
      "article_tags",
    ]) {
      expect(sql).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("contains public read, author write, and admin moderation policies", () => {
    const sql = migrationSql();

    expect(sql).toContain("published posts are readable");
    expect(sql).toContain("authors can create posts");
    expect(sql).toContain("authors can update own visible posts");
    expect(sql).toContain("published comments are readable");
    expect(sql).toContain("authors can create comments");
    expect(sql).toContain("admins can moderate posts");
    expect(sql).toContain("admins can moderate comments");
    expect(sql).toContain("published articles are readable");
    expect(sql).toContain("admins can manage articles");
  });

  it("includes status checks, indexes, and auth profile trigger", () => {
    const sql = migrationSql();

    expect(sql).toContain("create type public.content_status");
    expect(sql).toContain("create type public.article_status");
    expect(sql).toContain("create index posts_search_idx");
    expect(sql).toContain("create index articles_search_idx");
    expect(sql).toContain("handle_new_user");
    expect(sql).toContain("on auth.users");
    expect(sql).toContain("public.is_admin()");
  });
});
