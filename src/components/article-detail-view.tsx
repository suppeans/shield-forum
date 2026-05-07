"use client";

import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import { translateArticle } from "@/lib/i18n";
import type { ArticleWithRelations } from "@/lib/repositories/forum";
import { useLanguage } from "./language-provider";

type ArticleDetailViewProps = {
  article: ArticleWithRelations;
};

export function ArticleDetailView({ article }: ArticleDetailViewProps) {
  const { language, t } = useLanguage();
  const translatedArticle = translateArticle(article, language);

  return (
    <main className="page">
      <PageHeading
        label={t("article.tutorial")}
        title={translatedArticle.title}
        description={`${translatedArticle.summary} ${t("article.writtenBy", {
          name: article.author.displayName,
        })}`}
      />
      <div className="detail-layout">
        <article className="article-body">
          <p>{translatedArticle.body}</p>
        </article>
        <aside className="panel">
          <h2>{t("common.tags")}</h2>
          <TagCloud tags={translatedArticle.tags} />
        </aside>
      </div>
    </main>
  );
}
