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
        label=""
        title=""
        description=""
        labelKey="nav.admin"
        titleKey="admin.title"
        descriptionKey="admin.description"
      />
      <AdminPanel forum={forum} articles={knowledge.articles} />
    </main>
  );
}
