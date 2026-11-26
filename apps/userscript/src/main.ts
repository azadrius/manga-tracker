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
  let confirmed = false;
  const grab = async () => {
    const el = document.querySelector<HTMLElement>("[data-capture-key]");
    const value = el?.dataset.captureKey;
    if (!value || !parseCaptureKey(value)) return;
    if ((await getValue<string>(KEY, "")) === value) {
      if (!confirmed) toast("Safari est déjà relié à ta liste ✓");
      confirmed = true;
      return;
    }
    confirmed = true;
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
    if ((sent[id] ?? -1) >= capture.chapter) {
      toast(`Manga Tracker : ${capture.seriesTitle} · ch. ${capture.chapter} déjà enregistré`);
      return;
    }

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
      toast("Manga Tracker : envoi impossible, nouvel essai bientôt.", { error: true, duration: 4000 });
      setTimeout(() => (lastUrl = ""), 10000); // Pas de réseau : on réessaiera.
    }
  };

  void check();
  setInterval(() => void check(), 1500);
}

/** Diagnostic : ajoute « #mt-debug » à la fin d'une adresse pour voir ce que le script détecte. */
async function debugReport() {
  const capture = detectChapter({ url: location.href, title: document.title });
  const key = parseCaptureKey(await getValue<string>(KEY, ""));
  toast(
    `Manga Tracker actif · clé : ${key ? "oui" : "non"} · chapitre : ${capture ? `${capture.seriesTitle} ${capture.chapter}` : "non détecté"}`,
    { duration: 8000 },
  );
}
if (location.hash.includes("mt-debug")) void debugReport();

if (location.href.startsWith(APP_URL)) linkFromWebApp();
else watchChapters();
