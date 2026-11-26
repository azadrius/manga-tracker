/** API de stockage des gestionnaires de scripts (Userscripts sur Safari, Tampermonkey…). */
declare const GM: { getValue<T>(key: string, fallback?: T): Promise<T>; setValue(key: string, value: unknown): Promise<void> } | undefined;

const hasGM = typeof GM !== "undefined" && typeof GM?.getValue === "function";

/** Stockage partagé entre tous les sites (repli sur localStorage, propre à chaque site). */
export async function getValue<T>(key: string, fallback: T): Promise<T> {
  if (hasGM) return GM!.getValue<T>(key, fallback);
  const raw = localStorage.getItem(`manga-tracker:${key}`);
  return raw === null ? fallback : (JSON.parse(raw) as T);
}

export async function setValue(key: string, value: unknown): Promise<void> {
  if (hasGM) return GM!.setValue(key, value);
  localStorage.setItem(`manga-tracker:${key}`, JSON.stringify(value));
}
