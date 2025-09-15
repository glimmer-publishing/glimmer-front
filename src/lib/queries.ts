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
    sku,
     preOrderShippingDate,
    features[] {
      "featureName": feature->name,
      value
    },
    "reviews": reviews[] {
      author,
      rating,
      text
    },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    "genreSlug": genre->slug.current,
    "genreTitle": genre->name
  }
}
`;

export const homepageCombinedQuery = `{
  "heroBanners": *[_type == "heroBanner"] | order(order asc) {
    title,
    description,
    "image": image.asset->url,
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
    "genreSlug": genre->slug.current,
    "genreTitle": genre->name
  },
  "genres": *[_type == "genre"] | order(order asc) {
    name,
    "slug": slug.current,
    order,
    "image": image.asset->url
  },
  "instagram": *[_type == "instagram"][0]{
    "posts": posts[] {
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
    sku,
    preOrderShippingDate,
    features[]{
      "featureName": feature->name,
      value
    },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    "genreSlug": genre->slug.current,
    "genreTitle": genre->title
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
    "products": *[
      _type == "product" && references(^._id)
    ]{
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
      sku,
      preOrderShippingDate,
      features[]{
      "featureName": feature->name,
      value
      },
      "genreSlug": genre->slug.current,
      "categorySlug": category->slug.current,
    }
  },
  "catalogBanner": *[
    _type == "homepageBanner" && showOnCatalog == true
  ][0]  {
  "imageCatalog": imageCatalog.asset->url,
  link,
  },
  "allProducts": *[
    _type == "product" && references(^._id)
  ]{
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
    sku,
    preOrderShippingDate,
    features[]{
      "featureName": feature->name,
      value
    },
    "genreSlug": genre->slug.current,
    "categorySlug": category->slug.current,
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
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    "genreSlug": genre->slug.current,
    "genreTitle": genre->name,
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
    }
  }
`;

export const allRecommendedProductsQuery = `
  *[_type == "product" && genre->slug.current == $genreSlug && slug.current != $currentSlug]{
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
    sku,
    features[]{
      "featureName": feature->name,
      value
    },
    "categorySlug": category->slug.current,
    "categoryTitle": category->title,
    "genreSlug": genre->slug.current,
    "genreTitle": genre->title
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

export const productsByIds = `*[_type == "product" && _id in $ids]{
  "id":_id,
  price,
  discountPrice,
  status,
 }`;
