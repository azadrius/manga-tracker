import type { Timestamp } from "firebase/firestore";

const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

export function timeAgo(ts: Timestamp | null): string {
  if (!ts) return "à l'instant";
  const seconds = (ts.toMillis() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "à l'instant";
}

export function formatChapter(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toLocaleString("fr");
}
