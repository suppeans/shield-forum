"use client";

import type { TranslationKey } from "@/lib/i18n";
import { useLanguage } from "./language-provider";

type PageHeadingProps = {
  label?: string;
  title: string;
  description: string;
  labelKey?: TranslationKey;
  titleKey?: TranslationKey;
  descriptionKey?: TranslationKey;
  action?: React.ReactNode;
};

export function PageHeading({
  label,
  title,
  description,
  labelKey,
  titleKey,
  descriptionKey,
  action,
}: PageHeadingProps) {
  const { t } = useLanguage();
  const resolvedLabel = labelKey ? t(labelKey) : label;
  const resolvedTitle = titleKey ? t(titleKey) : title;
  const resolvedDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <div className="page-heading">
      <div>
        {resolvedLabel ? <p className="eyebrow">{resolvedLabel}</p> : null}
        <h1>{resolvedTitle}</h1>
        <p>{resolvedDescription}</p>
      </div>
      {action ? <div className="heading-action">{action}</div> : null}
    </div>
  );
}
