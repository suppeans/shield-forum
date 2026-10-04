import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArticleList } from "@/components/article-list";
import { newsImportSchema } from "@/lib/validation";
import fixture from "../docs/news-import.example.json";
import { NewsEditionView } from "@/components/news-edition-view";
afterEach(cleanup);
describe("public news list", () => {
  it("shows the briefing collection time without inventing a source publication hour", () => {
    const article = newsImportSchema.parse({ ...fixture, sample: false, generated_at: "2026-10-04T21:00:00+09:00",
      news: [{ ...fixture.news[0], published_at: "2026-10-02T00:00:00+09:00", published_time_known: false }] }).news[0];
    const { container } = render(<NewsEditionView edition={{ date: fixture.date, articles: [article], featured: [article], remaining: [], dates: [fixture.date], sample: false }} today={fixture.date} />);
    expect(container.querySelector(".last-update time")).toHaveAttribute("datetime", article.collected_at);
    expect(screen.getByText("2026/10/02 JST")).toBeInTheDocument();
    expect(container.textContent).not.toContain("00:00");
  });
  it("shows source, importance, timestamp and explicit sample label with a news detail link", () => {
    const article = newsImportSchema.parse(fixture).news[0];
    render(<ArticleList articles={[article]} />);
    expect(screen.getByRole("link", { name: article.title })).toHaveAttribute("href", `/news/${article.id}`);
    expect(screen.getByText(article.source)).toBeInTheDocument();
    expect(screen.getByText(article.why_it_matters)).toBeInTheDocument();
    expect(screen.getByText("表示サンプル")).toBeInTheDocument();
    expect(screen.queryByText(/ログイン|返信/)).not.toBeInTheDocument();
  });
  it("escapes untrusted imported text instead of rendering markup", () => {
    const article = { ...newsImportSchema.parse(fixture).news[0], title: '<img src=x onerror="alert(1)">' };
    const { container } = render(<ArticleList articles={[article]} />);
    expect(screen.getByRole("link", { name: article.title })).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
});
