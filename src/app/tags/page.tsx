import { PageHeading } from "@/components/page-heading";
import { TagCloud } from "@/components/tag-cloud";
import { getForumContent } from "@/lib/repositories/forum";

export default async function TagsPage() {
  const { tags } = await getForumContent();

  return (
    <main className="page">
      <PageHeading
        label="Tags"
        title="Topic index"
        description="Browse security discussions and tutorials by technical topic."
      />
      <section className="panel">
        <h2>Available tags</h2>
        <TagCloud tags={tags} />
      </section>
    </main>
  );
}
