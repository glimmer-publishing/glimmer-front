import RecommendedProducts from "@/components/productPage/recommendedProducts/RecommendedProducts";
import ReviewedProducts from "@/components/productPage/reviewedProducts/ReviewedProducts";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import { notFound } from "next/navigation";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { productBySlugQuery } from "@/lib/queries";
import ProductInfo from "@/components/productPage/productInfo/ProductInfo";
import type { Metadata } from "next";
import { getDefaultMetadata } from "@/utils/getDefaultMetadata";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import { getProductGenreSlugs } from "@/utils/getProductGenreSlugs";
import { sanityImageUrl } from "@/utils/sanityImage";

interface ProductPageProps {
  params: Promise<{ category: string; product: string }>;
}

/* No paths at build time, but declaring the function makes the route ISR:
   each book is rendered on its first visit and then served from cache until
   /api/revalidate or the hourly fallback invalidates it. */
export function generateStaticParams(): { category: string; product: string }[] {
  return [];
}

/* Shared by generateMetadata and the page; Next dedupes the identical cached
   fetch within one render. Throws on a Sanity error, so a failed rebuild
   keeps the cached page rather than caching a 404. */
const getProduct = (productSlug: string) =>
  fetchSanityDataServer(productBySlugQuery, { productSlug });

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { product } = await params;

  const currentProduct = await getProduct(product);

  if (!currentProduct) return getDefaultMetadata();

  const currentPrice =
    currentProduct.discountPrice &&
    currentProduct.discountPrice < currentProduct.price
      ? currentProduct.discountPrice
      : currentProduct.price;

  return {
    title: `${currentProduct.title}, ${currentProduct.author}. Купити книгу за ${currentPrice} грн`,
    description:
      currentProduct?.description || getDefaultMetadata().description,
    openGraph: {
      images: [
        // A sized copy of the cover, with no declared size (covers are
        // portrait); the site-wide fallback's real size is declared.
        currentProduct?.mainImage
          ? {
              url: sanityImageUrl(currentProduct.mainImage, { width: 1200 }),
              alt: "Glimmer",
            }
          : {
              url: "/opengraph-image.jpg",
              width: 1200,
              height: 638,
              alt: "Glimmer",
            },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product } = await params;

  const currentProduct = await getProduct(product);

  if (!currentProduct) {
    notFound();
  }

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
