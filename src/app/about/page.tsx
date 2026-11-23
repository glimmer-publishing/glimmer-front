import AboutHero from "@/components/aboutPage/AboutHero";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import Instagram from "@/components/shared/instagram/Instagram";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import { ContentService } from "@/services/ContentService";
import AboutInfo from "@/components/aboutPage/AboutInfo";

export default async function AboutPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    {
      label: "Про нас",
      href: "/about",
    },
  ];

  const instagramPosts = await ContentService.getInstagramPosts();

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <AboutHero />
      <AboutInfo />
      <Instagram instagramPosts={instagramPosts} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
