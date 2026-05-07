"use client";

import { useLanguage } from "./language-provider";

type SearchFormProps = {
  query: string;
};

export function SearchForm({ query }: SearchFormProps) {
  const { t } = useLanguage();

  return (
    <form className="search-form" action="/search">
      <input
        className="input"
        name="q"
        defaultValue={query}
        placeholder={t("search.placeholder")}
        aria-label={t("search.query")}
      />
      <button className="button" type="submit">
        {t("common.search")}
      </button>
    </form>
  );
}
