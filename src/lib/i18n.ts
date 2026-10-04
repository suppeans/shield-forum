import type { Category } from "./types";
export type Language = "zh" | "ja" | "en";
export const defaultLanguage: Language = "ja";
export const languageStorageKey = "shield-news-language";
export const languages = [
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "en", label: "English", nativeLabel: "English" },
] as const;
const ja = {
  "header.home": "SHIELD NEWS ホーム", "header.primaryNavigation": "メインナビゲーション", "language.select": "表示言語を選択",
  "nav.home": "ホーム", "nav.ai": "AI", "nav.security": "セキュリティ", "nav.business": "企業", "nav.semiconductors": "半導体", "nav.cloud": "クラウド", "nav.careers": "IT就職", "nav.about": "このサイトについて", "nav.search": "ニュースを検索", "nav.menu": "メニュー",
  "home.label": "日本 IT ニュース / デイリーブリーフ", "home.title": "今日の変化を、\n明日の視点に。", "home.description": "日本のIT業界を、ひとつの視点から。重要な動きとその意味を、毎日のブリーフで。",
  "home.focus": "注目ニュース", "home.list": "ニュース一覧", "home.today": "今日のブリーフ", "home.total": "収録ニュース", "home.sources": "出典", "home.archive": "過去のブリーフ", "home.all": "すべて", "home.empty": "この日のニュースはまだ公開されていません。", "home.emptyFilter": "このカテゴリーのニュースはありません。", "home.updated": "最新の収録時刻", "home.latest": "最新の公開号を見る",
  "news.why": "注目する理由", "news.read": "ニュースを読む", "news.original": "原文を読む", "news.sample": "表示サンプル", "news.sampleNotice": "現在は架空の表示サンプルです。実際のニュースではありません。", "news.japan": "日本", "news.global": "海外 / 日本への影響", "news.facts": "主な事実", "news.summary": "ニュースの概要", "news.source": "情報源", "news.disclosure": "原記事を要約したニュースブリーフです。事実確認や詳細は、情報源の原文をご確認ください。", "news.related": "同じ日のニュース", "news.edition": "収録日", "news.published": "原記事の公開日時（日本時間）",
  "common.tags": "関連タグ", "common.search": "検索", "common.back": "ブリーフに戻る", "list.noArticles": "該当するニュースはありません。",
  "search.title": "ニュースを探す。", "search.description": "見出し、要約、情報源、タグから過去のニュースを検索。", "search.placeholder": "AI、半導体、企業名など", "search.query": "検索キーワード", "search.results": "検索結果",
  "tags.label": "トピック", "tags.title": "関心から、ニュースへ。", "tags.description": "タグを選んで、関連するニュースを読み返す。",
  "archive.title": "毎日の変化を、記録する。", "archive.description": "日付から過去の日本ITニュースを振り返る。",
  "about.title": "日本のITを、毎日の視点に。", "about.description": "SHIELD NEWS は日本IT業界のニュースを要約する情報集約サイトです。",
  "footer.description": "日本のIT業界を読む、毎日のブリーフ。", "footer.content": "記事は日本語で提供しています。", "footer.notice": "独立したニュース集約サイトです。各記事の権利は原発信者に帰属します。", "footer.archive": "アーカイブ", "footer.topics": "トピック", "footer.about": "編集方針",
} as const;
export type TranslationKey = keyof typeof ja;
const en: Record<TranslationKey, string> = {
  "header.home": "SHIELD NEWS home", "header.primaryNavigation": "Main navigation", "language.select": "Select interface language",
  "nav.home": "Home", "nav.ai": "AI", "nav.security": "Security", "nav.business": "Business", "nav.semiconductors": "Chips", "nav.cloud": "Cloud", "nav.careers": "IT careers", "nav.about": "About", "nav.search": "Search news", "nav.menu": "Menu",
  "home.label": "JAPAN IT / DAILY BRIEF", "home.title": "Today's changes.\nTomorrow's perspective.", "home.description": "A daily perspective on Japan's IT industry. The developments that matter, and why.",
  "home.focus": "In focus", "home.list": "News feed", "home.today": "Today's brief", "home.total": "Stories", "home.sources": "Sources", "home.archive": "Previous briefs", "home.all": "All", "home.empty": "No news has been published for this date yet.", "home.emptyFilter": "No stories in this category.", "home.updated": "Latest story timestamp", "home.latest": "Read the latest edition",
  "news.why": "Why it matters", "news.read": "Read brief", "news.original": "Read original", "news.sample": "Display sample", "news.sampleNotice": "Fictional display samples. These are not actual news reports.", "news.japan": "Japan", "news.global": "Global / impact on Japan", "news.facts": "Key facts", "news.summary": "Summary", "news.source": "Source", "news.disclosure": "This is a summarized news brief. Check the original source for facts and full details.", "news.related": "From the same edition", "news.edition": "Edition date", "news.published": "Source publication date (Japan time)",
  "common.tags": "Related tags", "common.search": "Search", "common.back": "Back to the brief", "list.noArticles": "No matching stories.",
  "search.title": "Find a story.", "search.description": "Search headlines, summaries, sources and tags across the archive.", "search.placeholder": "AI, chips, company name…", "search.query": "Search keywords", "search.results": "Search results",
  "tags.label": "Topics", "tags.title": "Follow your interests.", "tags.description": "Select a tag to revisit related stories.",
  "archive.title": "A record of daily change.", "archive.description": "Browse Japan IT news by edition date.",
  "about.title": "A daily perspective on Japan IT.", "about.description": "SHIELD NEWS aggregates and summarizes news about Japan's IT industry.",
  "footer.description": "Your daily brief on Japan's IT industry.", "footer.content": "Articles are provided in Japanese.", "footer.notice": "An independent news aggregation site. Original publishers retain their content rights.", "footer.archive": "Archive", "footer.topics": "Topics", "footer.about": "Editorial policy",
};
const zh: Record<TranslationKey, string> = {
  "header.home": "SHIELD NEWS 首页", "header.primaryNavigation": "主导航", "language.select": "选择界面语言",
  "nav.home": "首页", "nav.ai": "AI", "nav.security": "网络安全", "nav.business": "企业", "nav.semiconductors": "半导体", "nav.cloud": "云计算", "nav.careers": "IT 就职", "nav.about": "关于本站", "nav.search": "搜索新闻", "nav.menu": "菜单",
  "home.label": "日本 IT / 每日简报", "home.title": "今日的变化，\n明日的视角。", "home.description": "每日关注日本 IT 行业的重要动态，以及它们值得关注的原因。",
  "home.focus": "重点新闻", "home.list": "新闻列表", "home.today": "今日简报", "home.total": "收录新闻", "home.sources": "新闻来源", "home.archive": "历史简报", "home.all": "全部", "home.empty": "当天新闻尚未发布。", "home.emptyFilter": "该分类暂无新闻。", "home.updated": "最新收录新闻时间", "home.latest": "查看最新一期",
  "news.why": "为什么值得关注", "news.read": "阅读摘要", "news.original": "阅读原文", "news.sample": "展示样例", "news.sampleNotice": "当前为虚构的展示样例，并非真实新闻。", "news.japan": "日本", "news.global": "全球 / 对日本的影响", "news.facts": "核心事实", "news.summary": "新闻摘要", "news.source": "新闻来源", "news.disclosure": "本站提供新闻摘要，请通过原始来源核实事实并查看完整报道。", "news.related": "同日新闻", "news.edition": "收录日期", "news.published": "原文发布时间（日本时间）",
  "common.tags": "相关标签", "common.search": "搜索", "common.back": "返回简报", "list.noArticles": "没有匹配的新闻。",
  "search.title": "查找新闻。", "search.description": "按标题、摘要、来源或标签搜索历史新闻。", "search.placeholder": "AI、半导体、企业名称等", "search.query": "搜索关键词", "search.results": "搜索结果",
  "tags.label": "主题", "tags.title": "从兴趣出发。", "tags.description": "选择标签查看相关报道。",
  "archive.title": "记录每天的变化。", "archive.description": "按日期查看过去的日本 IT 新闻。",
  "about.title": "每日关注日本 IT。", "about.description": "SHIELD NEWS 是日本 IT 行业新闻摘要与信息聚合站。",
  "footer.description": "日本 IT 行业每日简报。", "footer.content": "新闻正文使用日语。", "footer.notice": "独立新闻聚合站，原文版权归原始发布者所有。", "footer.archive": "历史新闻", "footer.topics": "主题", "footer.about": "编辑方针",
};
export function isLanguage(value: string | null | undefined): value is Language { return value === "zh" || value === "ja" || value === "en"; }
export function t(language: Language, key: TranslationKey | string, values: Record<string, string | number> = {}) {
  const dictionary = { ja, en, zh }[language];
  const template = dictionary[key as TranslationKey] ?? ja[key as TranslationKey] ?? key;
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template as string);
}
export function getDateLocale(language: Language) { return { ja: "ja-JP", zh: "zh-CN", en: "en" }[language]; }
export function translateCategory<T extends Category>(category: T, language: Language): T {
  const key = `nav.${category.slug}`;
  return { ...category, name: key in ja ? t(language, key) : category.name };
}
