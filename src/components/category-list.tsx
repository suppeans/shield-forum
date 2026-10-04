"use client";
import Link from "next/link";
import { translateCategory } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import { useLanguage } from "./language-provider";
export function CategoryList({ categories, selected, date }: { categories: readonly Category[]; selected?: string; date?: string }) {
  const { language, t } = useLanguage();
  function href(category?: string) { const params = new URLSearchParams(); if (date) params.set("date", date); if (category) params.set("category", category); return `/?${params}#news-feed`; }
  return <nav className="category-tabs" aria-label="ニュースカテゴリー">
    <Link className={!selected ? "selected" : ""} href={href()} aria-current={!selected ? "page" : undefined}>{t("home.all")}</Link>
    {categories.map((category) => <Link key={category.slug} className={selected === category.slug ? "selected" : ""} href={href(category.slug)} aria-current={selected === category.slug ? "page" : undefined}>{translateCategory(category, language).name}</Link>)}
  </nav>;
}
