"use client";

import Link from "next/link";
import { BookOpen, UserRound } from "lucide-react";
import { getDateLocale, translateArticle } from "@/lib/i18n";
import type { ArticleWithRelations } from "@/lib/repositories/forum";
import { useLanguage } from "./language-provider";
import { TagPill } from "./tag-pill";

type ArticleListProps = {
  articles: ArticleWithRelations[];
};

export function ArticleList({ articles }: ArticleListProps) {
  const { language, t } = useLanguage();

  if (articles.length === 0) {
    return <p className="muted">{t("list.noArticles")}</p>;
  }

  return (
    <div className="content-list">
      {articles.map((article) => {
        const translatedArticle = translateArticle(article, language);

        return (
          <article className="list-item" key={article.id}>
            <div className="item-kicker">
              <span className="with-icon">
                <BookOpen size={14} aria-hidden="true" />
                {t("article.tutorial")}
              </span>
              <span>
                {article.publishedAt
                  ? formatDate(article.publishedAt, language)
                  : t("article.draft")}
              </span>
            </div>
            <h2 className="item-title">
              <Link href={`/knowledge/${article.slug}`}>
                {translatedArticle.title}
              </Link>
            </h2>
            <p>{translatedArticle.summary}</p>
            <div className="item-meta">
              <span className="with-icon">
                <UserRound size={14} aria-hidden="true" />
                {article.author.displayName}
              </span>
            </div>
            <div className="tag-cloud compact">
              {translatedArticle.tags.map((tag) => (
                <TagPill key={tag.id} tag={tag} />
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function formatDate(value: string, language: "zh" | "ja" | "en") {
  return new Intl.DateTimeFormat(getDateLocale(language), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
