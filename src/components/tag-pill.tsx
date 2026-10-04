import Link from "next/link";
import type { Tag } from "@/lib/types";
export function TagPill({ tag }: { tag: Tag }) {
  return <Link className="tag-pill" href={`/tags?tag=${encodeURIComponent(tag.slug)}`}>{tag.name}</Link>;
}
