# Manga Tracker

Retrouve où tu en es dans tous les mangas que tu lis en ligne, sur PC comme sur iPhone.
L'appli garde pour chaque série le **dernier chapitre lu** (le numéro le plus élevé) et un lien pour reprendre la lecture.
La liste est synchronisée via ton compte Google.

## Fonctionnement

```
 Chrome (PC)            Safari (iPhone / iPad)
 extension              script « Userscripts »        ← étapes 2 et 3
      │                        │
      └──────────┬─────────────┘
                 ▼
        Firebase (Firestore)  ◄──── Appli web (PWA) : liste, recherche, corrections
        users/{uid}/series/{site__série}
```

- **Détection** (`packages/core`) : à partir de l'URL d'une page, reconnaît le site, la série et le numéro du chapitre.
  Sites gérés spécifiquement : Asura Scans, Manhuaus. Les autres sites passent par une détection générique
  (`…/chapter-12`, `…/chapitre/12`, `…-chapter-12/`).
- **Règle de progression** : un chapitre n'est enregistré que s'il est plus élevé que celui déjà noté.
  Relire un ancien chapitre ne fait donc pas reculer la progression (correction manuelle possible dans l'appli).
- **Appli web** (`apps/web`) : React + Vite, installable sur l'écran d'accueil de l'iPhone
  (Safari → Partager → *Sur l'écran d'accueil*), fonctionne hors ligne grâce au cache Firestore.

## Structure

| Dossier | Contenu |
| --- | --- |
| `packages/core` | Détection du manga et du chapitre, avec tests |
| `apps/web` | Appli web (PWA) |
| `firestore.rules` | Règles de sécurité : chacun n'accède qu'à sa liste |
| `docs/` | Guides de mise en place |
| `.github/workflows` | Tests automatiques et déploiement sur GitHub Pages |

## Développement

```bash
npm install
npm test             # tests de détection
npm run typecheck
npm run emulators    # base Firebase locale (Java requis)
npm run dev:local    # appli connectée à la base locale, sans compte réel
npm run dev          # appli connectée au vrai projet Firebase
```

Mise en place du projet Firebase : voir [docs/firebase-setup.md](docs/firebase-setup.md).

## Ajouter un site

Si un site n'est pas bien reconnu, ajoute un adaptateur dans `packages/core/src/adapters.ts`
(sur le modèle de `manhuausAdapter`), référence-le dans `siteAdapters`, et ajoute des exemples d'URL
dans `packages/core/test/detect.test.ts`.
