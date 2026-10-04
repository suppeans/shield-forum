import { NewsEditionView } from "@/components/news-edition-view";
import { getNewsEdition } from "@/lib/repositories/news";
import { japanDate } from "@/lib/news-date";
import { z } from "zod";
export default async function HomePage({ searchParams }: { searchParams?: Promise<{ date?: string; category?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const today = japanDate();
  const date = z.iso.date().safeParse(params.date);
  const edition = await getNewsEdition(date.success ? date.data : today, params.category);
  return <NewsEditionView edition={edition} today={today} category={params.category} />;
}
