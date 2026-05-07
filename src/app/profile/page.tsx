import { PageHeading } from "@/components/page-heading";
import { PostForm } from "@/components/post-form";
import { PostList } from "@/components/post-list";
import { getForumContent } from "@/lib/repositories/forum";
import { profiles } from "@/lib/sample-data";

export default async function ProfilePage() {
  const forum = await getForumContent();
  const profile = profiles[0];
  const authoredPosts = forum.posts.filter((post) => post.authorId === profile.id);

  return (
    <main className="page">
      <PageHeading
        label="Profile"
        title={profile.displayName}
        description={profile.bio ?? "Community member"}
      />
      <div className="grid knowledge-grid">
        <section>
          <h2>Your discussions</h2>
          <PostList posts={authoredPosts} />
        </section>
        <PostForm categories={forum.categories} tags={forum.tags} />
      </div>
    </main>
  );
}
