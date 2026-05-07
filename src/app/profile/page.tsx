import { PostForm } from "@/components/post-form";
import { PostList } from "@/components/post-list";
import { ProfileHeading } from "@/components/profile-heading";
import { TranslatedText } from "@/components/translated-text";
import { getForumContent } from "@/lib/repositories/forum";
import { profiles } from "@/lib/sample-data";

export default async function ProfilePage() {
  const forum = await getForumContent();
  const profile = profiles[0];
  const authoredPosts = forum.posts.filter((post) => post.authorId === profile.id);

  return (
    <main className="page">
      <ProfileHeading profile={profile} />
      <div className="grid knowledge-grid">
        <section>
          <TranslatedText as="h2" translationKey="profile.yourDiscussions" />
          <PostList posts={authoredPosts} />
        </section>
        <PostForm categories={forum.categories} tags={forum.tags} />
      </div>
    </main>
  );
}
