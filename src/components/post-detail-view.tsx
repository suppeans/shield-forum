"use client";

import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import {
  translateCategory,
  translateComment,
  translatePost,
} from "@/lib/i18n";
import type { PostDetail } from "@/lib/repositories/forum";
import { useLanguage } from "./language-provider";

type PostDetailViewProps = {
  post: PostDetail;
  commentForm: React.ReactNode;
};

export function PostDetailView({ post, commentForm }: PostDetailViewProps) {
  const { language, t } = useLanguage();
  const translatedPost = translatePost(post, language);
  const translatedCategory = translateCategory(post.category, language);

  return (
    <main className="page">
      <PageHeading
        label={translatedCategory.name}
        title={translatedPost.title}
        description={t("post.startedBy", {
          name: post.author.displayName,
          views: post.viewCount.toLocaleString(),
          replies: post.commentCount,
        })}
      />
      <div className="detail-layout">
        <article className="article-body">
          <p>{translatedPost.body}</p>
          <TagCloud tags={translatedPost.tags} />
        </article>
        <aside className="panel">
          <h2>{t("comment.replies")}</h2>
          {post.comments.length === 0 ? (
            <p className="muted">{t("comment.noReplies")}</p>
          ) : (
            post.comments.map((comment) => {
              const translatedComment = translateComment(comment, language);

              return (
                <div className="comment" key={comment.id}>
                  <strong>{comment.author.displayName}</strong>
                  <p>{translatedComment.body}</p>
                </div>
              );
            })
          )}
          {commentForm}
        </aside>
      </div>
    </main>
  );
}
