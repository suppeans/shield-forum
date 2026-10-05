import { expect, test } from "@playwright/test";
test("news brief links to attributed detail, category and date archives", async ({ page }) => {
  await page.goto("/?date=2026-10-04");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("今日の変化を");
  await expect(page.getByText("現在は架空の表示サンプルです。実際のニュースではありません。")).toBeVisible();
  await page.getByRole("link", { name: "国内企業の生成AI導入、実証から業務運用へ", exact: true }).click();
  await expect(page.getByRole("heading", { name: "主な事実" })).toBeVisible();
  await expect(page.getByRole("link", { name: "原文を読む" })).toHaveAttribute("href", /example.com/);
  await page.goto("/?date=2026-10-03&category=security");
  await expect(page.locator("#news-feed").getByRole("heading", { name: /サプライチェーンのリスク/ })).toBeVisible();
  await page.goto("/search?q=SBOM");
  await expect(page.getByRole("link", { name: /サプライチェーンのリスク/ }).first()).toBeVisible();
});
test("retired account and community pages return 404", async ({ page }) => {
  for (const path of ["/auth/sign-in", "/profile", "/admin", "/forum"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
  }
});
test("mobile menu, empty edition and unknown detail remain usable", async ({ page, isMobile }) => {
  await page.goto("/?date=2026-09-01");
  await expect(page.getByText("この日のニュースはまだ公開されていません。")).toBeVisible();
  if (isMobile) { await page.getByRole("button", { name: "メニュー", exact: true }).click(); await expect(page.getByRole("link", { name: "このサイトについて", exact: true }).first()).toBeVisible(); }
  await page.goto("/news/missing-news");
  await expect(page.getByRole("heading", { name: "ページが見つかりません。" })).toBeVisible();
});

