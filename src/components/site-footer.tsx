"use client";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "./language-provider";
export function SiteFooter() {
  const { t } = useLanguage();
  return <footer className="site-footer"><div className="footer-inner"><div><Link className="brand" href="/"><ShieldCheck size={25} aria-hidden="true" /><span>SHIELD NEWS</span></Link><p>{t("footer.description")}</p><small>{t("footer.content")}</small></div><nav aria-label="フッターナビゲーション"><Link href="/archive">{t("footer.archive")}</Link><Link href="/tags">{t("footer.topics")}</Link><Link href="/about">{t("footer.about")}</Link><Link href="https://github.com/suppeans/shield-forum">GitHub ↗</Link></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SHIELD NEWS</span><p>{t("footer.notice")}</p></div></footer>;
}
