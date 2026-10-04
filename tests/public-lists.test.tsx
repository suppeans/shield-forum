import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArticleList } from "@/components/article-list";
import { newsImportSchema } from "@/lib/validation";
import fixture from "../docs/news-import.example.json";
afterEach(cleanup);
describe("public news list", () => {
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
