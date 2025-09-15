import Container from "../shared/container/Container";
import PageTitle from "../shared/titles/PageTitle";
import SectionDescription from "../shared/sectionDescription/SectionDescription";

export default function AboutHero() {
  return (
    <Container className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-8 lg:mb-12">
      <PageTitle>Про нас</PageTitle>
      <SectionDescription className="lg:max-w-[363px]">
        Знайомся із Glimmer — новим українським видавництвом. Ми створюємо
        світи, які говорять від серця до серця.
      </SectionDescription>
    </Container>
  );
}
