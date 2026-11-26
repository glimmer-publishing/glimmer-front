import Container from "@/shared/ui/container/Container";
import Section from "@/shared/ui/section/Section";
import SectionDescription from "@/shared/ui/section-description/SectionDescription";
import SectionTitle from "@/shared/ui/titles/SectionTitle";
import type { Product } from "@/entities/product/model/product";
import ProductSlider from "./ProductSlider";

interface ProductSliderSectionProps {
  /* Section heading. */
  title: string;
  /* Text beside the heading on desktop, below it on mobile; home only. */
  description?: string;
  /* The cards; the section is not rendered without any. */
  products: Product[];
  /* Swiper class; globals.css styles each slider by it. */
  swiperClassName: string;
}

/**
 * A section of product cards: heading (with a description on home), then
 * the slider. Used for every product row on home and below a book.
 */
export default function ProductSliderSection({
  title,
  description,
  products,
  swiperClassName,
}: ProductSliderSectionProps) {
  if (!products.length) return null;

  return (
    <Section>
      <Container>
        {!!description && (
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-6 lg:mb-12">
            <SectionTitle>{title}</SectionTitle>
            <SectionDescription>{description}</SectionDescription>
          </div>
        )}
        {!description && (
          <SectionTitle className="mb-6 lg:mb-12">{title}</SectionTitle>
        )}
        <ProductSlider products={products} swiperClassName={swiperClassName} />
      </Container>
    </Section>
  );
}
