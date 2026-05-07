import { createClient } from "@supabase/supabase-js";
import {
  articles,
  categories,
  comments,
  posts,
  profiles,
  tags,
} from "@/lib/sample-data";
import type { Article, Category, Comment, Post, Profile, Tag } from "@/lib/types";

export type PostWithRelations = Post & {
  author: Profile;
  category: Category;
};

export type ArticleWithRelations = Article & {
  author: Profile;
};

export type CommentWithAuthor = Comment & {
  author: Profile;
};

export type HomeContent = {
  featuredArticles: ArticleWithRelations[];
  latestPosts: PostWithRelations[];
  categories: Category[];
  trendingTags: Tag[];
};

export type ForumContent = {
  categories: Category[];
  posts: PostWithRelations[];
  tags: Tag[];
};

export type KnowledgeContent = {
  articles: ArticleWithRelations[];
  tags: Tag[];
};

export type PostDetail = PostWithRelations & {
  comments: CommentWithAuthor[];
};

export type SearchResults = {
  posts: PostWithRelations[];
  articles: ArticleWithRelations[];
};

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function getPublicPosts() {
  return posts
    .filter((post) => post.status === "published")
    .map(withPostRelations)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function getPublicArticles() {
  return articles
    .filter((article) => article.status === "published")
    .map(withArticleRelations)
    .sort((left, right) =>
      (right.publishedAt ?? right.createdAt).localeCompare(
        left.publishedAt ?? left.createdAt,
      ),
    );
}

function withPostRelations(post: Post): PostWithRelations {
  const author = profiles.find((profile) => profile.id === post.authorId);
  const category = categories.find(
    (candidate) => candidate.id === post.categoryId,
  );

  if (!author || !category) {
    throw new Error(`Sample post ${post.id} has missing relations`);
  }

  return { ...post, author, category };
}

function withArticleRelations(article: Article): ArticleWithRelations {
  const author = profiles.find((profile) => profile.id === article.authorId);

  if (!author) {
    throw new Error(`Sample article ${article.id} has missing author`);
  }

  return { ...article, author };
}

function withCommentAuthor(comment: Comment): CommentWithAuthor {
  const author = profiles.find((profile) => profile.id === comment.authorId);

  if (!author) {
    throw new Error(`Sample comment ${comment.id} has missing author`);
  }

  return { ...comment, author };
}

function sampleHomeContent(): HomeContent {
  return {
    featuredArticles: getPublicArticles().slice(0, 3),
    latestPosts: getPublicPosts().slice(0, 5),
    categories: categories.filter((category) => category.isVisible),
    trendingTags: tags,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!hasSupabaseEnv()) {
    return sampleHomeContent();
  }

  const [forum, knowledge] = await Promise.all([
    getForumContent(),
    getKnowledgeContent(),
  ]);

  return {
    featuredArticles: knowledge.articles.slice(0, 3),
    latestPosts: forum.posts.slice(0, 5),
    categories: forum.categories,
    trendingTags: forum.tags.slice(0, 8),
  };
}

export async function getForumContent(): Promise<ForumContent> {
  if (!hasSupabaseEnv()) {
    return {
      categories: categories.filter((category) => category.isVisible),
      posts: getPublicPosts(),
      tags,
    };
  }

  const supabase = createAnonClient();
  const [{ data: categoryRows }, { data: tagRows }, { data: postRows }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order"),
      supabase.from("tags").select("*").order("name"),
      supabase
        .from("posts")
        .select("*, profiles(*), categories(*), post_tags(tags(*)), comments(id)")
        .eq("status", "published")
        .order("created_at", { ascending: false }),
    ]);

  return {
    categories: mapCategories(categoryRows ?? []),
    tags: mapTags(tagRows ?? []),
    posts: (postRows ?? []).map(mapPostRow),
  };
}

export async function getKnowledgeContent(): Promise<KnowledgeContent> {
  if (!hasSupabaseEnv()) {
    return {
      articles: getPublicArticles(),
      tags,
    };
  }

  const supabase = createAnonClient();
  const [{ data: tagRows }, { data: articleRows }] = await Promise.all([
    supabase.from("tags").select("*").order("name"),
    supabase
      .from("articles")
      .select("*, profiles(*), article_tags(tags(*))")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  return {
    articles: (articleRows ?? []).map(mapArticleRow),
    tags: mapTags(tagRows ?? []),
  };
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  if (!hasSupabaseEnv()) {
    const post = getPublicPosts().find((candidate) => candidate.slug === slug);

    if (!post) {
      return null;
    }

    return {
      ...post,
      comments: comments
        .filter(
          (comment) =>
            comment.postId === post.id && comment.status === "published",
        )
        .map(withCommentAuthor),
    };
  }

  const supabase = createAnonClient();
  const { data } = await supabase
    .from("posts")
    .select(
      "*, profiles(*), categories(*), post_tags(tags(*)), comments(*, profiles(*))",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data ? mapPostDetailRow(data) : null;
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleWithRelations | null> {
  if (!hasSupabaseEnv()) {
    return getPublicArticles().find((article) => article.slug === slug) ?? null;
  }

  const supabase = createAnonClient();
  const { data } = await supabase
    .from("articles")
    .select("*, profiles(*), article_tags(tags(*))")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data ? mapArticleRow(data) : null;
}

export async function searchContent(query: string): Promise<SearchResults> {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return { posts: [], articles: [] };
  }

  if (!hasSupabaseEnv()) {
    const matches = (value: string) =>
      value.toLowerCase().includes(normalizedQuery);

    return {
      posts: getPublicPosts().filter(
        (post) =>
          matches(post.title) || matches(post.excerpt) || matches(post.body),
      ),
      articles: getPublicArticles().filter(
        (article) =>
          matches(article.title) ||
          matches(article.summary) ||
          matches(article.body),
      ),
    };
  }

  const supabase = createAnonClient();
  const [{ data: postRows }, { data: articleRows }] = await Promise.all([
    supabase
      .from("posts")
      .select("*, profiles(*), categories(*), post_tags(tags(*)), comments(id)")
      .eq("status", "published")
      .textSearch("title", normalizedQuery, { type: "websearch" })
      .limit(20),
    supabase
      .from("articles")
      .select("*, profiles(*), article_tags(tags(*))")
      .eq("status", "published")
      .textSearch("title", normalizedQuery, { type: "websearch" })
      .limit(20),
  ]);

  return {
    posts: (postRows ?? []).map(mapPostRow),
    articles: (articleRows ?? []).map(mapArticleRow),
  };
}

function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, anonKey);
}

function mapCategories(rows: Record<string, unknown>[]): Category[] {
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
    isVisible: Boolean(row.is_visible),
  }));
}

function mapTags(rows: Record<string, unknown>[]): Tag[] {
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
  }));
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    username: String(row.username),
    displayName: String(row.display_name),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    bio: row.bio ? String(row.bio) : null,
    role: row.role === "admin" ? "admin" : "user",
    createdAt: String(row.created_at),
  };
}

function mapPostRow(row: Record<string, unknown>): PostWithRelations {
  const postTags = Array.isArray(row.post_tags) ? row.post_tags : [];
  const rawComments = Array.isArray(row.comments) ? row.comments : [];

  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    body: String(row.body),
    excerpt: String(row.body).slice(0, 180),
    categoryId: String(row.category_id),
    authorId: String(row.author_id),
    status: row.status === "hidden" ? "hidden" : "published",
    viewCount: Number(row.view_count ?? 0),
    tags: postTags
      .map((joinRow) => (joinRow as { tags?: Record<string, unknown> }).tags)
      .filter(Boolean)
      .map((tag) => mapTags([tag as Record<string, unknown>])[0]),
    commentCount: rawComments.length,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    author: mapProfile(row.profiles as Record<string, unknown>),
    category: mapCategories([row.categories as Record<string, unknown>])[0],
  };
}

function mapArticleRow(row: Record<string, unknown>): ArticleWithRelations {
  const articleTags = Array.isArray(row.article_tags) ? row.article_tags : [];

  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    summary: String(row.summary),
    body: String(row.body),
    authorId: String(row.author_id),
    status:
      row.status === "hidden"
        ? "hidden"
        : row.status === "published"
          ? "published"
          : "draft",
    publishedAt: row.published_at ? String(row.published_at) : null,
    tags: articleTags
      .map((joinRow) => (joinRow as { tags?: Record<string, unknown> }).tags)
      .filter(Boolean)
      .map((tag) => mapTags([tag as Record<string, unknown>])[0]),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    author: mapProfile(row.profiles as Record<string, unknown>),
  };
}

function mapPostDetailRow(row: Record<string, unknown>): PostDetail {
  const post = mapPostRow(row);
  const rawComments = Array.isArray(row.comments) ? row.comments : [];

  return {
    ...post,
    comments: rawComments
      .filter((comment) => (comment as { status?: string }).status === "published")
      .map((comment) => {
        const commentRow = comment as Record<string, unknown>;
        return {
          id: String(commentRow.id),
          postId: String(commentRow.post_id),
          authorId: String(commentRow.author_id),
          parentCommentId: commentRow.parent_comment_id
            ? String(commentRow.parent_comment_id)
            : null,
          body: String(commentRow.body),
          status: "published",
          createdAt: String(commentRow.created_at),
          updatedAt: String(commentRow.updated_at),
          author: mapProfile(commentRow.profiles as Record<string, unknown>),
        };
      }),
  };
}
