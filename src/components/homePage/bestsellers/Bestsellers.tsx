import Container from "@/components/shared/container/Container";
import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import SectionDescription from "@/components/shared/sectionDescription/SectionDescription";
import { Product } from "@/types/product";
import BestsellersSlider from "./BestsellersSlider";

interface BestsellersProps {
  bestsellers: Product[];
}

export default function Bestsellers({ bestsellers }: BestsellersProps) {
  if (!bestsellers || !bestsellers?.length) return null;

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-6 lg:mb-12">
          <SectionTitle>Топ продажів</SectionTitle>
          <SectionDescription>
            Наші улюбленці — і твої теж. Ці товари обирають найчастіше, бо вони
            справді особливі.
          </SectionDescription>
        </div>
        <BestsellersSlider bestsellers={bestsellers} />
      </Container>
    </Section>
  );
}
