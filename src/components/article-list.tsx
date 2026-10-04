"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { categoryName, toTags } from "@/lib/types";
import { newsTime } from "@/lib/news-date";
import { useLanguage } from "./language-provider";
import { TagCloud } from "./tag-cloud";
export function ArticleList({ articles, compact = false }: { articles: NewsArticle[]; compact?: boolean }) {
  const { t } = useLanguage();
  if (!articles.length) return <p className="empty-state">{t("list.noArticles")}</p>;
  return <div className={`content-list ${compact ? "compact-list" : ""}`}>{articles.map((article, index) => <article className="list-item" key={article.id}>
    <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
    <div className="news-row-content"><div className="item-kicker"><Link href={`/?date=${article.edition_date}&category=${article.category}#news-feed`} className="category-label">{categoryName(article.category)}</Link><span>{article.source}</span><time dateTime={article.published_at}>{newsTime(article.published_at, article.published_time_known)} JST</time>{article.is_sample && <span className="sample-label">{t("news.sample")}</span>}</div>
      <h2 className="item-title"><Link href={`/news/${article.id}`}>{article.title}</Link></h2><p>{article.summary}</p>
      <div className="why-inline"><span>{t("news.why")}</span><p>{article.why_it_matters}</p></div>
      {!compact && <TagCloud tags={toTags(article.tags)} />}
    </div>
    {article.image_url && !compact && <Image className="list-thumbnail" src={article.image_url} width={144} height={100} alt="" unoptimized />}
    <Link href={`/news/${article.id}`} className="row-arrow" aria-label={`${t("news.read")}: ${article.title}`}><ArrowUpRight size={22} aria-hidden="true" /></Link>
  </article>)}</div>;
}
