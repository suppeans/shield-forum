import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { importNews, storageMode } from "@/lib/news-storage";
import { MAX_IMPORT_BYTES } from "@/lib/validation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const token = process.env.NEWS_IMPORT_TOKEN;
  if (!token || token.length < 32) return Response.json({ error: "Import API is not configured" }, { status: 503 });
  const supplied = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${token}`;
  if (Buffer.byteLength(supplied) !== Buffer.byteLength(expected)
    || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (storageMode() !== "supabase") return Response.json({ error: "Use the CLI for file storage. The hosted import API requires NEWS_STORAGE=supabase." }, { status: 409 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return Response.json({ error: "Send application/json" }, { status: 415 });
  try {
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "Empty request body" }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_IMPORT_BYTES) { await reader.cancel(); return Response.json({ error: "Maximum body size is 2 MiB" }, { status: 413 }); }
      chunks.push(value);
    }
    const input: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const result = await importNews(input);
    revalidatePath("/", "layout");
    return Response.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: "Invalid news JSON", issues: error.issues }, { status: 400 });
    if (error instanceof SyntaxError) return Response.json({ error: "Malformed JSON" }, { status: 400 });
    console.error("News import storage error", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Import failed; check server configuration and database migration" }, { status: 500 });
  }
}
