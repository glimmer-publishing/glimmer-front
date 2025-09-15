import Container from "../shared/container/Container";
import PageTitle from "../shared/titles/PageTitle";
import SectionDescription from "../shared/sectionDescription/SectionDescription";
import FavoritesList from "./FavoritesList";

export default function Favorites() {
  return (
    <section className="pb-8 lg:pb-10">
      <Container>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-8 lg:mb-12">
          <PageTitle>Обрані товари</PageTitle>
          <SectionDescription className="lg:max-w-[363px]">
            Твій список бажань — усе, що зацікавило, в одному місці.
          </SectionDescription>
        </div>
      </Container>
      <FavoritesList />
    </section>
  );
}
