"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

type ReturnEntry = { depth: number };
let pendingReturn: { articleHref: string; entry: ReturnEntry } | undefined;

export function ArticleLink(props: ComponentProps<typeof Link> & { href: string }) {
  const scrollBeforeClick = useRef<number | undefined>(undefined);
  return <Link {...props} onPointerDown={event => {
    if (event.button === 0) scrollBeforeClick.current = window.scrollY;
  }} onKeyDown={event => {
    if (event.key === "Enter") scrollBeforeClick.current = window.scrollY;
  }} onNavigate={() => {
    window.history.replaceState({ ...window.history.state, shieldNewsScrollY: scrollBeforeClick.current ?? window.scrollY }, "");
    scrollBeforeClick.current = undefined;
    const previous = window.history.state?.shieldNewsReturn as ReturnEntry | undefined;
    if (window.location.pathname.startsWith("/news/") && !previous) {
      pendingReturn = undefined;
      return;
    }
    const entry = window.location.pathname.startsWith("/news/") && previous
      ? { ...previous, depth: previous.depth + 1 }
      : { depth: 1 };
    pendingReturn = { articleHref: props.href, entry };
  }} />;
}

export function ArticleBackLink({ articleHref, fallbackHref, children }: {
  articleHref: string;
  fallbackHref: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (pendingReturn?.articleHref !== articleHref) return;
    // Keep the return destination on this history entry through refresh and back/forward.
    window.history.replaceState({ ...window.history.state, shieldNewsReturn: pendingReturn.entry }, "");
    pendingReturn = undefined;
  }, [articleHref]);

  return <Link className="back-link" href={fallbackHref} onNavigate={event => {
    const entry = window.history.state?.shieldNewsReturn as ReturnEntry | undefined;
    if (entry && entry.depth > 0 && entry.depth < window.history.length) {
      event.preventDefault();
      window.history.go(-entry.depth);
    }
  }}>{children}</Link>;
}

export function ArticleScrollRestoration() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [restore, setRestore] = useState<{ route: string; y: number }>();

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const y = event.state?.shieldNewsScrollY;
      if (typeof y === "number") setRestore({ route: window.location.pathname + window.location.search, y });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const route = pathname + (search ? `?${search}` : "");
    if (!restore || restore.route !== route || window.history.state?.shieldNewsScrollY !== restore.y) return;
    let cancelled = false;
    let frame = 0;
    document.fonts.ready.then(() => {
      if (!cancelled) frame = requestAnimationFrame(() => window.scrollTo({ top: restore.y, behavior: "instant" }));
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [pathname, search, restore]);

  return null;
}
