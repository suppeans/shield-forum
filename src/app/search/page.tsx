import { ArticleList } from "@/components/article-list";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
import { SearchForm } from "@/components/search-form";
import { TranslatedText } from "@/components/translated-text";
import { searchContent } from "@/lib/repositories/forum";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = searchParams ? await searchParams : {};
  const query = params.q ?? "";
  const results = query ? await searchContent(query) : { posts: [], articles: [] };

  return (
    <main className="page">
      <PageHeading
        label=""
        title=""
        description=""
        labelKey="nav.search"
        titleKey="search.title"
        descriptionKey="search.description"
      />
      <SearchForm query={query} />
      <div className="grid knowledge-grid">
        <section>
          <TranslatedText as="h2" translationKey="search.discussions" />
          <PostList posts={results.posts} />
        </section>
        <section>
          <TranslatedText as="h2" translationKey="search.tutorials" />
          <ArticleList articles={results.articles} />
        </section>
      </div>
    </main>
  );
}
