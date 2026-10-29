"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Clock3, Radio } from "lucide-react";
import { categories, type NewsArticle } from "@/lib/types";
import { displayDate, newsTime } from "@/lib/news-date";
import { useLanguage } from "./language-provider";
import { translatedCategoryName } from "@/lib/i18n";
import { useArticleTranslation } from "./use-article-translation";
import { TranslationStatus } from "./translation-status";
import { ArticleList } from "./article-list";
import { CategoryList } from "./category-list";
import { ArchiveLinks } from "./archive-links";
import { SampleNotice } from "./sample-notice";
import { BlurText } from "./blur-text";
import { Spotlight } from "./spotlight";
type Edition = { date: string; articles: NewsArticle[]; featured: NewsArticle[]; dates: string[]; sample: boolean };
export function NewsEditionView({ edition, today, category }: { edition: Edition; today: string; category?: string }) {
  const { t } = useLanguage();
  const [lead, ...supporting] = edition.featured;
  const last = edition.articles.map((article) => article.collected_at).filter((value): value is string => Boolean(value)).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  return <main className="page" id="main">
    <section className="brief-heading"><Spotlight /><div className="brief-intro"><p className="eyebrow"><Radio size={14} aria-hidden="true" />{t("home.label")}</p><h1>{t("home.title").split("\n").map((line, index) => <BlurText key={line} text={line} className={index === 0 ? "" : "accent-title"} />)}</h1><p className="intro">{t("home.description")}</p><div className="brief-actions"><Link className="button uiverse-button" href="#news-feed"><span className="button-label">{t("home.list")}</span><span className="button-icon"><ArrowRight size={18} aria-hidden="true" /></span></Link><Link className="with-icon brief-search" href="/search">{t("nav.search")}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></div>
      <div className="edition-stamp"><span className="edition-label">DAILY EDITION</span><strong>{displayDate(edition.date)}</strong><div><span className="status-dot" />{edition.date === today ? t("home.today") : t("home.archive")}<span> / JST</span></div></div>
    </section>
    <div className="brief-stats"><span><strong>{String(edition.articles.length).padStart(2, "0")}</strong>{t("home.total")}</span><span><strong>{String(new Set(edition.articles.map((article) => article.source)).size).padStart(2, "0")}</strong>{t("home.sources")}</span>{last && <span className="last-update"><Clock3 size={14} aria-hidden="true" />{t("home.updated")}<time dateTime={last}>{newsTime(last)} JST</time></span>}</div>
    {edition.sample && <SampleNotice />}
    {lead ? <section className="focus-section" aria-labelledby="focus-heading"><div className="section-title"><h2 id="focus-heading">{t("home.focus")}</h2><span className="section-index">01 — IN FOCUS</span></div>
      <div className={`focus-grid${supporting.length ? "" : " is-single"}`}><LeadStory original={lead} />{supporting.length > 0 && <aside className="focus-sidebar"><ArticleList articles={supporting} compact /></aside>}</div>
    </section> : <div className="empty-state"><p>{category ? t("home.emptyFilter") : t("home.empty")}</p>{edition.dates[0] && edition.dates[0] !== edition.date && <Link className="read-link" href={`/?date=${edition.dates[0]}`}>{t("home.latest")}<ArrowRight size={16} /></Link>}</div>}
    <section id="news-feed" className="feed-section" aria-labelledby="feed-heading"><div className="section-title"><h2 id="feed-heading">{t("home.list")}</h2><span className="section-index">02 — NEWS FEED</span></div><CategoryList categories={categories} selected={category} date={edition.date} />
      <div className="feed-layout"><ArticleList articles={edition.articles} /><aside className="archive-panel panel"><h2>{t("home.archive")}</h2><ArchiveLinks dates={edition.dates} selected={edition.date} /><Link href="/archive" className="read-link">{t("footer.archive")}<ArrowRight size={15} /></Link></aside></div>
    </section>
  </main>;
}

function LeadStory({ original }: { original: NewsArticle }) {
  const { t, language } = useLanguage();
  const { article: lead, status, retry, contentLanguage, ref } = useArticleTranslation(original);
  return <article className="lead-story" lang={contentLanguage} ref={ref}>{lead.image_url && <div className="lead-visual"><Image src={lead.image_url} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 60vw" /></div>}
        <div className="lead-copy"><div className="item-kicker"><span className="category-label">{translatedCategoryName(lead.category, language)}</span><span>{lead.source}</span><time dateTime={lead.published_at}>{newsTime(lead.published_at, lead.published_time_known)} JST</time></div>
          <TranslationStatus status={status} retry={retry} /><h2><Link href={`/news/${lead.id}`}>{lead.title}</Link></h2><p>{lead.summary}</p><div className="why-inline"><span>{t("news.why")}</span><p>{lead.why_it_matters}</p></div><Link className="read-link" href={`/news/${lead.id}`}>{t("news.read")}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div></article>;
}
