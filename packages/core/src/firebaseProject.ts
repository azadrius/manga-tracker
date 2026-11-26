/**
 * Projet Firebase utilisé par l'appli web, l'extension Chrome et le script Safari.
 * Ces valeurs ne sont pas secrètes : la sécurité repose sur les règles Firestore (firestore.rules).
 */
export const firebaseProject = {
  apiKey: "AIzaSyDXdllLnPgtZCcj6oHWQEdgmQeEd2IS-9I",
  authDomain: "manga-tracker-14d5d.firebaseapp.com",
  projectId: "manga-tracker-14d5d",
  appId: "1:871364306160:web:c25292b5ba9def09b3ce35",
};

/** Projet fictif utilisé avec les émulateurs Firebase (tests en local). */
export const emulatorProject = {
  apiKey: "demo-key",
  authDomain: "localhost",
  projectId: "demo-manga-tracker",
  appId: "demo-app",
  firestoreUrl: "http://127.0.0.1:8080",
};

/** Adresse publique de l'appli web. */
export const webAppUrl = "https://azadrius.github.io/manga-tracker/";
