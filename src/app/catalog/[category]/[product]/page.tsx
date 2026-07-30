import RecommendedProducts from "@/components/productPage/recommendedProducts/RecommendedProducts";
import ReviewedProducts from "@/components/productPage/reviewedProducts/ReviewedProducts";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { productBySlugQuery } from "@/lib/queries";
import ProductInfo from "@/components/productPage/productInfo/ProductInfo";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/utils/getDefaultMetadata";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import { getProductGenreSlugs } from "@/utils/getProductGenreSlugs";

interface ProductPageProps {
  params: Promise<{ category: string; product: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { product } = await params;

  const currentProduct = await fetchSanityDataServer(productBySlugQuery, {
    productSlug: product,
  });

  const currentPrice =
    currentProduct?.discountPrice &&
    currentProduct?.discountPrice < currentProduct?.price
      ? currentProduct?.discountPrice
      : currentProduct?.price;

  return {
    title:
      `${currentProduct?.title}, ${currentProduct?.author}. Купити книгу за ${currentPrice} грн` ||
      getDefaultMetadata().title,
    description:
      currentProduct?.description || getDefaultMetadata().description,
    openGraph: {
      images: [
        {
          url: currentProduct?.mainImage || "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: "Glimmer",
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product } = await params;

  const currentProduct = await fetchSanityDataServer(productBySlugQuery, {
    productSlug: product,
  });

  if (!currentProduct) return null;

  const { categorySlug, categoryTitle, genreTitle, genreSlug, genres, title, slug } =
    currentProduct;

  // Build the category+genre label — omit the genre part when none is set
  const categoryCrumbLabel = genreTitle
    ? `${categoryTitle} - ${genreTitle}`
    : categoryTitle;

  // Build the category crumb href — only append subcategory when we have a slug
  const categoryCrumbHref = genreSlug
    ? `/catalog/${categorySlug}?subcategory=${genreSlug}`
    : `/catalog/${categorySlug}`;

  const crumbs = [
    { label: "Головна", href: "/" },
    { label: categoryCrumbLabel, href: categoryCrumbHref },
    { label: title, href: slug },
  ];

  // Collect all genre slugs for the "match any" recommendation query
  const genreSlugs = getProductGenreSlugs({ genres, genreSlug });

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <ProductInfo currentProduct={currentProduct} />
      <RecommendedProducts currentSlug={product} genreSlugs={genreSlugs} />
      <ReviewedProducts />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
