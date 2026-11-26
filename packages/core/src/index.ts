export type { ChapterCapture, PageInfo, SiteAdapter } from "./types";
export { detectChapter, seriesKey } from "./detect";
export { siteAdapters, asuraAdapter, manhuausAdapter, genericAdapter } from "./adapters";
export { slugToTitle, seriesTitleFromPageTitle } from "./text";
export {
  formatCaptureKey,
  parseCaptureKey,
  generateSecret,
  sendCapture,
  inboxFields,
  type CaptureKey,
  type FirestoreTarget,
  type SendResult,
} from "./capture";
export { firebaseProject, emulatorProject, webAppUrl } from "./firebaseProject";
