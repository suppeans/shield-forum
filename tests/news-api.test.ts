// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newsImportSchema } from "@/lib/validation";
import fixture from "../docs/news-import.example.json";
const mocks = vi.hoisted(() => ({ write: vi.fn(), revalidate: vi.fn(), mode: vi.fn() }));
vi.mock("@/lib/news-storage", () => ({ importNews: mocks.write, storageMode: mocks.mode }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { POST } from "@/app/api/news/import/route";
const token = "test-only-token-01234567890123456789";
function request(body: string, authorization = `Bearer ${token}`, type = "application/json") {
  return new Request("https://example.com/api/news/import", { method: "POST", headers: { Authorization: authorization, "Content-Type": type }, body });
}
beforeEach(() => {
  vi.stubEnv("NEWS_IMPORT_TOKEN", token);
  mocks.mode.mockReturnValue("supabase");
  mocks.write.mockImplementation(async (input) => { const batch = newsImportSchema.parse(input); return { date: batch.date, imported: batch.news.length }; });
});
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
describe("protected import API", () => {
  it("fails closed without server configuration or valid credentials", async () => {
    expect((await POST(request("{}", "Bearer wrong"))).status).toBe(401);
    vi.stubEnv("NEWS_IMPORT_TOKEN", "");
    expect((await POST(request("{}"))).status).toBe(503);
    expect(mocks.write).not.toHaveBeenCalled();
  });
  it("blocks hosted filesystem writes and non-JSON bodies", async () => {
    mocks.mode.mockReturnValue("file");
    expect((await POST(request("{}"))).status).toBe(409);
    mocks.mode.mockReturnValue("supabase");
    expect((await POST(request("{}", undefined, "text/plain"))).status).toBe(415);
  });
  it("rejects malformed, oversized and invalid batches", async () => {
    expect((await POST(request("{broken"))).status).toBe(400);
    expect((await POST(request("x".repeat(2 * 1024 * 1024 + 1)))).status).toBe(413);
    expect((await POST(request(JSON.stringify({ ...fixture, date: "bad-date" })))).status).toBe(400);
  });
  it("imports one validated batch and revalidates news pages", async () => {
    const response = await POST(request(JSON.stringify(fixture)));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ date: fixture.date, imported: 1 });
    expect(mocks.write).toHaveBeenCalledTimes(1);
    expect(mocks.revalidate).toHaveBeenCalledWith("/", "layout");
  });
  it("does not leak storage errors to callers", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.write.mockRejectedValue(new Error("private-internal-error"));
    const response = await POST(request(JSON.stringify(fixture)));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("private-internal-error");
    log.mockRestore();
  });
});
