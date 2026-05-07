import Link from "next/link";
import { ArticleList } from "@/components/article-list";
import { CategoryList } from "@/components/category-list";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
import { TagCloud } from "@/components/tag-cloud";
import { TranslatedText } from "@/components/translated-text";
import { getHomeContent } from "@/lib/repositories/forum";

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <main className="page">
      <PageHeading
        label=""
        labelKey="home.label"
        title="Shield Forum"
        description=""
        descriptionKey="home.description"
        action={
          <Link className="button" href="/forum">
            <TranslatedText translationKey="home.browseDiscussions" />
          </Link>
        }
      />
      <div className="grid home-grid">
        <aside className="panel" aria-label="Forum categories">
          <TranslatedText as="h2" translationKey="forum.categories" />
          <CategoryList categories={content.categories} />
        </aside>
        <section aria-labelledby="latest-discussions">
          <div className="section-title">
            <TranslatedText
              as="h2"
              id="latest-discussions"
              translationKey="home.latestDiscussions"
            />
            <Link className="button button-secondary button-small" href="/forum">
              <TranslatedText translationKey="home.viewForum" />
            </Link>
          </div>
          <PostList posts={content.latestPosts} />
        </section>
        <aside className="panel" aria-label="Featured tutorials and tags">
          <TranslatedText as="h2" translationKey="home.featuredTutorials" />
          <ArticleList articles={content.featuredArticles.slice(0, 2)} />
          <TranslatedText
            as="h2"
            style={{ marginTop: 20 }}
            translationKey="home.trendingTags"
          />
          <TagCloud tags={content.trendingTags} />
        </aside>
      </div>
    </main>
  );
}
