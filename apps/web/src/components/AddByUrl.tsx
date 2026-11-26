import { detectChapter } from "@manga-tracker/core";
import { useState, type FormEvent } from "react";
import { recordChapter } from "../lib/library";

const MESSAGES = {
  created: "Ajouté à ta liste.",
  advanced: "Chapitre mis à jour.",
  unchanged: "Déjà à jour : tu as lu un chapitre plus récent.",
} as const;

/** Ajout manuel en collant le lien d'un chapitre (utile avant d'installer l'extension). */
export function AddByUrl({ uid }: { uid: string }) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const capture = detectChapter({ url: url.trim() });
    if (!capture) {
      setMessage({ text: "Ce lien ne ressemble pas à une page de chapitre.", error: true });
      return;
    }
    try {
      setMessage({ text: MESSAGES[await recordChapter(uid, capture)] });
      setUrl("");
    } catch (err) {
      setMessage({ text: (err as Error).message, error: true });
    }
  }

  return (
    <form className="add" onSubmit={submit}>
      <input
        type="url"
        inputMode="url"
        placeholder="Coller le lien d'un chapitre…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <button type="submit">Ajouter</button>
      {message && <p className={message.error ? "error" : "muted"}>{message.text}</p>}
    </form>
  );
}
