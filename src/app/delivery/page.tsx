import DeliveryConditions from "@/components/deliveryPage/deliveryConditions/DeliveryConditions";
import DeliveryInfo from "@/components/deliveryPage/deliveryInfo/DeliveryInfo";
import PaymentMethods from "@/components/deliveryPage/paymentMethods/PaymentMethods";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";

export default function DeliveryPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    {
      label: "Доставка та оплата",
      href: "/delivery",
    },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <DeliveryInfo />
      <DeliveryConditions />
      <PaymentMethods />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
