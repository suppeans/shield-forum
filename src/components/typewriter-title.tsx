import type { CSSProperties } from "react";

// Character spans adapted from React Bits BlurText. See THIRD-PARTY.md.
export function TypewriterTitle({ text }: { text: string }) {
  const lines = text.split("\n").map((line) => Array.from(line));
  const length = lines.flat().length;
  const typeInterval = 85;
  const eraseInterval = 55;
  const eraseStart = length * typeInterval + 2400;
  const duration = eraseStart + (length - 1) * eraseInterval + 380;
  const cyclePosition = (time: number) => `${time / duration * 100}%`;

  return <h1>
    <span className="sr-only">{text.replaceAll("\n", " ")}</span>
    <span key={text} className="typewriter-title" aria-hidden="true" style={{ "--typewriter-duration": `${duration}ms` } as CSSProperties}>
      {lines.map((letters, lineIndex) => {
        const lineStart = lines.slice(0, lineIndex).reduce((total, line) => total + line.length, 0);

        return <span key={lineIndex} className={lineIndex === 0 ? "" : "accent-title"}>
          {letters.map((letter, letterIndex) => {
            const index = lineStart + letterIndex;
            const style = {
              "--type-at": cyclePosition((index + 1) * typeInterval),
              "--erase-at": cyclePosition(eraseStart + (length - 1 - index) * eraseInterval),
            } as CSSProperties;

            return <span key={letterIndex} className="typewriter-letter" style={style}>{letter}</span>;
          })}
        </span>;
      })}
    </span>
  </h1>;
}
