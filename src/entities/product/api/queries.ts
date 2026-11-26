import {
  activeDiscountFilter,
  activeDiscountProjection,
  genresProjection,
} from "@/shared/api/sanity/fragments";

/**
 * Products discounted today, with the catalog banner, for /catalog/discounted.
 */
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

/* Every book by $authorName, as listing cards. */
export const productsByAuthorQuery = `
*[_type == "product" && author == $authorName] | order(title asc) ${listingCardProjection}
`;

/**
 * Series is a "Серія" characteristic row, not a field - see
 * ../lib/getSeriesInfo.ts. Pass SERIES_FEATURE as $seriesFeature.
 */
export const productsBySeriesQuery = `
*[
  _type == "product" &&
  count(features[feature->name == $seriesFeature && value == $seriesName]) > 0
] | order(title asc) ${listingCardProjection}
`;

/**
 * Card projection for recommendation cards (genre-based matches and
 * manual recommendations).
 */
const recommendedProductCardProjection = `
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
    features[]{
      "featureName": feature->name,
      value
    },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    ${genresProjection}`;

/* One book with everything its product page shows. */
export const productBySlugQuery = `
  *[_type == "product" && slug.current == $productSlug][0]{
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
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    description,
    "gallery": gallery[].asset->url,
    "bookScreens": bookScreens[].asset->url,
    sku,
    preOrderShippingDate,
    features[]{
      "featureName": feature->name,
      value
    },
    "reviews": reviews[] | order(date desc){
      "author": name,
      rating,
      text,
      date
    },
    ${genresProjection}
  }
`;

/**
 * Accepts $genreSlugs (string[]) and $currentSlug (string). A product
 * matches if it shares at least one genre slug with the given list.
 */
export const allRecommendedProductsQuery = `
  *[_type == "product"
    && slug.current != $currentSlug
    && count(
         (genres[]->slug.current)[@ in $genreSlugs]
       ) > 0
  ]{
    ${recommendedProductCardProjection}
  }
`;

/**
 * Accepts $slugs (string[]) and returns one entry per matching product, so a
 * caller holding several products (the checkout cart) collects all their
 * curated picks in a single round trip. Kept separate from
 * `productBySlugQuery` so the product object stays small.
 *
 * GROQ does not preserve the order of `$slugs`, so callers that care about
 * ordering must reorder by slug themselves - see `orderManualRecommendations`.
 */
export const manualRecommendationsBySlugsQuery = `
  *[_type == "product" && slug.current in $slugs]{
    "slug": slug.current,
    "manualRecommendations": manualRecommendations[]->{
      ${recommendedProductCardProjection}
    }
  }
`;

/* Only the primary genre's name, for the Google Merchant feed. */
const genreTitleProjection = `
    "genreTitle": genres[0]->name`;

/* Books with a cover, for the Google Merchant feed at /api/feed. */
export const allProductsForFeedQuery = `
*[_type == "product" && defined(gallery[0]) && category->slug.current == "khudozhnya-literatura"]{
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

/* A product's name and code, for the Telegram review notification. */
export const productReferenceQuery = `*[_type == "product" && _id == $id][0]{
  title,
  author,
  sku
}`;
