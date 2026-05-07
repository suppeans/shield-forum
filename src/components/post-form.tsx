import { createPost } from "@/lib/actions/content";
import type { Category, Tag } from "@/lib/types";
import {
  TranslatedCategoryOption,
  TranslatedTagName,
} from "./translated-content";
import { TranslatedText } from "./translated-text";

type PostFormProps = {
  categories: Category[];
  tags: Tag[];
};

export function PostForm({ categories, tags }: PostFormProps) {
  return (
    <form className="panel stack" action={createPost}>
      <TranslatedText as="h2" translationKey="post.createDiscussion" />
      <label className="field">
        <TranslatedText translationKey="common.title" />
        <input className="input" name="title" maxLength={140} required />
      </label>
      <label className="field">
        <TranslatedText translationKey="common.category" />
        <select className="input" name="categoryId" required>
          {categories.map((category) => (
            <TranslatedCategoryOption key={category.id} category={category} />
          ))}
        </select>
      </label>
      <label className="field">
        <TranslatedText translationKey="common.body" />
        <textarea className="textarea" name="body" maxLength={20000} required />
      </label>
      <fieldset className="field">
        <legend>
          <TranslatedText translationKey="common.tags" />
        </legend>
        <div className="checkbox-grid">
          {tags.map((tag) => (
            <label key={tag.id}>
              <input name="tagIds" type="checkbox" value={tag.id} />{" "}
              <TranslatedTagName tag={tag} />
            </label>
          ))}
        </div>
      </fieldset>
      <button className="button" type="submit">
        <TranslatedText translationKey="post.publishPost" />
      </button>
    </form>
  );
}
