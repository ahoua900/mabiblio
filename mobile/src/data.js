export const languages = ['Français', 'English', 'Español', 'Deutsch', 'العربية', '中文'];
export const genres = ['Roman', 'Bande dessinée', 'Essai', 'Scolaire'];
export const ages = ['Enfants', 'Jeunesse', 'Adultes'];

export const LANG_CODES = {
  'Français': 'fr-FR', 'English': 'en-US', 'Español': 'es-ES',
  'Deutsch': 'de-DE', 'العربية': 'ar-SA', '中文': 'zh-CN',
};

export const seedBooks = [
  { id: 'b1', title: "L'Enfant et la Rivière", author: 'Nadia Fontaine', genre: 'Roman', age: 'Jeunesse', color: '#B0413E', rating: 4.5, language: 'Français', pageCount: 6, summaryFull: "Un jeune garçon découvre les secrets de son village au fil de l'eau. Entre amitié et courage, ce roman tendre parle de grandir et de laisser aller.", reviews: [{ id: 1, user: 'Camille R.', initial: 'C', rating: 5, comment: "Une écriture délicate, parfaite à lire à voix haute avec mes enfants.", date: 'il y a 3 jours' }] },
  { id: 'b2', title: 'Les Carnets de Mona', author: 'Julien Perrot', genre: 'Bande dessinée', age: 'Enfants', color: '#C97A1B', rating: 4.8, language: 'Français', pageCount: 5, summaryFull: "Mona explore son quartier et invente mille histoires. Une bande dessinée pétillante, pensée pour être lue et relue en famille.", reviews: [] },
  { id: 'b3', title: 'Petite Philosophie du Quotidien', author: 'Claire Dubosc', genre: 'Essai', age: 'Adultes', color: '#1F7A4D', rating: 4.2, language: 'Français', pageCount: 8, summaryFull: "De courts essais pour penser le quotidien autrement. Claire Dubosc questionne nos habitudes avec clarté et une pointe d'humour.", reviews: [{ id: 2, user: 'Antoine M.', initial: 'A', rating: 4, comment: "Des chapitres courts, parfaits pour l'écoute pendant les trajets.", date: 'il y a 1 semaine' }, { id: 3, user: 'Léa P.', initial: 'L', rating: 4, comment: "« Le bonheur se cache dans la répétition des petites choses. » Cette phrase m'a marquée.", date: 'il y a 2 semaines' }] },
  { id: 'b4', title: 'Mathématiques Faciles — 6e', author: "Ministère de l'Éducation", genre: 'Scolaire', age: 'Jeunesse', color: '#5B4A9E', rating: 3.9, language: 'Français', pageCount: 10, summaryFull: "Manuel de mathématiques pour la classe de sixième, avec exercices corrigés et rappels de cours illustrés.", reviews: [] },
  { id: 'b5', title: 'Le Dragon Timide', author: 'Sofia Lenoir', genre: 'Bande dessinée', age: 'Enfants', color: '#1E7F8C', rating: 4.9, language: 'Français', pageCount: 4, summaryFull: "Un petit dragon qui a peur de son propre feu apprend à s'accepter grâce à ses amis de la forêt.", reviews: [] },
  { id: 'b6', title: 'Un Été à Marrakech', author: 'Karim Belhadj', genre: 'Roman', age: 'Adultes', color: '#994488', rating: 4.4, language: 'Français', pageCount: 9, summaryFull: "Une famille se retrouve le temps d'un été marocain, entre souvenirs, secrets et retrouvailles inattendues.", reviews: [{ id: 4, user: 'Nadia F.', initial: 'N', rating: 5, comment: "Dépaysant et chaleureux, un roman que j'ai adoré partager en famille.", date: 'il y a 4 jours' }] },
  { id: 'b7', title: 'Sciences Naturelles Illustrées', author: 'Léa Moreau', genre: 'Scolaire', age: 'Enfants', color: '#2F7D63', rating: 4.1, language: 'Français', pageCount: 7, summaryFull: "Découvrir la nature à travers des illustrations simples et un vocabulaire adapté aux plus jeunes.", reviews: [] },
  { id: 'b8', title: 'Réflexions sur le Temps', author: 'Antoine Marchal', genre: 'Essai', age: 'Adultes', color: '#4A5568', rating: 4.6, language: 'Français', pageCount: 11, summaryFull: "Un essai sur notre rapport moderne au temps qui passe, entre urgence permanente et besoin de ralentir.", reviews: [] },
];

export const communityFeed = [
  { id: 1, user: 'Sarah K.', initial: 'S', action: 'a noté', book: 'Le Dragon Timide', rating: 5, text: "Mes enfants l'adorent, parfait pour le soir en version audio.", time: 'il y a 2h', type: 'Avis' },
  { id: 2, user: 'Marc T.', initial: 'M', action: 'a partagé une citation de', book: 'Petite Philosophie du Quotidien', rating: 0, text: "« Le bonheur se cache dans la répétition des petites choses. »", time: 'il y a 5h', type: 'Citations' },
  { id: 3, user: 'Inès B.', initial: 'I', action: 'a noté', book: 'Un Été à Marrakech', rating: 5, text: "Une très belle découverte, l'écoute audio est parfaite pour les trajets.", time: 'il y a 1 jour', type: 'Avis' },
  { id: 4, user: 'Hugo D.', initial: 'H', action: 'a commenté', book: "L'Enfant et la Rivière", rating: 4, text: "Idéal pour découvrir la lecture audio avec mes élèves de CM1.", time: 'il y a 2 jours', type: 'Avis' },
  { id: 5, user: 'Yasmine C.', initial: 'Y', action: 'a partagé une citation de', book: 'Réflexions sur le Temps', rating: 0, text: "« Ralentir n'est pas renoncer, c'est choisir ce qui compte. »", time: 'il y a 3 jours', type: 'Citations' },
  { id: 6, user: 'Paul V.', initial: 'P', action: 'a noté', book: 'Les Carnets de Mona', rating: 5, text: "Ma fille de 6 ans redemande cette BD chaque soir.", time: 'il y a 4 jours', type: 'Avis' },
];
