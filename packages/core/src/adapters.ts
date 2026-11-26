import type { ChapterCapture, SiteAdapter } from "./types";
import { normalizeHost, parseChapterNumber, seriesTitleFromPageTitle, slugToTitle } from "./text";

/** Asura ajoute parfois un suffixe aléatoire au slug (« solo-leveling-7f873ca6 ») qui change avec le temps. */
function stripAsuraHash(slug: string): string {
  return slug.replace(/-[0-9a-f]{8}$/i, "");
}

function build(
  url: URL,
  rawSlug: string,
  seriesPath: string,
  chapter: number | null,
  title: string | undefined,
  cleanSlug: (slug: string) => string = (s) => s,
): ChapterCapture | null {
  if (chapter === null) return null;
  const seriesSlug = cleanSlug(rawSlug).toLowerCase();
  if (!seriesSlug) return null;
  return {
    site: normalizeHost(url.hostname),
    seriesSlug,
    seriesTitle: seriesTitleFromPageTitle(title) ?? slugToTitle(seriesSlug),
    seriesUrl: `${url.origin}${seriesPath}`,
    chapter,
    chapterUrl: url.href,
  };
}

/**
 * Asura Scans.
 * - /comics/<slug>/chapter/<n>   (ou /series/…)
 * - /<slug>-chapter-<n>/          (ancien format)
 */
export const asuraAdapter: SiteAdapter = {
  name: "Asura Scans",
  hosts: ["asurascans.com", "asuracomic.net", "asuratoon.com", "asura.gg"],
  parse(url, title) {
    const modern = url.pathname.match(/^\/(comics|series|manga)\/([^/]+)\/chapter\/(\d+)(?:[.-](\d+))?\/?$/i);
    if (modern) {
      const [, section, slug, main, dec] = modern;
      return build(url, slug!, `/${section}/${slug}`, parseChapterNumber(main!, dec), title, stripAsuraHash);
    }
    const legacy = url.pathname.match(/^\/(?:\d+-)?([^/]+?)-chapter-(\d+)(?:-(\d+))?\/?$/i);
    if (legacy) {
      const [, slug, main, dec] = legacy;
      return build(url, slug!, `/manga/${slug}/`, parseChapterNumber(main!, dec), title, stripAsuraHash);
    }
    return null;
  },
};

/** Manhuaus (thème WordPress « Madara ») : /manga/<slug>/chapter-<n>/ */
export const manhuausAdapter: SiteAdapter = {
  name: "Manhuaus",
  hosts: ["manhuaus.com", "manhuaus.org"],
  parse(url, title) {
    const m = url.pathname.match(/^\/(manga|manhua|manhwa|comic)\/([^/]+)\/chapter-(\d+)(?:[-.](\d+))?(?:-[^/]*)?\/?$/i);
    if (!m) return null;
    const [, section, slug, main, dec] = m;
    return build(url, slug!, `/${section}/${slug}/`, parseChapterNumber(main!, dec), title);
  },
};

/**
 * Détection générique pour les autres sites. Formats reconnus :
 * - /<section>/<slug>/chapter-12/   /<slug>/chapitre/12   /<slug>/ch-12
 * - /<slug>-chapter-12/
 */
export const genericAdapter: SiteAdapter = {
  name: "Autre site",
  hosts: [],
  parse(url, title) {
    const segments = url.pathname.split("/").filter(Boolean);
    const word = "(?:chapter|chapitre|chap|ch|episode|ep)";

    // « …/<slug>/chapter-12 » ou « …/<slug>/chapter/12 »
    for (let i = segments.length - 1; i >= 1; i--) {
      const seg = segments[i]!;
      let m = seg.match(new RegExp(`^${word}[-_]?(\\d+)(?:[-_.](\\d+))?(?:[-_].*)?$`, "i"));
      let slugIndex = i - 1;
      if (!m && /^(?:chapter|chapitre|chap|ch|episode|ep)$/i.test(segments[i - 1] ?? "")) {
        m = seg.match(/^(\d+)(?:[-_.](\d+))?$/);
        slugIndex = i - 2;
      }
      if (m && slugIndex >= 0) {
        const slug = segments[slugIndex]!;
        const seriesPath = `/${segments.slice(0, slugIndex + 1).join("/")}/`;
        return build(url, slug, seriesPath, parseChapterNumber(m[1]!, m[2]), title, stripAsuraHash);
      }
    }

    // « /<slug>-chapter-12 »
    const last = segments.at(-1);
    const inline = last?.match(new RegExp(`^(.+?)-${word}-(\\d+)(?:[-.](\\d+))?$`, "i"));
    if (inline) {
      const [, slug, main, dec] = inline;
      return build(url, slug!, `/${slug}/`, parseChapterNumber(main!, dec), title);
    }
    return null;
  },
};

/** Adaptateurs spécifiques, essayés avant la détection générique. */
export const siteAdapters: SiteAdapter[] = [asuraAdapter, manhuausAdapter];
