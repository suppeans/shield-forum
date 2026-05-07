import Link from "next/link";
import type { Tag } from "@/lib/types";

type TagPillProps = {
  tag: Tag;
};

export function TagPill({ tag }: TagPillProps) {
  return (
    <Link className="tag-pill" href={`/tags?tag=${tag.slug}`}>
      {tag.name}
    </Link>
  );
}
