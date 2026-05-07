import { createArticle } from "@/lib/actions/content";
import type { ArticleWithRelations, ForumContent } from "@/lib/repositories/forum";
import { TranslatedOption, TranslatedTagName } from "./translated-content";
import { TranslatedText } from "./translated-text";

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
        <TranslatedText as="h2" translationKey="admin.moderationQueue" />
        <div className="stat-grid">
          <div className="stat">
            <strong>{forum.posts.length}</strong>
            <TranslatedText translationKey="admin.publishedPosts" />
          </div>
          <div className="stat">
            <strong>{publishedArticles.length}</strong>
            <TranslatedText translationKey="admin.publishedTutorials" />
          </div>
          <div className="stat">
            <strong>{forum.tags.length}</strong>
            <TranslatedText translationKey="admin.activeTags" />
          </div>
        </div>
        <p className="muted">
          <TranslatedText translationKey="admin.moderationNote" />
        </p>
      </section>
      <form className="panel stack" action={createArticle}>
        <TranslatedText as="h2" translationKey="admin.publishTutorial" />
        <label className="field">
          <TranslatedText translationKey="common.title" />
          <input className="input" name="title" maxLength={160} required />
        </label>
        <label className="field">
          <TranslatedText translationKey="admin.summary" />
          <textarea className="textarea" name="summary" maxLength={280} required />
        </label>
        <label className="field">
          <TranslatedText translationKey="common.body" />
          <textarea className="textarea" name="body" maxLength={40000} required />
        </label>
        <label className="field">
          <TranslatedText translationKey="admin.status" />
          <select className="input" name="status" defaultValue="draft">
            <TranslatedOption value="draft" translationKey="admin.draft" />
            <TranslatedOption
              value="published"
              translationKey="admin.published"
            />
          </select>
        </label>
        <fieldset className="field">
          <legend>
            <TranslatedText translationKey="common.tags" />
          </legend>
          <div className="checkbox-grid">
            {forum.tags.map((tag) => (
              <label key={tag.id}>
                <input name="tagIds" type="checkbox" value={tag.id} />{" "}
                <TranslatedTagName tag={tag} />
              </label>
            ))}
          </div>
        </fieldset>
        <button className="button" type="submit">
          <TranslatedText translationKey="admin.saveTutorial" />
        </button>
      </form>
    </div>
  );
}
