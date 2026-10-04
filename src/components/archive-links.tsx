import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { displayDate } from "@/lib/news-date";
export function ArchiveLinks({ dates, selected }: { dates: string[]; selected?: string }) {
  return <div className="archive-links">{dates.map((date) => <Link key={date} href={`/?date=${date}`} aria-current={selected === date ? "page" : undefined}><time dateTime={date}>{displayDate(date)}</time><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div>;
}
