import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import { TranslatedText } from "@/components/translated-text";
import { getForumContent } from "@/lib/repositories/forum";

export default async function TagsPage() {
  const { tags } = await getForumContent();

  return (
    <main className="page">
      <PageHeading
        label=""
        title=""
        description=""
        labelKey="tags.label"
        titleKey="tags.title"
        descriptionKey="tags.description"
      />
      <section className="panel">
        <TranslatedText as="h2" translationKey="tags.available" />
        <TagCloud tags={tags} />
      </section>
    </main>
  );
}
