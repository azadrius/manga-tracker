# Enregistrement automatique des chapitres

L'appli enregistre toute seule le chapitre que tu lis, dès que tu ouvres sa page.
Pour ça, chaque navigateur a besoin d'une **clé de capture** :

1. Ouvre l'appli (<https://azadrius.github.io/manga-tracker/>), connecte-toi.
2. En bas, ouvre **Enregistrement automatique** → **Créer ma clé** → **Copier**.

La clé permet seulement d'*ajouter* des chapitres à ta liste : elle ne permet ni de la lire ni de la modifier.
Si tu penses qu'elle a fuité, clique sur *Générer une nouvelle clé* : l'ancienne cesse de fonctionner.

## Sur PC : extension Chrome

1. Télécharge `manga-tracker-extension.zip` depuis la
   [release « extension »](https://github.com/azadrius/manga-tracker/releases/tag/extension) et dézippe-le
   dans un dossier que tu garderas (par exemple `Documents\manga-tracker-extension`).
2. Dans Chrome, va sur `chrome://extensions` et active le **Mode développeur** (en haut à droite).
3. Clique sur **Charger l'extension non empaquetée** et choisis le dossier dézippé.
4. Une page de réglage s'ouvre : colle ta clé et clique sur **Enregistrer**.
   (Plus tard, clique sur l'icône de l'extension, épinglée via la pièce de puzzle.)

C'est tout. Quand tu ouvres un chapitre, l'icône affiche :

| Badge | Signification |
| --- | --- |
| ✓ vert | Chapitre enregistré |
| ! rouge | Clé manquante ou refusée : recolle-la depuis l'appli |
| × gris | Pas de connexion : il sera renvoyé à la prochaine visite |

La clé est synchronisée par Chrome : sur un autre PC connecté au même compte Google, il suffit d'installer l'extension.

**Mise à jour** : télécharge à nouveau le zip, remplace le contenu du dossier, puis clique sur ↻ dans `chrome://extensions`.

## Sur iPhone et iPad : Safari

Arrive à l'étape 3.

## Comment ça marche

L'extension dépose chaque chapitre détecté dans une « boîte de réception » de ta base Firebase.
Dès que l'appli est ouverte (sur n'importe quel appareil), elle range ces chapitres dans ta liste
en gardant le plus élevé, puis vide la boîte. Relire un ancien chapitre ne fait donc jamais reculer ta progression.
