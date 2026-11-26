import Container from "@/shared/ui/container/Container";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import Instagram from "@/widgets/instagram/ui/Instagram";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import type { HomeViewData } from "../api/loadHomeView";
import Genres from "./Genres";
import Hero from "./Hero";
import PromoBanner from "./PromoBanner";
import ProductSliderSection from "@/widgets/products/ui/ProductSliderSection";

/**
 * The home page. The second promo banner is rendered twice, beside the
 * first from md and below the new products on mobile, one copy hidden by
 * CSS at each breakpoint. A banner missing in Studio is skipped, with its
 * row.
 */
export default function HomeView({
  heroBanners,
  genres,
  bestsellers,
  promotionalProducts,
  newProducts,
  promoBannerFirst,
  promoBannerSecond,
  instagramPosts,
}: HomeViewData) {
  return (
    <>
      <Hero banners={heroBanners} />
      <MarqueeLine />
      <Genres genres={genres} />
      <ProductSliderSection
        title="Топ продажів"
        description="Наші улюбленці — і твої теж. Ці товари обирають найчастіше, бо вони справді особливі."
        products={bestsellers}
        swiperClassName="bestsellers"
      />
      <ProductSliderSection
        title="Акційні товари"
        description="Обмежена кількість примірників — встигни замовити за зниженою ціною."
        products={promotionalProducts}
        swiperClassName="promotionalProducts"
      />
      {(!!promoBannerFirst || !!promoBannerSecond) && (
        <Container className="md:flex gap-4 py-8 lg:py-10">
          {!!promoBannerFirst && (
            <PromoBanner banner={promoBannerFirst} idx="first" />
          )}
          {!!promoBannerSecond && (
            <PromoBanner
              banner={promoBannerSecond}
              className="hidden md:block"
              idx="second"
            />
          )}
        </Container>
      )}
      <ProductSliderSection
        title="Наші новинки"
        description="Найсвіжіші новинки, які точно тобі потрібні!"
        products={newProducts}
        swiperClassName="newProducts"
      />
      {!!promoBannerSecond && (
        <Container className="md:hidden py-8">
          <PromoBanner banner={promoBannerSecond} idx="second" />
        </Container>
      )}
      <Instagram instagramPosts={instagramPosts} />
      <MarqueeLine />
      <TelegramCTA />
    </>
  );
}
