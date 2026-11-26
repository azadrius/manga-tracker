import { genericAdapter, siteAdapters } from "./adapters";
import { normalizeHost } from "./text";
import type { ChapterCapture, PageInfo, SiteAdapter } from "./types";

function adapterFor(host: string): SiteAdapter | undefined {
  return siteAdapters.find((a) => a.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
}

/**
 * Point d'entrée : à partir de l'URL (et du titre) d'une page,
 * renvoie le manga et le chapitre lus, ou `null` si ce n'est pas une page de chapitre.
 */
export function detectChapter(page: PageInfo): ChapterCapture | null {
  let url: URL;
  try {
    url = new URL(page.url);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const specific = adapterFor(normalizeHost(url.hostname));
  if (specific) return specific.parse(url, page.title);
  return genericAdapter.parse(url, page.title);
}

/**
 * Identifiant de document stable pour une série : « asurascans.com__solo-leveling ».
 * Ne contient jamais de « / » (interdit dans un identifiant Firestore).
 */
export function seriesKey(capture: Pick<ChapterCapture, "site" | "seriesSlug">): string {
  return `${capture.site}__${capture.seriesSlug}`.replace(/[/\s]+/g, "_").slice(0, 700);
}
