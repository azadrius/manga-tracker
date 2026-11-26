import type { ChapterCapture } from "@manga-tracker/core";
import { seriesKey } from "@manga-tracker/core";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/** Document Firestore : users/{uid}/series/{seriesKey} */
export interface Series {
  id: string;
  site: string;
  seriesSlug: string;
  seriesTitle: string;
  seriesUrl: string;
  lastChapter: number;
  lastChapterUrl: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

const seriesCollection = (uid: string) => collection(db, "users", uid, "series");

export function subscribeLibrary(uid: string, onChange: (series: Series[]) => void, onError: (e: Error) => void) {
  return onSnapshot(
    seriesCollection(uid),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Series, "id">) }))),
    onError,
  );
}

export type RecordResult = "created" | "advanced" | "unchanged";

/**
 * Enregistre un chapitre lu. Règle : on garde toujours le numéro le plus élevé,
 * donc relire un ancien chapitre ne fait pas reculer la progression.
 */
export async function recordChapter(uid: string, capture: ChapterCapture): Promise<RecordResult> {
  const ref = doc(seriesCollection(uid), seriesKey(capture));
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      tx.set(ref, {
        site: capture.site,
        seriesSlug: capture.seriesSlug,
        seriesTitle: capture.seriesTitle,
        seriesUrl: capture.seriesUrl,
        lastChapter: capture.chapter,
        lastChapterUrl: capture.chapterUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return "created";
    }
    if (capture.chapter > (snap.data().lastChapter as number)) {
      tx.update(ref, { lastChapter: capture.chapter, lastChapterUrl: capture.chapterUrl, updatedAt: serverTimestamp() });
      return "advanced";
    }
    return "unchanged";
  });
}

/** Correction manuelle : fixe le chapitre, même s'il est plus bas. */
export function setChapter(uid: string, id: string, chapter: number) {
  return updateDoc(doc(seriesCollection(uid), id), { lastChapter: chapter, updatedAt: serverTimestamp() });
}

export function renameSeries(uid: string, id: string, title: string) {
  return updateDoc(doc(seriesCollection(uid), id), { seriesTitle: title });
}

export function removeSeries(uid: string, id: string) {
  return deleteDoc(doc(seriesCollection(uid), id));
}
