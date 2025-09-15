import AboutHero from "@/components/aboutPage/AboutHero";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import Instagram from "@/components/shared/instagram/Instagram";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { allInstagramPostsQuery } from "@/lib/queries";
import About from "@/components/aboutPage/About";

export default async function AboutPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    {
      label: "Про нас",
      href: "/about",
    },
  ];

  const allInstagramPosts = await fetchSanityDataServer(allInstagramPostsQuery);

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <AboutHero />
      <About />
      <Instagram instagramPosts={allInstagramPosts?.posts} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
