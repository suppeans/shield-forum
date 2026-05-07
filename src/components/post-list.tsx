import Link from "next/link";
import { MessageSquare, Shield } from "lucide-react";
import type { PostWithRelations } from "@/lib/repositories/forum";
import { TagPill } from "./tag-pill";

type PostListProps = {
  posts: PostWithRelations[];
};

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="muted">No public discussions match this view.</p>;
  }

  return (
    <div className="content-list">
      {posts.map((post) => (
        <article className="list-item" key={post.id}>
          <div className="item-kicker">
            <span className="with-icon">
              <Shield size={14} aria-hidden="true" />
              {post.category.name}
            </span>
            <span>{post.commentCount} replies</span>
          </div>
          <h2 className="item-title">
            <Link href={`/forum/${post.slug}`}>{post.title}</Link>
          </h2>
          <p>{post.excerpt}</p>
          <div className="item-meta">
            <span className="with-icon">
              <MessageSquare size={14} aria-hidden="true" />
              {post.author.displayName}
            </span>
            <span>{formatDate(post.createdAt)}</span>
            <span>{post.viewCount.toLocaleString()} views</span>
          </div>
          <div className="tag-cloud compact">
            {post.tags.map((tag) => (
              <TagPill key={tag.id} tag={tag} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
