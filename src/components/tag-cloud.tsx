import type { Tag } from "@/lib/types";
import { TagPill } from "./tag-pill";

type TagCloudProps = {
  tags: Tag[];
};

export function TagCloud({ tags }: TagCloudProps) {
  return (
    <div className="tag-cloud">
      {tags.map((tag) => (
        <TagPill key={tag.id} tag={tag} />
      ))}
    </div>
  );
}
