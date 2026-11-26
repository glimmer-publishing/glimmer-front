import * as motion from "motion/react-client";
import type { ProductListing } from "@/entities/product/model/types";
import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import Container from "@/shared/ui/container/Container";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import { fadeInAnimation } from "@/shared/lib/animationVariants";
import ProductGrid from "@/widgets/products/ui/ProductGrid";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";

export interface CollectionViewProps {
  /* Heading and breadcrumb label, e.g. the author's name. */
  title: string;
  /* Path of the page; every dropdown and page link points to it. */
  pathname: string;
  /* The filtered, sorted current page of products. */
  listing: ProductListing;
}

/**
 * Products grouped by something other than a category, under a heading:
 * the author and series pages.
 */
export default function CollectionView({
  title,
  pathname,
  listing,
}: CollectionViewProps) {
  const crumbs = [
    { label: "Головна", href: "/" },
    { label: title, href: pathname },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <section className="pb-8 lg:pb-10">
        <Container>
          <motion.h1
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInAnimation({ y: 10 })}
            className="text-[22px] lg:text-[32px] font-semibold leading-[120%] mb-4 lg:mb-6"
          >
            {title}
          </motion.h1>
          <ProductGrid baseHref={pathname} listing={listing} />
        </Container>
      </section>
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
