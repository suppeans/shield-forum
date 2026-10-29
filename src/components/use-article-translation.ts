"use client";
import { useEffect, useRef, useState } from "react";
import { articleText, articleTranslationSchema, type ArticleTranslation, type TranslationLanguage } from "@/lib/article-translation";
import type { NewsArticle } from "@/lib/types";
import { useLanguage } from "./language-provider";

const translations = new Map<string, Promise<ArticleTranslation>>();
let active = 0;
const waiting: (() => void)[] = [];

async function requestTranslation(article: NewsArticle, language: TranslationLanguage) {
  if (active >= 3) await new Promise<void>(resolve => waiting.push(resolve));
  active++;
  try {
    const response = await fetch(`/api/news/${encodeURIComponent(article.id)}/translation?language=${language}`, {
      signal: AbortSignal.timeout(55_000),
    });
    if (!response.ok) throw new Error("Translation unavailable");
    const result = await response.json();
    return articleTranslationSchema.parse(result.translation);
  } finally { active--; waiting.shift()?.(); }
}

export function useArticleTranslation(original: NewsArticle) {
  const { language } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const key = JSON.stringify([original.id, articleText(original), language]);
  const [result, setResult] = useState<{ key: string; translation?: ArticleTranslation; failed?: boolean }>();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (language === "ja" || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [language, visible]);
  useEffect(() => {
    if (language === "ja" || !visible) return;
    let current = true;
    let pending = translations.get(key);
    if (!pending) {
      pending = requestTranslation(original, language);
      translations.set(key, pending);
      pending.catch(() => translations.delete(key));
    }
    pending.then(translation => {
      if (current) setResult({ key, translation });
    }, () => { if (current) setResult({ key, failed: true }); });
    return () => { current = false; };
    // The key includes every translated field; object identity changes must not refetch it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt, visible]);
  const translated = language !== "ja" && result?.key === key ? result : undefined;
  return {
    ref,
    article: translated?.translation ? { ...original, ...translated.translation } : original,
    status: language === "ja" ? "original" : translated?.translation ? "translated" : translated?.failed ? "error" : "loading",
    contentLanguage: translated?.translation ? language : "ja",
    retry: () => { setResult(undefined); setAttempt(value => value + 1); },
  };
}
