import { lazy, Suspense } from "react";

// Firebase est chargé à part pour que l'écran de chargement s'affiche tout de suite.
const SignedInApp = lazy(() => import("./components/Root"));

export function App() {
  return (
    <Suspense fallback={<main className="center muted">Chargement…</main>}>
      <SignedInApp />
    </Suspense>
  );
}
