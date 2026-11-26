import { useState, type FormEvent } from "react";
import { formatChapter, timeAgo } from "../lib/format";
import { removeSeries, renameSeries, setChapter, type Series } from "../lib/library";

type Mode = "view" | "edit" | "confirmDelete";

export function SeriesCard({ uid, series }: { uid: string; series: Series }) {
  const [mode, setMode] = useState<Mode>("view");
  const [title, setTitle] = useState(series.seriesTitle);
  const [chapter, setChapterValue] = useState(String(series.lastChapter));

  async function save(e: FormEvent) {
    e.preventDefault();
    const n = Number(chapter.replace(",", "."));
    const tasks: Promise<void>[] = [];
    if (Number.isFinite(n) && n >= 0 && n !== series.lastChapter) tasks.push(setChapter(uid, series.id, n));
    if (title.trim() && title.trim() !== series.seriesTitle) tasks.push(renameSeries(uid, series.id, title.trim()));
    await Promise.all(tasks);
    setMode("view");
  }

  if (mode === "edit") {
    return (
      <li className="card">
        <form className="edit" onSubmit={save}>
          <label>
            Titre
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Dernier chapitre lu
            <input inputMode="decimal" value={chapter} onChange={(e) => setChapterValue(e.target.value)} />
          </label>
          <div className="actions">
            <button type="submit" className="primary">Enregistrer</button>
            <button type="button" onClick={() => setMode("view")}>Annuler</button>
            <button type="button" className="danger" onClick={() => setMode("confirmDelete")}>Supprimer</button>
          </div>
        </form>
      </li>
    );
  }

  if (mode === "confirmDelete") {
    return (
      <li className="card">
        <p>Supprimer « {series.seriesTitle} » de ta liste ?</p>
        <div className="actions">
          <button className="danger" onClick={() => removeSeries(uid, series.id)}>Oui, supprimer</button>
          <button onClick={() => setMode("view")}>Annuler</button>
        </div>
      </li>
    );
  }

  return (
    <li className="card">
      <div className="card-main">
        <a className="title" href={series.seriesUrl} target="_blank" rel="noreferrer">
          {series.seriesTitle}
        </a>
        <div className="meta">
          <span className="site">{series.site}</span>
          <span>{timeAgo(series.updatedAt)}</span>
        </div>
      </div>
      <div className="card-side">
        <span className="chapter">Ch. {formatChapter(series.lastChapter)}</span>
        <div className="actions">
          <a className="button primary" href={series.lastChapterUrl} target="_blank" rel="noreferrer">
            Reprendre
          </a>
          <button
            aria-label="Modifier"
            onClick={() => {
              setTitle(series.seriesTitle);
              setChapterValue(String(series.lastChapter));
              setMode("edit");
            }}
          >
            ✎
          </button>
        </div>
      </div>
    </li>
  );
}
