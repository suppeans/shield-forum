import { describe, expect, it } from "vitest";
import {
  languages,
  t,
  translateArticle,
  translateCategory,
  translatePost,
} from "@/lib/i18n";
import { articles, categories, posts } from "@/lib/sample-data";

describe("i18n translations", () => {
  it("provides Chinese, Japanese, and English UI labels", () => {
    expect(languages.map((language) => language.code)).toEqual([
      "zh",
      "ja",
      "en",
    ]);
    expect(t("zh", "nav.forum")).toBe("论坛");
    expect(t("ja", "nav.forum")).toBe("フォーラム");
    expect(t("en", "nav.forum")).toBe("Forum");
  });

  it("translates seeded forum content by slug", () => {
    expect(translatePost(posts[0], "zh").title).toBe(
      "上线前如何测试 Supabase RLS？",
    );
    expect(translatePost(posts[0], "ja").excerpt).toContain("匿名読み取り");
    expect(translateArticle(articles[0], "zh").summary).toContain(
      "开放注册前",
    );
    expect(translateCategory(categories[0], "ja").name).toBe(
      "Web セキュリティ",
    );
  });

  it("falls back to original content when a translation is missing", () => {
    const customPost = {
      ...posts[0],
      slug: "community-generated-post",
      title: "Original community post",
    };

    expect(translatePost(customPost, "ja").title).toBe(
      "Original community post",
    );
    expect(t("ja", "missing.key")).toBe("missing.key");
  });
});
