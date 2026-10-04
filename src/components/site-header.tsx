"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ShieldCheck, Menu, X, ArrowUpRight } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "./language-provider";
const navItems = [
  { href: "/", key: "nav.home" }, { href: "/?category=ai#news-feed", key: "nav.ai" },
  { href: "/?category=security#news-feed", key: "nav.security" }, { href: "/?category=business#news-feed", key: "nav.business" },
  { href: "/?category=semiconductors#news-feed", key: "nav.semiconductors" }, { href: "/?category=cloud#news-feed", key: "nav.cloud" },
  { href: "/?category=careers#news-feed", key: "nav.careers" }, { href: "/about", key: "nav.about" },
] satisfies { href: string; key: TranslationKey }[];
export function SiteHeader() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const category = useSearchParams().get("category");
  return <header className="site-header">
    <Link className="brand" href="/" aria-label={t("header.home")} onClick={() => setOpen(false)}><ShieldCheck size={27} aria-hidden="true" /><span>SHIELD<span className="brand-secondary">NEWS</span></span></Link>
    <nav id="main-navigation" className={`nav-links ${open ? "is-open" : ""}`} aria-label={t("header.primaryNavigation")}>
      {navItems.map((item) => { const active = item.href === "/about" ? pathname === "/about" : pathname === "/" && (item.href === "/" ? !category : item.href.includes(`category=${category}`));
        return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{t(item.key)}</Link>;
      })}
    </nav>
    <div className="header-actions"><LanguageSwitcher /><Link className="icon-link" href="/search" aria-label={t("nav.search")}><Search size={19} aria-hidden="true" /></Link>
      <Link className="button button-small header-brief" href="/#news-feed">{t("home.today")}<ArrowUpRight size={15} aria-hidden="true" /></Link>
      <button className="icon-link mobile-menu" aria-label={t("nav.menu")} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
  </header>;
}
