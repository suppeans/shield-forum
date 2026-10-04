import { readNews } from "../news-storage";
import { japanDate } from "../news-date";
import type { NewsArticle } from "../types";
export function rankNews(articles: NewsArticle[]) {
  return [...articles].sort((a, b) => Number(b.featured) - Number(a.featured)
    || a.priority - b.priority || Number(a.region === "global") - Number(b.region === "global")
    || Date.parse(b.published_at) - Date.parse(a.published_at));
}
export function filterNews(articles: NewsArticle[], filters: { date?: string; category?: string; tag?: string; query?: string } = {}) {
  const query = filters.query?.trim().toLocaleLowerCase();
  return articles.filter((article) => (!filters.date || article.edition_date === filters.date)
    && (!filters.category || article.category === filters.category)
    && (!filters.tag || article.tags.includes(filters.tag))
    && (!query || [article.title, article.summary, article.source, article.why_it_matters, ...article.tags]
      .join(" ").toLocaleLowerCase().includes(query)));
}
export async function getNewsEdition(date = japanDate(), category?: string) {
  const all = await readNews();
  const articles = rankNews(filterNews(all, { date, category }));
  return { date, articles, featured: articles.slice(0, 4), remaining: articles.slice(4),
    dates: [...new Set(all.map((article) => article.edition_date))].sort().reverse(),
    sample: articles.some((article) => article.is_sample) };
}
export async function getNewsById(id: string) { return (await readNews()).find((article) => article.id === id) ?? null; }
