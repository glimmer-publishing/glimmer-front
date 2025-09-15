import { Review } from "@/types/review";

export function getAverageRating(reviews: Review[]): number {
  if (!reviews?.length) return 0;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;

  return Math.round(average * 10) / 10;
}
