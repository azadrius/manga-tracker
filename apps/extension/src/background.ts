import { parseCaptureKey, seriesKey, sendCapture, type FirestoreTarget } from "@manga-tracker/core";
import { firebaseProject, emulatorProject } from "@manga-tracker/core";
import { STORAGE_KEYS, type CaptureStatus, type ChapterMessage, type LastCapture } from "./messages";

declare const __USE_EMULATORS__: boolean;

const target: FirestoreTarget = __USE_EMULATORS__
  ? { projectId: emulatorProject.projectId, apiKey: emulatorProject.apiKey, baseUrl: emulatorProject.firestoreUrl }
  : { projectId: firebaseProject.projectId, apiKey: firebaseProject.apiKey };

/** Plus haut chapitre déjà envoyé par série, pour ne pas renvoyer à chaque visite. */
const sentChapters = new Map<string, number>();

const BADGES: Record<CaptureStatus, { text: string; color: string }> = {
  saved: { text: "✓", color: "#2f9e44" },
  "no-key": { text: "!", color: "#e5484d" },
  "invalid-key": { text: "!", color: "#e5484d" },
  error: { text: "×", color: "#868e96" },
};

async function handleChapter(message: ChapterMessage, tabId: number | undefined) {
  const { capture } = message;
  const id = seriesKey(capture);
  if ((sentChapters.get(id) ?? -1) >= capture.chapter) return;

  const stored = await chrome.storage.sync.get(STORAGE_KEYS.captureKey);
  const key = parseCaptureKey(String(stored[STORAGE_KEYS.captureKey] ?? ""));
  const status: CaptureStatus = key ? await sendCapture(target, key, capture) : "no-key";
  if (status === "saved") sentChapters.set(id, capture.chapter);

  const last: LastCapture = {
    seriesTitle: capture.seriesTitle,
    chapter: capture.chapter,
    site: capture.site,
    status,
    at: Date.now(),
  };
  await chrome.storage.local.set({ [STORAGE_KEYS.lastCapture]: last });

  if (tabId !== undefined) {
    const badge = BADGES[status];
    await chrome.action.setBadgeText({ tabId, text: badge.text });
    await chrome.action.setBadgeBackgroundColor({ tabId, color: badge.color });
    await chrome.action.setTitle({ tabId, title: `Manga Tracker : ${capture.seriesTitle}, ch. ${capture.chapter}` });
  }
}

chrome.runtime.onMessage.addListener((message: ChapterMessage, sender) => {
  if (message?.type === "chapter") void handleChapter(message, sender.tab?.id);
});

// Une clé changée : on autorise à renvoyer les chapitres.
chrome.storage.onChanged.addListener((changes) => {
  if (STORAGE_KEYS.captureKey in changes) sentChapters.clear();
});

// Première installation : ouvre la fenêtre de réglage.
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") void chrome.tabs.create({ url: chrome.runtime.getURL("popup.html?welcome=1") });
});
