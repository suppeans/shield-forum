import { describe, expect, it } from "vitest";
import { defaultLanguage, languages, t } from "@/lib/i18n";
describe("multilingual news interface", () => {
  it("defaults to Japanese and translates news navigation", () => {
    expect(defaultLanguage).toBe("ja");
    expect(languages.map((language) => language.code)).toEqual(["zh", "ja", "en"]);
    expect(t("ja", "nav.security")).toBe("セキュリティ");
    expect(t("zh", "nav.security")).toBe("网络安全");
    expect(t("en", "nav.security")).toBe("Security");
  });
});
