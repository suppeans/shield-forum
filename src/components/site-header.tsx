"use client";

import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "./language-provider";

const navItems = [
  { href: "/forum", labelKey: "nav.forum" },
  { href: "/knowledge", labelKey: "nav.knowledge" },
  { href: "/tags", labelKey: "nav.tags" },
  { href: "/profile", labelKey: "nav.profile" },
  { href: "/admin", labelKey: "nav.admin" },
] satisfies { href: string; labelKey: TranslationKey }[];

const brandName = "Shield Forum";

export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label={t("header.home")}>
        <ShieldCheck size={24} aria-hidden="true" />
        <span>{brandName}</span>
      </Link>
      <nav className="nav-links" aria-label={t("header.primaryNavigation")}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <LanguageSwitcher />
        <Link className="icon-link" href="/search" aria-label={t("nav.search")}>
          <Search size={18} aria-hidden="true" />
        </Link>
        <Link className="button button-small" href="/auth/sign-in">
          {t("nav.signIn")}
        </Link>
      </div>
    </header>
  );
}
