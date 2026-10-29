import { z } from "zod";
import type { NewsArticle } from "./types";

export const translationLanguageSchema = z.enum(["zh", "en"]);
export type TranslationLanguage = z.infer<typeof translationLanguageSchema>;
export const articleTranslationSchema = z.object({
  title: z.string().trim().min(1).max(1500),
  summary: z.string().trim().min(1).max(12000),
  why_it_matters: z.string().trim().min(1).max(12000),
  core_facts: z.array(z.string().trim().min(1).max(6000)).max(20),
  tags: z.array(z.string().trim().min(1).max(320)).max(20),
}).strict();
export type ArticleTranslation = z.infer<typeof articleTranslationSchema>;

export function articleText(article: NewsArticle): ArticleTranslation {
  const { title, summary, why_it_matters, core_facts, tags } = article;
  return { title, summary, why_it_matters, core_facts, tags };
}
