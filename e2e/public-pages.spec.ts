import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", heading: "Shield Forum" },
  { path: "/forum", heading: "Discussion board" },
  { path: "/knowledge", heading: "Defensive tutorials" },
  { path: "/tags", heading: "Topic index" },
  { path: "/search", heading: "Search public content" },
  { path: "/auth/sign-in", heading: "Sign in to participate" },
  { path: "/profile", heading: "Cipher Warden" },
  { path: "/admin", heading: "Community operations" },
];

for (const pageInfo of pages) {
  test(`${pageInfo.path} loads`, async ({ page }) => {
    await page.goto(pageInfo.path);
    await expect(
      page.getByRole("heading", { name: pageInfo.heading, level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
  });
}

test("forum and knowledge details load public content", async ({ page }) => {
  await page.goto("/forum/test-supabase-rls-before-launch");
  await expect(
    page.getByRole("heading", {
      name: /how do you test supabase rls before launch/i,
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByText(/policy tests/i)).toBeVisible();

  await page.goto("/knowledge/launch-checklist-public-security-forums");
  await expect(
    page.getByRole("heading", {
      name: /a launch checklist for public security forums/i,
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByText(/baseline controls/i)).toBeVisible();
});

test("search returns matching public content", async ({ page }) => {
  await page.goto("/search?q=turnstile");
  await expect(
    page.getByRole("link", {
      name: /cloudflare turnstile placement for post forms/i,
    }),
  ).toBeVisible();
});
