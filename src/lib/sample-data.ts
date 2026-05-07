import type { Article, Category, Comment, Post, Profile, Tag } from "./types";

export const profiles: Profile[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    username: "cipherwarden",
    displayName: "Cipher Warden",
    avatarUrl: null,
    bio: "Application security engineer focused on practical defense.",
    role: "admin",
    createdAt: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    username: "cloudsploit",
    displayName: "CloudSploit",
    avatarUrl: null,
    bio: "Cloud security notes and incident response playbooks.",
    role: "user",
    createdAt: "2026-05-02T10:30:00.000Z",
  },
];

export const categories: Category[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Web Security",
    slug: "web-security",
    description: "Browser, application, API, and identity security.",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Cloud Security",
    slug: "cloud-security",
    description: "Cloud posture, IAM, logging, and network controls.",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Incident Response",
    slug: "incident-response",
    description: "Detection, triage, containment, and lessons learned.",
    sortOrder: 3,
    isVisible: true,
  },
];

export const tags: Tag[] = [
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "RLS",
    slug: "rls",
    description: "Row Level Security patterns and reviews.",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "OAuth",
    slug: "oauth",
    description: "OAuth, OIDC, and token handling.",
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "Cloudflare",
    slug: "cloudflare",
    description: "Edge security, WAF, CDN, and Turnstile.",
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    name: "Detection",
    slug: "detection",
    description: "Signals, alerts, and response workflows.",
  },
];

export const posts: Post[] = [
  {
    id: "88888888-8888-4888-8888-888888888888",
    title: "How do you test Supabase RLS before launch?",
    slug: "test-supabase-rls-before-launch",
    body: "We are preparing a public forum and want policy tests that catch anonymous writes, author-only edits, and admin moderation mistakes.",
    excerpt:
      "A practical checklist for validating anonymous reads, author edits, and admin moderation policies.",
    categoryId: categories[0].id,
    authorId: profiles[0].id,
    status: "published",
    viewCount: 482,
    tags: [tags[0]],
    commentCount: 4,
    createdAt: "2026-05-05T08:15:00.000Z",
    updatedAt: "2026-05-05T09:30:00.000Z",
  },
  {
    id: "99999999-9999-4999-8999-999999999999",
    title: "Cloudflare Turnstile placement for post forms",
    slug: "cloudflare-turnstile-post-forms",
    body: "Registration is obvious, but should high-volume forms also challenge users? Looking for practical friction limits.",
    excerpt:
      "Where to place Turnstile challenges without making normal community posting painful.",
    categoryId: categories[1].id,
    authorId: profiles[1].id,
    status: "published",
    viewCount: 319,
    tags: [tags[2]],
    commentCount: 2,
    createdAt: "2026-05-04T15:05:00.000Z",
    updatedAt: "2026-05-04T16:20:00.000Z",
  },
];

export const comments: Comment[] = [
  {
    id: "12121212-1212-4121-8121-121212121212",
    postId: posts[0].id,
    authorId: profiles[1].id,
    parentCommentId: null,
    body: "Start by writing negative tests for every policy. Anonymous insert checks catch more than people expect.",
    status: "published",
    createdAt: "2026-05-05T10:00:00.000Z",
    updatedAt: "2026-05-05T10:00:00.000Z",
  },
];

export const articles: Article[] = [
  {
    id: "aaaaaaaa-1111-4aaa-8aaa-111111111111",
    title: "A launch checklist for public security forums",
    slug: "launch-checklist-public-security-forums",
    summary:
      "Baseline controls for authentication, moderation, RLS, and edge protection before opening registration.",
    body: "Public security communities need strong defaults: verified auth flows, constrained rich text, RLS-backed authorization, and fast moderation controls.",
    authorId: profiles[0].id,
    status: "published",
    publishedAt: "2026-05-03T12:00:00.000Z",
    tags: [tags[0], tags[2]],
    createdAt: "2026-05-03T10:00:00.000Z",
    updatedAt: "2026-05-03T12:00:00.000Z",
  },
  {
    id: "bbbbbbbb-2222-4bbb-8bbb-222222222222",
    title: "OAuth token replay defenses for web apps",
    slug: "oauth-token-replay-defenses-web-apps",
    summary:
      "Use short-lived tokens, sender constraints, audit trails, and session rotation to reduce replay impact.",
    body: "Token replay is best handled in layers. Keep token lifetimes short, rotate sessions after risk events, and log unusual token use.",
    authorId: profiles[0].id,
    status: "published",
    publishedAt: "2026-05-02T14:00:00.000Z",
    tags: [tags[1], tags[3]],
    createdAt: "2026-05-02T11:00:00.000Z",
    updatedAt: "2026-05-02T14:00:00.000Z",
  },
];
