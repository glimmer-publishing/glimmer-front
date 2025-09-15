import Container from "@/components/shared/container/Container";
import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import SectionDescription from "@/components/shared/sectionDescription/SectionDescription";
import PromotionalProductsSlider from "./PromotionalProductsSlider";
import { Product } from "@/types/product";

interface PromotionalProductsProps {
  promotionalProducts: Product[];
}

export default function PromotionalProducts({
  promotionalProducts,
}: PromotionalProductsProps) {
  if (!promotionalProducts || !promotionalProducts?.length) return null;

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-6 lg:mb-12">
          <SectionTitle>Акційні товари</SectionTitle>
          <SectionDescription>
            Обмежена кількість примірників — встигни замовити за зниженою ціною.
          </SectionDescription>
        </div>
        <PromotionalProductsSlider promotionalProducts={promotionalProducts} />
      </Container>
    </Section>
  );
}
