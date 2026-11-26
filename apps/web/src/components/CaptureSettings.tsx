import { useState } from "react";
import { regenerateCaptureKey, useCaptureKey } from "../lib/captureKey";

const GUIDE_URL = "https://github.com/azadrius/manga-tracker/blob/main/docs/enregistrement-automatique.md";

/** Section « Enregistrement automatique » : la clé à coller dans l'extension Chrome / le script Safari. */
export function CaptureSettings({ uid }: { uid: string }) {
  const key = useCaptureKey(uid);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!key) return;
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function regenerate() {
    await regenerateCaptureKey(uid);
    setConfirming(false);
  }

  return (
    <details className="settings">
      <summary>Enregistrement automatique</summary>
      <p className="muted">
        L'extension Chrome et le script Safari utilisent cette clé pour ajouter les chapitres que tu lis.{" "}
        <a href={GUIDE_URL} target="_blank" rel="noreferrer">
          Guide d'installation
        </a>
      </p>
      {key === undefined && <p className="muted">Chargement…</p>}
      {key === null && (
        <button className="primary" onClick={regenerate}>
          Créer ma clé
        </button>
      )}
      {key && (
        <>
          <div className="key-row">
            <input readOnly value={key} onFocus={(e) => e.currentTarget.select()} aria-label="Clé de capture" />
            <button onClick={copy}>{copied ? "Copiée ✓" : "Copier"}</button>
          </div>
          {confirming ? (
            <div className="actions">
              <span className="muted">L'ancienne clé ne marchera plus sur tes appareils.</span>
              <button className="danger" onClick={regenerate}>Remplacer</button>
              <button onClick={() => setConfirming(false)}>Annuler</button>
            </div>
          ) : (
            <button className="link" onClick={() => setConfirming(true)}>
              Générer une nouvelle clé
            </button>
          )}
        </>
      )}
    </details>
  );
}
