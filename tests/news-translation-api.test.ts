// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ read: vi.fn(), translate: vi.fn() }));
vi.mock("@/lib/repositories/news", () => ({ getNewsById: mocks.read }));
vi.mock("@/lib/deepseek-translation", () => ({ translateArticle: mocks.translate }));
import { GET } from "@/app/api/news/[id]/translation/route";
import { newsImportSchema } from "@/lib/validation";
import { articleText } from "@/lib/article-translation";
import fixture from "../docs/news-import.example.json";
const article = newsImportSchema.parse(fixture).news[0];
function call(language = "zh", id = article.id, headers = {}) {
  return GET(new Request(`http://localhost/api/news/${id}/translation?language=${language}`, { headers }), { params: Promise.resolve({ id }) });
}
afterEach(() => vi.resetAllMocks());
describe("translation API boundary", () => {
  it("only translates existing stories in supported target languages", async () => {
    for (const language of ["ja", "fr", "", "zh&prompt=attack"]) expect((await call(language)).status).toBe(language === "zh&prompt=attack" ? 404 : 400);
    expect((await call("zh", "../bad-id")).status).toBe(400);
    expect(mocks.translate).not.toHaveBeenCalled();
    expect((await call()).status).toBe(404);
  });
  it("rejects cross-site requests before reading stories or making a paid request", async () => {
    expect((await call("en", article.id, { "sec-fetch-site": "cross-site" })).status).toBe(403);
    expect(mocks.read).not.toHaveBeenCalled(); expect(mocks.translate).not.toHaveBeenCalled();
  });
  it("uses server-held news, ignores caller text and returns no provider secrets on failure", async () => {
    mocks.read.mockResolvedValue(article);
    mocks.translate.mockResolvedValue(articleText(article));
    const result = await call("en");
    expect(await result.json()).toEqual({ translation: articleText(article) });
    expect(mocks.translate).toHaveBeenCalledWith(articleText(article), "en");
    mocks.translate.mockRejectedValue(new Error("secret-provider-key"));
    const failed = await call();
    expect(failed.status).toBe(503);
    expect(await failed.text()).not.toContain("secret-provider-key");
    expect(failed.headers.get("Retry-After")).toBe("60");
  });
});
