"use client";
import { useLanguage } from "./language-provider";
export function TranslationStatus({ status, retry }: { status: string; retry: () => void }) {
  const { t } = useLanguage();
  if (status === "original") return null;
  return <div className="translation-status" role="status" aria-live="polite">
    <span>{t(status === "loading" ? "translation.loading" : status === "error" ? "translation.error" : "translation.notice")}</span>
    {status === "error" && <button type="button" onClick={retry}>{t("translation.retry")}</button>}
  </div>;
}
