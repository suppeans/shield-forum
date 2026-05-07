import { describe, expect, it } from "vitest";
import {
  getArticleBySlug,
  getForumContent,
  getHomeContent,
  getKnowledgeContent,
  getPostBySlug,
  hasSupabaseEnv,
  searchContent,
} from "@/lib/repositories/forum";

describe("forum repository fallback", () => {
  it("reports missing Supabase environment in local fallback mode", () => {
    expect(hasSupabaseEnv()).toBe(false);
  });

  it("returns public home content from sample data", async () => {
    const content = await getHomeContent();

    expect(content.featuredArticles.length).toBeGreaterThan(0);
    expect(content.latestPosts.length).toBeGreaterThan(0);
    expect(content.categories.length).toBeGreaterThan(0);
    expect(content.trendingTags.length).toBeGreaterThan(0);
    expect(content.latestPosts.every((post) => post.status === "published")).toBe(
      true,
    );
  });

  it("filters hidden records from public forum and knowledge lists", async () => {
    const forum = await getForumContent();
    const knowledge = await getKnowledgeContent();

    expect(forum.posts.map((post) => post.slug)).not.toContain(
      "hidden-moderation-note",
    );
    expect(knowledge.articles.map((article) => article.slug)).not.toContain(
      "hidden-admin-draft",
    );
  });

  it("loads published detail records by slug", async () => {
    const post = await getPostBySlug("test-supabase-rls-before-launch");
    const article = await getArticleBySlug(
      "launch-checklist-public-security-forums",
    );

    expect(post?.title).toContain("Supabase RLS");
    expect(article?.title).toContain("launch checklist");
  });

  it("searches published posts and articles only", async () => {
    const results = await searchContent("turnstile");
    const hiddenResults = await searchContent("forbidden hidden");

    expect(results.posts.map((post) => post.slug)).toContain(
      "cloudflare-turnstile-post-forms",
    );
    expect(results.articles.length + results.posts.length).toBeGreaterThan(0);
    expect(hiddenResults.posts).toHaveLength(0);
    expect(hiddenResults.articles).toHaveLength(0);
  });
});
