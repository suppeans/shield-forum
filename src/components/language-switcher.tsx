"use client";

import { ChevronDown, Languages } from "lucide-react";
import { languages } from "@/lib/i18n";
import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const currentLanguage = languages.find((item) => item.code === language);

  return (
    <div className="language-switcher">
      <button
        className="icon-link language-trigger"
        type="button"
        aria-label={t("language.select")}
        title={t("language.select")}
      >
        <Languages size={18} aria-hidden="true" />
        <span>{currentLanguage?.nativeLabel ?? "English"}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="language-menu" role="menu" aria-label={t("language.select")}>
        {languages.map((item) => (
          <button
            key={item.code}
            className="language-option"
            type="button"
            role="menuitemradio"
            aria-checked={item.code === language}
            onClick={() => setLanguage(item.code)}
          >
            <span>{item.nativeLabel}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
