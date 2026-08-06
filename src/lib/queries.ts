// ---------------------------------------------------------------------------
// Shared GROQ helpers
// ---------------------------------------------------------------------------

// Full genre projection for a product — reads `genres[]` (new field) and
// falls back to legacy `genre` (single ref) when `genres` is not yet set.
// Produces:
//   genres     → array of { slug, title }  (may be empty)
//   genreSlug  → primary genre slug        (null when no genre at all)
//   genreTitle → primary genre name        (null when no genre at all)
const genresProjection = `
    "genres": select(
      count(genres) > 0 => genres[]->{ "slug": slug.current, "title": name },
      defined(genre)    => [genre->{ "slug": slug.current, "title": name }],
      []
    ),
    "genreSlug": select(
      count(genres) > 0 => genres[0]->slug.current,
      defined(genre)    => genre->slug.current,
      null
    ),
    "genreTitle": select(
      count(genres) > 0 => genres[0]->name,
      defined(genre)    => genre->name,
      null
    )`;

// Slimmer variant when only genreTitle is needed (e.g. feed).
const genreTitleProjection = `
    "genreTitle": select(
      count(genres) > 0 => genres[0]->name,
      defined(genre)    => genre->name,
      null
    )`;

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
         (select(
           count(genres) > 0 => genres[]->slug.current,
           defined(genre)    => [genre->slug.current],
           []
         ))[@ in $genreSlugs]
       ) > 0
  ]{
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
    ${genresProjection}
  }
`;

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
