// @vitest-environment node
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { importNews, readNews } from "@/lib/news-storage";
import fixture from "../docs/news-import.example.json";
let directory: string;
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), "shield-news-"));
  vi.stubEnv("NEWS_STORAGE", "file");
  vi.stubEnv("NEWS_DATA_FILE", join(directory, "news.json"));
});
afterEach(async () => { vi.unstubAllEnvs(); await rm(directory, { recursive: true, force: true }); });
describe("daily news imports", () => {
  it("creates a file and updates stable ids without losing prior editions", async () => {
    await importNews({ ...fixture, date: "2026-10-03", news: [{ ...fixture.news[0], id: "prior" }] });
    await importNews(fixture);
    await importNews({ ...fixture, news: [{ ...fixture.news[0], title: "更新した見出し" }] });
    const records = await readNews();
    expect(records).toHaveLength(2);
    expect(records.find((article) => article.id === fixture.news[0].id)?.title).toBe("更新した見出し");
    expect(records.find((article) => article.id === "prior")?.edition_date).toBe("2026-10-03");
  });
  it("rejects a whole invalid batch without changing existing bytes", async () => {
    await importNews(fixture);
    const before = await readFile(join(directory, "news.json"), "utf8");
    await expect(importNews({ ...fixture, news: [fixture.news[0], { ...fixture.news[0], id: "bad", source_url: "javascript:alert(1)" }] })).rejects.toThrow();
    expect(await readFile(join(directory, "news.json"), "utf8")).toBe(before);
  });
  it("refuses to overwrite corrupted existing data", async () => {
    await writeFile(join(directory, "news.json"), "{broken");
    await expect(importNews(fixture)).rejects.toThrow();
    expect(await readFile(join(directory, "news.json"), "utf8")).toBe("{broken");
  });
  it("honors the writer lock and cannot overwrite another import", async () => {
    await writeFile(join(directory, "news.json.lock"), "locked");
    await expect(importNews(fixture)).rejects.toMatchObject({ code: "EEXIST" });
  });
  it("replaces same-day fictional samples when real news is imported", async () => {
    await importNews(fixture);
    await importNews({ ...fixture, sample: false, news: [{ ...fixture.news[0], id: "verified-news" }] });
    expect((await readNews()).map((article) => [article.id, article.is_sample])).toEqual([["verified-news", false]]);
  });
});
