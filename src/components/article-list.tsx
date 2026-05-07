import Link from "next/link";
import { BookOpen, UserRound } from "lucide-react";
import type { ArticleWithRelations } from "@/lib/repositories/forum";
import { TagPill } from "./tag-pill";

type ArticleListProps = {
  articles: ArticleWithRelations[];
};

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <p className="muted">No published tutorials match this view.</p>;
  }

  return (
    <div className="content-list">
      {articles.map((article) => (
        <article className="list-item" key={article.id}>
          <div className="item-kicker">
            <span className="with-icon">
              <BookOpen size={14} aria-hidden="true" />
              Tutorial
            </span>
            <span>{article.publishedAt ? formatDate(article.publishedAt) : "Draft"}</span>
          </div>
          <h2 className="item-title">
            <Link href={`/knowledge/${article.slug}`}>{article.title}</Link>
          </h2>
          <p>{article.summary}</p>
          <div className="item-meta">
            <span className="with-icon">
              <UserRound size={14} aria-hidden="true" />
              {article.author.displayName}
            </span>
          </div>
          <div className="tag-cloud compact">
            {article.tags.map((tag) => (
              <TagPill key={tag.id} tag={tag} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
