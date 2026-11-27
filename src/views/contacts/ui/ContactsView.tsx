import type { InstagramPost } from "@/entities/instagram-post/model/types";
import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import MarqueeLine from "@/shared/ui/marquee-line/MarqueeLine";
import Instagram from "@/widgets/instagram/ui/Instagram";
import TelegramCTA from "@/widgets/telegram-cta/ui/TelegramCTA";
import ContactsCallback from "./ContactsCallback";
import ContactsInfo from "./ContactsInfo";

/* The page's breadcrumb trail. */
const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Контакти", href: "/contacts" },
];

type ContactsViewProps = {
  /* The Instagram feed; empty when Sanity is unavailable. */
  instagramPosts: InstagramPost[];
};

/**
 * The contacts page: phone, emails and hours, the callback form, then the
 * Instagram feed.
 */
export default function ContactsView({ instagramPosts }: ContactsViewProps) {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <ContactsInfo />
      <ContactsCallback />
      <Instagram instagramPosts={instagramPosts} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
