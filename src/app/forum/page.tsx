import Link from "next/link";
import { CategoryList } from "@/components/category-list";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
import { TagCloud } from "@/components/tag-cloud";
import { TranslatedText } from "@/components/translated-text";
import { getForumContent } from "@/lib/repositories/forum";

export default async function ForumPage() {
  const content = await getForumContent();

  return (
    <main className="page">
      <PageHeading
        label=""
        title=""
        description=""
        labelKey="forum.label"
        titleKey="forum.title"
        descriptionKey="forum.description"
        action={
          <Link className="button" href="/auth/sign-in">
            <TranslatedText translationKey="forum.newPost" />
          </Link>
        }
      />
      <div className="grid forum-grid">
        <aside className="panel" aria-label="Categories">
          <TranslatedText as="h2" translationKey="forum.categories" />
          <CategoryList categories={content.categories} />
        </aside>
        <section aria-labelledby="public-threads">
          <div className="section-title">
            <TranslatedText
              as="h2"
              id="public-threads"
              translationKey="forum.publicThreads"
            />
          </div>
          <PostList posts={content.posts} />
        </section>
        <aside className="panel" aria-label="Tags">
          <TranslatedText as="h2" translationKey="common.tags" />
          <TagCloud tags={content.tags} />
          <div className="danger-note" style={{ marginTop: 18 }}>
            <TranslatedText translationKey="forum.dangerNote" />
          </div>
        </aside>
      </div>
    </main>
  );
}
