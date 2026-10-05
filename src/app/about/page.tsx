import { PageHeading } from "@/components/page-heading";
export default function AboutPage() {
  return <main className="page" id="main"><PageHeading title="" description="" labelKey="nav.about" titleKey="about.title" descriptionKey="about.description" /><article className="article-body about-body"><section><h2>日本のニュースを、優先する。</h2><p>AI、サイバーセキュリティ、IT企業、半導体、クラウド、ソフトウェア開発、DX、政策、IT人材、スタートアップ。日本本土の動きを中心に、日本のIT業界への影響が大きい世界のニュースも扱います。</p></section><section><h2>情報源が見えるブリーフ。</h2><p>各記事には情報源と原文へのリンクを明記します。SHIELD NEWS は原発信者や報道機関ではありません。ニュースの事実と、注目する理由としての解説を分けて掲載します。原文の全文を転載せず、確認できる事実を短く要約します。</p></section><section><h2>朝と夜、最新の動きを確認する。</h2><p>日本時間の毎日9時と21時を目安に、AIの定時ニュースタスクで情報源を確認し、日本語のブリーフを更新します。公開号の収録日、当サイトの収録時刻、原記事の公開日時は区別します。原文に時刻がない場合は日付のみ表示します。休日などは直近の発表を含め、新たな確認済み情報がない場合は既存記事を維持します。</p></section><section><h2>正確さと透明性。</h2><p>AIで生成された要約には誤りが含まれる場合があります。重要な判断には原文をご確認ください。修正・お問い合わせは <a href="mailto:leianda946@gmail.com">leianda946@gmail.com</a> まで。</p></section></article></main>;
}

