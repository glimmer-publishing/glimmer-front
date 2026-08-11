import { Product } from "@/types/product";

// ---------------------------------------------------------------------------
// Shared GROQ helpers
// ---------------------------------------------------------------------------

// Full genre projection for a product — reads `genres[]`, the only genre field
// on the product schema. The first entry is treated as the primary genre.
// Produces:
//   genres     → array of { slug, title }  (may be empty)
//   genreSlug  → primary genre slug        (null when no genre at all)
//   genreTitle → primary genre name        (null when no genre at all)
const genresProjection = `
    "genres": select(
      count(genres) > 0 => genres[]->{ "slug": slug.current, "title": name },
      []
    ),
    "genreSlug": genres[0]->slug.current,
    "genreTitle": genres[0]->name`;

// Slimmer variant when only genreTitle is needed (e.g. feed).
const genreTitleProjection = `
    "genreTitle": genres[0]->name`;

// Card projection reused wherever a product needs to render as a recommendation
// card (genre-based matches, manual recommendations).
const recommendedProductCardProjection = `
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    discountPrice,
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

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const allInstagramPostsQuery = `
  *[_type == "instagram"][0]{
    "posts": posts[]{
      "image": image.asset->url,
      "alt": image.alt,
      "url": url
    }
  }
`;

export const allCategoriesAndProductsQuery = `
{
  "categories": *[_type == "category"]{
    "id": _id,
    title,
    "slug": slug.current,
    order,
    genres[]-> | order(order asc){
      "title": name,
      "slug": slug.current,
      order
    }
  },
  "products": *[_type == "product"]{
    "slug": slug.current,
    title,
    author,
    price,
    discountPrice,
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
  }
}
`;

export const homepageCombinedQuery = `{
  "heroBanners": *[_type == "heroBanner"] | order(order asc) {
    title,
    description,
    "imageMob": imageMob.asset->url,
    "imageTab": imageTab.asset->url,
    "imageDesk": imageDesk.asset->url,
    button {
      label,
      link,
      position
    },
    order
  },
  "homepageBanners": *[_type == "homepageBanner"] | order(order asc) {
    "imageSmall": imageSmall.asset->url,
    "imageLarge": imageLarge.asset->url,
    "imageCatalog": imageCatalog.asset->url,
    link,
    showOnCatalog,
    order
  },
  "products": *[_type == "product"]{
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    discountPrice,
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
  "genres": *[_type == "genre"] | order(order asc) {
    name,
    "slug": slug.current,
    order,
    "image": image.asset->url
  },
  "instagram": *[_type == "instagram"][0]{
    "posts": posts[]{
      "image": image.asset->url,
      "alt": image.alt,
      "url": url
    }
  }
}`;

export const allDiscountedProductsQuery = `
{
  "allProducts": *[_type == "product" && defined(discountPrice)]{
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    discountPrice,
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

// Whole catalog — books and stationery together, for /catalog/all.
// Keeps the same card projection as the category query, `reviews` included, so
// the default "за рейтингом" sort actually has data to work with.
export const allProductsQuery = `
{
  "allProducts": *[_type == "product"]{
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    discountPrice,
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

export const allProductsByCategoryQuery = `
*[_type == "category" && slug.current == $categorySlug][0]{
  "categoryTitle": title,
  "categorySlug": slug.current,
  "genres": genres[]->{
    "genreTitle": name,
    "genreSlug": slug.current,
    "products": *[_type == "product" && references(^._id)]{
      "id": _id,
      title,
      author,
      "slug": slug.current,
      price,
      discountPrice,
      "mainImage": gallery[0].asset->url,
      "reviews": reviews[]{
        author,
        rating,
        text
      },
      status,
      preOrderShippingDate,
      isBestseller,
      isNew,
      isNationalCashback,
      sku,
      features[]{
        "featureName": feature->name,
        value
      },
      "categorySlug": category->slug.current,
      ${genresProjection}
    }
  },
  "catalogBanner": *[
    _type == "homepageBanner" && showOnCatalog == true
  ][0]{
    "imageCatalog": imageCatalog.asset->url,
    link
  },
  "allProducts": *[_type == "product" && references(^._id)]{
    "id": _id,
    title,
    author,
    "slug": slug.current,
    price,
    discountPrice,
    description,
    "mainImage": gallery[0].asset->url,
    "reviews": reviews[]{
      author,
      rating,
      text
    },
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
    ${genresProjection}
  }
}
`;

export const productBySlugQuery = `
  *[_type == "product" && slug.current == $productSlug][0]{
    "id": _id,
    "slug": slug.current,
    title,
    author,
    price,
    discountPrice,
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

// Accepts $genreSlugs (string[]) and $currentSlug (string).
// A product matches if it shares at least one genre slug with the given list.
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

// Accepts $slugs (string[]) and returns one entry per matching product, so a
// caller holding several products (the checkout cart) collects all their
// curated picks in a single round trip. Kept separate from `productBySlugQuery`
// so the resolved cards never ride along on the current product object — that
// object is persisted to the cart and reviewed-products stores.
//
// GROQ does not preserve the order of `$slugs`, so callers that care about
// ordering must reorder by slug themselves — see `orderManualRecommendations`.
export const manualRecommendationsBySlugsQuery = `
  *[_type == "product" && slug.current in $slugs]{
    "slug": slug.current,
    "manualRecommendations": manualRecommendations[]->{
      ${recommendedProductCardProjection}
    }
  }
`;

// Shape of one `manualRecommendationsBySlugsQuery` entry, kept next to the
// query so the projection aliases and the properties the components read stay
// tied together. Inner entries are null for picks that no longer resolve (the
// reference is weak, so the target can be removed).
export type ManualRecommendationsBySlug = {
  slug: string;
  manualRecommendations: Array<Product | null> | null;
};

export const promocodeByCodeQuery = `
  *[_type == "promocode" && code == $promocode][0]{
    "id": _id,
    code,
    discountPercent,
    expirationDate,
    "publishers": publishers[]->{
      "id": _id,
      name
    }
  }
`;

export const allProductsForFeedQuery = `
*[_type == "product" && defined(gallery[0]) && category->slug.current == "khudozhnya-literatura"]{
  "id": sku,
  "slug": slug.current,
  title,
  "description": coalesce(description, title),
  price,
  discountPrice,
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

export const productsByIds = `*[_type == "product" && _id in $ids]{
  "id": _id,
  price,
  discountPrice,
  status,
  preOrderShippingDate,
  isNationalCashback,
}`;

export const productsByAuthorQuery = `
*[_type == "product" && author == $authorName] | order(title asc) {
  "id": _id,
  "slug": slug.current,
  title,
  author,
  price,
  discountPrice,
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
}
`;
