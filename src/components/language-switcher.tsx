"use client";

import { ChevronDown, Languages } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { languages } from "@/lib/i18n";
import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { language, setLanguage, t } = useLanguage();
  const currentLanguage = languages.find((item) => item.code === language);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <div className="language-switcher" ref={ref} onKeyDown={event => {
      if (event.key === "Escape") {
        setOpen(false); ref.current?.querySelector("button")?.focus();
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault(); setOpen(true);
        const options = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>(".language-option") ?? []);
        const index = options.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
          : (index + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length;
        queueMicrotask(() => options[next]?.focus());
      }
    }}>
      <button
        className="icon-link language-trigger"
        type="button"
        aria-label={t("language.select")}
        title={t("language.select")}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen(value => !value)}
      >
        <Languages size={18} aria-hidden="true" />
        <span>{currentLanguage?.nativeLabel ?? "English"}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <div id={menuId} className="language-menu" hidden={!open} role="menu" aria-label={t("language.select")}>
        {languages.map((item) => (
          <button
            key={item.code}
            className="language-option"
            type="button"
            role="menuitemradio"
            aria-checked={item.code === language}
            onClick={() => { setLanguage(item.code); setOpen(false); ref.current?.querySelector("button")?.focus(); }}
          >
            <span>{item.nativeLabel}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
