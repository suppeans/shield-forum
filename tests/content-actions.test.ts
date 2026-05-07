import { describe, expect, it } from "vitest";
import { prepareCommentInput, preparePostInput } from "@/lib/actions/content";

describe("content action helpers", () => {
  it("normalizes valid post form data", () => {
    const formData = new FormData();
    formData.set("title", "  Turnstile on risky forms  ");
    formData.set("body", "  Challenge registration and repeated posting.  ");
    formData.set("categoryId", "11111111-1111-4111-8111-111111111111");
    formData.append("tagIds", "44444444-4444-4444-8444-444444444444");

    const result = preparePostInput(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe("Turnstile on risky forms");
      expect(result.data.tagIds).toEqual([
        "44444444-4444-4444-8444-444444444444",
      ]);
    }
  });

  it("returns field errors for unsafe comments", () => {
    const formData = new FormData();
    formData.set("postId", "88888888-8888-4888-8888-888888888888");
    formData.set("body", "<script>alert(1)</script>");

    const result = prepareCommentInput(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Unsafe markup");
    }
  });
});
