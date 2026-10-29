import { z } from "zod";
import { articleText, translationLanguageSchema } from "@/lib/article-translation";
import { translateArticle } from "@/lib/deepseek-translation";
import { getNewsById } from "@/lib/repositories/news";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ error: "Cross-site translation is not allowed" }, { status: 403 });
  }
  const language = translationLanguageSchema.safeParse(new URL(request.url).searchParams.get("language"));
  const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/).safeParse((await params).id);
  if (!language.success || !id.success) return Response.json({ error: "Invalid translation request" }, { status: 400 });
  const article = await getNewsById(id.data);
  if (!article) return Response.json({ error: "Story not found" }, { status: 404 });
  try {
    const translation = await translateArticle(articleText(article), language.data);
    return Response.json({ translation }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Translation unavailable" }, {
      status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    });
  }
}
