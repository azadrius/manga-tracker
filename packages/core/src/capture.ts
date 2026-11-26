import type { ChapterCapture } from "./types";

/**
 * Envoi d'un chapitre détecté vers Firestore, sans connexion Google.
 *
 * L'extension Chrome et le script Safari n'ont pas de session Firebase : ils s'identifient
 * avec une « clé de capture » générée dans l'appli web. Ils ne peuvent que déposer des
 * captures dans users/{uid}/inbox ; l'appli web les range ensuite dans la liste
 * (en gardant toujours le chapitre le plus élevé) et vide la boîte.
 */

const KEY_PREFIX = "mt1";

export interface CaptureKey {
  uid: string;
  secret: string;
}

/** Format affiché à l'utilisateur : « mt1.<uid>.<secret> ». */
export function formatCaptureKey(key: CaptureKey): string {
  return `${KEY_PREFIX}.${key.uid}.${key.secret}`;
}

export function parseCaptureKey(value: string): CaptureKey | null {
  const [prefix, uid, secret, ...rest] = value.trim().split(".");
  if (prefix !== KEY_PREFIX || !uid || !secret || rest.length) return null;
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(uid) || !/^[A-Za-z0-9_-]{32,128}$/.test(secret)) return null;
  return { uid, secret };
}

/** Génère un secret aléatoire (base64url, 256 bits). */
export function generateSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export interface FirestoreTarget {
  projectId: string;
  apiKey: string;
  /** Par défaut l'API Firestore de Google ; sinon l'émulateur local (http://127.0.0.1:8080). */
  baseUrl?: string;
}

export type SendResult = "saved" | "invalid-key" | "error";

/** Champs Firestore d'une capture déposée dans la boîte. */
export function inboxFields(capture: ChapterCapture, key: CaptureKey) {
  return {
    site: { stringValue: capture.site },
    seriesSlug: { stringValue: capture.seriesSlug },
    seriesTitle: { stringValue: capture.seriesTitle },
    seriesUrl: { stringValue: capture.seriesUrl },
    chapter: { doubleValue: capture.chapter },
    chapterUrl: { stringValue: capture.chapterUrl },
    capturedAt: { timestampValue: new Date().toISOString() },
    captureKey: { stringValue: key.secret },
  };
}

export async function sendCapture(
  target: FirestoreTarget,
  key: CaptureKey,
  capture: ChapterCapture,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  const base = target.baseUrl ?? "https://firestore.googleapis.com";
  const url =
    `${base}/v1/projects/${encodeURIComponent(target.projectId)}/databases/(default)/documents` +
    `/users/${encodeURIComponent(key.uid)}/inbox?key=${encodeURIComponent(target.apiKey)}`;
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: inboxFields(capture, key) }),
    });
    if (res.ok) return "saved";
    return res.status === 403 ? "invalid-key" : "error";
  } catch {
    return "error";
  }
}
