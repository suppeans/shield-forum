"use client";

import {
  translateCategory,
  translateTag,
  type TranslationKey,
} from "@/lib/i18n";
import type { Category, Tag } from "@/lib/types";
import { useLanguage } from "./language-provider";

type TranslatedCategoryOptionProps = {
  category: Category;
};

export function TranslatedCategoryOption({
  category,
}: TranslatedCategoryOptionProps) {
  const { language } = useLanguage();
  const translatedCategory = translateCategory(category, language);

  return <option value={category.id}>{translatedCategory.name}</option>;
}

type TranslatedTagNameProps = {
  tag: Tag;
};

export function TranslatedTagName({ tag }: TranslatedTagNameProps) {
  const { language } = useLanguage();
  const translatedTag = translateTag(tag, language);

  return <>{translatedTag.name}</>;
}

type TranslatedOptionProps = {
  value: string;
  translationKey: TranslationKey;
};

export function TranslatedOption({
  value,
  translationKey,
}: TranslatedOptionProps) {
  const { t } = useLanguage();

  return <option value={value}>{t(translationKey)}</option>;
}
