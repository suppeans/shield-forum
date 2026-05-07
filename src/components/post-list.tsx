"use client";

import Link from "next/link";
import { MessageSquare, Shield } from "lucide-react";
import {
  getDateLocale,
  translateCategory,
  translatePost,
  t as translate,
} from "@/lib/i18n";
import type { PostWithRelations } from "@/lib/repositories/forum";
import { useLanguage } from "./language-provider";
import { TagPill } from "./tag-pill";

type PostListProps = {
  posts: PostWithRelations[];
};

export function PostList({ posts }: PostListProps) {
  const { language, t } = useLanguage();

  if (posts.length === 0) {
    return <p className="muted">{t("list.noPosts")}</p>;
  }

  return (
    <div className="content-list">
      {posts.map((post) => {
        const translatedPost = translatePost(post, language);
        const translatedCategory = translateCategory(post.category, language);

        return (
          <article className="list-item" key={post.id}>
            <div className="item-kicker">
              <span className="with-icon">
                <Shield size={14} aria-hidden="true" />
                {translatedCategory.name}
              </span>
              <span>
                {translate(language, "post.replies", {
                  count: post.commentCount,
                })}
              </span>
            </div>
            <h2 className="item-title">
              <Link href={`/forum/${post.slug}`}>{translatedPost.title}</Link>
            </h2>
            <p>{translatedPost.excerpt}</p>
            <div className="item-meta">
              <span className="with-icon">
                <MessageSquare size={14} aria-hidden="true" />
                {post.author.displayName}
              </span>
              <span>{formatDate(post.createdAt, language)}</span>
              <span>
                {translate(language, "post.views", {
                  count: post.viewCount.toLocaleString(getDateLocale(language)),
                })}
              </span>
            </div>
            <div className="tag-cloud compact">
              {translatedPost.tags.map((tag) => (
                <TagPill key={tag.id} tag={tag} />
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function formatDate(value: string, language: "zh" | "ja" | "en") {
  return new Intl.DateTimeFormat(getDateLocale(language), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
