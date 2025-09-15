export interface CatalogItem {
  slug: string;
  title: string;
  genres?: { title: string; slug: string }[];
}
