import Container from "../shared/container/Container";
import PageTitle from "../shared/titles/PageTitle";
import SectionDescription from "../shared/sectionDescription/SectionDescription";
import CheckoutFormWithNotifications from "./CheckoutFormWithNotifications";
export default function Checkout() {
  return (
    <section className="lg:pb-10">
      <Container>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-8 lg:mb-12">
          <PageTitle>Оформлення замовлення</PageTitle>
          <SectionDescription className="lg:max-w-[440px]">
            Заповни необхідну інформацію, і вже скоро твої книжки будуть у
            дорозі!
          </SectionDescription>
        </div>
        <CheckoutFormWithNotifications />
      </Container>
    </section>
  );
}
