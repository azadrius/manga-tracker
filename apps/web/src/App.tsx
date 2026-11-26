import { lazy, Suspense } from "react";
import { isFirebaseConfigured } from "./config";

// Firebase n'est chargé que s'il est configuré, pour afficher un message clair sinon.
const SignedInApp = lazy(() => import("./components/Root"));

export function App() {
  if (!isFirebaseConfigured) {
    return (
      <main className="center">
        <h1>Configuration requise</h1>
        <p>
          Renseigne la configuration Firebase dans <code>apps/web/src/config.ts</code> (voir{" "}
          <code>docs/firebase-setup.md</code>).
        </p>
      </main>
    );
  }
  return (
    <Suspense fallback={<main className="center muted">Chargement…</main>}>
      <SignedInApp />
    </Suspense>
  );
}
