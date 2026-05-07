import { describe, expect, it } from "vitest";
import {
  articleInputSchema,
  commentInputSchema,
  postInputSchema,
  profileInputSchema,
  rejectUnsafeMarkup,
  slugify,
} from "@/lib/validation";

describe("content validation", () => {
  it("trims post titles and bodies while preserving safe markdown", () => {
    const parsed = postInputSchema.parse({
      title: "  Hardening Supabase RLS for forums  ",
      body: "  Use **policy tests** before launch.  ",
      categoryId: "11111111-1111-4111-8111-111111111111",
      tagIds: ["22222222-2222-4222-8222-222222222222"],
    });

    expect(parsed.title).toBe("Hardening Supabase RLS for forums");
    expect(parsed.body).toBe("Use **policy tests** before launch.");
  });

  it("rejects empty post titles", () => {
    expect(() =>
      postInputSchema.parse({
        title: "   ",
        body: "Body is present",
        categoryId: "11111111-1111-4111-8111-111111111111",
        tagIds: [],
      }),
    ).toThrow(/Title is required/);
  });

  it("rejects unsafe HTML in posts, comments, articles, and profiles", () => {
    expect(() =>
      postInputSchema.parse({
        title: "Stored XSS",
        body: "<script>alert(1)</script>",
        categoryId: "11111111-1111-4111-8111-111111111111",
        tagIds: [],
      }),
    ).toThrow(/Unsafe markup/);

    expect(() =>
      commentInputSchema.parse({
        postId: "33333333-3333-4333-8333-333333333333",
        body: "<img src=x onerror=alert(1)>",
      }),
    ).toThrow(/Unsafe markup/);

    expect(() =>
      articleInputSchema.parse({
        title: "Browser exploit notes",
        summary: "Safe summary",
        body: "<iframe src='https://example.com'></iframe>",
        tagIds: [],
        status: "draft",
      }),
    ).toThrow(/Unsafe markup/);

    expect(() =>
      profileInputSchema.parse({
        username: "researcher",
        displayName: "<svg onload=alert(1)>",
        bio: "hello",
      }),
    ).toThrow(/Unsafe markup/);
  });

  it("generates stable slugs from technical titles", () => {
    expect(slugify("  OAuth Token Replay: 防御 Checklist  ")).toBe(
      "oauth-token-replay-checklist",
    );
  });

  it("accepts safe markdown-like text", () => {
    expect(() =>
      rejectUnsafeMarkup(
        "Use `Content-Security-Policy` and block inline scripts.",
      ),
    ).not.toThrow();
  });
});
