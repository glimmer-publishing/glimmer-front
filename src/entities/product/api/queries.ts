import {
  activeDiscountFilter,
  activeDiscountProjection,
  genresProjection,
} from "@/shared/api/sanity/fragments";

export const allDiscountedProductsQuery = `
{
  "allProducts": *[_type == "product" && ${activeDiscountFilter}]{
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    ${activeDiscountProjection},
    "mainImage": gallery[0].asset->url,
    status,
    isBestseller,
    isNew,
    isNationalCashback,
    sku,
    preOrderShippingDate,
    features[]{
      "featureName": feature->name,
      value
    },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    ${genresProjection}
  },
  "catalogBanner": *[
    _type == "homepageBanner" && showOnCatalog == true
  ][0]{
    "imageCatalog": imageCatalog.asset->url,
    link
  }
}
`;

/**
 * Whole catalog — books and stationery together, for /catalog/all.
 * Keeps the same card projection as the category query, `reviews` included, so
 * the default "за рейтингом" sort actually has data to work with.
 */
export const allProductsQuery = `
{
  "allProducts": *[_type == "product"]{
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    ${activeDiscountProjection},
    "mainImage": gallery[0].asset->url,
    status,
    isBestseller,
    isNew,
    isNationalCashback,
    sku,
    preOrderShippingDate,
    features[]{
      "featureName": feature->name,
      value
    },
    "reviews": reviews[]{
      author,
      rating,
      text
    },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    ${genresProjection}
  },
  "catalogBanner": *[
    _type == "homepageBanner" && showOnCatalog == true
  ][0]{
    "imageCatalog": imageCatalog.asset->url,
    link
  }
}
`;

/**
 * Card projection for the author and series listings. `features` is needed by
 * the series page to sort by position in series.
 */
const listingCardProjection = `{
  "id": _id,
  "slug": slug.current,
  title,
  author,
  price,
  ${activeDiscountProjection},
  "mainImage": gallery[0].asset->url,
  status,
  isBestseller,
  isNew,
  isNationalCashback,
  sku,
  preOrderShippingDate,
  features[]{
    "featureName": feature->name,
    value
  },
  "reviews": reviews[]{
    author,
    rating,
    text
  },
  "categorySlug": category->slug.current,
  "categoryTitle": category->title,
  ${genresProjection}
}`;

export const productsByAuthorQuery = `
*[_type == "product" && author == $authorName] | order(title asc) ${listingCardProjection}
`;

/**
 * Series is a "Серія" characteristic row, not a field - see
 * src/utils/getSeriesInfo.ts. Pass SERIES_FEATURE as $seriesFeature.
 */
export const productsBySeriesQuery = `
*[
  _type == "product" &&
  count(features[feature->name == $seriesFeature && value == $seriesName]) > 0
] | order(title asc) ${listingCardProjection}
`;
