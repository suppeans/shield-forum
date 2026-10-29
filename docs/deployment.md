# SHIELD NEWS 部署

## Vercel 自动部署

项目使用 Next.js App Router、React 和 TypeScript。使用 Node 24，安装依赖后运行 `npm run build`。

Vercel 项目 `shield-forum` 连接 `suppeans/shield-forum` 的 `main` 分支。框架选择 Next.js，项目根目录为仓库根目录，构建命令为 `npm run build`，输出目录使用框架默认值。`package.json` 固定 Node 24.x；`vercel.json` 设置框架、函数区域和安全响应头，`next.config.ts` 将新闻 JSON 打包进服务端函数。

公开网站：[shieldnews.devs.li](https://shieldnews.devs.li/)。Vercel 原生处理 Next.js 动态页面和 API，无须静态导出或添加框架插件。

默认 `NEWS_STORAGE=file`：导入 JSON，提交 `src/data/news.json` 并推送到 `main`，Vercel 自动构建和发布。云端函数的文件修改无法持久保存，因此文件模式禁用 HTTP 写入。每日任务流程见 [daily-news-workflow.md](daily-news-workflow.md)。

## 可选的 Supabase 新闻存储

当前公开网站使用 JSON；只有需要直接通过 HTTP 更新时才启用数据库模式。

1. 在专用于 SHIELD NEWS 的 Supabase 项目执行 `supabase/migrations/20261005000000_news_schema.sql`。它只初始化 `news_articles`、索引、更新时刻触发器和读写权限，不执行数据删除。已存在的新闻表和内容会保留。
2. 设置 `NEWS_STORAGE=supabase`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` 和服务端 `SUPABASE_SERVICE_ROLE_KEY`。HTTP 导入另需至少 32 字符的随机 `NEWS_IMPORT_TOKEN`。
3. 用 `supabase/tests/news_schema.sql` 检查权限：公开客户端只读，服务端负责写入。
4. 导入已核实的新闻 JSON，重新部署以切换存储模式。此后导入更新在下一次页面请求时显示，无须重新构建。

配置失败时应用会显示错误，不用样例替代数据库内容。密钥只放在部署环境中，服务端密钥和导入令牌不能使用 `NEXT_PUBLIC_` 前缀，也不能提交到 Git。

## 安全与缓存

`next.config.ts` 和 `vercel.json` 设置安全响应头。缓存不可变静态资源；新闻 HTML、动态响应和 `POST /api/news/import` 不使用共享缓存。导入接口验证服务端 Bearer 令牌、数据格式和批次大小。不要在日志中输出令牌。

## DeepSeek 新闻翻译

在 Vercel 项目的 Environment Variables 中设置服务端 `DEEPSEEK_API_KEY`，范围至少包含 Production；修改后需要重新部署。本地开发在 `.env.local` 填写同名变量。不要使用 `NEXT_PUBLIC_` 前缀，不要将密钥提交到 Git 或粘贴到聊天/日志。

`DEEPSEEK_TRANSLATION_MODEL` 默认为 `deepseek-flash`，可按 DeepSeek 账号可用模型覆盖。使用官方 `https://api.deepseek.com/chat/completions` 接口及 JSON Output，不引入 SDK。参考 [DeepSeek JSON Output](https://api-docs.deepseek.com/guides/json_mode/) 和 [Chat Completions API](https://api-docs.deepseek.com/api/create-chat-completion/)。

切换为中文或英文时，进入阅读区域的新闻会请求 `/api/news/{id}/translation?language=zh`（或 `en`），覆盖标题、摘要、核心事实、解读和标签。日本語始终恢复本站日文原稿；来源、日期、原文链接和标签筛选地址不变。AI 译文附有标记，失败时保留日文并提供重试入口。

接口只接受本站现存新闻 ID 和 `zh` / `en`，不接收用户提供的待译文本或提示词。译文经格式与数组长度验证后，使用 Next.js Data Cache 按完整原文、目标语言、模型和翻译版本缓存；原稿修改会生成新的缓存项。浏览器会合并同篇新闻请求，服务端合并当前实例内的在途请求，限制同时处理数量。浏览器响应不缓存，避免新闻修正后继续显示旧稿。

翻译会使用 DeepSeek API 额度。缓存和实例内并发限制不等于全局限额；生产环境应在服务商设置用量控制，并按访问量配置 Vercel Firewall。未配置密钥、额度不足或超时会返回通用 503，不把服务商响应、密钥或内部错误返回浏览器。该功能无需变更新闻 JSON、数据库或每日编辑任务。
