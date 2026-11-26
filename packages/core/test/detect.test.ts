import { describe, expect, it } from "vitest";
import { detectChapter, seriesKey } from "../src";

describe("Asura Scans", () => {
  it("détecte le format /comics/<slug>/chapter/<n>", () => {
    const c = detectChapter({ url: "https://asurascans.com/comics/solo-max-level-newbie-0f4b5c3a/chapter/180" });
    expect(c).toMatchObject({
      site: "asurascans.com",
      seriesSlug: "solo-max-level-newbie",
      seriesTitle: "Solo Max Level Newbie",
      seriesUrl: "https://asurascans.com/comics/solo-max-level-newbie-0f4b5c3a",
      chapter: 180,
    });
  });

  it("garde la même série quand le suffixe aléatoire change", () => {
    const a = detectChapter({ url: "https://asurascans.com/comics/nano-machine-11111111/chapter/1" })!;
    const b = detectChapter({ url: "https://asurascans.com/comics/nano-machine-abcdef12/chapter/2" })!;
    expect(seriesKey(a)).toBe(seriesKey(b));
  });

  it("utilise le titre de la page quand il est disponible", () => {
    const c = detectChapter({
      url: "https://www.asurascans.com/comics/the-greatest-estate-developer-1a2b3c4d/chapter/12",
      title: "The Greatest Estate Developer Chapter 12 - Asura Scans",
    });
    expect(c?.seriesTitle).toBe("The Greatest Estate Developer");
    expect(c?.site).toBe("asurascans.com");
  });

  it("gère l'ancien format /<slug>-chapter-<n>/", () => {
    const c = detectChapter({ url: "https://asurascans.com/omniscient-readers-viewpoint-chapter-200/" });
    expect(c).toMatchObject({ seriesSlug: "omniscient-readers-viewpoint", chapter: 200 });
  });

  it("ignore la page de la série", () => {
    expect(detectChapter({ url: "https://asurascans.com/comics/solo-max-level-newbie-0f4b5c3a" })).toBeNull();
    expect(detectChapter({ url: "https://asurascans.com/comics" })).toBeNull();
  });
});

describe("Manhuaus", () => {
  it("détecte /manga/<slug>/chapter-<n>/", () => {
    const c = detectChapter({ url: "https://manhuaus.com/manga/martial-peak/chapter-3800/" });
    expect(c).toMatchObject({
      site: "manhuaus.com",
      seriesSlug: "martial-peak",
      seriesTitle: "Martial Peak",
      seriesUrl: "https://manhuaus.com/manga/martial-peak/",
      chapter: 3800,
    });
  });

  it("gère les chapitres décimaux", () => {
    expect(detectChapter({ url: "https://manhuaus.com/manga/tales-of-demons-and-gods/chapter-480-5/" })?.chapter).toBe(480.5);
  });

  it("ignore la page de la série", () => {
    expect(detectChapter({ url: "https://manhuaus.com/manga/martial-peak/" })).toBeNull();
  });
});

describe("Autres sites (détection générique)", () => {
  it.each([
    ["https://example.com/manga/one-piece/chapter-1100", "one-piece", 1100],
    ["https://example.com/series/one-piece/chapitre/1100", "one-piece", 1100],
    ["https://example.com/read/one-piece/ch-12.5/", "one-piece", 12.5],
    ["https://example.com/one-piece-chapter-1100/", "one-piece", 1100],
  ])("%s", (url, slug, chapter) => {
    expect(detectChapter({ url })).toMatchObject({ seriesSlug: slug, chapter });
  });

  it("ignore les pages qui ne sont pas des chapitres", () => {
    expect(detectChapter({ url: "https://example.com/" })).toBeNull();
    expect(detectChapter({ url: "https://example.com/manga/one-piece/" })).toBeNull();
    expect(detectChapter({ url: "pas une url" })).toBeNull();
    expect(detectChapter({ url: "chrome://extensions/" })).toBeNull();
  });
});

describe("seriesKey", () => {
  it("ne contient jamais de « / »", () => {
    expect(seriesKey({ site: "a.com", seriesSlug: "x/y z" })).toBe("a.com__x_y_z");
  });
});
