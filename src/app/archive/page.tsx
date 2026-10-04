import { PageHeading } from "@/components/page-heading";
import { ArchiveLinks } from "@/components/archive-links";
import { readNews } from "@/lib/news-storage";
export default async function ArchivePage() {
  const dates = [...new Set((await readNews()).map((article) => article.edition_date))].sort().reverse();
  return <main className="page" id="main"><PageHeading title="" description="" labelKey="home.archive" titleKey="archive.title" descriptionKey="archive.description" /><section className="panel archive-page"><ArchiveLinks dates={dates} />{!dates.length && <p className="muted">公開されたニュースはまだありません。</p>}</section></main>;
}
