"use client";
import { Info } from "lucide-react";
import { useLanguage } from "./language-provider";
export function SampleNotice() { const { t } = useLanguage(); return <div className="sample-notice" role="note"><Info size={16} aria-hidden="true" /><strong>{t("news.sample")}</strong><span>{t("news.sampleNotice")}</span></div>; }
