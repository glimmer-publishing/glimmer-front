import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import PrivacyPolicy from "./PrivacyPolicy";

const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Політика конфіденційності", href: "/privacy-policy" },
];

/**
 * The Політика конфіденційності page: breadcrumbs and the static text.
 */
export default function PrivacyPolicyView() {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <PrivacyPolicy />
    </div>
  );
}
