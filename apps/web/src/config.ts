/**
 * Configuration Firebase de l'appli (Console Firebase → Paramètres du projet → Vos applications).
 * Ces valeurs ne sont pas secrètes : la sécurité repose sur les règles Firestore (firestore.rules).
 */
const productionConfig = {
  apiKey: "AIzaSyDXdllLnPgtZCcj6oHWQEdgmQeEd2IS-9I",
  authDomain: "manga-tracker-14d5d.firebaseapp.com",
  projectId: "manga-tracker-14d5d",
  appId: "1:871364306160:web:c25292b5ba9def09b3ce35",
};

/** `npm run dev:local` : tout tourne sur l'émulateur Firebase, sans compte ni projet réel. */
export const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

const emulatorConfig = {
  apiKey: "demo-key",
  authDomain: "localhost",
  projectId: "demo-manga-tracker",
  appId: "demo-app",
};

export const firebaseConfig = useEmulators ? emulatorConfig : productionConfig;

export const isFirebaseConfigured = !Object.values(firebaseConfig).some((v) => v.includes("A_REMPLIR"));
