# Lectura — Bibliothèque audio

Application web d'une bibliothèque de livres numériques avec lecture PDF, écoute audio
(voix de synthèse), avis, communauté et ajout de livres. Interface en français.

Implémentation de la maquette Claude Design **Bibliotheque.dc.html**
([projet](https://claude.ai/design/p/47d68eb0-5669-42ec-a66f-c29e14c851f4?file=Bibliotheque.dc.html)).

## Lancer

Ouvrez `index.html` dans un navigateur. Aucune dépendance, aucun build : l'application est
entièrement contenue dans ce fichier (HTML + JavaScript, sans framework ni CDN).

## Fonctionnalités

- **Catalogue** — grille de livres, filtres par genre et par tranche d'âge, champ de recherche.
- **Fiche livre** — couverture, note, résumé, boutons *Lire le PDF* / *Écouter* / *Ajouter à ma liste*,
  et section avis avec formulaire de notation (étoiles) + publication.
- **Lecteur** — mode *Texte* paginé et mode *Écoute* (lecture/pause, barre de progression animée,
  choix de la voix, de la vitesse et de la langue de lecture).
- **Ajouter un livre** — dépôt d'un PDF, métadonnées (titre, auteur, genre, âge, langue) et option
  de traduction ; le nouveau livre apparaît dans le catalogue.
- **Profil** — statistiques et historique de lecture avec progression.
- **Communauté** — fil d'activité filtrable (Tous / Avis / Citations).

## Structure

L'état de l'application (écran courant, filtres, livres ajoutés, avis, lecteur audio…) est géré
dans un objet `state` ; chaque action met à jour l'état et déclenche un rendu. Les données de
démonstration (livres, avis, fil communautaire) sont définies en tête du script.
