import type { User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { signOutUser } from "../lib/auth";
import { processInbox } from "../lib/inbox";
import type { Series } from "../lib/library";
import { useLibrary } from "../lib/useLibrary";
import { AddByUrl } from "./AddByUrl";
import { CaptureSettings } from "./CaptureSettings";
import { SeriesCard } from "./SeriesCard";

type Sort = "recent" | "title";

const sorters: Record<Sort, (a: Series, b: Series) => number> = {
  recent: (a, b) => (b.updatedAt?.toMillis() ?? Infinity) - (a.updatedAt?.toMillis() ?? Infinity),
  title: (a, b) => a.seriesTitle.localeCompare(b.seriesTitle, "fr"),
};

/** Ignore accents et majuscules pour la recherche. */
const normalize = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function Library({ user }: { user: User }) {
  const { series, error } = useLibrary(user.uid);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("recent");
  const [inboxError, setInboxError] = useState<Error | null>(null);

  // Range les chapitres envoyés par l'extension / le script Safari.
  useEffect(() => processInbox(user.uid, setInboxError), [user.uid]);

  const visible = useMemo(() => {
    const q = normalize(search.trim());
    return (series ?? [])
      .filter((s) => !q || normalize(`${s.seriesTitle} ${s.site}`).includes(q))
      .sort(sorters[sort]);
  }, [series, search, sort]);

  return (
    <main className="library">
      <header>
        <h1>Mes mangas</h1>
        <button className="link" onClick={signOutUser} title={user.email ?? ""}>
          Déconnexion
        </button>
      </header>

      <AddByUrl uid={user.uid} />

      <div className="toolbar">
        <input type="search" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Trier">
          <option value="recent">Lus récemment</option>
          <option value="title">A → Z</option>
        </select>
      </div>

      {(error ?? inboxError) && <p className="error">Erreur de synchronisation : {(error ?? inboxError)!.message}</p>}
      {series === null && !error && <p className="muted">Chargement…</p>}
      {series?.length === 0 && (
        <p className="muted empty">
          Ta liste est vide. Colle le lien d'un chapitre ci-dessus, ou installe l'extension pour un enregistrement
          automatique.
        </p>
      )}
      {series && series.length > 0 && (
        <>
          <p className="muted count">
            {visible.length} manga{visible.length > 1 ? "s" : ""}
          </p>
          <ul className="list">
            {visible.map((s) => (
              <SeriesCard key={s.id} uid={user.uid} series={s} />
            ))}
          </ul>
        </>
      )}

      <CaptureSettings uid={user.uid} />
    </main>
  );
}
