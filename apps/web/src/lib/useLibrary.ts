import { useEffect, useState } from "react";
import { subscribeLibrary, type Series } from "./library";

export function useLibrary(uid: string, refreshKey = 0) {
  const [series, setSeries] = useState<Series[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => subscribeLibrary(uid, setSeries, setError), [uid, refreshKey]);
  return { series, error };
}
