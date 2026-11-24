import { Suspense } from "react";
import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import Container from "@/shared/ui/container/Container";
import Loader from "@/shared/ui/loader/Loader";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import SectionDescription from "@/shared/ui/section-description/SectionDescription";
import PageTitle from "@/shared/ui/titles/PageTitle";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import FavoritesListing from "./FavoritesListing";

const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Обрані товари", href: "/favorites" },
];

/**
 * The favorites page: a static heading, then the listing loaded in the
 * browser, since the saved slugs exist only there.
 */
export default function FavoritesView() {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <section className="pb-8 lg:pb-10">
        <Container>
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-8 lg:mb-12">
            <PageTitle>Обрані товари</PageTitle>
            <SectionDescription className="lg:max-w-[363px]">
              Твій список бажань — усе, що зацікавило, в одному місці.
            </SectionDescription>
          </div>
        </Container>
        {/* useSearchParams needs a boundary on a static page. */}
        <Suspense fallback={<Loader className="h-[460px] lg:h-[580px]" />}>
          <FavoritesListing />
        </Suspense>
      </section>
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
