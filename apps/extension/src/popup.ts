import { parseCaptureKey, webAppUrl } from "@manga-tracker/core";
import { STORAGE_KEYS, type LastCapture } from "./messages";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const STATUS_TEXT: Record<LastCapture["status"], string> = {
  saved: "enregistré",
  "no-key": "clé manquante",
  "invalid-key": "clé refusée : génère-en une nouvelle dans l'appli",
  error: "pas de connexion, réessaie plus tard",
};

async function render() {
  const sync = await chrome.storage.sync.get(STORAGE_KEYS.captureKey);
  const local = await chrome.storage.local.get(STORAGE_KEYS.lastCapture);
  const key = String(sync[STORAGE_KEYS.captureKey] ?? "");
  const last = local[STORAGE_KEYS.lastCapture] as LastCapture | undefined;

  $<HTMLInputElement>("key").value = key;
  $("key-state").textContent = key ? "Clé enregistrée ✓" : "Aucune clé pour l'instant.";
  $("key-state").className = key ? "ok" : "muted";

  const lastEl = $("last");
  if (last) {
    lastEl.textContent = `${last.seriesTitle}, ch. ${last.chapter} (${last.site}) : ${STATUS_TEXT[last.status]}`;
    lastEl.className = last.status === "saved" ? "" : "error";
  } else {
    lastEl.textContent = "Ouvre un chapitre sur un site de lecture.";
    lastEl.className = "muted";
  }
}

$<HTMLFormElement>("key-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = $<HTMLInputElement>("key").value.trim();
  if (!parseCaptureKey(value)) {
    $("key-state").textContent = "Cette clé n'est pas valide. Copie-la depuis l'appli.";
    $("key-state").className = "error";
    return;
  }
  await chrome.storage.sync.set({ [STORAGE_KEYS.captureKey]: value });
  await render();
});

$<HTMLAnchorElement>("open-app").href = webAppUrl;
if (new URLSearchParams(location.search).has("welcome")) document.body.classList.add("welcome");

void render();
