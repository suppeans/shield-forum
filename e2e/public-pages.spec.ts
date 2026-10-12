import { expect, test } from "@playwright/test";
import news from "../src/data/news.json";

const article = news.filter((item) => !item.is_sample).sort((a, b) => b.edition_date.localeCompare(a.edition_date))[0];
test("news brief links to attributed detail, category and date archives", async ({ page }) => {
  await page.goto(`/?date=${article.edition_date}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("今日の変化を");
  await page.locator("#news-feed").getByRole("link", { name: article.title, exact: true }).click();
  await expect(page.getByRole("heading", { name: "主な事実" })).toBeVisible();
  await expect(page.getByRole("link", { name: "原文を読む" })).toHaveAttribute("href", article.source_url);
  await page.goto(`/?date=${article.edition_date}&category=${article.category}`);
  await expect(page.locator("#news-feed").getByRole("heading", { name: article.title, exact: true })).toBeVisible();
  await page.goto(`/search?q=${encodeURIComponent(article.title)}`);
  await expect(page.getByRole("link", { name: article.title, exact: true }).first()).toBeVisible();
});
test("unknown pages return 404", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
});
test("reading layout stays visible with reduced motion and fits the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/?date=${article.edition_date}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/今日の変化を/);
  await expect(page.locator(".blur-letter").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator(".blur-letter").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".spotlight")).toHaveAttribute("aria-hidden", "true");
  await page.getByRole("link", { name: "ニュース一覧", exact: true }).click();
  await expect(page).toHaveURL(/#news-feed$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
test("mobile menu, empty edition and unknown detail remain usable", async ({ page, isMobile }) => {
  await page.goto("/?date=2026-09-01");
  await expect(page.getByText("この日のニュースはまだ公開されていません。")).toBeVisible();
  if (isMobile) { await page.getByRole("button", { name: "メニュー", exact: true }).click(); await expect(page.getByRole("link", { name: "このサイトについて", exact: true }).first()).toBeVisible(); }
  await page.goto("/news/missing-news");
  await expect(page.getByRole("heading", { name: "ページが見つかりません。" })).toBeVisible();
});
