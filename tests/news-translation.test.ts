// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
import { translateArticle, translateWithDeepSeek } from "@/lib/deepseek-translation";
import { articleText } from "@/lib/article-translation";
import { newsImportSchema } from "@/lib/validation";
import fixture from "../docs/news-import.example.json";
const original = articleText(newsImportSchema.parse(fixture).news[0]);
const translated = { ...original, title: "Translated headline" };
function completion(value: unknown = translated, finish = "stop") {
  return Response.json({ choices: [{ finish_reason: finish, message: { content: JSON.stringify(value) } }] });
}
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("DeepSeek news translation", () => {
  it("requires a server key and never calls the provider when it is absent", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    await expect(translateArticle(original, "zh")).rejects.toThrow(/not configured/);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("uses the fixed provider, JSON output and all news fields, without changing the source", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "private-test-key");
    const fetcher = vi.fn().mockResolvedValue(completion()); vi.stubGlobal("fetch", fetcher);
    expect(await translateWithDeepSeek(original, "zh", "deepseek-flash")).toEqual(translated);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.deepseek.com/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer private-test-key");
    const body = JSON.parse(init.body);
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.thinking).toEqual({ type: "disabled" });
    expect(JSON.parse(body.messages[1].content)).toEqual(original);
    expect(body.messages[0].content).toContain("Simplified Chinese");
    expect(original.title).toBe(fixture.news[0].title);
  });
  it("coalesces duplicate in-flight requests but separates languages and edited content", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "private-test-key");
    const fetcher = vi.fn().mockImplementation(async () => completion()); vi.stubGlobal("fetch", fetcher);
    await Promise.all([translateArticle(original, "zh"), translateArticle(original, "zh")]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    await translateArticle(original, "en");
    await translateArticle({ ...original, title: "Updated source" }, "zh");
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it("rejects truncation, malformed JSON, omitted facts and provider errors; failures can retry", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "private-test-key");
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    for (const response of [completion(translated, "length"), Response.json({ choices: [{ finish_reason: "stop", message: { content: "{broken" } }] }),
      completion({ ...translated, core_facts: [] }), completion({ ...translated, tags: [] }), new Response("private provider body", { status: 429 })]) {
      fetcher.mockResolvedValueOnce(response);
      await expect(translateArticle(original, "zh")).rejects.toThrow();
    }
    fetcher.mockResolvedValueOnce(completion());
    await expect(translateArticle(original, "zh")).resolves.toEqual(translated);
  });
});
