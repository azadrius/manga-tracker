/**
 * Configuration Firebase de l'appli (Console Firebase → Paramètres du projet → Vos applications).
 * Ces valeurs ne sont pas secrètes : la sécurité repose sur les règles Firestore (firestore.rules).
 */
const productionConfig = {
  apiKey: "A_REMPLIR",
  authDomain: "A_REMPLIR.firebaseapp.com",
  projectId: "A_REMPLIR",
  appId: "A_REMPLIR",
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
