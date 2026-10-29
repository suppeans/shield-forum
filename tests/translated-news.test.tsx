import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NewsEditionView } from "@/components/news-edition-view";
import { ArticleDetailView } from "@/components/article-detail-view";
import { newsImportSchema } from "@/lib/validation";
import { articleText } from "@/lib/article-translation";
import fixture from "../docs/news-import.example.json";
const original = newsImportSchema.parse(fixture).news[0];
const zh = { title: "企业将生成式 AI 引入业务", summary: "中文新闻摘要", why_it_matters: "中文影响解读", core_facts: ["中文事实一", "中文事实二"], tags: ["生成式 AI", "企业应用", "LLM"] };
function switchTo(name: "中文" | "English" | "日本語") {
  fireEvent.click(screen.getByRole("button", { name: /表示言語を選択|选择语言|Select language/ }));
  fireEvent.click(screen.getByRole("menuitemradio", { name: new RegExp(`^${name}`) }));
}
beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.unstubAllGlobals(); localStorage.clear(); });
describe("news content language switching", () => {
  it("keeps the menu open for selection and supports keyboard and outside dismissal", async () => {
    render(<LanguageProvider><LanguageSwitcher /></LanguageProvider>);
    const trigger = screen.getByRole("button", { name: "表示言語を選択" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    trigger.focus(); fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const chinese = await screen.findByRole("menuitemradio", { name: /^中文/ });
    await waitFor(() => expect(chinese).toHaveFocus());
    fireEvent.keyDown(chinese, { key: "Escape" });
    expect(trigger).toHaveFocus(); expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger); fireEvent.pointerDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("translates featured/feed/detail/facts/tags, shares requests and restores the exact Japanese original", async () => {
    const article = { ...original, id: "translation-surfaces" };
    const fetcher = vi.fn().mockImplementation(async () => Response.json({ translation: zh })); vi.stubGlobal("fetch", fetcher);
    render(<LanguageProvider><LanguageSwitcher /><NewsEditionView edition={{ date: fixture.date, articles: [article], featured: [article], dates: [fixture.date], sample: true }} today={fixture.date} /><ArticleDetailView article={article} related={[]} /></LanguageProvider>);
    expect(fetcher).not.toHaveBeenCalled();
    switchTo("中文");
    await waitFor(() => expect(screen.getAllByText(zh.title).length).toBeGreaterThanOrEqual(3));
    expect(screen.getByText("中文事实一")).toBeInTheDocument();
    expect(screen.getAllByText(zh.why_it_matters).length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByRole("link", { name: "企业应用" })[0]).toHaveAttribute("href", `/tags?tag=${encodeURIComponent(article.tags[1])}`);
    expect(screen.getByRole("link", { name: "阅读原文" })).toHaveAttribute("href", article.source_url);
    expect(fetcher).toHaveBeenCalledTimes(1);
    switchTo("日本語");
    expect(screen.getAllByText(article.title).length).toBeGreaterThanOrEqual(3);
    expect(screen.queryByText(zh.title)).not.toBeInTheDocument();
    switchTo("中文");
    await waitFor(() => expect(screen.getAllByText(zh.title).length).toBeGreaterThanOrEqual(3));
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("keeps original news on errors and supports retry", async () => {
    const article = { ...original, id: "translation-retry" };
    const fetcher = vi.fn().mockResolvedValueOnce(new Response("unavailable", { status: 503 })).mockImplementation(async () => Response.json({ translation: zh })); vi.stubGlobal("fetch", fetcher);
    render(<LanguageProvider><LanguageSwitcher /><ArticleDetailView article={article} related={[]} /></LanguageProvider>);
    switchTo("中文");
    await screen.findByText("翻译暂不可用，当前显示日文原文。");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(article.title);
    fireEvent.click(screen.getByRole("button", { name: "重试" }));
    await screen.findByRole("heading", { name: zh.title });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("does not let a slow Chinese response overwrite a later English or Japanese selection", async () => {
    let resolveChinese!: (response: Response) => void;
    const article = { ...original, id: "translation-race" };
    vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string) => url.endsWith("language=zh")
      ? new Promise<Response>(resolve => { resolveChinese = resolve; })
      : Promise.resolve(Response.json({ translation: { ...articleText(article), title: "English headline" } }))));
    render(<LanguageProvider><LanguageSwitcher /><ArticleDetailView article={article} related={[]} /></LanguageProvider>);
    switchTo("中文");
    await waitFor(() => expect(resolveChinese).toBeDefined());
    switchTo("English");
    await screen.findByRole("heading", { name: "English headline" });
    await act(async () => resolveChinese(Response.json({ translation: zh })));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("English headline");
    switchTo("日本語");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(article.title);
  });
});
