# SHIELD NEWS — 日本ITニュース

既存の Shield Forum (Next.js App Router / React / TypeScript / CSS / Supabase) を、ログイン不要のニュース集約サイトに改修しました。記事リスト、詳細レイアウト、検索、タグ、言語切替、Vercel/Cloudflare構成を再利用しています。

## 起動・検証

Node.js **24 LTS** と npm を使用します。

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

`http://localhost:3000`。初期データは**架空の表示サンプル**です。今日がサンプル収録日と異なる場合、`/?date=2026-10-04` から表示を確認できます。公開ニュースがない日を最新号で黙って置き換えません。

## 毎日のニュースを追加する

ChatGPTの毎日のタスクに、[データ仕様とプロンプト](docs/news-import.md) に従ったJSONを生成させます。出典を確認してからインポートしてください。

```sh
npm run import-news -- ./daily-news.json
```

- 初期の `NEWS_STORAGE=file` は `src/data/news.json` を更新。Gitにコミットして再デプロイします。
- `NEWS_STORAGE=supabase` は既存Supabaseの `news_articles` テーブルに直接書き込み。再デプロイなしで次のページリクエストに反映します。
- 同じidを再送すると更新され、以前の日付の記事は残ります。idは全記事で一意にしてください。
- HTTP自動連携には `POST /api/news/import` が利用できます。Supabaseモードのみ、サーバー用トークン必須。

[導入・旧データの移行](docs/deployment.md) / [改修調査](docs/migration-audit.md) / [設計](DESIGN.md)
