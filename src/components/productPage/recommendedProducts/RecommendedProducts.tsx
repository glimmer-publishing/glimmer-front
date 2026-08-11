import { Suspense } from "react";
import Container from "../../shared/container/Container";
import SectionTitle from "../../shared/titles/SectionTitle";
import Loader from "../../shared/loader/Loader";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import {
  allRecommendedProductsQuery,
  productManualRecommendationsQuery,
  type ManualRecommendationsResult,
} from "@/lib/queries";
import { mergeRecommendedProducts } from "@/utils/mergeRecommendedProducts";
import { Product } from "@/types/product";
import RecommendedSlider from "./RecommendedSlider";

interface RecommendedProductsProps {
  currentSlug: string;
  genreSlugs: string[];
}

export default async function RecommendedProducts({
  currentSlug,
  genreSlugs,
}: RecommendedProductsProps) {
  const [genreBasedProducts, manualResult]: [
    Product[] | undefined,
    ManualRecommendationsResult | undefined,
  ] = await Promise.all([
    fetchSanityDataServer(allRecommendedProductsQuery, {
      genreSlugs,
      currentSlug,
    }),
    fetchSanityDataServer(productManualRecommendationsQuery, { currentSlug }),
  ]);

  const recommendedProducts = mergeRecommendedProducts(
    manualResult?.manualRecommendations,
    genreBasedProducts
  );

  if (!recommendedProducts.length) return null;

  return (
    <section className="py-8 lg:py-10">
      <Container>
        <SectionTitle className="mb-6 lg:mb-12">Рекомендовані</SectionTitle>
        <Suspense fallback={<Loader />}>
          <RecommendedSlider recommendedProducts={recommendedProducts} />
        </Suspense>
      </Container>
    </section>
  );
}
