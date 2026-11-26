import { formatCaptureKey, generateSecret } from "@manga-tracker/core";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";

const keyDoc = (uid: string) => doc(db, "users", uid, "private", "capture");

/** Clé de capture actuelle, au format à coller dans l'extension (ou `null` s'il n'y en a pas). */
export function useCaptureKey(uid: string): string | null | undefined {
  const [value, setValue] = useState<string | null | undefined>(undefined);
  useEffect(
    () =>
      onSnapshot(keyDoc(uid), (snap) => {
        const secret = snap.get("key") as string | undefined;
        setValue(secret ? formatCaptureKey({ uid, secret }) : null);
      }),
    [uid],
  );
  return value;
}

/** Crée (ou remplace) la clé. L'ancienne cesse aussitôt de fonctionner. */
export function regenerateCaptureKey(uid: string) {
  return setDoc(keyDoc(uid), { key: generateSecret(), createdAt: serverTimestamp() });
}
