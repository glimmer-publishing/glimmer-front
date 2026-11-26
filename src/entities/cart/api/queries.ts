import { activeDiscountProjection } from "@/shared/api/sanity/fragments";

/* The cart's products, priced with today's discount window. */
export const cartProductsQuery = `*[_type == "product" && _id in $ids]{
  "id": _id,
  "slug": slug.current,
  title,
  author,
  sku,
  price,
  ${activeDiscountProjection},
  status,
  preOrderShippingDate,
  isNationalCashback,
  "mainImage": gallery[0].asset->url,
  "categorySlug": category->slug.current,
  "categoryTitle": category->title,
  "publisher": features[lower(feature->name) == "видавництво"][0].value,
  "genreSlugs": coalesce(genres[]->slug.current, [])
}`;

/* A promo code, matched regardless of letter case. */
export const promocodeQuery = `*[_type == "promocode" && lower(code) == lower($code)][0]{
  code,
  discountPercent,
  expirationDate,
  "publishers": coalesce(publishers[]->name, [])
}`;
