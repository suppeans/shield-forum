import { createComment } from "@/lib/actions/content";

type CommentFormProps = {
  postId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
  return (
    <form className="stack" action={createComment}>
      <input name="postId" type="hidden" value={postId} />
      <label className="field">
        Reply
        <textarea className="textarea" name="body" maxLength={8000} required />
      </label>
      <button className="button" type="submit">
        Add reply
      </button>
    </form>
  );
}
