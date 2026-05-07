import { createComment } from "@/lib/actions/content";
import { TranslatedText } from "./translated-text";

type CommentFormProps = {
  postId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
  return (
    <form className="stack" action={createComment}>
      <input name="postId" type="hidden" value={postId} />
      <label className="field">
        <TranslatedText translationKey="comment.reply" />
        <textarea className="textarea" name="body" maxLength={8000} required />
      </label>
      <button className="button" type="submit">
        <TranslatedText translationKey="comment.addReply" />
      </button>
    </form>
  );
}
