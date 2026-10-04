import { createClient } from "@supabase/supabase-js";
import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { z } from "zod";
import { newsArticleSchema, newsImportSchema } from "./validation.ts";
import type { NewsArticle } from "./types.ts";
const fields = "id,title,summary,category,source,source_url,published_at,edition_date,image_url,why_it_matters,core_facts,tags,featured,priority,region,is_sample";
export function storageMode() {
  const mode = process.env.NEWS_STORAGE ?? "file";
  if (mode !== "file" && mode !== "supabase") throw new Error("NEWS_STORAGE must be file or supabase");
  return mode;
}
function database(write = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = write ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase news storage is missing its server environment configuration");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
function dataPath() { return process.env.NEWS_DATA_FILE ?? join(/* turbopackIgnore: true */ process.cwd(), "src/data/news.json"); }
export async function readNews(): Promise<NewsArticle[]> {
  if (storageMode() === "file") return z.array(newsArticleSchema).parse(JSON.parse(await readFile(/* turbopackIgnore: true */ dataPath(), "utf8")));
  const client = database();
  const rows: NewsArticle[] = [];
  // ponytail: read the small archive in full; move date/search filters to SQL when it grows.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from("news_articles").select(fields)
      .order("edition_date", { ascending: false }).order("id").range(offset, offset + 999);
    if (error) throw new Error(`Cannot read news: ${error.message}`);
    rows.push(...z.array(newsArticleSchema).parse(data));
    if (data.length < 1000) return rows;
  }
}
export function mergeNews(current: NewsArticle[], incoming: NewsArticle[]) {
  const realDates = new Set(incoming.filter((article) => !article.is_sample).map((article) => article.edition_date));
  const entries = new Map(current.filter((article) => !article.is_sample || !realDates.has(article.edition_date)).map((article) => [article.id, article]));
  for (const article of incoming) entries.set(article.id, article);
  return [...entries.values()].sort((a, b) => b.edition_date.localeCompare(a.edition_date) || a.id.localeCompare(b.id));
}
export async function importNews(input: unknown) {
  const batch = newsImportSchema.parse(input);
  if (storageMode() === "supabase") {
    const { error } = await database(true).from("news_articles").upsert(batch.news, { onConflict: "id" });
    if (error) throw new Error(`Cannot import news: ${error.message}`);
  } else {
    const path = dataPath();
    await mkdir(/* turbopackIgnore: true */ dirname(path), { recursive: true });
    const lock = await open(/* turbopackIgnore: true */ `${path}.lock`, "wx");
    const temporary = `${path}.${randomUUID()}.tmp`;
    try {
      let current: NewsArticle[] = [];
      try { current = await readNews(); } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      await writeFile(/* turbopackIgnore: true */ temporary, `${JSON.stringify(mergeNews(current, batch.news), null, 2)}\n`, "utf8");
      await rename(/* turbopackIgnore: true */ temporary, /* turbopackIgnore: true */ path);
    } finally {
      await lock.close(); await unlink(/* turbopackIgnore: true */ `${path}.lock`); await unlink(/* turbopackIgnore: true */ temporary).catch(() => {});
    }
  }
  return { date: batch.date, imported: batch.news.length, storage: storageMode() };
}
