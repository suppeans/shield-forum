import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailView } from "@/components/article-detail-view";
import { getNewsById, getNewsEdition } from "@/lib/repositories/news";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getNewsById((await params).id);
  return article ? { title: article.title, description: article.summary } : { title: "ニュースが見つかりません" };
}
export default async function NewsPage({ params }: Props) {
  const article = await getNewsById((await params).id);
  if (!article) notFound();
  const edition = await getNewsEdition(article.edition_date);
  return <ArticleDetailView article={article} related={edition.articles.filter((item) => item.id !== article.id).slice(0, 3)} />;
}
