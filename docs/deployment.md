# SHIELD NEWS 部署

## Netlify 自动部署

项目使用 Next.js App Router、React 和 TypeScript。使用 Node 24，安装依赖后运行 `npm run build`。

Netlify 连接 `suppeans/shield-forum` 的 `main` 分支。`netlify.toml` 已设置构建命令、`.next` 发布目录、安全响应头和新闻 JSON 打包；项目根目录留空。

公开网站：[shield-news-suppeans.netlify.app](https://shield-news-suppeans.netlify.app/)。Netlify 的 Next.js 适配器处理动态页面和 API，无须静态导出或添加框架插件。

默认 `NEWS_STORAGE=file`：导入 JSON，提交 `src/data/news.json` 并推送到 `main`，Netlify 自动构建和发布。云端函数的文件修改无法持久保存，因此文件模式禁用 HTTP 写入。每日任务流程见 [daily-news-workflow.md](daily-news-workflow.md)。

## 可选的 Supabase 新闻存储

当前公开网站使用 JSON；只有需要直接通过 HTTP 更新时才启用数据库模式。

1. 在专用于 SHIELD NEWS 的 Supabase 项目执行 `supabase/migrations/20261005000000_news_schema.sql`。它只初始化 `news_articles`、索引、更新时刻触发器和读写权限，不执行数据删除。已存在的新闻表和内容会保留。
2. 设置 `NEWS_STORAGE=supabase`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` 和服务端 `SUPABASE_SERVICE_ROLE_KEY`。HTTP 导入另需至少 32 字符的随机 `NEWS_IMPORT_TOKEN`。
3. 用 `supabase/tests/news_schema.sql` 检查权限：公开客户端只读，服务端负责写入。
4. 导入已核实的新闻 JSON，重新部署以切换存储模式。此后导入更新在下一次页面请求时显示，无须重新构建。

配置失败时应用会显示错误，不用样例替代数据库内容。密钥只放在部署环境中，服务端密钥和导入令牌不能使用 `NEXT_PUBLIC_` 前缀，也不能提交到 Git。

## 安全与缓存

`next.config.ts` 和 `netlify.toml` 设置安全响应头。缓存不可变静态资源；新闻 HTML、动态响应和 `POST /api/news/import` 不使用共享缓存。导入接口验证服务端 Bearer 令牌、数据格式和批次大小。不要在日志中输出令牌。
