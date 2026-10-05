# 云端每日新闻任务

目标：每天日本时间 09:00、21:00 在 ChatGPT 云端生成并发布新闻，不依赖个人电脑。网站继续使用现有 JSON 数据和 GitHub → Vercel 自动部署。

每日云端任务按日本时间 09:00、21:00 执行。本文记录配置与发布规则；每次运行是否成功，以任务结果、GitHub 提交和公网内容为准。

## 一次性配置

1. 使用自己的 ChatGPT 账号，建立仅自己可用的云端工作环境，关联 `suppeans/shield-forum`。环境使用 Node 24 和 `npm ci`；不要上传本地 SSH 私钥，也不要把电脑路径写入云端提示词。
2. 为该环境配置此仓库的 GitHub 写入授权。公开仓库可以读取，并不代表能够推送。优先使用平台提供的仓库授权；需要个人令牌时，由账号所有者在密钥管理界面填写，限定此仓库的 Contents 读写权限。不要在聊天、日志、JSON 或仓库中填写令牌。
3. 确认任务可以检索并打开新闻原文，以及访问 GitHub 和 `shield-news-suppeans.vercel.app`。不能访问的来源直接省略，不能用模型记忆替代当天检索。
4. 先使用下方提示词执行一次普通云端任务，验证导入、检查、GitHub 推送和 Vercel 上线。没有新消息时允许不写数据；另行确认仓库写入授权后再安排定时运行。
5. 在 ChatGPT 网页端的“定时任务”中设置每天 **09:00、21:00，Asia/Tokyo**，采用下方完整提示词和相同的云端工具／环境。先执行一次，确认检索、仓库写入和公网发布成功。

定时任务、云端环境及写入能力取决于账号实际可用功能。任务不能访问环境或仓库时应报告失败阶段。开始时间不等于发布完成时间，检索、检查和 Vercel 部署都需要时间。

## 完整执行提示词

```text
为 SHIELD NEWS 生成并发布经过核实的日本 IT 新闻。执行必须完全在云端完成，不连接个人电脑，不使用任何本地文件路径或 SSH 私钥。

仓库：https://github.com/suppeans/shield-forum
生产分支：main
网站：https://shield-news-suppeans.vercel.app/
数据：src/data/news.json
规则：docs/daily-news-workflow.md、docs/news-import.md、docs/cloud-news-task.md

一、准备
读取远端 main 的最新文件与导入 schema，按 Asia/Tokyo 确定今天日期。使用该云端环境自身的仓库授权。先检查工作区干净，git fetch origin main 后仅允许 fast-forward 同步。遇到未提交改动、分叉或推送冲突时保留现状并报告，不 reset、不强推、不提交他人的改动。使用 Node 24 和 npm ci；云端文件模式设置 NEWS_STORAGE=file，不配置 Supabase 或新的收费服务。

二、编辑
联网检索最近 24 小时日本 IT 行业的真实新消息，周末可扩大至 72 小时。日本本土优先，涵盖 AI／生成式 AI、网络安全、企业和产品、半导体、云与数据中心、开发、DX、政策、IT 就职与人才、创业，以及对日本有明确影响的全球科技新闻。优先企业官方公告、JPCERT/CC、IPA、政府和研究机构。必须实际打开原文核实事实及发布日期；不能核实或日期未知就省略。不凑数量，不复制媒体全文，不编造来源、图片或时间。

标题、摘要、核心事实、影响分析和标签采用自然日语。事实与影响分析分开，明确区分计划、β测试和正式发布。来源必须是支持事实的原文深链接。图片没有明确使用许可就设 null。

三、生成与导入
生成符合现有 schema 的 JSON：date 为日本收录日，sample:false，generated_at 为本次实际核实时间，news 为条目数组。category 只用 ai、security、business、semiconductors、cloud、careers、development、dx、policy、startups、global。每条包含 id、title、summary、category、source、source_url、published_at、published_time_known、image_url、why_it_matters、core_facts、tags、featured、priority、region。
原文仅有日期时 published_time_known:false，published_at 存储该日期 00:00:00+09:00，不把午夜当作真实发布时间。按源公告和事件使用稳定 id。早晚更新合并当天数据并保留上午内容；不要把历史事件移动到新的 edition_date。对历史条目纠错时保留原收录日和未变化条目的 collected_at。实质新进展可作为新条目，并注明首次公告与更新日期。无新增或需纠正的消息时保持文件不变并报告无新增。
批次放在仓库外临时文件，使用现有 npm run import-news -- /path/to/batch.json 导入，不手工绕过 schema。确认无样例、重复事件或未来的发布时间，历史及早间内容仍存在。

四、检查与发布
运行 npm run test、npm run typecheck、npm run lint；代码或构建配置有变化时再运行 npm run build。检查 git diff，只提交本次新闻数据 src/data/news.json，正常推送到 main。代码、数据库、域名、账号和其他项目不在本任务修改范围内。授权失败或推送失败时明确报告阶段，不宣称已更新。不要输出任何令牌或环境变量。
GitHub 推送触发现有 Vercel 部署。打开公网首页和本批一条详情，核对新增内容、来源链接和真实收录时间；可用时同时检查部署状态。只有线上内容确认后才报告已发布。等待部署时明确区分“已推送”和“已上线”。

五、结果
简短报告新增／更正条数、最新收录时间（日本时间）及网站链接。无新增时如实说明；失败时给出失败阶段和需要用户处理的具体事项，不重置或覆盖现有内容。
```

## 手机使用

配置完成后，手机在同一 ChatGPT 账号查看“定时任务”和运行结果；需要临时更新时使用该任务的“立即运行”。检索、生成、推送和部署都由云端完成，手机和电脑无须一直在线。

依据：[ChatGPT 定时任务](https://learn.chatgpt.com/docs/automations)、[云端环境](https://learn.chatgpt.com/docs/environments/cloud-environments)。
