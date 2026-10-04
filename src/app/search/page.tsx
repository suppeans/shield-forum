import { ArticleList } from "@/components/article-list";
import { PageHeading } from "@/components/page-heading";
import { SearchForm } from "@/components/search-form";
import { TranslatedText } from "@/components/translated-text";
import { readNews } from "@/lib/news-storage";
import { filterNews, rankNews } from "@/lib/repositories/news";
export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const query = (searchParams ? (await searchParams).q : "") ?? "";
  const results = query.trim() ? rankNews(filterNews(await readNews(), { query })) : [];
  return <main className="page" id="main"><PageHeading title="" description="" labelKey="nav.search" titleKey="search.title" descriptionKey="search.description" /><SearchForm query={query} /><div className="section-title"><TranslatedText as="h2" translationKey="search.results" /><span className="muted">{results.length}</span></div><ArticleList articles={results} /></main>;
}
