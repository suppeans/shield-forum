import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import { getPostBySlug } from "@/lib/repositories/forum";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="page">
      <PageHeading
        label={post.category.name}
        title={post.title}
        description={`Started by ${post.author.displayName}. ${post.viewCount.toLocaleString()} views and ${post.commentCount} replies.`}
      />
      <div className="detail-layout">
        <article className="article-body">
          <p>{post.body}</p>
          <TagCloud tags={post.tags} />
        </article>
        <aside className="panel">
          <h2>Replies</h2>
          {post.comments.length === 0 ? (
            <p className="muted">No replies yet.</p>
          ) : (
            post.comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <strong>{comment.author.displayName}</strong>
                <p>{comment.body}</p>
              </div>
            ))
          )}
          <CommentForm postId={post.id} />
        </aside>
      </div>
    </main>
  );
}
