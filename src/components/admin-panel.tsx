import { createArticle } from "@/lib/actions/content";
import type { ArticleWithRelations, ForumContent } from "@/lib/repositories/forum";

type AdminPanelProps = {
  forum: ForumContent;
  articles: ArticleWithRelations[];
};

export function AdminPanel({ forum, articles }: AdminPanelProps) {
  const publishedArticles = articles.filter(
    (article) => article.status === "published",
  );

  return (
    <div className="grid knowledge-grid">
      <section className="panel">
        <h2>Moderation queue</h2>
        <div className="stat-grid">
          <div className="stat">
            <strong>{forum.posts.length}</strong>
            Published posts
          </div>
          <div className="stat">
            <strong>{publishedArticles.length}</strong>
            Published tutorials
          </div>
          <div className="stat">
            <strong>{forum.tags.length}</strong>
            Active tags
          </div>
        </div>
        <p className="muted">
          Hidden content remains in Supabase for review and restoration. Full
          moderation actions are enforced by RLS admin policies.
        </p>
      </section>
      <form className="panel stack" action={createArticle}>
        <h2>Publish tutorial</h2>
        <label className="field">
          Title
          <input className="input" name="title" maxLength={160} required />
        </label>
        <label className="field">
          Summary
          <textarea className="textarea" name="summary" maxLength={280} required />
        </label>
        <label className="field">
          Body
          <textarea className="textarea" name="body" maxLength={40000} required />
        </label>
        <label className="field">
          Status
          <select className="input" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <fieldset className="field">
          <legend>Tags</legend>
          <div className="checkbox-grid">
            {forum.tags.map((tag) => (
              <label key={tag.id}>
                <input name="tagIds" type="checkbox" value={tag.id} /> {tag.name}
              </label>
            ))}
          </div>
        </fieldset>
        <button className="button" type="submit">
          Save tutorial
        </button>
      </form>
    </div>
  );
}
