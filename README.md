# Lectura — Bibliothèque audio

Application web **mobile-first** de bibliothèque de livres numériques : découverte, liseuse
avec réglages de lecture, lecture PDF réelle, écoute audio par **synthèse vocale**, favoris,
avis, communauté, ajout de livres et **comptes utilisateurs**. Interface en français.

Design original inspiré d'apps de lecture premium (liseuse type Kobo, découverte type librairie) :
fond clair épuré, accent rouge éditorial, typographie serif pour la lecture, navigation par
onglets en bas. Sur grand écran, l'app s'affiche centrée comme un téléphone.
Le backend est assuré par **Supabase** (avec repli local hors-ligne).

## Lancer

Ouvrez `index.html` dans un navigateur — l'application démarre immédiatement en **mode local**
(comptes, livres, avis et PDF stockés dans le navigateur). Aucun build n'est requis.

> Pour utiliser Supabase et la synthèse vocale de façon fiable, servez le dossier via un petit
> serveur statique plutôt qu'en `file://` :
> `python3 -m http.server` puis ouvrez http://localhost:8000

## Ce qui est réellement dynamique

| Domaine | Fonctionnement |
|---|---|
| **Découverte** | Accueil avec « Reprendre la lecture », tendances, catégories et nouveautés |
| **Recherche** | Filtre par titre / auteur / genre en direct, recherches récentes mémorisées, catégories |
| **Liseuse** | Réglages de lecture réels : tonalité (Clair / Sépia / Sombre / Charbon), taille et famille de police, marges — appliqués en direct ; barre de progression par page |
| **Audio** | Lecture **réelle** par synthèse vocale du navigateur (`SpeechSynthesis`) : voix, vitesse, langue |
| **PDF** | Les livres uploadés sont **réellement affichés** (visionneuse PDF intégrée) et stockés |
| **Favoris** | Bouton marque-page → « Ma liste », retrouvée dans la Bibliothèque, persistée |
| **Comptes** | Inscription / connexion / déconnexion (Supabase Auth, ou comptes locaux en mode hors-ligne) |
| **Persistance** | Livres ajoutés, avis et favoris **survivent au rechargement** (Supabase, sinon localStorage + IndexedDB) |
| **Profil** | Statistiques calculées : livres ouverts, avis écrits, temps d'écoute cumulé, historique |
| **Communauté** | Fil filtrable (Tous / Avis / Citations) |

### À noter
- Les livres du catalogue de démonstration (`b1`…`b8`) n'ont pas de vrai PDF : ils s'ouvrent dans
  le lecteur texte paginé. Seuls les livres **uploadés** ouvrent la visionneuse PDF.

## Version mobile (React Native / Expo)

Une application mobile native équivalente se trouve dans [`mobile/`](mobile/) : même design et
mêmes fonctionnalités (comptes Supabase, liseuse avec réglages de lecture, écoute audio via
`expo-speech`, ajout de PDF, favoris, avis). Voir [`mobile/README.md`](mobile/README.md) pour
l'installation et le lancement (`cd mobile && npm install && npx expo start`).

## Configurer Supabase

L'app fonctionne sans Supabase (mode local). Pour activer les comptes et la persistance côté serveur :

1. **Créer les tables** : dans votre projet Supabase → *SQL Editor*, exécutez le contenu de
   [`supabase/schema.sql`](supabase/schema.sql). Cela crée les tables `profiles`, `books`, `reviews`,
   le bucket de stockage `pdfs`, et les règles de sécurité (RLS).
2. **Renseigner les clés** : dans [`config.js`](config.js), collez l'`URL` du projet et la clé
   **anon public** (Dashboard → *Project Settings → API*). Ne mettez jamais la clé `service_role`.
3. Rechargez la page : la mention en bas de l'écran de connexion passe à « Connecté à Supabase ».

> Astuce : si vous ne voulez pas versionner vos clés, décommentez `config.js` dans `.gitignore`
> et gardez une copie locale du fichier.

## Structure du projet

```
index.html          Coquille HTML (styles + inclut config.js puis app.js)
config.js           URL + clé anon Supabase (vide = mode local)
app.js              Toute la logique : données, couche d'accès (db), Auth,
                    moteur audio, rendu et évènements
supabase/schema.sql Schéma SQL à exécuter dans Supabase (tables, RLS, storage)
```

La couche `db` (dans `app.js`) expose une API unique (`signIn`, `loadBooks`, `saveReview`,
`pdfUrl`, …) et choisit automatiquement l'implémentation **Supabase** ou **locale** selon
`config.js`. Ajouter d'autres backends revient à compléter cette couche.

## Étapes suivantes possibles

- Suivi de progression de lecture côté serveur (table dédiée) plutôt qu'en localStorage.
- Confirmation d'email / réinitialisation de mot de passe via Supabase Auth.
