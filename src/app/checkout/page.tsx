import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import Checkout from "@/components/checkoutPage/Checkout";

const crumbs = [
  { label: "Головна", href: "/" },
  {
    label: "Оформлення замовлення",
    href: "/checkout",
  },
];

export default function CheckoutPage() {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <Checkout />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
