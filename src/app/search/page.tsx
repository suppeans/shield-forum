import { ArticleList } from "@/components/article-list";
import { PageHeading } from "@/components/page-heading";
import { PostList } from "@/components/post-list";
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
        label="Search"
        title="Search public content"
        description="Find published discussions and tutorials. Hidden or draft content is excluded."
      />
      <form className="search-form" action="/search">
        <input
          className="input"
          name="q"
          defaultValue={query}
          placeholder="Search RLS, Turnstile, OAuth..."
          aria-label="Search query"
        />
        <button className="button" type="submit">
          Search
        </button>
      </form>
      <div className="grid knowledge-grid">
        <section>
          <h2>Discussions</h2>
          <PostList posts={results.posts} />
        </section>
        <section>
          <h2>Tutorials</h2>
          <ArticleList articles={results.articles} />
        </section>
      </div>
    </main>
  );
}
