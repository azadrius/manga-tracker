import type { ChapterCapture, SendResult } from "@manga-tracker/core";

/** Message envoyé par la page (content script) au service worker. */
export interface ChapterMessage {
  type: "chapter";
  capture: ChapterCapture;
}

export type CaptureStatus = SendResult | "no-key";

/** Dernière capture, affichée dans la fenêtre de l'extension. */
export interface LastCapture {
  seriesTitle: string;
  chapter: number;
  site: string;
  status: CaptureStatus;
  at: number;
}

export const STORAGE_KEYS = {
  /** chrome.storage.sync : la clé suit ton compte Google sur tous tes Chrome. */
  captureKey: "captureKey",
  /** chrome.storage.local */
  lastCapture: "lastCapture",
} as const;
