import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useEmulators } from "../config";
import { auth } from "./firebase";

export type AuthState = { status: "loading" } | { status: "signedOut" } | { status: "signedIn"; user: User };

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: "loading" });
  useEffect(
    () => onAuthStateChanged(auth, (user) => setState(user ? { status: "signedIn", user } : { status: "signedOut" })),
    [],
  );
  return state;
}

export async function signInWithGoogle(): Promise<void> {
  if (useEmulators) {
    // L'émulateur accepte un faux compte Google : pratique pour tester sans réseau.
    const fakeToken = JSON.stringify({ sub: "local-user", email: "test@example.com", email_verified: true });
    await signInWithCredential(auth, GoogleAuthProvider.credential(fakeToken));
    return;
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    // Fenêtre bloquée (fréquent dans une appli installée sur iPhone) : on passe par une redirection.
    const code = (error as { code?: string }).code;
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return;
    }
    if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") throw error;
  }
}

export const signOutUser = () => signOut(auth);
