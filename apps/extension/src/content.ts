import { detectChapter } from "@manga-tracker/core";
import type { ChapterMessage } from "./messages";

/**
 * Tourne dans chaque page. Si la page est un chapitre, on prévient le service worker.
 * Beaucoup de sites changent de chapitre sans recharger la page : on surveille donc l'adresse.
 */
let lastSent = "";

function check() {
  const capture = detectChapter({ url: location.href, title: document.title });
  if (!capture) return;
  const id = `${capture.site}|${capture.seriesSlug}|${capture.chapter}|${capture.seriesTitle}`;
  if (id === lastSent) return;
  lastSent = id;
  const message: ChapterMessage = { type: "chapter", capture };
  chrome.runtime.sendMessage(message).catch(() => {
    // Extension rechargée ou mise à jour : on réessaiera au prochain changement.
    lastSent = "";
  });
}

check();
setInterval(check, 1500);
