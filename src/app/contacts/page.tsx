import CallBack from "@/components/contactsPage/CallBack";
import ContactsInfo from "@/components/contactsPage/ContactsInfo";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import Instagram from "@/components/shared/instagram/Instagram";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";
import { fetchSanityDataServer } from "@/utils/fetchSanityDataServer";
import { allInstagramPostsQuery } from "@/lib/queries";

export default async function ContactsPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    {
      label: "Контакти",
      href: "/contacts",
    },
  ];

  const allInstagramPosts = await fetchSanityDataServer(allInstagramPostsQuery);

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <ContactsInfo />
      <CallBack />
      <Instagram instagramPosts={allInstagramPosts?.posts} />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}
