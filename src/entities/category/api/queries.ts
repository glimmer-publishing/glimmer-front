import {
  activeDiscountProjection,
  genresProjection,
} from "@/shared/api/sanity/fragments";

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
      ${activeDiscountProjection},
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
    ${activeDiscountProjection},
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
