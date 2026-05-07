import { createPost } from "@/lib/actions/content";
import type { Category, Tag } from "@/lib/types";

type PostFormProps = {
  categories: Category[];
  tags: Tag[];
};

export function PostForm({ categories, tags }: PostFormProps) {
  return (
    <form className="panel stack" action={createPost}>
      <h2>Create discussion</h2>
      <label className="field">
        Title
        <input className="input" name="title" maxLength={140} required />
      </label>
      <label className="field">
        Category
        <select className="input" name="categoryId" required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Body
        <textarea className="textarea" name="body" maxLength={20000} required />
      </label>
      <fieldset className="field">
        <legend>Tags</legend>
        <div className="checkbox-grid">
          {tags.map((tag) => (
            <label key={tag.id}>
              <input name="tagIds" type="checkbox" value={tag.id} /> {tag.name}
            </label>
          ))}
        </div>
      </fieldset>
      <button className="button" type="submit">
        Publish post
      </button>
    </form>
  );
}
