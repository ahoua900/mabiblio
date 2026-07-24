import { seedBooks } from '../data';

export function allBooks(customBooks) {
  return seedBooks.concat(customBooks || []);
}

export function getBook(customBooks, id) {
  return allBooks(customBooks).find((b) => b.id === id);
}

export function reviewsFor(reviewsByBook, book) {
  return (reviewsByBook[book.id] || []).concat(book.reviews || []);
}

export function bookRating(reviewsByBook, book) {
  const r = reviewsFor(reviewsByBook, book);
  if (book.rating) return book.rating;
  return r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : 0;
}
