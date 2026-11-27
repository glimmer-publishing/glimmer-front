import { activeDiscountProjection } from "@/shared/api/sanity/fragments";

/* Only the primary genre's name, for the Google Merchant feed. */
const genreTitleProjection = `
    "genreTitle": genres[0]->name`;

/* Books with a cover in category $categorySlug, for the feed at /api/feed. */
export const allProductsForFeedQuery = `
*[_type == "product" && defined(gallery[0]) && category->slug.current == $categorySlug]{
  "id": sku,
  "slug": slug.current,
  title,
  "description": coalesce(description, title),
  price,
  ${activeDiscountProjection},
  status,
  preOrderShippingDate,
  "mainImage": gallery[0].asset->url,
  "categorySlug": category->slug.current,
  "categoryTitle": category->title,
  ${genreTitleProjection},
  features[]{
    "featureName": feature->name,
    value
  }
}
`;
