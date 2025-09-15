export interface Category {
  id: string;
  title: string;
  slug: string;
  order: number;
  genres?: { title: string; slug: string }[];
}
