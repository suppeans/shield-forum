import { describe, expect, it } from "vitest";
import { MAX_IMPORT_BYTES, newsImportSchema, parseImportJson } from "@/lib/validation";
import { japanDate, newsTime } from "@/lib/news-date";
import { filterNews, rankNews } from "@/lib/repositories/news";
import fixture from "../docs/news-import.example.json";
const article = newsImportSchema.parse(fixture).news[0];
describe("news schema and editions", () => {
  it("preserves source date precision separately from briefing collection time", () => {
    const batch = newsImportSchema.parse({ ...fixture, generated_at: "2026-10-04T21:00:00+09:00",
      news: [{ ...fixture.news[0], published_at: "2026-10-02T00:00:00+09:00", published_time_known: false }] });
    expect(batch.news[0].collected_at).toBe("2026-10-04T21:00:00+09:00");
    expect(newsTime(batch.news[0].published_at, batch.news[0].published_time_known)).toBe("2026/10/02");
    expect(newsImportSchema.safeParse({ ...fixture, generated_at: "2026-10-04" }).success).toBe(false);
  });
  it("validates source links, calendar dates, categories and duplicate ids", () => {
    for (const changes of [{ source_url: "data:text/html,bad" }, { source_url: "https://user:pass@example.com/story" }, { category: "unknown" }, { published_at: "2026-10-04" }]) {
      expect(newsImportSchema.safeParse({ ...fixture, news: [{ ...fixture.news[0], ...changes }] }).success).toBe(false);
    }
    expect(newsImportSchema.safeParse({ ...fixture, date: "2026-02-30" }).success).toBe(false);
    expect(newsImportSchema.safeParse({ ...fixture, news: [fixture.news[0], fixture.news[0]] }).success).toBe(false);
    expect(newsImportSchema.safeParse({ ...fixture, news: [] }).success).toBe(false);
  });
  it("caps import size and handles Japanese midnight by timezone, not server date", () => {
    expect(() => parseImportJson(" ".repeat(MAX_IMPORT_BYTES + 1))).toThrow(/2 MiB/);
    expect(japanDate("2026-10-03T14:59:59Z")).toBe("2026-10-03");
    expect(japanDate("2026-10-03T15:00:00Z")).toBe("2026-10-04");
  });
  it("filters by edition date independently of original publication date", () => {
    const olderPublication = { ...article, published_at: "2026-10-02T09:00:00+09:00" };
    expect(filterNews([olderPublication], { date: "2026-10-04", category: "ai", query: "生成AI" })).toHaveLength(1);
    expect(filterNews([olderPublication], { date: "2026-10-02" })).toHaveLength(0);
    expect(filterNews([olderPublication], { tag: "not-a-tag" })).toHaveLength(0);
  });
  it("ranks featured stories, importance and Japanese relevance deterministically", () => {
    const global = { ...article, id: "global", region: "global" as const };
    const normal = { ...article, id: "normal", featured: false };
    expect(rankNews([global, normal, article]).map((news) => news.id)).toEqual([article.id, "global", "normal"]);
  });
});
