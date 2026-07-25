// Fusionne les livres de l'utilisateur (déjà téléchargés/ajoutés) avec le
// catalogue de découverte (Project Gutenberg), sans doublons.
export function allBooks(customBooks, catalog) {
  const own = customBooks || [];
  const cat = (catalog || []).filter((c) => !own.some((b) => b.id === c.id));
  return own.concat(cat);
}

export function getBook(customBooks, catalog, id) {
  return allBooks(customBooks, catalog).find((b) => b.id === id);
}

export function reviewsFor(reviewsByBook, book) {
  return (reviewsByBook[book.id] || []).concat(book.reviews || []);
}

export function bookRating(reviewsByBook, book) {
  const r = reviewsFor(reviewsByBook, book);
  if (book.rating) return book.rating;
  return r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : 0;
}
