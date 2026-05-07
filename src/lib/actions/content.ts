import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  articleInputSchema,
  commentInputSchema,
  postInputSchema,
  slugify,
} from "@/lib/validation";

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function preparePostInput(
  formData: FormData,
): ParseResult<ReturnType<typeof postInputSchema.parse>> {
  const result = postInputSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    categoryId: formData.get("categoryId"),
    tagIds: formData.getAll("tagIds"),
  });

  if (!result.success) {
    return { ok: false, error: result.error.issues[0]?.message ?? "Invalid post" };
  }

  return { ok: true, data: result.data };
}

export function prepareCommentInput(
  formData: FormData,
): ParseResult<ReturnType<typeof commentInputSchema.parse>> {
  const result = commentInputSchema.safeParse({
    postId: formData.get("postId"),
    parentCommentId: formData.get("parentCommentId") || null,
    body: formData.get("body"),
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues[0]?.message ?? "Invalid comment",
    };
  }

  return { ok: true, data: result.data };
}

export function prepareArticleInput(
  formData: FormData,
): ParseResult<ReturnType<typeof articleInputSchema.parse>> {
  const result = articleInputSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    tagIds: formData.getAll("tagIds"),
    status: formData.get("status") || "draft",
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues[0]?.message ?? "Invalid article",
    };
  }

  return { ok: true, data: result.data };
}

export async function createPost(formData: FormData) {
  "use server";

  const input = preparePostInput(formData);
  if (!input.ok) {
    return;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/auth/sign-in");
  }

  const slug = `${slugify(input.data.title)}-${Date.now().toString(36)}`;
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title: input.data.title,
      slug,
      body: input.data.body,
      category_id: input.data.categoryId,
      author_id: userData.user.id,
      status: "published",
    })
    .select("id, slug")
    .single();

  if (error || !post) {
    return;
  }

  if (input.data.tagIds.length > 0) {
    await supabase.from("post_tags").insert(
      input.data.tagIds.map((tagId) => ({
        post_id: post.id,
        tag_id: tagId,
      })),
    );
  }

  revalidatePath("/forum");
  redirect(`/forum/${post.slug}`);
}

export async function createComment(formData: FormData) {
  "use server";

  const input = prepareCommentInput(formData);
  if (!input.ok) {
    return;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/auth/sign-in");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: input.data.postId,
    parent_comment_id: input.data.parentCommentId ?? null,
    body: input.data.body,
    author_id: userData.user.id,
    status: "published",
  });

  if (error) {
    return;
  }

  revalidatePath("/forum");
}

export async function createArticle(formData: FormData) {
  "use server";

  const input = prepareArticleInput(formData);
  if (!input.ok) {
    return;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/auth/sign-in");
  }

  const slug = `${slugify(input.data.title)}-${Date.now().toString(36)}`;
  const { data: article, error } = await supabase
    .from("articles")
    .insert({
      title: input.data.title,
      slug,
      summary: input.data.summary,
      body: input.data.body,
      author_id: userData.user.id,
      status: input.data.status,
      published_at:
        input.data.status === "published" ? new Date().toISOString() : null,
    })
    .select("id, slug")
    .single();

  if (error || !article) {
    return;
  }

  if (input.data.tagIds.length > 0) {
    await supabase.from("article_tags").insert(
      input.data.tagIds.map((tagId) => ({
        article_id: article.id,
        tag_id: tagId,
      })),
    );
  }

  revalidatePath("/knowledge");
  redirect(`/knowledge/${article.slug}`);
}
