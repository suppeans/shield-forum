import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import { ArticleList } from "@/components/article-list";
import { readNews } from "@/lib/news-storage";
import { filterNews, rankNews } from "@/lib/repositories/news";
import { toTags } from "@/lib/types";
export default async function TagsPage({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const tag = searchParams ? (await searchParams).tag : undefined;
  const news = await readNews();
  const tags = [...new Set(news.flatMap((article) => article.tags))].sort((a, b) => a.localeCompare(b, "ja"));
  return <main className="page" id="main"><PageHeading title="" description="" labelKey="tags.label" titleKey="tags.title" descriptionKey="tags.description" /><section className="panel topic-cloud"><TagCloud tags={toTags(tags)} /></section>{tag && <section><div className="section-title"><h2>#{tag}</h2></div><ArticleList articles={rankNews(filterNews(news, { tag }))} /></section>}</main>;
}
