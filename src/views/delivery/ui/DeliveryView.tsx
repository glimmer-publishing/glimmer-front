import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import DeliveryConditions from "./DeliveryConditions";
import DeliveryInfo from "./DeliveryInfo";
import PaymentMethods from "./PaymentMethods";

const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Доставка та оплата", href: "/delivery" },
];

/**
 * The delivery and payment page: static information only.
 */
export default function DeliveryView() {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <DeliveryInfo />
      <DeliveryConditions />
      <PaymentMethods />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
