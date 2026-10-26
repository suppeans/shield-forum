"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { displayDate } from "@/lib/news-date";
import { useLanguage } from "./language-provider";
export function ArchiveLinks({ dates, selected }: { dates: string[]; selected?: string }) {
  const { t } = useLanguage();
  const olderDates = dates.slice(8);
  return <><div className="archive-links">{dates.slice(0, 8).map((date) => <Link key={date} href={`/?date=${date}`} aria-current={selected === date ? "page" : undefined}><time dateTime={date}>{displayDate(date)}</time><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div>
    {olderDates.length > 0 && <form className="archive-select" action="/">
      <label>{t("archive.choose")}<select key={selected ?? ""} className="input" name="date" defaultValue={olderDates.includes(selected ?? "") ? selected : ""} required>
        <option value="" disabled>{t("archive.selectDate")}</option>
        {olderDates.map((date) => <option key={date} value={date}>{displayDate(date)}</option>)}
      </select></label>
      <button className="button" type="submit">{t("archive.open")}</button>
    </form>}
  </>;
}
