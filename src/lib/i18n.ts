import { categoryName, type Category } from "./types";
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
  "translation.loading": "翻訳中…", "translation.error": "翻訳を取得できません。日本語の原文を表示しています。", "translation.retry": "再試行", "translation.notice": "AI翻訳 · 詳細は原文をご確認ください。",
  "nav.development": "開発", "nav.dx": "DX", "nav.policy": "政策", "nav.startups": "スタートアップ", "nav.global": "グローバル",
  "nav.home": "ホーム", "nav.ai": "AI", "nav.security": "セキュリティ", "nav.business": "企業", "nav.semiconductors": "半導体", "nav.cloud": "クラウド", "nav.careers": "IT就職", "nav.about": "このサイトについて", "nav.search": "ニュースを検索", "nav.menu": "メニュー",
  "home.label": "日本 IT ニュース / デイリーブリーフ", "home.title": "今日の変化を、\n明日の視点に。", "home.description": "日本のIT業界の重要な動きと、その意味を。確認できた情報を整理し、要点と背景をわかりやすくお届けします。",
  "home.focus": "注目ニュース", "home.list": "ニュース一覧", "home.today": "今日のブリーフ", "home.total": "収録ニュース", "home.sources": "出典", "home.archive": "過去のブリーフ", "home.all": "すべて", "home.empty": "この日のニュースはまだ公開されていません。", "home.emptyFilter": "このカテゴリーのニュースはありません。", "home.updated": "最新の収録時刻", "home.latest": "最新の公開号を見る",
  "news.why": "注目する理由", "news.read": "ニュースを読む", "news.original": "原文を読む", "news.sample": "表示サンプル", "news.sampleNotice": "現在は架空の表示サンプルです。実際のニュースではありません。", "news.japan": "日本", "news.global": "海外 / 日本への影響", "news.facts": "主な事実", "news.summary": "ニュースの概要", "news.source": "情報源", "news.disclosure": "原記事を要約したニュースブリーフです。事実確認や詳細は、情報源の原文をご確認ください。", "news.related": "同じ日のニュース", "news.edition": "収録日", "news.published": "原記事の公開日時（日本時間）",
  "common.tags": "関連タグ", "common.search": "検索", "common.back": "ブリーフに戻る", "list.noArticles": "該当するニュースはありません。",
  "search.title": "ニュースを探す。", "search.description": "見出し、要約、情報源、タグから過去のニュースを検索。", "search.placeholder": "AI、半導体、企業名など", "search.query": "検索キーワード", "search.results": "検索結果",
  "tags.label": "トピック", "tags.title": "関心から、ニュースへ。", "tags.description": "タグを選んで、関連するニュースを読み返す。",
  "archive.choose": "以前のブリーフ", "archive.selectDate": "日付を選択", "archive.open": "表示",
  "archive.title": "毎日の変化を、記録する。", "archive.description": "日付から過去の日本ITニュースを振り返る。",
  "about.title": "日本のITを、毎日の視点に。", "about.description": "SHIELD NEWS は日本IT業界のニュースを要約する情報集約サイトです。",
  "about.focusTitle": "日本のニュースを、優先する。",
  "about.focusBody": "AI、サイバーセキュリティ、IT企業、半導体、クラウド、ソフトウェア開発、DX、政策、IT人材、スタートアップ。日本本土の動きを中心に、日本のIT業界への影響が大きい世界のニュースも扱います。",
  "about.sourcesTitle": "情報源が見えるブリーフ。",
  "about.sourcesBody": "各記事には情報源と原文へのリンクを明記します。SHIELD NEWS は原発信者や報道機関ではありません。ニュースの事実と、注目する理由としての解説を分けて掲載します。原文の全文を転載せず、確認できる事実を短く要約します。",
  "about.updatesTitle": "確認できた情報を、順次届ける。",
  "about.updatesBody": "情報源を確認し、要点を整理したうえでブリーフを更新します。公開号の収録日、当サイトの収録時刻、原記事の公開日時は区別します。原文に時刻がない場合は日付のみ表示します。休日などは直近の発表を含め、新たな確認済み情報がない場合は既存記事を維持します。",
  "about.accuracyTitle": "正確さと透明性。",
  "about.accuracyBody": "AIで生成された要約には誤りが含まれる場合があります。重要な判断には原文をご確認ください。修正・お問い合わせは",
  "about.contactSuffix": " まで。",
  "footer.description": "日本のIT業界を読む、毎日のブリーフ。", "footer.notice": "独立したニュース集約サイトです。各記事の権利は原発信者に帰属します。", "footer.archive": "アーカイブ", "footer.topics": "トピック", "footer.about": "編集方針",
} as const;
export type TranslationKey = keyof typeof ja;
const en: Record<TranslationKey, string> = {
  "header.home": "SHIELD NEWS home", "header.primaryNavigation": "Main navigation", "language.select": "Select language",
  "translation.loading": "Translating…", "translation.error": "Translation unavailable. Showing the Japanese original.", "translation.retry": "Retry", "translation.notice": "AI translation · Check the original for details.",
  "nav.development": "Development", "nav.dx": "DX", "nav.policy": "Policy", "nav.startups": "Startups", "nav.global": "Global",
  "nav.home": "Home", "nav.ai": "AI", "nav.security": "Security", "nav.business": "Business", "nav.semiconductors": "Chips", "nav.cloud": "Cloud", "nav.careers": "IT careers", "nav.about": "About", "nav.search": "Search news", "nav.menu": "Menu",
  "home.label": "JAPAN IT / DAILY BRIEF", "home.title": "Today's changes.\nTomorrow's perspective.", "home.description": "The developments that matter in Japan's IT industry, and why. Clear summaries and context, grounded in verified sources.",
  "home.focus": "In focus", "home.list": "News feed", "home.today": "Today's brief", "home.total": "Stories", "home.sources": "Sources", "home.archive": "Previous briefs", "home.all": "All", "home.empty": "No news has been published for this date yet.", "home.emptyFilter": "No stories in this category.", "home.updated": "Latest story timestamp", "home.latest": "Read the latest edition",
  "news.why": "Why it matters", "news.read": "Read brief", "news.original": "Read original", "news.sample": "Display sample", "news.sampleNotice": "Fictional display samples. These are not actual news reports.", "news.japan": "Japan", "news.global": "Global / impact on Japan", "news.facts": "Key facts", "news.summary": "Summary", "news.source": "Source", "news.disclosure": "This is a summarized news brief. Check the original source for facts and full details.", "news.related": "From the same edition", "news.edition": "Edition date", "news.published": "Source publication date (Japan time)",
  "common.tags": "Related tags", "common.search": "Search", "common.back": "Back to the brief", "list.noArticles": "No matching stories.",
  "search.title": "Find a story.", "search.description": "Search headlines, summaries, sources and tags across the archive.", "search.placeholder": "AI, chips, company name…", "search.query": "Search keywords", "search.results": "Search results",
  "tags.label": "Topics", "tags.title": "Follow your interests.", "tags.description": "Select a tag to revisit related stories.",
  "archive.choose": "Older briefs", "archive.selectDate": "Select a date", "archive.open": "View",
  "archive.title": "A record of daily change.", "archive.description": "Browse Japan IT news by edition date.",
  "about.title": "A daily perspective on Japan IT.", "about.description": "SHIELD NEWS aggregates and summarizes news about Japan's IT industry.",
  "about.focusTitle": "Japan's news comes first.",
  "about.focusBody": "AI, cybersecurity, IT companies, semiconductors, cloud computing, software development, digital transformation, policy, IT talent and startups. We focus on developments in Japan, alongside global news with a significant impact on Japan's IT industry.",
  "about.sourcesTitle": "Briefs with visible sources.",
  "about.sourcesBody": "Every article identifies its source and links to the original. SHIELD NEWS is neither the original publisher nor a news agency. We separate reported facts from our explanation of why they matter. We briefly summarize verifiable facts rather than reproducing entire articles.",
  "about.updatesTitle": "Verified information, published as it is ready.",
  "about.updatesBody": "We update the brief after checking sources and organizing the key points. We distinguish the edition date, our collection time and the original article's publication date and time. If the source gives no time, we display only the date. On holidays, we may include recent announcements; when there is no newly verified information, existing stories remain unchanged.",
  "about.accuracyTitle": "Accuracy and transparency.",
  "about.accuracyBody": "AI-generated summaries may contain errors. Check the original source before making important decisions. For corrections or inquiries, contact",
  "about.contactSuffix": ".",
  "footer.description": "Your daily brief on Japan's IT industry.", "footer.notice": "An independent news aggregation site. Original publishers retain their content rights.", "footer.archive": "Archive", "footer.topics": "Topics", "footer.about": "Editorial policy",
};
const zh: Record<TranslationKey, string> = {
  "header.home": "SHIELD NEWS 首页", "header.primaryNavigation": "主导航", "language.select": "选择语言",
  "translation.loading": "正在翻译…", "translation.error": "翻译暂不可用，当前显示日文原文。", "translation.retry": "重试", "translation.notice": "AI 译文 · 详情请核对原文。",
  "nav.development": "开发", "nav.dx": "数字化转型", "nav.policy": "政策", "nav.startups": "初创企业", "nav.global": "全球",
  "nav.home": "首页", "nav.ai": "AI", "nav.security": "网络安全", "nav.business": "企业", "nav.semiconductors": "半导体", "nav.cloud": "云计算", "nav.careers": "IT 就职", "nav.about": "关于本站", "nav.search": "搜索新闻", "nav.menu": "菜单",
  "home.label": "日本 IT / 每日简报", "home.title": "今日的变化，\n明日的视角。", "home.description": "关注日本 IT 行业的重要动态及其影响。梳理已核实的信息，清晰呈现新闻要点与背景。",
  "home.focus": "重点新闻", "home.list": "新闻列表", "home.today": "今日简报", "home.total": "收录新闻", "home.sources": "新闻来源", "home.archive": "历史简报", "home.all": "全部", "home.empty": "当天新闻尚未发布。", "home.emptyFilter": "该分类暂无新闻。", "home.updated": "最新收录新闻时间", "home.latest": "查看最新一期",
  "news.why": "为什么值得关注", "news.read": "阅读摘要", "news.original": "阅读原文", "news.sample": "展示样例", "news.sampleNotice": "当前为虚构的展示样例，并非真实新闻。", "news.japan": "日本", "news.global": "全球 / 对日本的影响", "news.facts": "核心事实", "news.summary": "新闻摘要", "news.source": "新闻来源", "news.disclosure": "本站提供新闻摘要，请通过原始来源核实事实并查看完整报道。", "news.related": "同日新闻", "news.edition": "收录日期", "news.published": "原文发布时间（日本时间）",
  "common.tags": "相关标签", "common.search": "搜索", "common.back": "返回简报", "list.noArticles": "没有匹配的新闻。",
  "search.title": "查找新闻。", "search.description": "按标题、摘要、来源或标签搜索历史新闻。", "search.placeholder": "AI、半导体、企业名称等", "search.query": "搜索关键词", "search.results": "搜索结果",
  "tags.label": "主题", "tags.title": "从兴趣出发。", "tags.description": "选择标签查看相关报道。",
  "archive.choose": "更早的简报", "archive.selectDate": "选择日期", "archive.open": "查看",
  "archive.title": "记录每天的变化。", "archive.description": "按日期查看过去的日本 IT 新闻。",
  "about.title": "每日关注日本 IT。", "about.description": "SHIELD NEWS 是日本 IT 行业新闻摘要与信息聚合站。",
  "about.focusTitle": "优先关注日本新闻。",
  "about.focusBody": "涵盖 AI、网络安全、IT 企业、半导体、云计算、软件开发、数字化转型、政策、IT 人才和初创企业。以日本本土动态为重点，同时关注对日本 IT 行业有重要影响的全球新闻。",
  "about.sourcesTitle": "每篇简报，来源清晰。",
  "about.sourcesBody": "每篇新闻均注明信息来源并附上原文链接。SHIELD NEWS 并非原始发布者或新闻机构。我们将新闻事实与“为什么值得关注”的解读分开呈现，简要归纳可核实的事实，不全文转载原文。",
  "about.updatesTitle": "核实信息后，陆续发布。",
  "about.updatesBody": "我们在核实来源、梳理要点后更新简报，并区分简报收录日期、本站收录时间与原文发布时间。原文未提供具体时刻时，仅显示日期。节假日期间可能收录近期公告；没有新增的已核实信息时，保留现有新闻。",
  "about.accuracyTitle": "准确与透明。",
  "about.accuracyBody": "AI 生成的摘要可能存在错误。作出重要判断前，请核对原文。如需更正或咨询，请联系",
  "about.contactSuffix": "。",
  "footer.description": "日本 IT 行业每日简报。", "footer.notice": "独立新闻聚合站，原文版权归原始发布者所有。", "footer.archive": "历史新闻", "footer.topics": "主题", "footer.about": "编辑方针",
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

export function translatedCategoryName(slug: string, language: Language) {
  const key = `nav.${slug}`;
  return key in ja ? t(language, key) : categoryName(slug);
}
