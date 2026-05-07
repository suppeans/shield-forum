import { ArticleList } from "@/components/article-list";
import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import { TranslatedText } from "@/components/translated-text";
import { getKnowledgeContent } from "@/lib/repositories/forum";

export default async function KnowledgePage() {
  const content = await getKnowledgeContent();

  return (
    <main className="page">
      <PageHeading
        label=""
        title=""
        description=""
        labelKey="knowledge.label"
        titleKey="knowledge.title"
        descriptionKey="knowledge.description"
      />
      <div className="grid knowledge-grid">
        <section aria-labelledby="tutorials">
          <TranslatedText
            as="h2"
            id="tutorials"
            className="section-title"
            translationKey="knowledge.publishedTutorials"
          />
          <ArticleList articles={content.articles} />
        </section>
        <aside className="panel">
          <TranslatedText as="h2" translationKey="knowledge.topics" />
          <TagCloud tags={content.tags} />
        </aside>
      </div>
    </main>
  );
}
