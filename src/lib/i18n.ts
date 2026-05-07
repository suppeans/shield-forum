import type { Article, Category, Comment, Post, Profile, Tag } from "./types";

export type Language = "zh" | "ja" | "en";

export const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "en", label: "English", nativeLabel: "English" },
];

export const defaultLanguage: Language = "en";
export const languageStorageKey = "shield-forum-language";

const en = {
  "admin.activeTags": "Active tags",
  "admin.description":
    "Publish tutorials, monitor public content, and keep moderation state auditable.",
  "admin.draft": "Draft",
  "admin.moderationNote":
    "Hidden content remains in Supabase for review and restoration. Full moderation actions are enforced by RLS admin policies.",
  "admin.moderationQueue": "Moderation queue",
  "admin.published": "Published",
  "admin.publishedPosts": "Published posts",
  "admin.publishedTutorials": "Published tutorials",
  "admin.publishTutorial": "Publish tutorial",
  "admin.saveTutorial": "Save tutorial",
  "admin.status": "Status",
  "admin.summary": "Summary",
  "admin.title": "Community operations",
  "article.draft": "Draft",
  "article.tutorial": "Tutorial",
  "article.writtenBy": "Written by {name}.",
  "auth.account": "Account",
  "auth.createAccount": "Create account",
  "auth.description":
    "Use email and password authentication backed by Supabase Auth.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.register": "Register",
  "auth.signIn": "Sign in",
  "auth.title": "Sign in to participate",
  "common.body": "Body",
  "common.category": "Category",
  "common.search": "Search",
  "common.tags": "Tags",
  "common.title": "Title",
  "comment.addReply": "Add reply",
  "comment.noReplies": "No replies yet.",
  "comment.replies": "Replies",
  "comment.reply": "Reply",
  "forum.categories": "Categories",
  "forum.dangerNote":
    "Keep exploit details defensive, reproducible, and bounded.",
  "forum.description":
    "Ask implementation questions, compare defensive patterns, and review practical security tradeoffs.",
  "forum.label": "Forum",
  "forum.newPost": "New post",
  "forum.publicThreads": "Public threads",
  "forum.title": "Discussion board",
  "header.home": "Shield Forum home",
  "header.language": "Language",
  "header.primaryNavigation": "Primary navigation",
  "home.browseDiscussions": "Browse discussions",
  "home.description":
    "A focused place for practical cybersecurity tutorials, defensive engineering notes, and public discussion.",
  "home.featuredTutorials": "Featured tutorials",
  "home.label": "Public security community",
  "home.latestDiscussions": "Latest discussions",
  "home.trendingTags": "Trending tags",
  "home.viewForum": "View forum",
  "knowledge.description":
    "Curated articles for application security, cloud hardening, detection, and community operations.",
  "knowledge.label": "Knowledge base",
  "knowledge.publishedTutorials": "Published tutorials",
  "knowledge.title": "Defensive tutorials",
  "knowledge.topics": "Topics",
  "language.current": "Current language",
  "language.select": "Select language",
  "list.noArticles": "No published tutorials match this view.",
  "list.noPosts": "No public discussions match this view.",
  "nav.admin": "Admin",
  "nav.forum": "Forum",
  "nav.knowledge": "Knowledge",
  "nav.profile": "Profile",
  "nav.search": "Search",
  "nav.signIn": "Sign in",
  "nav.tags": "Tags",
  "post.createDiscussion": "Create discussion",
  "post.publishPost": "Publish post",
  "post.replies": "{count} replies",
  "post.startedBy":
    "Started by {name}. {views} views and {replies} replies.",
  "post.views": "{count} views",
  "profile.communityMember": "Community member",
  "profile.label": "Profile",
  "profile.yourDiscussions": "Your discussions",
  "search.description":
    "Find published discussions and tutorials. Hidden or draft content is excluded.",
  "search.discussions": "Discussions",
  "search.placeholder": "Search RLS, Turnstile, OAuth...",
  "search.query": "Search query",
  "search.title": "Search public content",
  "search.tutorials": "Tutorials",
  "tags.available": "Available tags",
  "tags.description":
    "Browse security discussions and tutorials by technical topic.",
  "tags.label": "Tags",
  "tags.title": "Topic index",
};

export type TranslationKey = keyof typeof en;

const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  zh: {
    "admin.activeTags": "活跃标签",
    "admin.description": "发布教程、监控公开内容，并保持审核状态可追溯。",
    "admin.draft": "草稿",
    "admin.moderationNote":
      "隐藏内容会保留在 Supabase 中，便于复核和恢复。完整审核操作由 RLS 管理员策略强制执行。",
    "admin.moderationQueue": "审核队列",
    "admin.published": "已发布",
    "admin.publishedPosts": "已发布帖子",
    "admin.publishedTutorials": "已发布教程",
    "admin.publishTutorial": "发布教程",
    "admin.saveTutorial": "保存教程",
    "admin.status": "状态",
    "admin.summary": "摘要",
    "admin.title": "社区运营",
    "article.draft": "草稿",
    "article.tutorial": "教程",
    "article.writtenBy": "作者：{name}。",
    "auth.account": "账户",
    "auth.createAccount": "创建账户",
    "auth.description": "使用由 Supabase Auth 支持的邮箱和密码登录。",
    "auth.email": "邮箱",
    "auth.password": "密码",
    "auth.register": "注册",
    "auth.signIn": "登录",
    "auth.title": "登录后参与讨论",
    "common.body": "正文",
    "common.category": "分类",
    "common.search": "搜索",
    "common.tags": "标签",
    "common.title": "标题",
    "comment.addReply": "添加回复",
    "comment.noReplies": "暂无回复。",
    "comment.replies": "回复",
    "comment.reply": "回复",
    "forum.categories": "分类",
    "forum.dangerNote": "漏洞细节请保持防御性、可复现，并限定范围。",
    "forum.description": "提出实现问题，比较防御模式，并评估实际安全取舍。",
    "forum.label": "论坛",
    "forum.newPost": "发新帖",
    "forum.publicThreads": "公开主题",
    "forum.title": "讨论区",
    "header.home": "Shield Forum 首页",
    "header.language": "语言",
    "header.primaryNavigation": "主导航",
    "home.browseDiscussions": "浏览讨论",
    "home.description":
      "一个专注于实用网络安全教程、防御工程笔记和公开讨论的社区。",
    "home.featuredTutorials": "精选教程",
    "home.label": "公开安全社区",
    "home.latestDiscussions": "最新讨论",
    "home.trendingTags": "热门标签",
    "home.viewForum": "查看论坛",
    "knowledge.description":
      "面向应用安全、云加固、检测和社区运营的精选文章。",
    "knowledge.label": "知识库",
    "knowledge.publishedTutorials": "已发布教程",
    "knowledge.title": "防御教程",
    "knowledge.topics": "主题",
    "language.current": "当前语言",
    "language.select": "选择语言",
    "list.noArticles": "此视图没有匹配的已发布教程。",
    "list.noPosts": "此视图没有匹配的公开讨论。",
    "nav.admin": "管理",
    "nav.forum": "论坛",
    "nav.knowledge": "知识库",
    "nav.profile": "个人资料",
    "nav.search": "搜索",
    "nav.signIn": "登录",
    "nav.tags": "标签",
    "post.createDiscussion": "创建讨论",
    "post.publishPost": "发布帖子",
    "post.replies": "{count} 条回复",
    "post.startedBy": "由 {name} 发起。{views} 次浏览，{replies} 条回复。",
    "post.views": "{count} 次浏览",
    "profile.communityMember": "社区成员",
    "profile.label": "个人资料",
    "profile.yourDiscussions": "我的讨论",
    "search.description": "查找已发布的讨论和教程。隐藏或草稿内容不会显示。",
    "search.discussions": "讨论",
    "search.placeholder": "搜索 RLS、Turnstile、OAuth...",
    "search.query": "搜索关键词",
    "search.title": "搜索公开内容",
    "search.tutorials": "教程",
    "tags.available": "可用标签",
    "tags.description": "按技术主题浏览安全讨论和教程。",
    "tags.label": "标签",
    "tags.title": "主题索引",
  },
  ja: {
    "admin.activeTags": "有効なタグ",
    "admin.description":
      "チュートリアルを公開し、公開コンテンツを監視し、モデレーション状態を監査可能に保ちます。",
    "admin.draft": "下書き",
    "admin.moderationNote":
      "非表示コンテンツは確認と復元のため Supabase に残ります。完全なモデレーション操作は RLS の管理者ポリシーで強制されます。",
    "admin.moderationQueue": "モデレーションキュー",
    "admin.published": "公開済み",
    "admin.publishedPosts": "公開済み投稿",
    "admin.publishedTutorials": "公開済みチュートリアル",
    "admin.publishTutorial": "チュートリアルを公開",
    "admin.saveTutorial": "チュートリアルを保存",
    "admin.status": "状態",
    "admin.summary": "概要",
    "admin.title": "コミュニティ運用",
    "article.draft": "下書き",
    "article.tutorial": "チュートリアル",
    "article.writtenBy": "著者: {name}。",
    "auth.account": "アカウント",
    "auth.createAccount": "アカウント作成",
    "auth.description": "Supabase Auth のメールとパスワード認証を使用します。",
    "auth.email": "メール",
    "auth.password": "パスワード",
    "auth.register": "登録",
    "auth.signIn": "ログイン",
    "auth.title": "ログインして参加",
    "common.body": "本文",
    "common.category": "カテゴリ",
    "common.search": "検索",
    "common.tags": "タグ",
    "common.title": "タイトル",
    "comment.addReply": "返信を追加",
    "comment.noReplies": "まだ返信はありません。",
    "comment.replies": "返信",
    "comment.reply": "返信",
    "forum.categories": "カテゴリ",
    "forum.dangerNote": "攻撃手順の詳細は防御目的、再現可能、範囲限定にしてください。",
    "forum.description":
      "実装上の疑問を投稿し、防御パターンを比較し、実践的なセキュリティ上の判断を確認します。",
    "forum.label": "フォーラム",
    "forum.newPost": "新規投稿",
    "forum.publicThreads": "公開スレッド",
    "forum.title": "ディスカッションボード",
    "header.home": "Shield Forum ホーム",
    "header.language": "言語",
    "header.primaryNavigation": "メインナビゲーション",
    "home.browseDiscussions": "ディスカッションを見る",
    "home.description":
      "実践的なサイバーセキュリティチュートリアル、防御エンジニアリングノート、公開議論に集中できる場所です。",
    "home.featuredTutorials": "注目チュートリアル",
    "home.label": "公開セキュリティコミュニティ",
    "home.latestDiscussions": "最新の議論",
    "home.trendingTags": "注目タグ",
    "home.viewForum": "フォーラムを見る",
    "knowledge.description":
      "アプリケーションセキュリティ、クラウド強化、検知、コミュニティ運用のための厳選記事です。",
    "knowledge.label": "ナレッジベース",
    "knowledge.publishedTutorials": "公開済みチュートリアル",
    "knowledge.title": "防御チュートリアル",
    "knowledge.topics": "トピック",
    "language.current": "現在の言語",
    "language.select": "言語を選択",
    "list.noArticles": "この表示に一致する公開済みチュートリアルはありません。",
    "list.noPosts": "この表示に一致する公開ディスカッションはありません。",
    "nav.admin": "管理",
    "nav.forum": "フォーラム",
    "nav.knowledge": "ナレッジ",
    "nav.profile": "プロフィール",
    "nav.search": "検索",
    "nav.signIn": "ログイン",
    "nav.tags": "タグ",
    "post.createDiscussion": "ディスカッションを作成",
    "post.publishPost": "投稿を公開",
    "post.replies": "{count} 件の返信",
    "post.startedBy": "{name} が開始。{views} 回表示、{replies} 件の返信。",
    "post.views": "{count} 回表示",
    "profile.communityMember": "コミュニティメンバー",
    "profile.label": "プロフィール",
    "profile.yourDiscussions": "自分のディスカッション",
    "search.description": "公開済みの議論とチュートリアルを検索します。非表示や下書きは除外されます。",
    "search.discussions": "ディスカッション",
    "search.placeholder": "RLS、Turnstile、OAuth を検索...",
    "search.query": "検索キーワード",
    "search.title": "公開コンテンツを検索",
    "search.tutorials": "チュートリアル",
    "tags.available": "利用可能なタグ",
    "tags.description": "技術トピック別にセキュリティの議論とチュートリアルを閲覧します。",
    "tags.label": "タグ",
    "tags.title": "トピック索引",
  },
};

type ContentTranslation = Record<string, string>;

const content: Record<Language, Record<string, ContentTranslation>> = {
  en: {},
  zh: {
    "profile:cipherwarden": {
      bio: "专注于实用防御的应用安全工程师。",
    },
    "profile:cloudsploit": {
      bio: "云安全笔记和事件响应剧本。",
    },
    "category:web-security": {
      name: "Web 安全",
      description: "浏览器、应用、API 和身份安全。",
    },
    "category:cloud-security": {
      name: "云安全",
      description: "云姿态、IAM、日志和网络控制。",
    },
    "category:incident-response": {
      name: "事件响应",
      description: "检测、分诊、遏制和复盘经验。",
    },
    "tag:rls": {
      name: "RLS",
      description: "行级安全策略模式和审查。",
    },
    "tag:oauth": {
      name: "OAuth",
      description: "OAuth、OIDC 和令牌处理。",
    },
    "tag:cloudflare": {
      name: "Cloudflare",
      description: "边缘安全、WAF、CDN 和 Turnstile。",
    },
    "tag:detection": {
      name: "检测",
      description: "信号、告警和响应流程。",
    },
    "post:test-supabase-rls-before-launch": {
      title: "上线前如何测试 Supabase RLS？",
      body: "我们正在准备一个公开论坛，希望策略测试能发现匿名写入、作者仅可编辑自己的内容，以及管理员审核失误。",
      excerpt:
        "用于验证匿名读取、作者编辑和管理员审核策略的实用检查清单。",
    },
    "post:cloudflare-turnstile-post-forms": {
      title: "帖子表单中的 Cloudflare Turnstile 应该放在哪里？",
      body: "注册环节很明显，但高频表单也应该触发验证吗？想了解实际可接受的摩擦边界。",
      excerpt: "如何放置 Turnstile 验证，同时不让正常社区发帖变得痛苦。",
    },
    "post:hidden-moderation-note": {
      title: "隐藏的审核备注",
      body: "这条禁止公开的隐藏帖子不应出现在公开列表或搜索结果中。",
      excerpt: "这条隐藏记录用于验证公开过滤。",
    },
    "comment:12121212-1212-4121-8121-121212121212": {
      body: "先为每条策略写负向测试。匿名插入检查能抓到比预期更多的问题。",
    },
    "article:launch-checklist-public-security-forums": {
      title: "公开安全论坛上线检查清单",
      summary: "开放注册前，认证、审核、RLS 和边缘防护需要具备的基础控制。",
      body: "公开安全社区需要强默认设置：经过验证的认证流程、受约束的富文本、由 RLS 支撑的授权，以及快速的审核控制。",
    },
    "article:oauth-token-replay-defenses-web-apps": {
      title: "Web 应用的 OAuth 令牌重放防御",
      summary: "使用短生命周期令牌、发送方约束、审计轨迹和会话轮换来降低重放影响。",
      body: "令牌重放最好分层处理。保持令牌生命周期较短，在风险事件后轮换会话，并记录异常令牌使用。",
    },
    "article:hidden-admin-draft": {
      title: "隐藏的管理员草稿",
      summary: "一篇不应公开的隐藏文章。",
      body: "这篇禁止公开的隐藏文章用于验证仓库过滤。",
    },
  },
  ja: {
    "profile:cipherwarden": {
      bio: "実践的な防御に注力するアプリケーションセキュリティエンジニア。",
    },
    "profile:cloudsploit": {
      bio: "クラウドセキュリティのメモとインシデント対応プレイブック。",
    },
    "category:web-security": {
      name: "Web セキュリティ",
      description: "ブラウザ、アプリケーション、API、ID セキュリティ。",
    },
    "category:cloud-security": {
      name: "クラウドセキュリティ",
      description: "クラウド態勢、IAM、ログ、ネットワーク制御。",
    },
    "category:incident-response": {
      name: "インシデント対応",
      description: "検知、トリアージ、封じ込め、学びの共有。",
    },
    "tag:rls": {
      name: "RLS",
      description: "Row Level Security のパターンとレビュー。",
    },
    "tag:oauth": {
      name: "OAuth",
      description: "OAuth、OIDC、トークン処理。",
    },
    "tag:cloudflare": {
      name: "Cloudflare",
      description: "エッジセキュリティ、WAF、CDN、Turnstile。",
    },
    "tag:detection": {
      name: "検知",
      description: "シグナル、アラート、対応ワークフロー。",
    },
    "post:test-supabase-rls-before-launch": {
      title: "公開前に Supabase RLS をどうテストしますか？",
      body: "公開フォーラムを準備しており、匿名書き込み、投稿者だけの編集、管理者モデレーションのミスを検出できるポリシーテストが必要です。",
      excerpt:
        "匿名読み取り、投稿者編集、管理者モデレーションポリシーを検証する実践的なチェックリスト。",
    },
    "post:cloudflare-turnstile-post-forms": {
      title: "投稿フォームでの Cloudflare Turnstile の配置",
      body: "登録時の導入は明らかですが、投稿量の多いフォームでもチャレンジを出すべきでしょうか。実用的な摩擦の上限を知りたいです。",
      excerpt:
        "通常のコミュニティ投稿をつらくしない Turnstile チャレンジの置き場所。",
    },
    "post:hidden-moderation-note": {
      title: "非表示のモデレーションメモ",
      body: "この禁止された非表示投稿は公開リストや検索結果に出てはいけません。",
      excerpt: "この非表示レコードは公開フィルタリングを検証します。",
    },
    "comment:12121212-1212-4121-8121-121212121212": {
      body: "まず各ポリシーに対して失敗ケースのテストを書きます。匿名挿入の確認は予想以上に多くの問題を見つけます。",
    },
    "article:launch-checklist-public-security-forums": {
      title: "公開セキュリティフォーラムのローンチチェックリスト",
      summary:
        "登録開始前に必要な認証、モデレーション、RLS、エッジ保護の基本コントロール。",
      body: "公開セキュリティコミュニティには、検証済みの認証フロー、制約されたリッチテキスト、RLS に基づく認可、素早いモデレーション制御といった強い初期設定が必要です。",
    },
    "article:oauth-token-replay-defenses-web-apps": {
      title: "Web アプリの OAuth トークンリプレイ防御",
      summary:
        "短命トークン、送信者制約、監査証跡、セッションローテーションでリプレイの影響を抑えます。",
      body: "トークンリプレイは層を重ねて対処するのが最適です。トークン寿命を短くし、リスクイベント後にセッションをローテーションし、異常なトークン利用を記録します。",
    },
    "article:hidden-admin-draft": {
      title: "非表示の管理者下書き",
      summary: "公開されるべきではない非表示記事。",
      body: "この禁止された非表示記事はリポジトリのフィルタリングを検証します。",
    },
  },
};

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "zh" || value === "ja" || value === "en";
}

export function t(
  language: Language,
  key: TranslationKey | string,
  values: Record<string, string | number> = {},
) {
  const template =
    translations[language][key as TranslationKey] ?? en[key as TranslationKey] ?? key;

  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

export function getDateLocale(language: Language) {
  if (language === "zh") {
    return "zh-CN";
  }

  if (language === "ja") {
    return "ja-JP";
  }

  return "en";
}

export function translateProfile<T extends Profile>(profile: T, language: Language): T {
  return applyContentTranslation(profile, language, `profile:${profile.username}`);
}

export function translateCategory<T extends Category>(
  category: T,
  language: Language,
): T {
  return applyContentTranslation(category, language, `category:${category.slug}`);
}

export function translateTag<T extends Tag>(tag: T, language: Language): T {
  return applyContentTranslation(tag, language, `tag:${tag.slug}`);
}

export function translatePost<T extends Post>(post: T, language: Language): T {
  const translated = applyContentTranslation(post, language, `post:${post.slug}`);

  return {
    ...translated,
    tags: translated.tags?.map((tag) => translateTag(tag, language)) ?? [],
  };
}

export function translateComment<T extends Comment>(
  comment: T,
  language: Language,
): T {
  return applyContentTranslation(comment, language, `comment:${comment.id}`);
}

export function translateArticle<T extends Article>(
  article: T,
  language: Language,
): T {
  const translated = applyContentTranslation(article, language, `article:${article.slug}`);

  return {
    ...translated,
    tags: translated.tags?.map((tag) => translateTag(tag, language)) ?? [],
  };
}

function applyContentTranslation<T extends object>(
  item: T,
  language: Language,
  key: string,
): T {
  const localized = content[language][key];

  if (!localized) {
    return item;
  }

  return { ...item, ...localized };
}
