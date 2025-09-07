// data/landlord/reviews.js
const reviews = [
  { reviewer: 'Alice', rating: 4, comment: 'Great experience' },
  { reviewer: 'Bob', rating: 5, comment: 'Excellent landlord' },
  { reviewer: 'Charlie', rating: 3, comment: 'Average experience' },
];

// Calculate average rating
export const averageRating = 
  (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

export default reviews;
