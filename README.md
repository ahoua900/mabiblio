# Lectura — Bibliothèque audio

Application web d'une bibliothèque de livres numériques : catalogue, lecture PDF réelle,
écoute audio par **synthèse vocale**, avis, communauté, ajout de livres et **comptes utilisateurs**.
Interface en français.

Implémentation de la maquette Claude Design **Bibliotheque.dc.html**
([projet](https://claude.ai/design/p/47d68eb0-5669-42ec-a66f-c29e14c851f4?file=Bibliotheque.dc.html)),
étendue avec un vrai backend **Supabase** (avec repli local hors-ligne).

## Lancer

Ouvrez `index.html` dans un navigateur — l'application démarre immédiatement en **mode local**
(comptes, livres, avis et PDF stockés dans le navigateur). Aucun build n'est requis.

> Pour utiliser Supabase et la synthèse vocale de façon fiable, servez le dossier via un petit
> serveur statique plutôt qu'en `file://` :
> `python3 -m http.server` puis ouvrez http://localhost:8000

## Ce qui est réellement dynamique

| Domaine | Fonctionnement |
|---|---|
| **Recherche** | Filtre le catalogue par titre / auteur, en direct, combinée aux filtres genre / âge |
| **Comptes** | Inscription / connexion / déconnexion (Supabase Auth, ou comptes locaux en mode hors-ligne) |
| **Persistance** | Livres ajoutés et avis **survivent au rechargement** (Supabase, sinon localStorage + IndexedDB) |
| **Audio** | Lecture **réelle** par synthèse vocale du navigateur (`SpeechSynthesis`) : voix, vitesse, langue |
| **PDF** | Les livres uploadés sont **réellement affichés** (visionneuse PDF intégrée) et stockés |
| **Profil** | Statistiques calculées : livres ouverts, avis écrits, temps d'écoute cumulé, historique |
| **Communauté** | Fil filtrable (Tous / Avis / Citations) |

### Encore simulé
- **Traduction** : l'option est présente mais la traduction automatique n'est pas encore branchée
  (emplacement prévu — voir « Étapes suivantes »).
- Les livres du catalogue de démonstration (`b1`…`b8`) n'ont pas de vrai PDF : ils s'ouvrent dans
  le lecteur texte paginé. Seuls les livres **uploadés** ouvrent la visionneuse PDF.

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
`config.js`. Ajouter d'autres backends ou brancher la traduction revient à compléter cette couche.

## Étapes suivantes possibles

- **Traduction réelle** : Edge Function Supabase appelant un service (DeepL, Google Traduction…),
  la clé restant côté serveur. L'emplacement côté données est déjà prévu (`translate`,
  `target_language`).
- Suivi de progression de lecture côté serveur (table dédiée) plutôt qu'en localStorage.
- Confirmation d'email / réinitialisation de mot de passe via Supabase Auth.
