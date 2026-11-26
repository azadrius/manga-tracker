# Mise en place de Firebase (une seule fois, ~5 minutes)

Firebase stocke ta liste et gère la connexion Google. L'offre gratuite (« Spark ») suffit largement.

1. **Créer le projet** : va sur <https://console.firebase.google.com>, clique sur *Créer un projet*,
   nomme-le `manga-tracker`, et désactive Google Analytics (inutile ici).
2. **Activer la connexion Google** : menu *Créer → Authentication → Commencer*, onglet
   *Mode de connexion*, choisis *Google*, active-le, choisis ton e-mail d'assistance, enregistre.
3. **Autoriser le site** : toujours dans *Authentication*, onglet *Paramètres → Domaines autorisés*,
   ajoute `azadrius.github.io`.
4. **Créer la base** : menu *Créer → Firestore Database → Créer une base de données*,
   emplacement `eur3 (europe-west)`, démarrer en **mode production**.
5. **Règles de sécurité** : dans Firestore, onglet *Règles*, remplace tout par le contenu de
   [`firestore.rules`](../firestore.rules), puis *Publier*.
6. **Récupérer la configuration** : roue dentée → *Paramètres du projet* → section *Vos applications*
   → icône `</>` (Web), nom `manga-tracker`, **sans** cocher Firebase Hosting.
   Copie les valeurs `apiKey`, `authDomain`, `projectId` et `appId` dans
   [`apps/web/src/config.ts`](../apps/web/src/config.ts).

Ces valeurs ne sont pas secrètes : elles identifient le projet, et ce sont les règles Firestore
qui empêchent quiconque d'autre de lire ou modifier ta liste.

## GitHub Pages

Dans le dépôt GitHub : *Settings → Pages → Build and deployment → Source : GitHub Actions*.
Chaque modification sur `main` redéploie l'appli sur <https://azadrius.github.io/manga-tracker/>.
