"use client";

import type { ElementType } from "react";
import type { TranslationKey } from "@/lib/i18n";
import { useLanguage } from "./language-provider";

type TranslatedTextProps = {
  as?: ElementType;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  translationKey: TranslationKey;
  values?: Record<string, string | number>;
};

export function TranslatedText({
  as,
  className,
  id,
  style,
  translationKey,
  values,
}: TranslatedTextProps) {
  const { t } = useLanguage();
  const Component = as ?? "span";

  return (
    <Component className={className} id={id} style={style}>
      {t(translationKey, values)}
    </Component>
  );
}
