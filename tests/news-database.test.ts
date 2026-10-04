// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newsImportSchema } from "@/lib/validation";
import fixture from "../docs/news-import.example.json";
const mocks = vi.hoisted(() => ({ client: vi.fn(), from: vi.fn(), select: vi.fn(), order: vi.fn(), range: vi.fn(), upsert: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.client }));
import { importNews, readNews } from "@/lib/news-storage";
beforeEach(() => {
  vi.stubEnv("NEWS_STORAGE", "supabase"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-test-key"); vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "private-test-key");
  const chain = { select: mocks.select, order: mocks.order, range: mocks.range, upsert: mocks.upsert };
  mocks.client.mockReturnValue({ from: mocks.from }); mocks.from.mockReturnValue(chain);
  mocks.select.mockReturnValue(chain); mocks.order.mockReturnValue(chain);
});
afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); });
describe("Supabase news storage", () => {
  it("reads only news with the anon key and paginates past the API row limit", async () => {
    const article = newsImportSchema.parse(fixture).news[0];
    mocks.range.mockResolvedValueOnce({ data: Array.from({ length: 1000 }, (_, i) => ({ ...article, id: `news-${i}` })), error: null })
      .mockResolvedValueOnce({ data: [{ ...article, id: "last" }], error: null });
    expect(await readNews()).toHaveLength(1001);
    expect(mocks.client.mock.calls[0][1]).toBe("public-test-key");
    expect(mocks.from).toHaveBeenCalledWith("news_articles");
    expect(mocks.range).toHaveBeenLastCalledWith(1000, 1999);
  });
  it("validates before a single upsert and uses only the server service key for writes", async () => {
    mocks.upsert.mockResolvedValue({ error: null });
    await expect(importNews({ ...fixture, date: "invalid" })).rejects.toThrow();
    expect(mocks.client).not.toHaveBeenCalled();
    await importNews(fixture);
    expect(mocks.client.mock.calls[0][1]).toBe("private-test-key");
    expect(mocks.upsert).toHaveBeenCalledWith(newsImportSchema.parse(fixture).news, { onConflict: "id" });
  });
  it("surfaces read failures instead of falling back to fictional data", async () => {
    mocks.range.mockResolvedValue({ data: null, error: { message: "table unavailable" } });
    await expect(readNews()).rejects.toThrow(/table unavailable/);
  });
});
