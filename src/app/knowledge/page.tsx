import { ArticleList } from "@/components/article-list";
import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import { getKnowledgeContent } from "@/lib/repositories/forum";

export default async function KnowledgePage() {
  const content = await getKnowledgeContent();

  return (
    <main className="page">
      <PageHeading
        label="Knowledge base"
        title="Defensive tutorials"
        description="Curated articles for application security, cloud hardening, detection, and community operations."
      />
      <div className="grid knowledge-grid">
        <section aria-labelledby="tutorials">
          <h2 id="tutorials" className="section-title">
            Published tutorials
          </h2>
          <ArticleList articles={content.articles} />
        </section>
        <aside className="panel">
          <h2>Topics</h2>
          <TagCloud tags={content.tags} />
        </aside>
      </div>
    </main>
  );
}
