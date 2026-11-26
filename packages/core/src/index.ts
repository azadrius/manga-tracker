export type { ChapterCapture, PageInfo, SiteAdapter } from "./types";
export { detectChapter, seriesKey } from "./detect";
export { siteAdapters, asuraAdapter, manhuausAdapter, genericAdapter } from "./adapters";
export { slugToTitle, seriesTitleFromPageTitle } from "./text";
