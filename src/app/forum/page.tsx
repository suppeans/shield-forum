import Link from "next/link";
import { CategoryList } from "@/components/category-list";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
import { TagCloud } from "@/components/tag-cloud";
import { getForumContent } from "@/lib/repositories/forum";

export default async function ForumPage() {
  const content = await getForumContent();

  return (
    <main className="page">
      <PageHeading
        label="Forum"
        title="Discussion board"
        description="Ask implementation questions, compare defensive patterns, and review practical security tradeoffs."
        action={
          <Link className="button" href="/auth/sign-in">
            New post
          </Link>
        }
      />
      <div className="grid forum-grid">
        <aside className="panel" aria-label="Categories">
          <h2>Categories</h2>
          <CategoryList categories={content.categories} />
        </aside>
        <section aria-labelledby="public-threads">
          <div className="section-title">
            <h2 id="public-threads">Public threads</h2>
          </div>
          <PostList posts={content.posts} />
        </section>
        <aside className="panel" aria-label="Tags">
          <h2>Tags</h2>
          <TagCloud tags={content.tags} />
          <div className="danger-note" style={{ marginTop: 18 }}>
            Keep exploit details defensive, reproducible, and bounded.
          </div>
        </aside>
      </div>
    </main>
  );
}
