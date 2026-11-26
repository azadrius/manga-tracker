import {
  detectChapter,
  emulatorProject,
  firebaseProject,
  parseCaptureKey,
  sendCapture,
  seriesKey,
  webAppUrl,
  type FirestoreTarget,
} from "@manga-tracker/core";
import { getValue, setValue } from "./gm";
import { toast } from "./toast";

declare const __USE_EMULATORS__: boolean;

const APP_URL = __USE_EMULATORS__ ? "http://localhost:5173/" : webAppUrl;
const target: FirestoreTarget = __USE_EMULATORS__
  ? { projectId: emulatorProject.projectId, apiKey: emulatorProject.apiKey, baseUrl: emulatorProject.firestoreUrl }
  : { projectId: firebaseProject.projectId, apiKey: firebaseProject.apiKey };

const KEY = "captureKey";
const SENT = "sentChapters";

/**
 * Sur l'appli web : récupère la clé de capture affichée dans la page,
 * pour que Safari soit relié sans rien copier-coller.
 */
function linkFromWebApp() {
  const grab = async () => {
    const el = document.querySelector<HTMLElement>("[data-capture-key]");
    const value = el?.dataset.captureKey;
    if (!value || !parseCaptureKey(value)) return;
    if ((await getValue<string>(KEY, "")) === value) return;
    await setValue(KEY, value);
    await setValue(SENT, {});
    toast("Safari est relié à ta liste ✓");
  };
  void grab();
  new MutationObserver(() => void grab()).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-capture-key"],
  });
}

/** Sur les autres sites : détecte le chapitre et l'envoie. */
function watchChapters() {
  let lastUrl = "";
  let warnedNoKey = false;

  const check = async () => {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    const capture = detectChapter({ url: location.href, title: document.title });
    if (!capture) return;

    const key = parseCaptureKey(await getValue<string>(KEY, ""));
    if (!key) {
      if (!warnedNoKey) {
        warnedNoKey = true;
        toast("Manga Tracker : ouvre ta liste une fois pour relier Safari.", {
          link: { href: APP_URL, text: "Ouvrir" },
          duration: 6000,
        });
      }
      return;
    }

    const sent = await getValue<Record<string, number>>(SENT, {});
    const id = seriesKey(capture);
    if ((sent[id] ?? -1) >= capture.chapter) return;

    const result = await sendCapture(target, key, capture);
    if (result === "saved") {
      await setValue(SENT, { ...(await getValue<Record<string, number>>(SENT, {})), [id]: capture.chapter });
      toast(`✓ ${capture.seriesTitle} · ch. ${capture.chapter}`);
    } else if (result === "invalid-key") {
      toast("Manga Tracker : clé refusée. Rouvre ta liste pour relier Safari.", {
        error: true,
        link: { href: APP_URL, text: "Ouvrir" },
        duration: 6000,
      });
    } else {
      lastUrl = ""; // Pas de réseau : on réessaiera.
    }
  };

  void check();
  setInterval(() => void check(), 1500);
}

if (location.href.startsWith(APP_URL)) linkFromWebApp();
else watchChapters();
