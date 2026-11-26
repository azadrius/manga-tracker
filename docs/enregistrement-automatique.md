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

Safari n'accepte pas les extensions Chrome. On passe par l'app gratuite **Userscripts**, qui fait tourner
le même code de détection dans Safari. À faire une fois sur chaque appareil (iPhone, iPad) :

1. Installe **Userscripts** depuis l'App Store (gratuite, éditeur : Justin Wasack).
2. Ouvre l'app Userscripts et choisis un dossier où ranger les scripts
   (par exemple *Sur mon iPhone → Userscripts*).
3. Va dans **Réglages → Safari → Extensions → Userscripts** : active-la, puis dans *Autorisations*
   choisis **Autoriser** pour « Tous les sites web ».
4. Dans Safari, ouvre <https://azadrius.github.io/manga-tracker/manga-tracker.user.js>,
   touche l'icône **aA** (ou la pièce de puzzle) dans la barre d'adresse → **Userscripts** → **Install**.
5. Ouvre ta liste (<https://azadrius.github.io/manga-tracker/>) dans Safari et connecte-toi.
   Si tu n'as pas encore de clé, ouvre *Enregistrement automatique* → *Créer ma clé*.
   Un message « Safari est relié à ta liste ✓ » apparaît : **rien à copier-coller**.

Ensuite, à chaque chapitre ouvert, un petit message « ✓ Titre · ch. N » s'affiche en bas de l'écran.

Astuce : ajoute la liste à ton écran d'accueil (Partager → *Sur l'écran d'accueil*) pour l'ouvrir comme une app.

Le script se met à jour tout seul quand une nouvelle version est publiée.

## Comment ça marche

L'extension (ou le script Safari) dépose chaque chapitre détecté dans une « boîte de réception » de ta base Firebase.
Dès que l'appli est ouverte (sur n'importe quel appareil), elle range ces chapitres dans ta liste
en gardant le plus élevé, puis vide la boîte. Relire un ancien chapitre ne fait donc jamais reculer ta progression.
