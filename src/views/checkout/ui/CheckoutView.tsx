import CheckoutWithNotifications from "./CheckoutWithNotifications";
import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import Container from "@/shared/ui/container/Container";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import SectionDescription from "@/shared/ui/section-description/SectionDescription";
import PageTitle from "@/shared/ui/titles/PageTitle";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";

const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Оформлення замовлення", href: "/checkout" },
];

/**
 * The checkout page: a static heading, then the form, which reads the cart
 * from the browser and has the server price it.
 */
export default function CheckoutView() {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <section className="lg:pb-10">
        <Container>
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:justify-between lg:items-center mb-8 lg:mb-12">
            <PageTitle>Оформлення замовлення</PageTitle>
            <SectionDescription className="lg:max-w-[440px]">
              Заповни необхідну інформацію, і вже скоро твої книжки будуть у
              дорозі!
            </SectionDescription>
          </div>
          <CheckoutWithNotifications />
        </Container>
      </section>
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
