export const categories = [
  { slug: "ai", name: "AI", description: "生成AI・大規模言語モデル" },
  { slug: "security", name: "セキュリティ", description: "脅威・対策・インシデント" },
  { slug: "business", name: "企業", description: "日本のIT企業・製品・サービス" },
  { slug: "semiconductors", name: "半導体", description: "製造・研究・サプライチェーン" },
  { slug: "cloud", name: "クラウド", description: "クラウド・データセンター" },
  { slug: "careers", name: "IT就職", description: "採用・人材・働き方" },
  { slug: "development", name: "開発", description: "ソフトウェア・開発者ツール" },
  { slug: "dx", name: "DX", description: "企業のデジタル化" },
  { slug: "policy", name: "政策", description: "制度・規制・行政" },
  { slug: "startups", name: "スタートアップ", description: "日本のテックスタートアップ" },
  { slug: "global", name: "グローバル", description: "日本に影響する世界のテック動向" },
] as const;
export type Category = (typeof categories)[number];
export type CategorySlug = Category["slug"];
export type Tag = { id: string; slug: string; name: string; description: string };
export type NewsArticle = {
  id: string; title: string; summary: string; category: CategorySlug;
  source: string; source_url: string; published_at: string; edition_date: string;
  image_url: string | null; why_it_matters: string; core_facts: string[]; tags: string[];
  featured: boolean; priority: number; region: "japan" | "global"; is_sample: boolean;
};
export function categoryName(slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}
export function toTags(names: string[]): Tag[] {
  return names.map((name) => ({ id: name, slug: name, name, description: "" }));
}
