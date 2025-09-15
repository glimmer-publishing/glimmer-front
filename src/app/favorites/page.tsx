import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import Favorites from "@/components/favoritesPage/Favorites";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";

export default function FavoritesPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    {
      label: "Обрані товари",
      href: "/favorites",
    },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <Suspense fallback={<Loader />}>
        {" "}
        <Favorites />
      </Suspense>
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
