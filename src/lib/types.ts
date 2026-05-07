export type UserRole = "user" | "admin";
export type ContentStatus = "published" | "hidden";
export type ArticleStatus = "draft" | "published" | "hidden";

export type Profile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: UserRole;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  categoryId: string;
  authorId: string;
  status: ContentStatus;
  viewCount: number;
  tags: Tag[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId: string | null;
  body: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  authorId: string;
  status: ArticleStatus;
  publishedAt: string | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};
