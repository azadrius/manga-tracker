import { useEffect, useState } from "react";
import { subscribeLibrary, type Series } from "./library";

/** `refreshKey` : change pour forcer une nouvelle connexion (retour au premier plan sur iOS). */
export function useLibrary(uid: string, refreshKey = 0) {
  const [series, setSeries] = useState<Series[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => subscribeLibrary(uid, setSeries, setError), [uid, refreshKey]);
  return { series, error };
}
