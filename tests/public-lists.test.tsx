import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleList } from "@/components/article-list";
import { PostList } from "@/components/post-list";
import { articles, posts, profiles, categories } from "@/lib/sample-data";

describe("public content lists", () => {
  it("renders post titles, categories, authors, and tags", () => {
    render(
      <PostList
        posts={[
          {
            ...posts[0],
            author: profiles[0],
            category: categories[0],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: /how do you test supabase rls before launch/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Web Security")).toBeInTheDocument();
    expect(screen.getByText("Cipher Warden")).toBeInTheDocument();
    expect(screen.getByText("RLS")).toBeInTheDocument();
  });

  it("renders article summaries, authors, and tags", () => {
    render(
      <ArticleList
        articles={[
          {
            ...articles[0],
            author: profiles[0],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: /a launch checklist for public security forums/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/baseline controls/i)).toBeInTheDocument();
    expect(screen.getByText("Cipher Warden")).toBeInTheDocument();
    expect(screen.getByText("Cloudflare")).toBeInTheDocument();
  });
});
