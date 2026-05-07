import { notFound } from "next/navigation";
import { ArticleDetailView } from "@/components/article-detail-view";
import { getArticleBySlug } from "@/lib/repositories/forum";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} />;
}
