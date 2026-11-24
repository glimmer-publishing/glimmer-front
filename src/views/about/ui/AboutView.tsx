import type { InstagramPost } from "@/types/instagram";
import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import Instagram from "@/widgets/instagram/ui/Instagram";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import AboutHero from "./AboutHero";
import AboutInfo from "./AboutInfo";

export interface AboutViewProps {
  /* Posts of the Instagram section; it hides itself when there are none. */
  instagramPosts: InstagramPost[];
}

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
