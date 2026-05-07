import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="stack">
      {categories.map((category) => (
        <Link className="category-row" key={category.id} href="/forum">
          <span>{category.name}</span>
          <small>{category.description}</small>
        </Link>
      ))}
    </div>
  );
}
