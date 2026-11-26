import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import type { ProductViewData } from "../api/loadProductView";
import ProductInfo from "./ProductInfo";
import ProductSliderSection from "@/widgets/products/ui/ProductSliderSection";
import ReviewedProducts from "./ReviewedProducts";

/**
 * The product page: the book, recommendations, and the books viewed before
 * it.
 */
export default function ProductView({
  product,
  crumbs,
  recommended,
}: ProductViewData) {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <ProductInfo currentProduct={product} />
      <ProductSliderSection
        title="Рекомендовані"
        products={recommended}
        swiperClassName="recommendedProducts"
      />
      <ReviewedProducts currentSlug={product.slug} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
