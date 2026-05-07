import { AdminPanel } from "@/components/admin-panel";
import { PageHeading } from "@/components/page-heading";
import { getForumContent, getKnowledgeContent } from "@/lib/repositories/forum";

export default async function AdminPage() {
  const [forum, knowledge] = await Promise.all([
    getForumContent(),
    getKnowledgeContent(),
  ]);

  return (
    <main className="page">
      <PageHeading
        label="Admin"
        title="Community operations"
        description="Publish tutorials, monitor public content, and keep moderation state auditable."
      />
      <AdminPanel forum={forum} articles={knowledge.articles} />
    </main>
  );
}
