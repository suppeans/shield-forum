# 改造前检查与处理

| 部分 | 检查结果 | 处理 |
| --- | --- | --- |
| 框架 | Next.js 16.2.5 App Router、React 19.2.6、TypeScript；原生 CSS；lucide | 保留，无另建框架 |
| 后端 | Server Actions，没有独立后端；旧 content actions 写 posts/comments/articles | 删除旧 actions，新增新闻导入 Route Handler |
| 数据库 | Supabase PostgreSQL：profiles/categories/posts/comments/articles/tags 及关联表 | 保留数据库客户端和迁移历史；新增 0003，切换到独立 news_articles |
| 认证 | Supabase SSR/browser clients，signIn/signUp/signOut；注册和登录合并在 /auth/sign-in | 删除客户端、actions、表单、路由和 @supabase/ssr |
| 用户功能 | /profile、/admin；投稿和作者信息依赖 profiles | 删除社区页面、管理后台、作者关系和相关类型 |
| 评论 | comment-form、post-detail-view、createComment、comments 表/RLS/父评论 | 删除整个调用链；新增迁移删除旧表及用户关联 |
| 可复用界面 | header、PageHeading、ArticleList、ArticleDetailView、CategoryList、TagCloud/TagPill、SearchForm、i18n | 在原组件和布局中改为新闻、来源和筛选；保留中日英界面切换（新闻正文日语） |
| 样式 | globals.css 的页面/面板/列表/详情/导航/响应式基础 | 保留这些布局和 class 结构，改为 Binance 深色/黄色 token；清理账号/评论/管理样式 |
| 环境变量 | 旧 Supabase URL/anon/service-role，SITE_URL，Turnstile 变量；本地无实际生产凭据 | 复用 Supabase 变量；移除无用项，新增 NEWS_STORAGE / NEWS_IMPORT_TOKEN |
| 部署 | vercel.json / next.config.ts / Cloudflare Worker + wrangler.toml | 保留部署与安全头；补文件追踪，禁用新闻 HTML 缓存 |
| 测试 | Vitest/Testing Library/Playwright 已安装 | 保留测试工具；改为新闻导入、日期、来源、过滤与旧路由移除验证 |

改造在 `codex/japan-it-news` 分支完成。没有连接生产数据库，没有执行数据库删除，也没有改动现有线上部署。旧 Supabase migrations 0001/0002 是已发布迁移记录，不是仍在使用的用户代码；保留它们是为了能够升级原数据库。

## 验证结果（2026-10-04）

- `npm run build`（包括 TypeScript）、ESLint、6 个测试文件中的 20 项 Vitest 测试通过。
- 实际执行 CLI 导入：新增、重复更新、保留历史记录；无效批次不会改变已有文件。
- 在临时 PostgreSQL 兼容环境 PGlite 中执行 0001 → 0002 → 0003：旧表和关联账号删除，无关 Auth 账号保留；匿名只读、service-role 写入、新闻分类约束通过。生产 Supabase 尚未执行迁移。
- 在本地生产服务器实际浏览桌面 1440px 与手机 390px 页面：详情与来源、分类、搜索、历史日期、语言切换、移动菜单、无新闻日期均正常；浏览器没有错误日志，手机没有横向溢出。
- HTTP 检查旧账号/社区/知识页面及不存在的新闻均返回 404；未配置导入令牌时 API 返回 503；部署产物已包含新闻 JSON。
- Playwright 场景已更新供后续 CI 使用；本次浏览器检查通过 Codex 浏览器执行，没有声称已运行 Playwright 命令行套件。
