/** « solo-leveling_ragnarok » → « Solo Leveling Ragnarok » */
export function slugToTitle(slug: string): string {
  return decodeURIComponent(slug)
    .split(/[-_+\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** « 12 », « 12-5 », « 12.5 », « 12_5 » → 12 / 12.5 */
export function parseChapterNumber(main: string, decimal?: string): number | null {
  const value = Number(decimal ? `${main}.${decimal}` : main);
  return Number.isFinite(value) ? value : null;
}

const CHAPTER_WORDS = /\s*[-–—|:]?\s*(?:chapter|chapitre|chap\.?|ch\.?|episode|ep\.?)\s*\d.*$/i;

/**
 * Extrait le nom de la série d'un titre de page,
 * ex. « Solo Leveling Chapter 12 - Asura Scans » → « Solo Leveling ».
 * Renvoie `null` si le titre ne ressemble pas à « <série> Chapter N ».
 */
export function seriesTitleFromPageTitle(title: string | undefined): string | null {
  if (!title) return null;
  const match = title.match(/^(.*?)(?:\s*[-–—|:]?\s*(?:chapter|chapitre|chap\.?|ch\.?|episode|ep\.?)\s*\d)/i);
  const candidate = match?.[1]?.replace(CHAPTER_WORDS, "").trim();
  return candidate && candidate.length > 1 ? candidate : null;
}

/** Nom d'hôte normalisé : minuscules, sans « www. ». */
export function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}
