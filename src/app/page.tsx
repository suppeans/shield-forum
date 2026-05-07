import Link from "next/link";
import { ArticleList } from "@/components/article-list";
import { CategoryList } from "@/components/category-list";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
import { TagCloud } from "@/components/tag-cloud";
import { getHomeContent } from "@/lib/repositories/forum";

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <main className="page">
      <PageHeading
        label="Public security community"
        title="Shield Forum"
        description="A focused place for practical cybersecurity tutorials, defensive engineering notes, and public discussion."
        action={
          <Link className="button" href="/forum">
            Browse discussions
          </Link>
        }
      />
      <div className="grid home-grid">
        <aside className="panel" aria-label="Forum categories">
          <h2>Categories</h2>
          <CategoryList categories={content.categories} />
        </aside>
        <section aria-labelledby="latest-discussions">
          <div className="section-title">
            <h2 id="latest-discussions">Latest discussions</h2>
            <Link className="button button-secondary button-small" href="/forum">
              View forum
            </Link>
          </div>
          <PostList posts={content.latestPosts} />
        </section>
        <aside className="panel" aria-label="Featured tutorials and tags">
          <h2>Featured tutorials</h2>
          <ArticleList articles={content.featuredArticles.slice(0, 2)} />
          <h2 style={{ marginTop: 20 }}>Trending tags</h2>
          <TagCloud tags={content.trendingTags} />
        </aside>
      </div>
    </main>
  );
}
