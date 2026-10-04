import { z } from "zod";
import { categories } from "./types.ts";
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
const text = (max: number) => z.string().trim().min(1).max(max);
const webUrl = z.url().max(2048).refine((value) => {
  const url = new URL(value);
  return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
}, "Use an HTTP(S) URL without credentials");
export const newsArticleSchema = z.object({
  id: text(128).regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/), title: text(240), summary: text(3000),
  category: z.enum(categories.map((category) => category.slug)), source: text(160), source_url: webUrl,
  published_at: z.iso.datetime({ offset: true }), published_time_known: z.boolean().default(true),
  collected_at: z.iso.datetime({ offset: true }).nullable().default(null), edition_date: z.iso.date(),
  image_url: webUrl.nullish().transform((value) => value ?? null), why_it_matters: text(3000),
  core_facts: z.array(text(1500)).max(20).default([]),
  tags: z.array(text(80)).max(20).transform((tags) => [...new Set(tags)]),
  featured: z.boolean().default(false), priority: z.number().int().min(1).max(5).default(3),
  region: z.enum(["japan", "global"]).default("japan"), is_sample: z.boolean().default(false),
});
// Validate the entire edition before writing; a bad item cannot partially publish.
export const newsImportSchema = z.object({
  date: z.iso.date(), generated_at: z.iso.datetime({ offset: true }).optional(), sample: z.boolean().default(false),
  news: z.array(newsArticleSchema.omit({ edition_date: true, is_sample: true, collected_at: true })).min(1).max(100),
}).superRefine((batch, context) => {
  const ids = new Set<string>();
  batch.news.forEach((article, index) => {
    if (ids.has(article.id)) context.addIssue({ code: "custom", path: ["news", index, "id"], message: "Duplicate news id" });
    ids.add(article.id);
  });
}).transform((batch) => ({ date: batch.date,
  news: batch.news.map((article) => ({ ...article, edition_date: batch.date, collected_at: batch.generated_at ?? null, is_sample: batch.sample })),
}));
export function parseImportJson(raw: string) {
  if (Buffer.byteLength(raw, "utf8") > MAX_IMPORT_BYTES) throw new Error("News import exceeds the 2 MiB limit");
  return newsImportSchema.parse(JSON.parse(raw));
}
