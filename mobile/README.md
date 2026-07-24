# Lectura — application mobile (React Native / Expo)

Version mobile native de Lectura, construite avec **Expo** (React Native). Elle reprend le
design de l'app web (liseuse premium, accent rouge, navigation par onglets) et les mêmes
fonctionnalités, avec le même backend **Supabase** (et un repli local hors-ligne).

## Prérequis

- Node.js 18+ et npm
- L'application **Expo Go** sur votre téléphone (iOS App Store / Google Play), **ou** un
  simulateur iOS (Xcode) / émulateur Android (Android Studio)

## Lancer

```bash
cd mobile
npm install            # ou: npx expo install   (résout les versions natives)
npx expo start
```

Puis scannez le QR code avec **Expo Go** (Android) ou l'app Appareil photo (iOS), ou appuyez
sur `i` (simulateur iOS) / `a` (émulateur Android) dans le terminal.

> Si `npm install` signale des incompatibilités de versions natives, lancez
> `npx expo install --fix` pour les aligner sur la version d'Expo installée.

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
