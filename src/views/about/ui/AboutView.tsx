import type { InstagramPost } from "@/entities/instagram-post/model/types";
import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import Instagram from "@/widgets/instagram/ui/Instagram";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import AboutHero from "./AboutHero";
import AboutInfo from "./AboutInfo";

/* What the about page shows besides its static text. */
export type AboutViewProps = {
  /* Posts of the Instagram section; it hides itself when there are none. */
  instagramPosts: InstagramPost[];
};

/* The page's breadcrumb trail. */
const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Про нас", href: "/about" },
];

/**
 * The about page: hero, the shop's story and the Instagram feed.
 */
export default function AboutView({ instagramPosts }: AboutViewProps) {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <AboutHero />
      <AboutInfo />
      <Instagram instagramPosts={instagramPosts} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
