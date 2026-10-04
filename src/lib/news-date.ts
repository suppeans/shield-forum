export function japanDate(value: Date | string = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(value));
}
export function newsTime(value: string, includeTime = true) {
  if (!includeTime) return displayDate(japanDate(value));
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value));
}
export function displayDate(value: string) { return value.replaceAll("-", "/"); }
