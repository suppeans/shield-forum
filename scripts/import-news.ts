import { readFile } from "node:fs/promises";
import { importNews } from "../src/lib/news-storage.ts";
import { MAX_IMPORT_BYTES, parseImportJson } from "../src/lib/validation.ts";
async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npm run import-news -- path/to/daily-news.json (or - for stdin)");
  let raw: string;
  if (file === "-") {
    const chunks: Buffer[] = [];
    let length = 0;
    for await (const chunk of process.stdin) {
      length += chunk.length;
      if (length > MAX_IMPORT_BYTES) throw new Error("News import exceeds the 2 MiB limit");
      chunks.push(Buffer.from(chunk));
    }
    raw = Buffer.concat(chunks).toString("utf8");
  } else raw = await readFile(file, "utf8");
  parseImportJson(raw);
  console.log(JSON.stringify(await importNews(JSON.parse(raw)), null, 2));
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "News import failed"); process.exitCode = 1;
});
