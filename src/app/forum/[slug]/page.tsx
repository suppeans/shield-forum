import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { PostDetailView } from "@/components/post-detail-view";
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

  return <PostDetailView post={post} commentForm={<CommentForm postId={post.id} />} />;
}
