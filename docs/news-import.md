# 每日新闻导入

## JSON 格式

参考 `docs/news-import.example.json`。批次格式为 `{ "date": "YYYY-MM-DD", "generated_at": "带时区的实际生成时间", "sample": false, "news": [...] }`。`generated_at` 可省略以兼容旧格式；提供时写入各条记录的 `collected_at`，用于首页显示实际收录时间。

每条新闻：

| 字段 | 含义 |
| --- | --- |
| id | 稳定且全局唯一，1–128 个英文字母/数字/下划线/连字符；重复导入更新同一条 |
| title / summary | 日语标题 / 摘要（最多 240 / 3000 字符） |
| category | ai, security, business, semiconductors, cloud, careers, development, dx, policy, startups, global |
| source / source_url | 实际原始发布者 / 对应原文完整 HTTP(S) URL，禁止用媒体首页代替原文 |
| published_at | 原始新闻发布时间，带时区的 ISO 8601，如 2026-10-04T09:30:00+09:00 |
| published_time_known | 原文是否给出准确时刻，默认 true；原文只有日期时设 false，published_at 使用该日期 00:00:00 作为存储值，界面只显示日期，不把午夜冒充实际发布时间 |
| image_url | 有使用许可时的图片 URL；没有则 null，可省略 |
| why_it_matters | 与日本 IT 行业的关系和意义，区别于事实 |
| core_facts | 建议提供 2–5 条已核实的事实；省略则详情页显示摘要 |
| tags | 字符串数组，最多 20 个 |
| featured / priority | 是否重点（默认 false）；重要性 1–5，1 最重要（默认 3） |
| region | japan（默认）或 global；同等排序条件下日本本土优先 |

`date` 是日报的收录日，`published_at` 是原文发布时间，两者可以不同；全部按日本时间展示。
`sample: true` 专用于架空展示样例，界面明确标识，不会伪装成真实新闻。

## 文件导入

```sh
npm run import-news -- ./daily-news.json
# 或 stdin
cat ./daily-news.json | npm run import-news -- -
```

默认更新 `src/data/news.json`。脚本先验证整个批次（最多 100 条、2 MiB），然后按 id 合并、加文件锁、原子写入。错误数据不会部分写入。
初次发布真实新闻前，可将 `src/data/news.json` 初始化为 `[]`，再导入，避免保留架空归档。真实批次会自动清除同一收录日的展示样例。文件模式的生产更新需要提交 Git 并重新部署。

## Supabase / HTTP

先按 `docs/deployment.md` 执行数据库迁移。服务器设置 `NEWS_STORAGE=supabase`、公开只读 Supabase URL/anon key，以及服务端 `SUPABASE_SERVICE_ROLE_KEY`。
HTTP 另设至少 32 字符的随机 `NEWS_IMPORT_TOKEN`。脚本可用 `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` 生成；不要将令牌放进仓库或浏览器。

```sh
curl -X POST https://YOUR-DOMAIN/api/news/import \
  -H "Authorization: Bearer $NEWS_IMPORT_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @daily-news.json
```

该接口在没有令牌时返回 503，错误令牌返回 401，文件模式返回 409，不支持通过无持久磁盘的云端函数更新 JSON 文件。每个批次使用一次数据库 upsert；默认只有服务端能够写入。页面动态读取新闻数据。
文件模式使用云端定时任务、Git 提交和 Vercel 自动部署，详见 `docs/daily-news-workflow.md`。HTTP 模式需配置 Supabase 和导入令牌，目前未启用。

## 给每日任务的提示词

> 请总结当天日本 IT 行业最重要的新闻，日本本土优先。涵盖 AI、网络安全、企业、半导体、云计算、开发、DX、政策、IT 招聘、创业公司，以及对日本有明确影响的全球科技新闻。只输出合法 JSON，格式为 {date, sample:false, news:[...]}，采用本文字段和 category 枚举。标题、摘要、核心事实和影响分析使用日语。为每条新闻提供真正支持事实的原文 URL 和带时区的原文发布时间，不要编造来源或新闻，不能核实的条目省略。使用稳定且全局唯一的 id；最重要 3–5 条标 featured:true，priority 从 1 到 5。图片没有明确使用许可时设 null。摘要保持简短，避免全文转载。没有值得核实的新闻时，报告无结果，不要编造批次。

请同时输出 `generated_at` 的实际生成时间。原文只给日期时，`published_time_known:false`；不要杜撰具体时刻。同一日报的早晚更新合并，同一事件不重复收录到其他日期。公告更新的时间与首次发布日期不同，应在摘要或核心事实中明确注明。
