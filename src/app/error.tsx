"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="page" id="main"><div className="empty-state"><h1>ニュースを読み込めませんでした。</h1><p>時間をおいて、もう一度お試しください。</p><button className="button" onClick={reset}>再読み込み</button></div></main>; }
