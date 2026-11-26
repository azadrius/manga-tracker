import { emulatorProject, firebaseProject } from "@manga-tracker/core";

/** `npm run dev:local` : tout tourne sur l'émulateur Firebase, sans compte ni projet réel. */
export const useEmulators = import.meta.env.VITE_USE_EMULATORS === "true";

export const firebaseConfig = useEmulators ? emulatorProject : firebaseProject;
