import { z } from "zod";

const uuid = z.uuid();
const unsafeMarkupPattern =
  /<\s*(script|iframe|object|embed|svg|img|link|meta|style|form|input|button|textarea|select|option|video|audio|source|base)\b|on[a-z]+\s*=|javascript:/i;

export function rejectUnsafeMarkup(value: string): string {
  if (unsafeMarkupPattern.test(value)) {
    throw new Error("Unsafe markup is not allowed");
  }

  return value;
}

const safeText = (fieldName: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .max(maxLength, `${fieldName} must be ${maxLength} characters or less`)
    .refine((value) => {
      try {
        rejectUnsafeMarkup(value);
        return true;
      } catch {
        return false;
      }
    }, "Unsafe markup is not allowed");

export const postInputSchema = z.object({
  title: safeText("Title", 140),
  body: safeText("Body", 20_000),
  categoryId: uuid,
  tagIds: z.array(uuid).max(6, "Posts can use at most 6 tags"),
});

export const commentInputSchema = z.object({
  postId: uuid,
  parentCommentId: uuid.nullish(),
  body: safeText("Comment", 8_000),
});

export const articleInputSchema = z.object({
  title: safeText("Title", 160),
  summary: safeText("Summary", 280),
  body: safeText("Body", 40_000),
  tagIds: z.array(uuid).max(10, "Articles can use at most 10 tags"),
  status: z.enum(["draft", "published", "hidden"]),
});

export const profileInputSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be 32 characters or less")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain only letters, numbers, and underscores",
    ),
  displayName: safeText("Display name", 80),
  bio: z
    .string()
    .trim()
    .max(280, "Bio must be 280 characters or less")
    .transform((value) => (value.length === 0 ? null : value))
    .refine((value) => {
      if (value === null) {
        return true;
      }

      try {
        rejectUnsafeMarkup(value);
        return true;
      } catch {
        return false;
      }
    }, "Unsafe markup is not allowed"),
});

export function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "untitled";
}
