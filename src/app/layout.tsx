import type { Metadata } from "next";
import { Suspense } from "react";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticleScrollRestoration } from "@/components/article-navigation";
import "./globals.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "SHIELD NEWS | 日本ITニュース", template: "%s | SHIELD NEWS" },
  description: "日本のAI、セキュリティ、IT企業、半導体、クラウド、IT就職を読む毎日のニュースブリーフ。各ニュースの出典と原文へのリンクを掲載しています。",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><body><LanguageProvider><a className="skip-link" href="#main">本文へスキップ</a><Suspense><SiteHeader /><ArticleScrollRestoration /></Suspense>{children}<SiteFooter /></LanguageProvider></body></html>;
}
