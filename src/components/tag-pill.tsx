"use client";

import Link from "next/link";
import { translateTag } from "@/lib/i18n";
import type { Tag } from "@/lib/types";
import { useLanguage } from "./language-provider";

type TagPillProps = {
  tag: Tag;
};

export function TagPill({ tag }: TagPillProps) {
  const { language } = useLanguage();
  const translatedTag = translateTag(tag, language);

  return (
    <Link className="tag-pill" href={`/tags?tag=${translatedTag.slug}`}>
      {translatedTag.name}
    </Link>
  );
}
