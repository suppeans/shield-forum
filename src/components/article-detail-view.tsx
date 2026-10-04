"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeading } from "./page-heading";
import { TagCloud } from "./tag-cloud";
import { ArticleList } from "./article-list";
import { SampleNotice } from "./sample-notice";
import { useLanguage } from "./language-provider";
import { categoryName, toTags, type NewsArticle } from "@/lib/types";
import { newsTime, displayDate } from "@/lib/news-date";
export function ArticleDetailView({ article, related }: { article: NewsArticle; related: NewsArticle[] }) {
  const { t } = useLanguage();
  return <main className="page article-page" id="main"><Link className="back-link" href={`/?date=${article.edition_date}`}><ArrowLeft size={16} aria-hidden="true" />{t("common.back")}</Link>
    {article.is_sample && <SampleNotice />}
    <PageHeading label={categoryName(article.category)} title={article.title} description={article.summary} />
    <div className="detail-meta"><span>{t("news.edition")}: <time dateTime={article.edition_date}>{displayDate(article.edition_date)}</time></span><span>{t("news.published")}: <time dateTime={article.published_at}>{newsTime(article.published_at)} JST</time></span><span>{article.source}</span></div>
    <div className="detail-layout"><article className="article-body">{article.image_url && <Image className="detail-image" src={article.image_url} width={1200} height={650} alt="" unoptimized />}
      <section><p className="eyebrow">01 / BRIEF</p><h2>{t("news.summary")}</h2><p>{article.summary}</p></section>
      <section><p className="eyebrow">02 / KEY FACTS</p><h2>{t("news.facts")}</h2><ul className="fact-list">{(article.core_facts.length ? article.core_facts : [article.summary]).map((fact, i) => <li key={i}>{fact}</li>)}</ul></section>
      <section className="why-block"><p className="eyebrow">03 / CONTEXT</p><h2>{t("news.why")}</h2><p>{article.why_it_matters}</p></section>
    </article><aside className="detail-sidebar"><section className="panel source-panel"><h2>{t("news.source")}</h2><p className="source-name">{article.source}</p><p className="source-host">{new URL(article.source_url).hostname}</p><p className="muted">{t("news.disclosure")}</p><a className="button" href={article.source_url} target="_blank" rel="noopener noreferrer">{t("news.original")}<ArrowUpRight size={17} aria-hidden="true" /></a></section><section className="panel"><h2>{t("common.tags")}</h2><TagCloud tags={toTags(article.tags)} /></section></aside></div>
    <section className="related-news"><div className="section-title"><h2>{t("news.related")}</h2></div><ArticleList articles={related} /></section>
  </main>;
}
