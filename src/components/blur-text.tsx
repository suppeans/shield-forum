import type { CSSProperties } from "react";

// Adapted from React Bits BlurText; license and source in THIRD-PARTY.md.
export function BlurText({ text, className = "" }: { text: string; className?: string }) {
  return <span className={`blur-text ${className}`}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{Array.from(text).map((letter, index) =>
      <span key={index} className="blur-letter" style={{ "--delay": `${index * 22}ms` } as CSSProperties}>{letter === " " ? "\u00a0" : letter}</span>
    )}</span>
  </span>;
}
