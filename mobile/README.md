# Lectura — application mobile (React Native / Expo)

Version mobile native de Lectura, construite avec **Expo** (React Native). Elle reprend le
design de l'app web (liseuse premium, accent rouge, navigation par onglets) et les mêmes
fonctionnalités, avec le même backend **Supabase** (et un repli local hors-ligne).

Cible : **Expo SDK 54** (React Native 0.81, React 19.1, New Architecture activée) — compatible
avec l'app **Expo Go** SDK 54.

## Prérequis

- Node.js 20+ et npm
- L'application **Expo Go** (SDK 54) sur votre téléphone (iOS App Store / Google Play), **ou** un
  simulateur iOS (Xcode) / émulateur Android (Android Studio)

## Lancer

```bash
cd mobile
npm install
npx expo start
```

Puis scannez le QR code avec **Expo Go** (Android) ou l'app Appareil photo (iOS), ou appuyez
sur `i` (simulateur iOS) / `a` (émulateur Android) dans le terminal.

> Les versions des dépendances sont déjà alignées sur le SDK 54. En cas de doute, exécutez
> `npx expo install --fix` : cette commande fait foi et cale chaque paquet sur la version exacte
> attendue par le SDK installé.

> **Note SDK 54** — l'ancienne API de `expo-file-system` a été déplacée sous
> `expo-file-system/legacy` ; le projet l'importe déjà ainsi (upload de PDF).

## Fonctionnalités

- **Comptes** — inscription / connexion / déconnexion via **Supabase Auth**, ou comptes locaux
  (AsyncStorage) tant que Supabase n'est pas configuré.
- **Découverte** (Accueil) — « Reprendre la lecture », tendances, catégories, nouveautés.
- **Explorer** — recherche par titre / auteur / genre, recherches récentes, catégories.
- **Liseuse** — réglages de lecture réels : **tonalité** (Clair / Sépia / Sombre / Charbon),
  **taille** et **famille** de police, **marges** ; barre de progression par page.
- **Écoute audio** — synthèse vocale réelle via **`expo-speech`** (vitesse, langue).
- **Ajout de livre** — sélection d'un PDF via **`expo-document-picker`**, stocké localement
  (FileSystem) et/ou envoyé dans **Supabase Storage**.
- **Favoris**, **avis**, **profil** (statistiques + historique) — persistés.

## Configurer Supabase

Identique à la version web : renseignez `src/config.js` avec l'`URL` et la clé **anon public**
de votre projet, et exécutez le schéma [`../supabase/schema.sql`](../supabase/schema.sql) dans
le SQL Editor de Supabase. Tant que `config.js` est vide, l'app tourne entièrement en local.

## Animations

Toutes les animations utilisent l'**API `Animated` intégrée** de React Native (aucune dépendance
native supplémentaire, aucune config Babel) :

- **Splash animé** (`src/components/AnimatedSplash.js`) — le splash natif statique est maintenu via
  `expo-splash-screen`, puis un overlay animé prend le relais : le logo apparaît (ressort + fondu),
  « Lectura » monte en fondu, et l'écran se dissout une fois l'app prête.
- **Appui tactile** — couvertures et boutons se réduisent légèrement à la pression
  (`PressableScale`).
- **Entrées décalées** — l'accueil et la fiche livre apparaissent en fondu-montée
  (`FadeInUp`), les éléments de la bibliothèque en cascade.
- **Bouton lecture audio** — pulsation continue pendant l'écoute.
- **Transitions de mise en page** (`LayoutAnimation`) — changement d'onglet de la bibliothèque
  et modifications des réglages de lecture (police, marges, tonalité) animés en douceur.

Les briques réutilisables sont dans `src/components/anim.js`.

## Icône & splash screen

Les visuels sont dans [`assets/`](assets/) et déclarés dans `app.json` :

| Fichier | Rôle |
|---|---|
| `icon.png` (1024²) | Icône de l'app (iOS + repli) |
| `adaptive-icon.png` (1024²) | Avant-plan de l'icône adaptative Android (fond rouge `#E4002B`) |
| `splash-icon.png` (1024²) | Écran de démarrage (centré, fond blanc) |
| `favicon.png` | Favicon web |

Ils sont générés à partir de SVG (carré rouge + glyphe « livre » blanc, la marque Lectura).
Pour les régénérer après modification, adaptez le script `scripts/gen-assets.js` (voir plus bas)
ou remplacez simplement les PNG.

## Builds natifs avec EAS

La configuration [`eas.json`](eas.json) définit trois profils : `development` (avec dev-client),
`preview` (APK Android / build simulateur iOS, distribution interne) et `production`.

```bash
npm install -g eas-cli          # une seule fois
eas login                       # votre compte Expo
eas init                        # crée le projet EAS et renseigne extra.eas.projectId

# Builds
eas build --profile preview --platform android      # APK à installer directement
eas build --profile preview --platform ios          # build simulateur
eas build --profile production --platform all        # binaires stores

# Publication OTA (mises à jour sans rebuild), si vous ajoutez expo-updates
# eas update --branch production
```

> `eas init` ajoute automatiquement `extra.eas.projectId` dans `app.json` : c'est cet identifiant
> qui relie le projet local à votre compte Expo. Les identifiants d'app sont déjà définis
> (`com.lectura.app` pour iOS et Android) ; changez-les si besoin avant le premier build.

## Architecture

```
App.js                      Providers (SafeArea, contexte, navigation)
index.js                    Point d'entrée Expo
src/config.js               Clés Supabase (vide = mode local)
src/theme.js                Couleurs, thèmes de lecture, polices, marges
src/data.js                 Données de démonstration
src/lib/
  db.js                     Façade : Supabase ou stockage local
  supabaseStore.js          Implémentation Supabase (Auth, tables, Storage)
  localStore.js             Implémentation locale (AsyncStorage)
  audio.js                  Moteur audio (expo-speech)
  store.js                  Contexte React (état global + actions)
  books.js / util.js / storage.js
src/components/             Cover, Stars, Chip, Button, Avatar, Fab…
src/screens/                Auth, Home, Explore, Community, Library, Profile,
                            Book, Reader, Upload
src/navigation/             Onglets + pile de navigation
```

La couche `db` choisit automatiquement Supabase ou le stockage local selon `config.js` :
la même logique métier fonctionne dans les deux cas.

## Notes

- L'affichage **PDF** utilise `react-native-webview`. Le rendu natif d'un PDF est fiable sur
  iOS ; sur Android, un PDF distant peut nécessiter un visualiseur. La lecture **texte** (avec
  tous les réglages) et l'**audio** fonctionnent partout.
- La progression de lecture, les favoris, les recherches récentes et les préférences de lecture
  sont conservés sur l'appareil (AsyncStorage).
