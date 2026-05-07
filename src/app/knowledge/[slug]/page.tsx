import { notFound } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
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

  return (
    <main className="page">
      <PageHeading
        label="Tutorial"
        title={article.title}
        description={`${article.summary} Written by ${article.author.displayName}.`}
      />
      <div className="detail-layout">
        <article className="article-body">
          <p>{article.body}</p>
        </article>
        <aside className="panel">
          <h2>Tags</h2>
          <TagCloud tags={article.tags} />
        </aside>
      </div>
    </main>
  );
}
