import type { ChapterCapture } from "@manga-tracker/core";
import { collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { recordChapter } from "./library";

/**
 * Range dans la liste les chapitres déposés par l'extension / le script Safari,
 * puis vide la boîte. Tourne tant que l'appli est ouverte, sur n'importe quel appareil.
 */
export function processInbox(uid: string, onError: (e: Error) => void) {
  const inbox = collection(db, "users", uid, "inbox");
  const inFlight = new Set<string>();
  return onSnapshot(
    inbox,
    (snap) => {
      for (const d of snap.docs) {
        if (inFlight.has(d.id) || d.metadata.hasPendingWrites) continue;
        inFlight.add(d.id);
        const data = d.data();
        const capture: ChapterCapture = {
          site: data.site,
          seriesSlug: data.seriesSlug,
          seriesTitle: data.seriesTitle,
          seriesUrl: data.seriesUrl,
          chapter: data.chapter,
          chapterUrl: data.chapterUrl,
        };
        recordChapter(uid, capture)
          .then(() => deleteDoc(d.ref))
          .catch(onError)
          .finally(() => inFlight.delete(d.id));
      }
    },
    onError,
  );
}
