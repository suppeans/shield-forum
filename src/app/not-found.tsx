import Link from "next/link";
export default function NotFound() { return <main className="page" id="main"><div className="empty-state"><p className="eyebrow">404</p><h1>ページが見つかりません。</h1><p>記事が存在しないか、公開されていません。</p><Link className="button" href="/">ホームへ戻る</Link></div></main>; }
