"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { toTags } from "@/lib/types";
import { newsTime } from "@/lib/news-date";
import { useLanguage } from "./language-provider";
import { translatedCategoryName } from "@/lib/i18n";
import { useArticleTranslation } from "./use-article-translation";
import { TranslationStatus } from "./translation-status";
import { TagCloud } from "./tag-cloud";
export function ArticleList({ articles, compact = false }: { articles: NewsArticle[]; compact?: boolean }) {
  const { t } = useLanguage();
  if (!articles.length) return <p className="empty-state">{t("list.noArticles")}</p>;
  return <div className={`content-list ${compact ? "compact-list" : ""}`}>{articles.map((article, index) => <ArticleRow original={article} index={index} compact={compact} key={article.id} />)}</div>;
}
function ArticleRow({ original, index, compact }: { original: NewsArticle; index: number; compact: boolean }) {
  const { t, language } = useLanguage();
  const { article, status, retry, contentLanguage, ref } = useArticleTranslation(original);
  return <article className="list-item" lang={contentLanguage} ref={ref}>
    <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
    <div className="news-row-content"><div className="item-kicker"><Link href={`/?date=${article.edition_date}&category=${article.category}#news-feed`} className="category-label">{translatedCategoryName(article.category, language)}</Link><span>{article.source}</span><time dateTime={article.published_at}>{newsTime(article.published_at, article.published_time_known)} JST</time>{article.is_sample && <span className="sample-label">{t("news.sample")}</span>}</div>
      <TranslationStatus status={status} retry={retry} /><h2 className="item-title"><Link href={`/news/${article.id}`}>{article.title}</Link></h2><p>{article.summary}</p>
      <div className="why-inline"><span>{t("news.why")}</span><p>{article.why_it_matters}</p></div>
      {!compact && <TagCloud tags={toTags(original.tags).map((tag, i) => ({ ...tag, name: article.tags[i] }))} />}
    </div>
    {article.image_url && !compact && <Image className="list-thumbnail" src={article.image_url} width={144} height={100} alt="" unoptimized />}
    <Link href={`/news/${article.id}`} className="row-arrow" aria-label={`${t("news.read")}: ${article.title}`}><ArrowUpRight size={22} aria-hidden="true" /></Link>
  </article>;
}
