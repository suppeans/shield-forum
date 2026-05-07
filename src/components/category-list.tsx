"use client";

import Link from "next/link";
import { translateCategory } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import { useLanguage } from "./language-provider";

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  const { language } = useLanguage();

  return (
    <div className="stack">
      {categories.map((category) => {
        const translatedCategory = translateCategory(category, language);

        return (
          <Link className="category-row" key={category.id} href="/forum">
            <span>{translatedCategory.name}</span>
            <small>{translatedCategory.description}</small>
          </Link>
        );
      })}
    </div>
  );
}
