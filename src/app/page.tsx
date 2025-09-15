import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { homepageCombinedQuery } from "@/lib/queries";
import Instagram from "@/components/shared/instagram/Instagram";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";
import Bestsellers from "@/components/homePage/bestsellers/Bestsellers";
import PromotionalProducts from "@/components/homePage/promotionalProducts/PromotionalProducts";
import NewProducts from "@/components/homePage/newProducts/NewProducts";
import { Product } from "@/types/product";
import PromoBanner from "@/components/homePage/promoBanner/PromoBanner";
import { HomepageBanner } from "@/types/promoBanner";
import Container from "@/components/shared/container/Container";
import Hero from "@/components/homePage/hero/Hero";
import Genres from "@/components/homePage/genres/Genres";
import { Genre } from "@/types/genre";

export default async function HomePage() {
  const homePageData = await fetchSanityDataServer(homepageCombinedQuery);
  const allInstagramPosts = homePageData?.instagram;
  const allProducts = homePageData?.products;
  const heroBanners = homePageData?.heroBanners;
  const homePageBanners = homePageData?.homepageBanners;

  const genres = homePageData?.genres;

  const sortedGenres = genres
    ?.slice()
    .sort((a: Genre, b: Genre) => a.order - b.order);

  const promoBannerFirst = homePageBanners?.find(
    (banner: HomepageBanner) => banner.order === 1
  );

  const promoBannerSecond = homePageBanners?.find(
    (banner: HomepageBanner) => banner.order === 2
  );

  const bestsellers = allProducts?.filter(
    (product: Product) => product.isBestseller
  );

  const promotionalProducts = allProducts?.filter(
    (product: Product) => product.discountPrice
  );

  const newProducts = allProducts?.filter((product: Product) => product.isNew);

  return (
    <>
      <Hero banners={heroBanners} />
      <MarqueeLine />
      <Suspense fallback={<Loader />}>
        <Genres genres={sortedGenres} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Bestsellers bestsellers={bestsellers} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <PromotionalProducts promotionalProducts={promotionalProducts} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Container className="md:flex gap-4 py-8 lg:py-10">
          <PromoBanner banner={promoBannerFirst} idx="first" />
          <PromoBanner
            banner={promoBannerSecond}
            className="hidden md:block"
            idx="second"
          />
        </Container>
      </Suspense>
      <Suspense fallback={<Loader />}>
        <NewProducts newProducts={newProducts} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Container className="md:hidden py-8">
          <PromoBanner banner={promoBannerSecond} idx="second" />
        </Container>
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Instagram instagramPosts={allInstagramPosts?.posts} />
      </Suspense>
      <MarqueeLine />
      <TelegramCTA />
    </>
  );
}
